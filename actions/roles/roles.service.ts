import { AuthError } from "@/utils/error";
import { RoleI } from "@/utils/types";
import { AuditorStatus, AuditStatus, Users } from "@prisma/client";
import AuditService from "../audit/audit.service";
import UserService from "../user/user.service";

class RoleService {
  constructor(
    private readonly userService: typeof UserService,
    private readonly auditService: typeof AuditService,
  ) {}

  async requireAuth(): Promise<Users> {
    const { user } = await this.userService.currentUser();
    if (!user) {
      throw new AuthError();
    }
    return user;
  }

  async isAuditOwner(user: Users, auditId: string): Promise<RoleI> {
    // I'm already fetching the audit. some of these are reused across permissions,
    // so might as well return it in the object.
    const audit = await this.auditService.getAudit(auditId);
    if (!audit) {
      return { audit, allowed: false };
    }
    if (user.id !== audit?.auditee.id) {
      return { audit, allowed: false };
    }
    return { audit, allowed: true };
  }

  async isAuditAuditor(user: Users, auditId: string): Promise<RoleI> {
    const audit = await this.auditService.getAudit(auditId);
    if (!audit) {
      return { audit, allowed: false };
    }
    const foundAuditor = audit.auditors.find((a) => a.user.id == user.id);

    if (!foundAuditor) {
      return { audit, allowed: false };
    }
    return { audit, allowed: true };
  }

  async canAttest(user: Users, auditId: string): Promise<RoleI> {
    const { audit, allowed } = await this.isAuditAuditor(user, auditId);
    if (!allowed || audit?.status !== AuditStatus.ATTESTATION) {
      return { audit, allowed: false };
    }
    return { audit, allowed: true };
  }

  async canEdit(user: Users, auditId: string): Promise<RoleI> {
    const { audit, allowed } = await this.isAuditOwner(user, auditId);
    if (
      !allowed ||
      (audit?.status != AuditStatus.DISCOVERY && audit?.status != AuditStatus.ATTESTATION)
    ) {
      return { audit, allowed: false };
    }
    return { audit, allowed: true };
  }

  async canLock(user: Users, auditId: string): Promise<RoleI> {
    const { audit, allowed } = await this.isAuditOwner(user, auditId);
    if (!allowed || audit?.status !== AuditStatus.DISCOVERY || !audit.details) {
      return { audit, allowed: false };
    }
    const verifiedAuditorExists = audit.auditors.find(
      (auditor) => auditor.status === AuditorStatus.VERIFIED,
    );
    if (!verifiedAuditorExists) {
      return { audit, allowed: false };
    }
    return { audit, allowed: true };
  }

  async canOpen(user: Users, auditId: string): Promise<RoleI> {
    const { audit, allowed } = await this.isAuditOwner(user, auditId);
    if (!allowed || audit?.status !== AuditStatus.ATTESTATION) {
      return { audit, allowed: false };
    }
    return { audit, allowed: true };
  }

  async canLeave(user: Users, auditId: string): Promise<RoleI> {
    const { audit, allowed } = await this.isAuditAuditor(user, auditId);
    if (
      !allowed ||
      (audit?.status != AuditStatus.DISCOVERY && audit?.status != AuditStatus.ATTESTATION)
    ) {
      return { audit, allowed: false };
    }
    return { audit, allowed: true };
  }

  async canRequest(user: Users, auditId: string): Promise<RoleI> {
    const audit = await this.auditService.getAudit(auditId);

    if (!audit) {
      return { audit, allowed: false };
    }
    if (!user.auditorRole) {
      return { audit, allowed: false };
    }
    const foundAuditor = audit.auditors.find((a) => a.user.id == user.id);

    if (foundAuditor || audit.status != AuditStatus.DISCOVERY) {
      return { audit, allowed: false };
    }
    return { audit, allowed: true };
  }
}

const roleService = new RoleService(UserService, AuditService);
export default roleService;
