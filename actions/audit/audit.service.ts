import { db } from "@/db";
import { action } from "@/db/schema/action.sql";
import { auditMembership } from "@/db/schema/audit-membership.sql";
import { audit } from "@/db/schema/audit.sql";
import { user } from "@/db/schema/user.sql";
import { AuditState, MarkdownAudits } from "@/utils/types/custom";
import {
  AuditStateEnum,
  AuditStatusEnum,
  MembershipStatusEnum,
  RoleTypeEnum,
} from "@/utils/types/enum";
import {
  ActionWithMembership,
  AuditMembershipSecure,
  AuditMembershipsInsecure,
  AuditWithOwnerInsecure,
  AuditWithOwnerSecure,
  AuditWithUsersInsecure,
  MembershipWithAudit,
} from "@/utils/types/relations";
import { AuditInsert, User } from "@/utils/types/tables";
import { eq, getTableColumns } from "drizzle-orm";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import ContractService from "../contract/contract.service";

class AuditService {
  constructor(private readonly contractService: typeof ContractService) {}

  getAudit(auditId: string): Promise<AuditWithOwnerSecure | undefined> {
    return db.query.audit.findFirst({
      where: (table, { eq }) => eq(table.id, auditId),
      with: {
        owner: true,
        auditMemberships: {
          with: {
            user: true,
          },
          columns: {
            findings: false,
          },
        },
      },
    });
  }

  getAuditWithFindings(auditId: string): Promise<AuditWithOwnerInsecure | undefined> {
    return db.query.audit.findFirst({
      where: (table, { eq }) => eq(table.id, auditId),
      with: {
        owner: true,
        auditMemberships: {
          with: {
            user: true,
          },
        },
      },
    });
  }

  getAuditActions(auditId: string): Promise<ActionWithMembership[]> {
    const { findings, ...rest } = getTableColumns(auditMembership);
    return db
      .select({
        action: getTableColumns(action),
        auditMembership: rest,
        user: getTableColumns(user),
      })
      .from(action)
      .innerJoin(auditMembership, eq(auditMembership.id, action.membership_id))
      .where(eq(auditMembership.audit_id, auditId))
      .innerJoin(user, eq(auditMembership.user_id, user.id))
      .then((res) => {
        return res.map((r) => {
          const { action, auditMembership, user } = r;
          return {
            ...action,
            auditMembership: {
              ...auditMembership,
              user,
            },
          };
        });
      });
  }

  getAuditAuditors(auditId: string): Promise<AuditMembershipSecure[]> {
    return db.query.auditMembership.findMany({
      where: (table, { eq, and }) =>
        and(eq(table.role, RoleTypeEnum.AUDITOR), eq(table.audit_id, auditId)),
      with: {
        user: true,
      },
      columns: {
        findings: false,
      },
    });
  }

  getAuditsDetailed(status?: AuditStatusEnum): Promise<AuditWithOwnerSecure[]> {
    return db.query.audit.findMany({
      where: (table, { eq }) => eq(table.status, status ?? AuditStatusEnum.DISCOVERY),
      with: {
        owner: true,
        auditMemberships: {
          where: (table, { eq, and }) =>
            and(
              eq(table.is_active, true),
              eq(table.role, RoleTypeEnum.AUDITOR),
              eq(table.status, MembershipStatusEnum.VERIFIED),
            ),
          with: {
            user: true,
          },
          columns: {
            findings: false,
          },
        },
      },
      orderBy: (audit, { desc }) => [desc(audit.created_at)],
    });
  }

  getAuditFindings(auditId: string): Promise<AuditWithUsersInsecure | undefined> {
    return db.query.audit.findFirst({
      where: (table, { eq }) => eq(table.id, auditId),
      with: {
        auditMemberships: {
          where: (membership, { eq, and }) =>
            and(
              eq(membership.is_active, true),
              eq(membership.role, RoleTypeEnum.AUDITOR),
              eq(membership.status, MembershipStatusEnum.VERIFIED),
              eq(membership.accepted_terms, true),
            ),
          with: {
            user: true,
          },
        },
      },
    });
  }

