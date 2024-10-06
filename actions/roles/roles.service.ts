import { prisma } from "@/db/prisma.server";
import { AuditStateError, AuthError, RoleError } from "@/utils/error";
import { MembershipAuditI } from "@/utils/types/prisma";
import { Audit, AuditStatusType, MembershipStatusType, RoleType, User } from "@prisma/client";
import AuditService from "../audit/audit.service";
import UserService from "../user/user.service";

class RoleService {
  constructor(
    private readonly userService: typeof UserService,
    private readonly auditService: typeof AuditService,
  ) {}

  async requireAuth(): Promise<User> {
    const { user } = await this.userService.currentUser();
    if (!user) {
      throw new AuthError();
    }
    return user;
  }

  private getMembership(user: User, auditId: string): Promise<MembershipAuditI | null> {
    return prisma.auditMembership.findUnique({
      where: {
        userId_auditId: {
          userId: user.id,
          auditId,
        },
        isActive: true,
      },
      include: {
        audit: true,
      },
    });
  }

  async isAuditOwner(user: User, auditId: string): Promise<MembershipAuditI> {
    // I'm already fetching the audit. some of these are reused across permissions,
    // so might as well return it in the object.
    const membership = await this.getMembership(user, auditId);
    if (!membership) {
      throw new RoleError();
    }
    if (membership.role !== RoleType.OWNER) {
      throw new RoleError();
    }
    if (membership.audit.ownerId !== user.id) {
      throw new RoleError();
    }
    return membership;
  }

  async isAuditAuditor(user: User, auditId: string): Promise<MembershipAuditI> {
    const membership = await this.getMembership(user, auditId);
    if (!membership) {
      throw new RoleError();
    }
    if (membership.role !== RoleType.AUDITOR) {
      throw new RoleError();
    }
    return membership;
  }

  async canAttest(user: User, auditId: string): Promise<MembershipAuditI> {
    const membership = await this.isAuditAuditor(user, auditId);
    if (membership.status !== MembershipStatusType.VERIFIED) {
      throw new RoleError();
    }
    const { audit } = membership;
    if (audit.status !== AuditStatusType.ATTESTATION) {
      throw new AuditStateError();
    }
    return membership;
  }

  async canEdit(user: User, auditId: string): Promise<MembershipAuditI> {
    const membership = await this.isAuditOwner(user, auditId);
    if (
      membership.audit.status != AuditStatusType.DISCOVERY &&
      membership.audit.status != AuditStatusType.ATTESTATION
    ) {
      throw new AuditStateError();
    }
    return membership;
  }

  async canAddFindings(user: User, auditId: string): Promise<MembershipAuditI> {
    const membership = await this.isAuditAuditor(user, auditId);
    if (membership.status !== MembershipStatusType.VERIFIED) {
      throw new RoleError();
    }
    if (membership.audit.status !== AuditStatusType.AUDITING) {
      throw new AuditStateError();
    }
    return membership;
  }

  async canLock(user: User, auditId: string): Promise<MembershipAuditI> {
    const membership = await this.isAuditOwner(user, auditId);
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

  async canOpen(user: User, auditId: string): Promise<MembershipAuditI> {
    const membership = await this.isAuditOwner(user, auditId);
    const { audit } = membership;
    if (audit.status !== AuditStatusType.ATTESTATION) {
      throw new AuditStateError();
    }
    return membership;
  }

  async canLeave(user: User, auditId: string): Promise<MembershipAuditI> {
    const membership = await this.isAuditAuditor(user, auditId);
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

  async canRequest(user: User, auditId: string): Promise<Audit> {
    if (!user.auditorRole) {
      throw new RoleError();
    }
    const audit = await prisma.audit.findUnique({
      where: {
        id: auditId,
        memberships: {
          none: {
            userId: user.id,
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

const roleService = new RoleService(UserService, AuditService);
export default roleService;
