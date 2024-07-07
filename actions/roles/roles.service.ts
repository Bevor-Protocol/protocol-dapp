import { AuditorStatus, AuditStatus } from "@prisma/client";
import UserService from "../user/user.service";
import AuditService from "../audit/audit.service";
import { RoleI } from "@/utils/types";

class RoleService {
  constructor(
    private readonly userService: typeof UserService,
    private readonly auditService: typeof AuditService,
  ) {}

  async isAuditOwner(id: string): Promise<RoleI> {
    // I'm already fetching the audit. some of these are reused across permissions,
    // so might as well return it in the object.
    const audit = await this.auditService.getAudit(id);
    const { user } = await this.userService.currentUser();
    if (!audit) {
      return { audit, user, allowed: false };
    }
    if (!user) {
      return { audit, user, allowed: false };
    }
    if (user.id !== audit?.auditee.id) {
      return { audit, user, allowed: false };
    }
    return { audit, user, allowed: true };
  }

  async isAuditAuditor(id: string): Promise<RoleI> {
    const audit = await this.auditService.getAudit(id);
    const { user } = await this.userService.currentUser();
    if (!audit) {
      return { audit, user, allowed: false };
    }
    if (!user) {
      return { audit, user, allowed: false };
    }
    const foundAuditor = audit.auditors.find((a) => a.user.id == user.id);

    if (!foundAuditor) {
      return { audit, user, allowed: false };
    }
    return { audit, user, allowed: true };
  }

  async canAttest(id: string): Promise<RoleI> {
    const { audit, user, allowed } = await this.isAuditAuditor(id);
    if (!allowed || audit?.status !== AuditStatus.ATTESTATION) {
      return { audit, user, allowed: false };
    }
    return { audit, user, allowed: true };
  }

  async canEdit(id: string): Promise<RoleI> {
    const { audit, user, allowed } = await this.isAuditOwner(id);
    if (
      !allowed ||
      (audit?.status != AuditStatus.DISCOVERY && audit?.status != AuditStatus.ATTESTATION)
    ) {
      return { audit, user, allowed: false };
    }
    return { audit, user, allowed: true };
  }

  async canLock(id: string): Promise<RoleI> {
    const { audit, user, allowed } = await this.isAuditOwner(id);
    if (!allowed || audit?.status !== AuditStatus.DISCOVERY || !audit.details) {
      return { audit, user, allowed: false };
    }
    const verifiedAuditorExists = audit.auditors.find(
      (auditor) => auditor.status === AuditorStatus.VERIFIED,
    );
    if (!verifiedAuditorExists) {
      return { audit, user, allowed: false };
    }
    return { audit, user, allowed: true };
  }

  async canOpen(id: string): Promise<RoleI> {
    const { audit, user, allowed } = await this.isAuditOwner(id);
    if (!allowed || audit?.status !== AuditStatus.ATTESTATION) {
      return { audit, user, allowed: false };
    }
    return { audit, user, allowed: true };
  }

  async canLeave(id: string): Promise<RoleI> {
    const { audit, user, allowed } = await this.isAuditAuditor(id);
    if (
      !allowed ||
      (audit?.status != AuditStatus.DISCOVERY && audit?.status != AuditStatus.ATTESTATION)
    ) {
      return { audit, user, allowed: false };
    }
    return { audit, user, allowed: true };
  }

  async canRequest(id: string): Promise<RoleI> {
    const audit = await this.auditService.getAudit(id);
    const { user } = await this.userService.currentUser();

    if (!audit) {
      return { audit, user, allowed: false };
    }
    if (!user || !user.auditorRole) {
      return { audit, user, allowed: false };
    }
    const foundAuditor = audit.auditors.find((a) => a.user.id == user.id);

    if (foundAuditor || audit.status != AuditStatus.DISCOVERY) {
      return { audit, user, allowed: false };
    }
    return { audit, user, allowed: true };
  }
}

const roleService = new RoleService(UserService, AuditService);
export default roleService;