  async getAuditState(auditId: string, user: User | undefined): Promise<AuditState> {
    const objOut = {
      isAuditOwner: false,
      isAuditAuditor: false,
      states: {
        [AuditStateEnum.CAN_ADD_REQUEST]: false,
        [AuditStateEnum.CAN_MANAGE_REQUESTS]: false,
        [AuditStateEnum.CAN_LOCK_AUDIT]: false,
        [AuditStateEnum.CAN_REMOVE_VERIFICATION]: false,
        [AuditStateEnum.CAN_REMOVE_REQUEST]: false,
        [AuditStateEnum.IS_REJECTED]: false,
        [AuditStateEnum.CAN_FINALIZE]: false,
        [AuditStateEnum.CAN_SUBMIT_FINDINGS]: false,
        [AuditStateEnum.CAN_UNLOCK]: false,
        [AuditStateEnum.CAN_ATTEST]: false,
      },
    };

    if (!user) return objOut;
    const audit = await this.getAuditWithFindings(auditId);
    if (!audit) return objOut;

    const owner = audit.owner;
    const auditors = audit.auditMemberships.filter(
      (member) => member.role === RoleTypeEnum.AUDITOR,
    );

    if (!owner) return objOut;

    const verified: AuditMembershipsInsecure[] = [];
    const requested: AuditMembershipsInsecure[] = [];
    const rejected: AuditMembershipsInsecure[] = [];

    auditors.forEach((auditor) => {
      switch (auditor.status) {
        case MembershipStatusEnum.VERIFIED:
          verified.push(auditor);
          break;
        case MembershipStatusEnum.REQUESTED:
          requested.push(auditor);
          break;
        case MembershipStatusEnum.REJECTED:
          rejected.push(auditor);
          break;
      }
    });

    objOut.isAuditOwner = owner.id === user.id;
    const userAuditor = auditors.find((auditor) => auditor.user_id === user.id);

    if (audit.status === AuditStatusEnum.DISCOVERY) {
      objOut.states[AuditStateEnum.CAN_ADD_REQUEST] = !userAuditor && user.auditor_role;
      if (userAuditor) {
        const { status } = userAuditor;
        objOut.states[AuditStateEnum.CAN_REMOVE_REQUEST] = status !== MembershipStatusEnum.REJECTED;
        objOut.states[AuditStateEnum.CAN_REMOVE_VERIFICATION] =
          status === MembershipStatusEnum.VERIFIED;
        objOut.states[AuditStateEnum.IS_REJECTED] = status === MembershipStatusEnum.REJECTED;
      }
      if (objOut.isAuditOwner) {
        objOut.states[AuditStateEnum.CAN_LOCK_AUDIT] = verified.length > 0 && !!audit.details;
        objOut.states[AuditStateEnum.CAN_MANAGE_REQUESTS] = auditors.length > 0;
      }

      return objOut;
    }
    if (audit.status === AuditStatusEnum.ATTESTATION) {
      if (objOut.isAuditOwner) {
        objOut.states[AuditStateEnum.CAN_FINALIZE] = verified.every(
          (member) => member.attested_terms,
        );
      }
      if (userAuditor) {
        objOut.states[AuditStateEnum.CAN_ATTEST] = !userAuditor.attested_terms;
      }

      return objOut;
    }
    if (audit.status === AuditStatusEnum.AUDITING) {
      if (userAuditor) {
        objOut.states[AuditStateEnum.CAN_SUBMIT_FINDINGS] = !userAuditor.findings;
      }
      if (objOut.isAuditAuditor) {
        objOut.states[AuditStateEnum.CAN_UNLOCK] = verified.every((member) => !!member.findings);
      }
    }

    return objOut;
  }

  getAuditOwnerMembership(auditId: string): Promise<MembershipWithAudit | undefined> {
    return db.query.auditMembership.findFirst({
      where: (membership, { eq, and }) =>
        and(eq(membership.audit_id, auditId), eq(membership.role, RoleTypeEnum.OWNER)),
      columns: {
        findings: false,
      },
      with: {
        audit: true,
      },
    });
  }

  addAuditInfo(auditId: string, infoId: string): Promise<AuditInsert> {
    return db
      .update(audit)
      .set({
        onchain_audit_info_id: infoId,
        status: AuditStatusEnum.AUDITING,
      })
      .where(eq(audit.id, auditId))
      .returning()
      .then((res) => res[0]);
  }

