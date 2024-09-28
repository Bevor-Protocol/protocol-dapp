import { prisma } from "@/db/prisma.server";
import { auditFormSchema } from "@/utils/validations";
import {
  Audit,
  AuditorStatus,
  AuditStatus,
  HistoryAction,
  Prisma,
  User,
  UserType,
} from "@prisma/client";
import { z } from "zod";

class OwnerService {
  createAudit(
    userId: string,
    data: Omit<z.infer<typeof auditFormSchema>, "details"> & { details?: string },
    auditors: User[],
  ): Promise<Audit> {
    return prisma.audit.create({
      data: {
        auditee: {
          connect: {
            id: userId,
          },
        },
        ...data,
        auditors: {
          create: auditors.map((auditor) => ({
            status: AuditorStatus.VERIFIED,
            user: {
              connect: {
                id: auditor.id,
              },
            },
          })),
        },
      },
    });
  }

  async updateAudit(
    userId: string,
    auditId: string,
    data: Prisma.AuditUpdateInput,
    auditorsCreate: string[],
    auditorsRemove: string[],
  ): Promise<Audit> {
    // would throw before this function is ever called. We can assure currentAudit exists.
    const auditorsCreateConnected = auditorsCreate.map((auditor) => ({
      status: AuditorStatus.VERIFIED,
      user: {
        connect: {
          id: auditor,
        },
      },
    }));

    return prisma.audit.update({
      where: {
        id: auditId,
      },
      data: {
        ...data,
        auditors: {
          create: auditorsCreateConnected,
          deleteMany: {
            auditId,
            userId: {
              in: auditorsRemove,
            },
          },
          updateMany: {
            where: {
              auditId,
            },
            data: {
              attestedTerms: false,
              acceptedTerms: false,
            },
          },
        },
        history: {
          create: {
            userType: UserType.AUDITEE,
            action: HistoryAction.EDITED,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        },
      },
    });
  }

  lockAudit(userId: string, auditId: string): Promise<Audit> {
    return prisma.audit.update({
      where: {
        id: auditId,
      },
      data: {
        status: AuditStatus.ATTESTATION,
        auditors: {
          deleteMany: {
            auditId,
            status: {
              not: AuditorStatus.VERIFIED,
            },
          },
        },
        history: {
          create: {
            action: HistoryAction.LOCKED,
            userType: UserType.AUDITEE,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        },
      },
    });
  }

  openAudit(userId: string, auditId: string): Promise<Audit> {
    return prisma.audit.update({
      where: {
        id: auditId,
      },
      data: {
        status: AuditStatus.DISCOVERY,
        auditors: {
          updateMany: {
            where: {
              auditId,
            },
            data: {
              acceptedTerms: false,
              attestedTerms: false,
            },
          },
        },
        history: {
          create: {
            userType: UserType.AUDITEE,
            action: HistoryAction.OPENED,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        },
      },
    });
  }

  updateRequestors(
    auditId: string,
    auditors: string[],
    status: AuditorStatus,
  ): Promise<Prisma.BatchPayload> {
    return prisma.auditor.updateMany({
      where: {
        auditId,
        userId: {
          in: auditors,
        },
      },
      data: {
        status,
      },
    });
  }
}

const ownerService = new OwnerService();
export default ownerService;
