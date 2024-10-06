import { prisma } from "@/db/prisma.server";
import { auditFormSchema } from "@/utils/validations";
import {
  Audit,
  AuditMembership,
  AuditStatusType,
  MembershipStatusType,
  Prisma,
  PrismaPromise,
  RoleType,
  User,
} from "@prisma/client";
import { z } from "zod";

class OwnerService {
  requiresAuditUpdate(
    audit: Audit,
    data: Prisma.AuditUpdateInput,
    auditorsPassed: User[],
    currentMembers: AuditMembership[],
  ): {
    requiresUpdate: boolean;
    activate: string[];
    deactivate: string[];
    create: string[];
  } {
    let requiresUpdate = false;
    for (const [k, v] of Object.entries(data)) {
      if (audit[k as keyof Audit] !== v) {
        requiresUpdate = true;
      }
    }

    const passedIds = auditorsPassed.map((auditor) => auditor.id);
    const currentIds = currentMembers.map((member) => member.userId);
    const activate: string[] = [];
    const deactivate: string[] = [];
    const create: string[] = [];

    currentMembers.forEach((member) => {
      if (passedIds.includes(member.userId)) {
        if (member.isActive && member.status === MembershipStatusType.VERIFIED) {
          return;
        }
        activate.push(member.userId);
      } else {
        deactivate.push(member.userId);
      }
    });

    passedIds.forEach((auditor) => {
      if (!currentIds.includes(auditor)) {
        create.push(auditor);
      }
    });

    return {
      requiresUpdate:
        requiresUpdate || activate.length > 0 || deactivate.length > 0 || create.length > 0,
      activate,
      deactivate,
      create,
    };
  }

  createAudit(
    userId: string,
    data: Omit<z.infer<typeof auditFormSchema>, "details"> & { details?: string },
    auditors: User[],
  ): PrismaPromise<Audit> {
    const auditorMembershipsCreate = auditors.map((auditor) => {
      return {
        role: RoleType.AUDITOR,
        userId: auditor.id,
        status: MembershipStatusType.VERIFIED,
      };
    });

    return prisma.audit.create({
      data: {
        ...data,
        owner: {
          connect: {
            id: userId,
          },
        },
        memberships: {
          create: [
            {
              role: RoleType.OWNER,
              status: MembershipStatusType.VERIFIED,
              userId,
            },
            ...auditorMembershipsCreate,
          ],
        },
      },
    });
  }

  updateAudit(
    auditId: string,
    data: Prisma.AuditUpdateInput,
    activate: string[],
    deactivate: string[],
    create: string[],
  ): Promise<Audit> {
    const toUpsert: Prisma.AuditMembershipUpsertArgs[] = [];

    activate.concat(create).forEach((userId) => {
      // an upsert is redundant, but it allows us to work around prisma
      // and simultaneously handle all the following cases in a single query.
      toUpsert.push({
        where: {
          userId_auditId: {
            userId,
            auditId,
          },
        },
        update: {
          isActive: true,
          status: MembershipStatusType.VERIFIED,
        },
        create: {
          userId,
          auditId,
          role: RoleType.AUDITOR,
          status: MembershipStatusType.VERIFIED,
          isActive: true,
        },
      });
    });
    deactivate.forEach((userId) => {
      toUpsert.push({
        where: {
          userId_auditId: {
            userId,
            auditId,
          },
        },
        update: {
          isActive: false,
          status: MembershipStatusType.REJECTED,
        },
        create: {
          userId,
          auditId,
          role: RoleType.AUDITOR,
          status: MembershipStatusType.REJECTED,
          isActive: false,
        },
      });
    });

    return prisma.audit.update({
      where: {
        id: auditId,
      },
      data: {
        ...data,
        memberships: {
          upsert: toUpsert,
        },
      },
    });
  }

  lockAudit(auditId: string): PrismaPromise<Audit> {
    return prisma.audit.update({
      where: {
        id: auditId,
      },
      data: {
        status: AuditStatusType.ATTESTATION,
        memberships: {
          updateMany: {
            where: {
              status: {
                not: MembershipStatusType.VERIFIED,
              },
            },
            data: {
              isActive: false,
            },
          },
        },
      },
    });
  }

  openAudit(auditId: string): PrismaPromise<Audit> {
    return prisma.audit.update({
      where: {
        id: auditId,
      },
      data: {
        status: AuditStatusType.DISCOVERY,
        memberships: {
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
      },
    });
  }
}

const ownerService = new OwnerService();
export default ownerService;