  addNftInfo(auditId: string, nftId: string): Promise<AuditInsert> {
    return db
      .update(audit)
      .set({
        onchain_nft_id: nftId,
        status: AuditStatusEnum.CHALLENGEABLE,
      })
      .where(eq(audit.id, auditId))
      .returning()
      .then((res) => res[0]);
  }

  parseMarkdown(path: string): Promise<string> {
    return fetch(path)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch remote markdown file");
        }
        return response.text();
      })
      .then((result) => {
        const { content } = matter(result);
        return remark().use(html).use(remarkGfm).process(content);
      })
      .then((contents) => {
        return contents.toString();
      });
  }

  /**
   * Safely displays markdown content for an audit, ensuring proper visibility
   * based on user roles and audit status.
   *
   * @param {AuditWithOwnerInsecure} audit - The audit object containing details and memberships.
   * @param {User | null} currentUser - The current user viewing the audit, or null if not logged in.
   * @returns {Promise<MarkdownAuditsI>} - A promise that resolves to an object
   * containing markdown details, global reveal status, pending cliff status, and findings.
   *
   * The function processes the audit details and findings, ensuring that only
   * authorized users can view certain content based on their roles and the audit's status.
   * It fetches on-chain information to determine the audit's start and cliff period,
   * and adjusts the visibility of findings accordingly.
   */
  async safeMarkdownDisplay(
    auditId: string,
    currentUser: User | undefined,
  ): Promise<MarkdownAudits> {
    const markdownObject: MarkdownAudits = {
      details: "",
      globalReveal: false,
      pendingCliff: false,
      findings: [],
    };

    const audit = await this.getAuditWithFindings(auditId);
    if (!audit) {
      return markdownObject;
    }

    if (audit.details) {
      markdownObject.details = await this.parseMarkdown(audit.details);
    }
    if (audit.status == AuditStatusEnum.DISCOVERY || audit.status == AuditStatusEnum.ATTESTATION) {
      return markdownObject;
    }

    // if finalized, we'll reveal to everyone.
    let globalReveal = audit.status == AuditStatusEnum.FINALIZED;
    // auditor can always see their own findings.
    // Protocol owner can see once they put money in escrow.
    const state = await this.getAuditState(auditId, currentUser);

    // effectively refetches the audit, but doesn't omit the findings.
    const auditWithFindings = await this.getAuditFindings(audit.id);

    // will never happen. But add it for type safety.
    if (!auditWithFindings) return markdownObject;
    // get the verified auditors from the call that doesn't omit findings.
    const verified = auditWithFindings.auditMemberships.filter(
      (member) =>
        member.role === RoleTypeEnum.AUDITOR && member.status == MembershipStatusEnum.VERIFIED,
    );

    let ownerReveal = globalReveal;

    const now = Math.round(new Date().getTime() / 1000);
    // fetch on-chain information to get audit start
    if (audit.onchain_audit_info_id && audit.status == AuditStatusEnum.CHALLENGEABLE) {
      if (state.isAuditOwner) {
        ownerReveal = true;
      }
      try {
        const onchainAudit = await this.contractService.getAudit(
          BigInt(audit.onchain_audit_info_id),
        );
        if (onchainAudit) {
          const { start, cliff } = onchainAudit;
          if (now < start + cliff) {
            markdownObject.pendingCliff = true;
          } else {
            // cliff period is over, visible to all parties.
            globalReveal = true;
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    markdownObject.globalReveal = globalReveal;

    for (const member of verified) {
      const { user } = member;
      const submitted = !!member.findings;
      const isOwner = user.id === currentUser?.id;
      const reveal = globalReveal || (!state.states.CAN_SUBMIT_FINDINGS && isOwner) || ownerReveal;

      let markdown = "";
      if (submitted && reveal) {
        markdown = await this.parseMarkdown(member.findings as string);
      }

      markdownObject.findings.push({
        user,
        isOwner,
        reveal,
        submitted,
        markdown,
      });
    }

    return markdownObject;
  }
}

const auditService = new AuditService(ContractService);
export default auditService;
