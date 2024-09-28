"use server";

import { ValidationResponseI } from "@/utils/types";
import { Auditor, User } from "@prisma/client";
import auditorController from "./auditor.controller";

const attestToTerms = async (
  auditId: string,
  status: boolean,
  comment: string,
): Promise<ValidationResponseI<User>> => {
  return auditorController.attestToTerms(auditId, status, comment);
};

const leaveAudit = async (auditId: string): Promise<ValidationResponseI<User>> => {
  return auditorController.leaveAudit(auditId);
};

const addFinding = async (
  auditId: string,
  formData: FormData,
): Promise<ValidationResponseI<User>> => {
  return auditorController.addFinding(auditId, formData);
};

const addRequest = async (auditId: string): Promise<ValidationResponseI<Auditor>> => {
  return auditorController.addRequest(auditId);
};

const deleteRequest = async (auditId: string): Promise<ValidationResponseI<Auditor>> => {
  return auditorController.deleteRequest(auditId);
};

export { addFinding, addRequest, attestToTerms, deleteRequest, leaveAudit };
