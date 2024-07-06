import { AuditStateI, MarkdownAuditsI } from "@/utils/types";
import {
  Auditors,
  AuditorStatus,
  Audits,
  AuditStatus,
  HistoryAction,
  UserType,
} from "@prisma/client";
import { prisma } from "@/db/prisma.server";
import { AuditDetailedI, AuditFindingsI, AuditI } from "@/utils/types/prisma";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import matter from "gray-matter";
import ContractService from "../contract/contract.service";

class AuditService {
  constructor(private readonly contractService: typeof ContractService) {}

  getAudit(id: string): Promise<AuditI | null> {
    return prisma.audits.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        duration: true,
        cliff: true,
        createdAt: true,
        status: true,
        details: true,
        token: true,
        auditee: true,
        onchainAuditInfoId: true,
        onchainNftId: true,
        auditors: {
          select: {
            user: true,
            status: true,
            attestedTerms: true,
            acceptedTerms: true,
          },
        },
        history: {
          select: {
            id: true,
            action: true,
            userType: true,
            comment: true,
            createdAt: true,
            audit: {
              select: {
                auditee: true,
              },
            },
            auditor: {
              select: {
                user: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  }

  getAuditsDetailed(status?: string): Promise<AuditDetailedI[]> {
    const statusFilter: Record<string, AuditStatus> = {
      open: AuditStatus.DISCOVERY,
      locked: AuditStatus.ATTESTATION,
      ongoing: AuditStatus.AUDITING,
      challengeable: AuditStatus.CHALLENGEABLE,
      completed: AuditStatus.FINALIZED,
    };

    return prisma.audits.findMany({
      where: {
        status: statusFilter[status ?? "open"],
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        duration: true,
        token: true,
        cliff: true,
        createdAt: true,
        auditee: true,
        auditors: {
          where: {
            status: AuditorStatus.VERIFIED,
          },
          select: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  getAuditFindings(id: string): Promise<AuditFindingsI | null> {
    return prisma.audits.findUnique({
      where: {
        id,
      },
      select: {
        onchainAuditInfoId: true,
        duration: true,
        price: true,
        cliff: true,
        token: true,
        auditors: {
          where: {
            acceptedTerms: true,
            findings: {
              not: null,
            },
          },
          select: {
            findings: true,
            user: {
              select: {
                address: true,
              },
            },
          },
        },
      },
    });
  }

  getAuditState(id: string, userId: string | undefined): Promise<AuditStateI> {
    const objOut = {
      isTheAuditee: false,
      isAnAuditor: false,
      userIsVerified: false,
      userIsRequested: false,
      userIsRejected: false,
      auditeeCanManageAuditors: false,
      auditeeCanLock: false,
      userAttested: false,
      userAccepted: false,
      userSubmitted: false,
      allAttested: false,
      allSubmitted: false,
    };
    return prisma.audits
      .findUnique({
        where: {
          id,
        },
        include: {
          auditors: {
            include: {
              user: true,
            },
          },
          auditee: true,
        },
      })
      .then((result) => {
        if (!result) return objOut;

        const verifiedAuditors = result.auditors.filter(
          (auditor) => auditor.status == AuditorStatus.VERIFIED,
        );
        const requestedAuditors = result.auditors.filter(
          (auditor) => auditor.status == AuditorStatus.REQUESTED,
        );
        const rejectedAuditors = result.auditors.filter(
          (auditor) => auditor.status == AuditorStatus.REJECTED,
        );

        const userAuditor: Auditors | undefined = result.auditors.find(
          (auditor) => auditor.userId == userId,
        );

        objOut.isTheAuditee = result.auditeeId == userId;

        if (userAuditor) {
          objOut.isAnAuditor = true;
          objOut.userIsVerified = userAuditor.status == AuditorStatus.VERIFIED;
          objOut.userIsRequested = userAuditor.status == AuditorStatus.REQUESTED;
          objOut.userIsRejected = userAuditor.status == AuditorStatus.REJECTED;

          objOut.userAttested = userAuditor.attestedTerms;
          objOut.userAccepted = userAuditor.acceptedTerms;
          objOut.userSubmitted = !!userAuditor.findings;
        }

        objOut.auditeeCanManageAuditors =
          requestedAuditors.length > 0 || rejectedAuditors.length > 0;
        objOut.auditeeCanLock = verifiedAuditors.length > 0 && !!result.details;

        objOut.allAttested =
          verifiedAuditors.filter((auditor) => auditor.acceptedTerms).length ==
          verifiedAuditors.length;

        objOut.allSubmitted =
          verifiedAuditors.filter((auditor) => !!auditor.findings).length ==
          verifiedAuditors.length;

        return objOut;
      });
  }

  addAuditInfo(id: string, infoId: string): Promise<Audits> {
    return prisma.audits.update({
      where: {
        id,
      },
      data: {
        onchainAuditInfoId: infoId,
        status: AuditStatus.AUDITING,
        history: {
          create: {
            userType: UserType.AUDITEE,
            action: HistoryAction.FINALIZED,
          },
        },
      },
    });
  }

  addNftInfo(id: string, nftId: string): Promise<Audits> {
    return prisma.audits.update({
      where: {
        id,
      },
      data: {
        onchainNftId: nftId,
        status: AuditStatus.CHALLENGEABLE,
        history: {
          create: {
            userType: UserType.AUDITEE,
            action: HistoryAction.MINTED,
          },
        },
      },
    });
  }

  parseMarkdown(path: string): Promise<string> {
    // I should move this to inside Audit Page, since we're already fetching the Audit, which is what
    // we'd do here.
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

  async safeMarkdownDisplay(id: string, userId: string | undefined): Promise<MarkdownAuditsI> {
    const markdownObject: MarkdownAuditsI = {
      details: "",
      globalReveal: false,
      pendingCliff: false,
      findings: [],
    };

    const state = await this.getAuditState(id, userId);

    const audit = await prisma.audits.findUnique({
      where: {
        id,
      },
      include: {
        auditors: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!audit) return markdownObject;

    // if details exist, get them.
    if (audit.details) {
      markdownObject.details = await this.parseMarkdown(audit.details);
    }

    // can early stop
    if (audit.status == AuditStatus.DISCOVERY || audit.status == AuditStatus.ATTESTATION) {
      return markdownObject;
    }

    // if finalized, we'll reveal to everyone.
    let globalReveal = audit.status == AuditStatus.FINALIZED;
    // auditor can always see their own findings.
    // Protocol owner can see once they put money in escrow.
    const auditeeReveal =
      audit.auditeeId == userId && (globalReveal || audit.status == AuditStatus.CHALLENGEABLE);

    const now = Math.round(new Date().getTime() / 1000);
    // fetch on-chain information to get audit start
    if (audit.onchainAuditInfoId && audit.status == AuditStatus.CHALLENGEABLE) {
      try {
        const onchainAudit = await this.contractService.getAudit(BigInt(audit.onchainAuditInfoId));
        if (onchainAudit) {
          const start = Number(onchainAudit[5]);
          const cliff = Number(onchainAudit[4]);
          if (now < start + cliff) {
            markdownObject.pendingCliff = true;
          } else {
            // cliff period is over, visible to all parties.
            globalReveal = true;
          }
        }
      } catch (error) {
        console.log(error);
        globalReveal = false;
      }
    }

    markdownObject.globalReveal = globalReveal;

    for (const auditor of audit.auditors) {
      if (auditor.status === AuditorStatus.VERIFIED) {
        const user = auditor.user;
        const submitted = !!auditor.findings;
        const owner = auditor.userId === userId;
        const reveal = globalReveal || (state.userSubmitted && owner) || auditeeReveal;

        let markdown = "";
        if (submitted && reveal) {
          markdown = await this.parseMarkdown(auditor.findings as string);
        }

        markdownObject.findings.push({
          user,
          owner,
          reveal,
          submitted,
          markdown,
        });
      }
    }

    return markdownObject;
  }
}

const auditService = new AuditService(ContractService);
export default auditService;
