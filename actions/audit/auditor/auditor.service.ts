import { prisma } from "@/db/prisma.server";
import { Auditor, AuditorStatus, AuditStatus, HistoryAction, User, UserType } from "@prisma/client";

class AuditorService {
  async attestToTerms(
    auditId: string,
    userId: string,
    status: boolean,
    comment: string,
  ): Promise<User> {
    // via an entry of User, we can simultaneously update Auditors, and create
    // a History observation.
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        auditors: {
          update: {
            where: {
              auditId_userId: {
                auditId,
                userId,
              },
            },
            data: {
              acceptedTerms: status,
              attestedTerms: true,
            },
          },
        },
        history: {
          create: {
            userType: UserType.AUDITOR,
            action: status ? HistoryAction.APPROVED : HistoryAction.REJECTED,
            comment: comment.length > 0 ? comment : null,
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

  async leaveAudit(auditId: string, auditorId: string, auditStatus: AuditStatus): Promise<User> {
    let historyObj = {};
    if (auditStatus == AuditStatus.AUDITING) {
      historyObj = {
        history: {
          create: {
            userType: UserType.AUDITOR,
            action: HistoryAction.LEFT,
            audit: {
              connect: {
                id: auditId,
              },
            },
          },
        },
      };
    }

    return prisma.user.update({
      where: {
        id: auditorId,
      },
      data: {
        auditors: {
          delete: {
            auditId_userId: {
              auditId,
              userId: auditorId,
            },
          },
          updateMany: {
            where: {
              auditId: auditorId,
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

  addFindings(auditId: string, userId: string, findings: string): Promise<User> {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        auditors: {
          update: {
            where: {
              auditId_userId: {
                auditId: auditId,
                userId: userId,
              },
            },
            data: {
              findings,
            },
          },
        },
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

  addRequest(id: string, userId: string): Promise<Auditor> {
    return prisma.auditor.create({
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

  deleteRequest(id: string, userId: string): Promise<Auditor> {
    return prisma.auditor.delete({
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
