"use server";

import { ValidationResponseI } from "@/utils/types";
import { Auditors, Audits } from "@prisma/client";
import auditorController from "./auditor.controller";

const attestToTerms = async (
  auditId: string,
  status: boolean,
  comment: string,
): Promise<ValidationResponseI<Auditors>> => {
  return auditorController.attestToTerms(auditId, status, comment);
};

const leaveAudit = async (auditId: string): Promise<ValidationResponseI<Audits>> => {
  return auditorController.leaveAudit(auditId);
};

const addFinding = async (
  auditId: string,
  formData: FormData,
): Promise<ValidationResponseI<Auditors>> => {
  return auditorController.addFinding(auditId, formData);
};

const addRequest = async (auditId: string): Promise<ValidationResponseI<Auditors>> => {
  return auditorController.addRequest(auditId);
};

const deleteRequest = async (auditId: string): Promise<ValidationResponseI<Auditors>> => {
  return auditorController.deleteRequest(auditId);
};

export { addFinding, addRequest, attestToTerms, deleteRequest, leaveAudit };
