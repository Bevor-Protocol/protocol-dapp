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
    id: string,
    data: Omit<z.infer<typeof auditFormSchema>, "details"> & { details?: string },
    auditors: User[],
  ): Promise<Audit> {
    return prisma.audit.create({
      data: {
        auditee: {
          connect: {
            id,
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
    id: string,
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
        id,
      },
      data: {
        ...data,
        auditors: {
          create: auditorsCreateConnected,
          deleteMany: {
            auditId: id,
            userId: {
              in: auditorsRemove,
            },
          },
          updateMany: {
            where: {
              auditId: id,
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
          },
        },
      },
    });
  }

  lockAudit(id: string): Promise<Audit> {
    return prisma.audit.update({
      where: {
        id,
      },
      data: {
        status: AuditStatus.ATTESTATION,
        auditors: {
          deleteMany: {
            auditId: id,
            status: {
              not: AuditorStatus.VERIFIED,
            },
          },
        },
        history: {
          create: {
            action: HistoryAction.LOCKED,
            userType: UserType.AUDITEE,
          },
        },
      },
    });
  }

  openAudit(id: string): Promise<Audit> {
    return prisma.audit.update({
      where: {
        id,
      },
      data: {
        status: AuditStatus.DISCOVERY,
        auditors: {
          updateMany: {
            where: {
              auditId: id,
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
          },
        },
      },
    });
  }

  updateRequestors(
    id: string,
    auditors: string[],
    status: AuditorStatus,
  ): Promise<Prisma.BatchPayload> {
    return prisma.auditor.updateMany({
      where: {
        auditId: id,
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
