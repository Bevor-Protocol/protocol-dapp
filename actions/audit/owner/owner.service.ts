import { db } from "@/db";
import { auditMembership } from "@/db/schema/audit-membership.sql";
import { audit } from "@/db/schema/audit.sql";
import { AuditStatusEnum, MembershipStatusEnum, RoleTypeEnum } from "@/utils/types/enum";
import { AuditMembershipSecure } from "@/utils/types/relations";
import { Audit, AuditInsert, AuditMembershipInsert, User } from "@/utils/types/tables";
import { auditFormSchema } from "@/utils/validations";
import { and, eq, inArray, not } from "drizzle-orm";
import { z } from "zod";

class OwnerService {
  requiresAuditUpdate(
    audit: Audit,
    data: Partial<AuditInsert>,
    auditorsPassed: User[],
    currentMembers: AuditMembershipSecure[],
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
    const currentIds = currentMembers.map((member) => member.user_id);
    const activate: string[] = [];
    const deactivate: string[] = [];
    const create: string[] = [];

    currentMembers.forEach((member) => {
      if (passedIds.includes(member.user_id)) {
        if (member.is_active && member.status === MembershipStatusEnum.VERIFIED) {
          return;
        }
        activate.push(member.user_id);
      } else {
        deactivate.push(member.user_id);
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

  async createAudit(
    userId: string,
    data: Omit<z.infer<typeof auditFormSchema>, "details"> & { details?: string },
    auditors: User[],
  ): Promise<Audit> {
    const auditorMembershipsCreate = auditors.map((auditor) => {
      return {
        role: RoleTypeEnum.AUDITOR,
        user_id: auditor.id,
        status: MembershipStatusEnum.VERIFIED,
      };
    });

    const auditCreated = await db
      .insert(audit)
      .values({
        ...data,
        owner_id: userId,
      })
      .returning()
      .then((res) => res[0]);

    await db.insert(auditMembership).values([
      {
        role: RoleTypeEnum.OWNER,
        status: MembershipStatusEnum.VERIFIED,
        user_id: userId,
        audit_id: auditCreated.id,
      },
      ...auditorMembershipsCreate.map((a) => ({
        ...a,
        audit_id: auditCreated.id,
      })),
    ]);

    return auditCreated;
  }

  async updateAudit(
    auditId: string,
    data: Partial<AuditInsert>,
    activate: string[],
    deactivate: string[],
    create: string[],
  ): Promise<void> {
    return await db.transaction(async (tx) => {
      const auditUpdated = await tx
        .update(audit)
        .set(data)
        .where(eq(audit.id, auditId))
        .returning()
        .then((res) => res[0]);

      await tx
        .update(auditMembership)
        .set({
          is_active: true,
          status: MembershipStatusEnum.VERIFIED,
        })
        .where(
          and(eq(auditMembership.audit_id, auditId), inArray(auditMembership.user_id, activate)),
        );

      await tx
        .update(auditMembership)
        .set({
          is_active: false,
          status: MembershipStatusEnum.REJECTED,
        })
        .where(
          and(eq(auditMembership.audit_id, auditId), inArray(auditMembership.user_id, deactivate)),
        );

      const toCreate: AuditMembershipInsert[] = create.map((c) => ({
        user_id: c,
        audit_id: auditUpdated.id,
        role: RoleTypeEnum.AUDITOR,
        status: MembershipStatusEnum.VERIFIED,
        is_active: true,
      }));

      await tx.insert(auditMembership).values(toCreate);
    });
  }

  lockAudit(auditId: string): Promise<void> {
    return db.transaction(async (tx) => {
      await tx
        .update(audit)
        .set({ status: AuditStatusEnum.ATTESTATION })
        .where(eq(audit.id, auditId))
        .returning()
        .then((res) => res[0]);

      await tx
        .update(auditMembership)
        .set({ is_active: false })
        .where(
          and(
            eq(auditMembership.audit_id, auditId),
            not(eq(auditMembership.status, MembershipStatusEnum.VERIFIED)),
          ),
        );
    });
  }

  openAudit(auditId: string): Promise<void> {
    return db.transaction(async (tx) => {
      await tx
        .update(audit)
        .set({ status: AuditStatusEnum.DISCOVERY })
        .where(eq(audit.id, auditId))
        .returning()
        .then((res) => res[0]);

      await tx
        .update(auditMembership)
        .set({ accepted_terms: false, attested_terms: false })
        .where(eq(auditMembership.audit_id, auditId));
    });
  }
}

const ownerService = new OwnerService();
export default ownerService;
