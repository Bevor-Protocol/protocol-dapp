import { prisma } from "@/db/prisma.server";
import { AuditStateI, MarkdownAuditsI } from "@/utils/types";
import { AuditStateEnum } from "@/utils/types/enum";
import {
  ActionI,
  AuditDetailedI,
  AuditFindingsI,
  AuditI,
  MembershipUserI,
} from "@/utils/types/prisma";
import {
  Audit,
  AuditMembership,
  AuditStatusType,
  MembershipStatusType,
  PrismaPromise,
  RoleType,
  User,
} from "@prisma/client";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import ContractService from "../contract/contract.service";

class AuditService {
  constructor(private readonly contractService: typeof ContractService) {}

  getAudit(auditId: string): PrismaPromise<AuditI | null> {
    return prisma.audit.findUnique({
      where: {
        id: auditId,
      },
      include: {
        owner: true,
        memberships: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  getAuditActions(auditId: string): PrismaPromise<ActionI[]> {
    return prisma.action.findMany({
      where: {
        membership: {
          auditId,
        },
      },
      include: {
        membership: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  getAuditAuditors(auditId: string): PrismaPromise<AuditMembership[]> {
    return prisma.auditMembership.findMany({
      where: {
        auditId,
        role: RoleType.AUDITOR,
      },
    });
  }

  getAuditsDetailed(status?: AuditStatusType): PrismaPromise<AuditDetailedI[]> {
    return prisma.audit.findMany({
      where: {
        status: status ?? AuditStatusType.DISCOVERY,
      },
      include: {
        owner: true,
        memberships: {
          where: {
            isActive: true,
            role: RoleType.AUDITOR,
            status: MembershipStatusType.VERIFIED,
          },
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  getAuditFindings(auditId: string): PrismaPromise<AuditFindingsI | null> {
    return prisma.audit.findUnique({
      where: {
        id: auditId,
      },
      include: {
        memberships: {
          where: {
            role: RoleType.AUDITOR,
            isActive: true,
            status: MembershipStatusType.VERIFIED,
            acceptedTerms: true,
          },
          omit: {
            findings: false,
          },
          include: {
            user: true,
          },
        },
      },
    });
  }

  getAuditState(audit: AuditI, user: User | null): AuditStateI {
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

    const owner = audit.owner;
    const auditors = audit.memberships;

    if (!owner) return objOut;

    const verified: MembershipUserI[] = [];
    const requested: MembershipUserI[] = [];
    const rejected: MembershipUserI[] = [];

    auditors.forEach((auditor) => {
      switch (auditor.status) {
        case MembershipStatusType.VERIFIED:
          verified.push(auditor);
          break;
        case MembershipStatusType.REQUESTED:
          requested.push(auditor);
          break;
        case MembershipStatusType.REJECTED:
          rejected.push(auditor);
          break;
      }
    });

    objOut.isAuditOwner = owner.id === user.id;
    const userAuditor = auditors.find((auditor) => auditor.userId === user.id);

    if (audit.status === AuditStatusType.DISCOVERY) {
      objOut.states[AuditStateEnum.CAN_ADD_REQUEST] = !userAuditor && user.auditorRole;
      if (userAuditor) {
        const { status } = userAuditor;
        objOut.states[AuditStateEnum.CAN_REMOVE_REQUEST] = status !== MembershipStatusType.REJECTED;
        objOut.states[AuditStateEnum.CAN_REMOVE_VERIFICATION] =
          status === MembershipStatusType.VERIFIED;
        objOut.states[AuditStateEnum.IS_REJECTED] = status === MembershipStatusType.REJECTED;
      }
      if (objOut.isAuditOwner) {
        objOut.states[AuditStateEnum.CAN_LOCK_AUDIT] = verified.length > 0 && !!audit.details;
        objOut.states[AuditStateEnum.CAN_MANAGE_REQUESTS] = requested.length > 0;
      }

      return objOut;
    }
    if (audit.status === AuditStatusType.ATTESTATION) {
      if (objOut.isAuditOwner) {
        objOut.states[AuditStateEnum.CAN_FINALIZE] = verified.every(
          (member) => member.attestedTerms,
        );
      }
      if (userAuditor) {
        objOut.states[AuditStateEnum.CAN_ATTEST] = !userAuditor.attestedTerms;
      }

      return objOut;
    }
    if (audit.status === AuditStatusType.AUDITING) {
      if (userAuditor) {
        objOut.states[AuditStateEnum.CAN_SUBMIT_FINDINGS] = !userAuditor.findings;
      }
      if (objOut.isAuditAuditor) {
        objOut.states[AuditStateEnum.CAN_UNLOCK] = verified.every((member) => !!member.findings);
      }
    }

    return objOut;
  }

  getAuditOwnerMembership(auditId: string): PrismaPromise<AuditMembership | null> {
    return prisma.auditMembership.findFirst({
      where: {
        auditId,
        role: RoleType.OWNER,
      },
    });
  }

  addAuditInfo(auditId: string, infoId: string): PrismaPromise<Audit> {
    return prisma.audit.update({
      where: {
        id: auditId,
      },
      data: {
        onchainAuditInfoId: infoId,
        status: AuditStatusType.AUDITING,
      },
    });
  }

  addNftInfo(auditId: string, nftId: string): PrismaPromise<Audit> {
    return prisma.audit.update({
      where: {
        id: auditId,
      },
      data: {
        onchainNftId: nftId,
        status: AuditStatusType.CHALLENGEABLE,
      },
    });
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
   * @param {AuditI} audit - The audit object containing details and memberships.
   * @param {User | null} currentUser - The current user viewing the audit, or null if not logged in.
   * @returns {Promise<MarkdownAuditsI>} - A promise that resolves to an object
   * containing markdown details, global reveal status, pending cliff status, and findings.
   *
   * The function processes the audit details and findings, ensuring that only
   * authorized users can view certain content based on their roles and the audit's status.
   * It fetches on-chain information to determine the audit's start and cliff period,
   * and adjusts the visibility of findings accordingly.
   */
  async safeMarkdownDisplay(audit: AuditI, currentUser: User | null): Promise<MarkdownAuditsI> {
    const markdownObject: MarkdownAuditsI = {
      details: "",
      globalReveal: false,
      pendingCliff: false,
      findings: [],
    };

    if (audit.details) {
      markdownObject.details = await this.parseMarkdown(audit.details);
    }
    if (audit.status == AuditStatusType.DISCOVERY || audit.status == AuditStatusType.ATTESTATION) {
      return markdownObject;
    }

    // if finalized, we'll reveal to everyone.
    let globalReveal = audit.status == AuditStatusType.FINALIZED;
    // auditor can always see their own findings.
    // Protocol owner can see once they put money in escrow.
    const state = this.getAuditState(audit, currentUser);

    // effectively refetches the audit, but doesn't omit the findings.
    const auditWithFindings = await this.getAuditFindings(audit.id);

    // will never happen. But add it for type safety.
    if (!auditWithFindings) return markdownObject;
    // get the verified auditors from the call that doesn't omit findings.
    const verified = auditWithFindings.memberships.filter(
      (member) =>
        member.role === RoleType.AUDITOR && member.status == MembershipStatusType.VERIFIED,
    );

    let ownerReveal = globalReveal;

    const now = Math.round(new Date().getTime() / 1000);
    // fetch on-chain information to get audit start
    if (audit.onchainAuditInfoId && audit.status == AuditStatusType.CHALLENGEABLE) {
      if (state.isAuditOwner) {
        ownerReveal = true;
      }
      try {
        const onchainAudit = await this.contractService.getAudit(BigInt(audit.onchainAuditInfoId));
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
        owner: isOwner,
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
