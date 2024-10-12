import { prisma } from "@/db/prisma.server";
import { AuditStateError, AuthError, RoleError } from "@/utils/error";
import { MembershipAuditI } from "@/utils/types/prisma";
import { Audit, AuditStatusType, MembershipStatusType, RoleType, User } from "@prisma/client";
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

  async requireRole(role: RoleType): Promise<User> {
    const { address } = await this.requireAccount();
    const user = await this.userService.getProfile(address);
    if (role === RoleType.AUDITOR && !user?.auditorRole) {
      throw new RoleError();
    }
    if (role === RoleType.OWNER && !user?.ownerRole) {
      throw new RoleError();
    }
    return user!;
  }

  private getMembership(userId: string, auditId: string): Promise<MembershipAuditI | null> {
    return prisma.auditMembership.findUnique({
      where: {
        userId_auditId: {
          userId,
          auditId,
        },
        isActive: true,
      },
      include: {
        audit: true,
      },
    });
  }

  async isAuditOwner(userId: string, auditId: string): Promise<MembershipAuditI> {
    // I'm already fetching the audit. some of these are reused across permissions,
    // so might as well return it in the object.
    const membership = await this.getMembership(userId, auditId);
    if (!membership) {
      throw new RoleError();
    }
    if (membership.role !== RoleType.OWNER) {
      throw new RoleError();
    }
    if (membership.audit.ownerId !== userId) {
      throw new RoleError();
    }
    return membership;
  }

  async isAuditAuditor(userId: string, auditId: string): Promise<MembershipAuditI> {
    const membership = await this.getMembership(userId, auditId);
    if (!membership) {
      throw new RoleError();
    }
    if (membership.role !== RoleType.AUDITOR) {
      throw new RoleError();
    }
    return membership;
  }

  async canAttest(userId: string, auditId: string): Promise<MembershipAuditI> {
    const membership = await this.isAuditAuditor(userId, auditId);
    if (membership.status !== MembershipStatusType.VERIFIED) {
      throw new RoleError();
    }
    const { audit } = membership;
    if (audit.status !== AuditStatusType.ATTESTATION) {
      throw new AuditStateError();
    }
    return membership;
  }

  async canEdit(userId: string, auditId: string): Promise<MembershipAuditI> {
    const membership = await this.isAuditOwner(userId, auditId);
    if (
      membership.audit.status != AuditStatusType.DISCOVERY &&
      membership.audit.status != AuditStatusType.ATTESTATION
    ) {
      throw new AuditStateError();
    }
    return membership;
  }

  async canAddFindings(userId: string, auditId: string): Promise<MembershipAuditI> {
    const membership = await this.isAuditAuditor(userId, auditId);
    if (membership.status !== MembershipStatusType.VERIFIED) {
      throw new RoleError();
    }
    if (membership.audit.status !== AuditStatusType.AUDITING) {
      throw new AuditStateError();
    }
    return membership;
  }

  async canLock(userId: string, auditId: string): Promise<MembershipAuditI> {
    const membership = await this.isAuditOwner(userId, auditId);
    if (membership.audit.status !== AuditStatusType.DISCOVERY) {
      throw new AuditStateError();
    }
    if (!membership.audit.details) {
      throw new AuditStateError();
    }
    const memberships = await this.auditService.getAuditAuditors(auditId);

    const verifiedAuditorExists = memberships.some(
      (member) => member.status === MembershipStatusType.VERIFIED,
    );
    if (!verifiedAuditorExists) {
      throw new AuditStateError();
    }
    return membership;
  }

  async canOpen(userId: string, auditId: string): Promise<MembershipAuditI> {
    const membership = await this.isAuditOwner(userId, auditId);
    const { audit } = membership;
    if (audit.status !== AuditStatusType.ATTESTATION) {
      throw new AuditStateError();
    }
    return membership;
  }

  async canLeave(userId: string, auditId: string): Promise<MembershipAuditI> {
    const membership = await this.isAuditAuditor(userId, auditId);
    if (membership.status !== MembershipStatusType.VERIFIED) {
      throw new RoleError();
    }
    const { audit } = membership;
    if (audit.status === AuditStatusType.CHALLENGEABLE) {
      throw new AuditStateError();
    }
    if (audit.status === AuditStatusType.FINALIZED) {
      throw new AuditStateError();
    }
    return membership;
  }

  async canRequest(userId: string, auditId: string): Promise<Audit> {
    await this.requireRole(RoleType.AUDITOR);
    const audit = await prisma.audit.findUnique({
      where: {
        id: auditId,
        memberships: {
          none: {
            userId,
          },
        },
      },
    });

    if (!audit) {
      throw new RoleError();
    }
    if (audit.status !== AuditStatusType.DISCOVERY) {
      throw new AuditStateError();
    }

    return audit;
  }
}

const roleService = new RoleService(UserService, AuditService, AuthService);
export default roleService;
