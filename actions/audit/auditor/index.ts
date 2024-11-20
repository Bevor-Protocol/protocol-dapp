"use server";

import { ResponseI } from "@/utils/types";
import { AuditMembershipInsert } from "@/utils/types/tables";
import auditorController from "./auditor.controller";

const attestToTerms = async (
  auditId: string,
  status: boolean,
  comment: string,
): Promise<ResponseI<AuditMembershipInsert>> => {
  return auditorController.attestToTerms(auditId, status, comment);
};

const leaveAudit = async (auditId: string): Promise<ResponseI<AuditMembershipInsert>> => {
  return auditorController.leaveAudit(auditId);
};

const addFinding = async (
  auditId: string,
  formData: FormData,
): Promise<ResponseI<AuditMembershipInsert>> => {
  return auditorController.addFinding(auditId, formData);
};

const addRequest = async (auditId: string): Promise<ResponseI<AuditMembershipInsert>> => {
  return auditorController.addRequest(auditId);
};

export { addFinding, addRequest, attestToTerms, leaveAudit };
