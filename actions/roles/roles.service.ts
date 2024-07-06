import { Users } from "@prisma/client";
import * as AuditService from "../audit/audit.service";
import * as UserController from "../user";
import { AuditI } from "@/utils/types/prisma";

export const isOwner = async (
  id: string,
): Promise<{
  audit: AuditI | null;
  isOwner: boolean;
}> => {
  const audit = await AuditService.getAudit(id);
  const { user } = await UserController.currentUser();
  if (!audit) {
    return { audit, isOwner: false };
  }
  if (!user) {
    return { audit, isOwner: false };
  }
  if (user.id !== audit.auditee.id) {
    return { audit, isOwner: false };
  }
  return { audit, isOwner: true };
};

export const isAuditor = async (
  id: string,
): Promise<{
  audit: AuditI | null;
  auditor: Users | null;
}> => {
  const auditor = null;
  const audit = await AuditService.getAudit(id);
  const { user } = await UserController.currentUser();
  if (!audit) {
    return { audit, auditor };
  }
  if (!user) {
    return { audit, auditor };
  }
  const foundAuditor = audit.auditors.find((a) => a.user.id == user.id);

  if (!foundAuditor) {
    return { audit, auditor };
  }
  return { audit, auditor: foundAuditor.user };
};
