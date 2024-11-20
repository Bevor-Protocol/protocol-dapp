import { db } from "@/db";
import { auditMembership } from "@/db/schema/audit-membership.sql";
import { MembershipStatusEnum, RoleTypeEnum } from "@/utils/types/enum";
import { AuditMembershipInsert } from "@/utils/types/tables";
import { eq } from "drizzle-orm";

class AuditorService {
  attestToTerms(membershipId: string, status: boolean): Promise<AuditMembershipInsert> {
    // via an entry of User, we can simultaneously update Auditors, and create
    // a History observation.
    return db
      .update(auditMembership)
      .set({
        accepted_terms: status,
        attested_terms: true,
      })
      .where(eq(auditMembership.id, membershipId))
      .returning()
      .then((res) => res[0]);
  }

  resetAttestations(auditId: string): Promise<AuditMembershipInsert> {
    return db
      .update(auditMembership)
      .set({
        accepted_terms: false,
        attested_terms: false,
      })
      .where(eq(auditMembership.audit_id, auditId))
      .returning()
      .then((res) => res[0]);
  }

  leaveAudit(membershipId: string): Promise<AuditMembershipInsert> {
    return db
      .update(auditMembership)
      .set({
        is_active: false,
      })
      .where(eq(auditMembership.id, membershipId))
      .returning()
      .then((res) => res[0]);
  }

  addFindings(membershipId: string, findings: string): Promise<AuditMembershipInsert> {
    return db
      .update(auditMembership)
      .set({
        findings,
      })
      .where(eq(auditMembership.id, membershipId))
      .returning()
      .then((res) => res[0]);
  }

  addRequest(userId: string, auditId: string): Promise<AuditMembershipInsert> {
    return db
      .insert(auditMembership)
      .values({
        user_id: userId,
        audit_id: auditId,
        role: RoleTypeEnum.AUDITOR,
        status: MembershipStatusEnum.REQUESTED,
      })
      .returning()
      .then((res) => res[0]);
  }
}

const auditorService = new AuditorService();
export default auditorService;
