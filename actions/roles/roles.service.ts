import { AuthError, RoleError } from "@/utils/error";
import { AuditI } from "@/utils/types/prisma";
import { AuditorStatus, AuditStatus, User } from "@prisma/client";
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

  async isAuditOwner(user: User, auditId: string): Promise<AuditI> {
    // I'm already fetching the audit. some of these are reused across permissions,
    // so might as well return it in the object.
    const audit = await this.auditService.getAudit(auditId);
    if (!audit) {
      throw new RoleError();
    }
    if (user.id !== audit?.auditee.id) {
      throw new RoleError();
    }
    return audit;
  }

  async isAuditAuditor(user: User, auditId: string): Promise<AuditI> {
    const audit = await this.auditService.getAudit(auditId);
    if (!audit) {
      throw new RoleError();
    }
    const foundAuditor = audit.auditors.find((a) => a.user.id == user.id);

    if (!foundAuditor) {
      throw new RoleError();
    }
    return audit;
  }

  async canAttest(user: User, auditId: string): Promise<AuditI> {
    const audit = await this.isAuditAuditor(user, auditId);
    if (audit.status !== AuditStatus.ATTESTATION) {
      throw new RoleError();
    }
    return audit;
  }

  async canEdit(user: User, auditId: string): Promise<AuditI> {
    const audit = await this.isAuditOwner(user, auditId);
    if (audit.status != AuditStatus.DISCOVERY && audit.status != AuditStatus.ATTESTATION) {
      throw new RoleError();
    }
    return audit;
  }

  async canLock(user: User, auditId: string): Promise<AuditI> {
    const audit = await this.isAuditOwner(user, auditId);
    if (audit.status !== AuditStatus.DISCOVERY || !audit.details) {
      throw new RoleError();
    }
    const verifiedAuditorExists = audit.auditors.find(
      (auditor) => auditor.status === AuditorStatus.VERIFIED,
    );
    if (!verifiedAuditorExists) {
      throw new RoleError();
    }
    return audit;
  }

  async canOpen(user: User, auditId: string): Promise<AuditI> {
    const audit = await this.isAuditOwner(user, auditId);
    if (audit.status !== AuditStatus.ATTESTATION) {
      throw new RoleError();
    }
    return audit;
  }

  async canLeave(user: User, auditId: string): Promise<AuditI> {
    const audit = await this.isAuditAuditor(user, auditId);
    if (audit.status != AuditStatus.DISCOVERY && audit.status != AuditStatus.ATTESTATION) {
      throw new RoleError();
    }
    return audit;
  }

  async canRequest(user: User, auditId: string): Promise<AuditI> {
    const audit = await this.auditService.getAudit(auditId);

    if (!audit) {
      throw new RoleError();
    }
    if (!user.auditorRole) {
      throw new RoleError();
    }
    const foundAuditor = audit.auditors.find((a) => a.user.id == user.id);

    if (foundAuditor || audit.status != AuditStatus.DISCOVERY) {
      throw new RoleError();
    }
    return audit;
  }
}

const roleService = new RoleService(UserService, AuditService);
export default roleService;
