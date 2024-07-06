import { prisma } from "@/db/prisma.server";
import { auditFormSchema } from "@/utils/validations";
import {
  AuditorStatus,
  Audits,
  AuditStatus,
  HistoryAction,
  Prisma,
  Users,
  UserType,
} from "@prisma/client";
import { z } from "zod";

class OwnerService {
  createAudit(
    id: string,
    data: Omit<z.infer<typeof auditFormSchema>, "details"> & { details?: string },
    auditors: Users[],
  ): Promise<Audits> {
    return prisma.audits.create({
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
    data: Prisma.AuditsUpdateInput,
    auditorsCreate: string[],
    auditorsRemove: string[],
  ): Promise<Audits> {
    // would throw before this function is ever called. We can assure currentAudit exists.
    const auditorsCreateConnected = auditorsCreate.map((auditor) => ({
      status: AuditorStatus.VERIFIED,
      user: {
        connect: {
          id: auditor,
        },
      },
    }));

    return prisma.audits.update({
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

  lockAudit(id: string): Promise<Audits> {
    return prisma.audits.update({
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

  openAudit(id: string): Promise<Audits> {
    return prisma.audits.update({
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
    return prisma.auditors.updateMany({
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
