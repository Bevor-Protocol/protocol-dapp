import { prisma } from "@/db/prisma.server";
import { AuditI } from "@/utils/types/prisma";
import {
  Auditors,
  AuditorStatus,
  Audits,
  AuditStatus,
  HistoryAction,
  Users,
  UserType,
} from "@prisma/client";

class AuditorService {
  attestToTerms(id: string, userId: string, status: boolean, comment: string): Promise<Auditors> {
    return prisma.auditors.update({
      where: {
        auditId_userId: {
          auditId: id,
          userId,
        },
      },
      data: {
        acceptedTerms: status,
        attestedTerms: true,
        history: {
          create: {
            userType: UserType.AUDITOR,
            action: status ? HistoryAction.APPROVED : HistoryAction.REJECTED,
            comment: comment.length > 0 ? comment : null,
            audit: {
              connect: {
                id,
              },
            },
          },
        },
      },
    });
  }

  async leaveAudit(audit: AuditI, auditor: Users): Promise<Audits> {
    let historyObj = {};
    if (audit.status == AuditStatus.AUDITING) {
      historyObj = {
        history: {
          create: {
            userType: UserType.AUDITOR,
            action: HistoryAction.LEFT,
            auditor: {
              connect: {
                id: auditor.id,
              },
            },
          },
        },
      };
    }

    return prisma.audits.update({
      where: {
        id: audit.id,
      },
      data: {
        auditors: {
          delete: {
            auditId_userId: {
              auditId: audit.id,
              userId: auditor.id,
            },
          },
          updateMany: {
            where: {
              auditId: auditor.id,
            },
            data: {
              acceptedTerms: false,
              attestedTerms: false,
            },
          },
        },
        ...historyObj,
      },
    });
  }

  addFindings(auditId: string, userId: string, findings: string): Promise<Auditors> {
    return prisma.auditors.update({
      where: {
        auditId_userId: {
          auditId: auditId,
          userId: userId,
        },
      },
      data: {
        findings,
        history: {
          create: {
            userType: UserType.AUDITOR,
            action: HistoryAction.FINDINGS,
            audit: {
              connect: {
                id: auditId,
              },
            },
          },
        },
      },
    });
  }

  addRequest(id: string, userId: string): Promise<Auditors> {
    return prisma.auditors.create({
      data: {
        status: AuditorStatus.REQUESTED,
        audit: {
          connect: {
            id,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  deleteRequest(id: string, userId: string): Promise<Auditors> {
    return prisma.auditors.delete({
      where: {
        auditId_userId: {
          auditId: id,
          userId,
        },
      },
    });
  }
}

const auditorService = new AuditorService();
export default auditorService;
