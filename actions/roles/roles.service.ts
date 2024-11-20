import { db } from "@/db";
import { auditMembership } from "@/db/schema/audit-membership.sql";
import { audit } from "@/db/schema/audit.sql";
import { AuditStateError, AuthError, RoleError } from "@/utils/error";
import { AuditStatusEnum, MembershipStatusEnum, RoleTypeEnum } from "@/utils/types/enum";
import { MembershipWithAudit } from "@/utils/types/relations";
import { Audit, User } from "@/utils/types/tables";
import { and, eq, ne } from "drizzle-orm";
import AuditService from "../audit/audit.service";
import AuthService from "../auth/auth.service";
import UserService from "../user/user.service";

class RoleService {
  constructor(
    private readonly userService: typeof UserService,
    private readonly auditService: typeof AuditService,
    private readonly authService: typeof AuthService,
  ) {}

  async requireAuth(): Promise<{ address: string; id: string }> {
    const data = await this.authService.currentUser();
    if (!data.address) {
      throw new AuthError();
    }
    return data;
  }

  async requireAccount(): Promise<{ address: string; id: string }> {
    // User can be authenticated via SIWE, but not have an account yet, since we
    // isolate those pieces of logic.
    const data = await this.authService.currentUser();
    if (!data.id) {
      throw new AuthError();
    }
    return data;
  }

  async requireRole(role: RoleTypeEnum): Promise<User> {
    const { address } = await this.requireAccount();
    const user = await this.userService.getProfile(address);
    if (role === RoleTypeEnum.AUDITOR && !user?.auditor_role) {
      throw new RoleError();
    }
    if (role === RoleTypeEnum.OWNER && !user?.owner_role) {
      throw new RoleError();
    }
    return user!;
  }

  private getMembership(userId: string, auditId: string): Promise<MembershipWithAudit | undefined> {
    return db.query.auditMembership.findFirst({
      where: and(
        eq(auditMembership.user_id, userId),
        eq(auditMembership.audit_id, auditId),
        eq(auditMembership.is_active, true),
      ),
      columns: {
        findings: false,
      },
      with: {
        audit: true,
      },
    });
  }

  async isAuditOwner(userId: string, auditId: string): Promise<MembershipWithAudit> {
    // I'm already fetching the audit. some of these are reused across permissions,
    // so might as well return it in the object.
    const membership = await this.getMembership(userId, auditId);
    if (!membership) {
      throw new RoleError();
    }
    if (membership.role !== RoleTypeEnum.OWNER) {
      throw new RoleError();
    }
    if (membership.audit.owner_id !== userId) {
      throw new RoleError();
    }
    return membership;
  }

  async isAuditAuditor(userId: string, auditId: string): Promise<MembershipWithAudit> {
    const membership = await this.getMembership(userId, auditId);
    if (!membership) {
      throw new RoleError();
    }
    if (membership.role !== RoleTypeEnum.AUDITOR) {
      throw new RoleError();
    }
    return membership;
  }

  async canAttest(userId: string, auditId: string): Promise<MembershipWithAudit> {
    const membership = await this.isAuditAuditor(userId, auditId);
    if (membership.status !== MembershipStatusEnum.VERIFIED) {
      throw new RoleError();
    }
    if (membership.audit.status !== AuditStatusEnum.ATTESTATION) {
      throw new AuditStateError();
    }
    return membership;
  }

  async canEdit(userId: string, auditId: string): Promise<MembershipWithAudit> {
    const membership = await this.isAuditOwner(userId, auditId);
    if (
      membership.audit.status != AuditStatusEnum.DISCOVERY &&
      membership.audit.status != AuditStatusEnum.ATTESTATION
    ) {
      throw new AuditStateError();
    }
    return membership;
  }

  async canAddFindings(userId: string, auditId: string): Promise<MembershipWithAudit> {
    const membership = await this.isAuditAuditor(userId, auditId);
    if (membership.status !== MembershipStatusEnum.VERIFIED) {
      throw new RoleError();
    }
    if (membership.audit.status !== AuditStatusEnum.AUDITING) {
      throw new AuditStateError();
    }
    return membership;
  }

  async canLock(userId: string, auditId: string): Promise<MembershipWithAudit> {
    const membership = await this.isAuditOwner(userId, auditId);
    if (membership.audit.status !== AuditStatusEnum.DISCOVERY) {
      throw new AuditStateError();
    }
    if (!membership.audit.details) {
      throw new AuditStateError();
    }
    const memberships = await this.auditService.getAuditAuditors(auditId);

    const verifiedAuditorExists = memberships.some(
      (member) => member.status === MembershipStatusEnum.VERIFIED,
    );
    if (!verifiedAuditorExists) {
      throw new AuditStateError();
    }
    return membership;
  }

  async canOpen(userId: string, auditId: string): Promise<MembershipWithAudit> {
    const membership = await this.isAuditOwner(userId, auditId);
    if (membership.audit.status !== AuditStatusEnum.ATTESTATION) {
      throw new AuditStateError();
    }
    return membership;
  }

  async canLeave(userId: string, auditId: string): Promise<MembershipWithAudit> {
    const membership = await this.isAuditAuditor(userId, auditId);
    if (membership.status !== MembershipStatusEnum.VERIFIED) {
      throw new RoleError();
    }
    if (membership.audit.status === AuditStatusEnum.CHALLENGEABLE) {
      throw new AuditStateError();
    }
    if (membership.audit.status === AuditStatusEnum.FINALIZED) {
      throw new AuditStateError();
    }
    return membership;
  }

  async canRequest(userId: string, auditId: string): Promise<Audit> {
    await this.requireRole(RoleTypeEnum.AUDITOR);
    const [auditFound] = await db
      .select()
      .from(audit)
      .leftJoin(auditMembership, eq(audit.id, auditMembership.audit_id))
      .where(and(ne(auditMembership.user_id, userId), eq(audit.id, auditId)))
      .limit(1);

    if (!auditFound) {
      throw new RoleError();
    }
    if (auditFound.audit.status !== AuditStatusEnum.DISCOVERY) {
      throw new AuditStateError();
    }

    return auditFound.audit;
  }
}

const roleService = new RoleService(UserService, AuditService, AuthService);
export default roleService;
