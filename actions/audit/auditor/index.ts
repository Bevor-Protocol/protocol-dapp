"use server";

import { ResponseI } from "@/utils/types";
import { Auditor, User } from "@prisma/client";
import auditorController from "./auditor.controller";

const attestToTerms = async (
  auditId: string,
  status: boolean,
  comment: string,
): Promise<ResponseI<User>> => {
  return auditorController.attestToTerms(auditId, status, comment);
};

const leaveAudit = async (auditId: string): Promise<ResponseI<User>> => {
  return auditorController.leaveAudit(auditId);
};

const addFinding = async (auditId: string, formData: FormData): Promise<ResponseI<User>> => {
  return auditorController.addFinding(auditId, formData);
};

const addRequest = async (auditId: string): Promise<ResponseI<Auditor>> => {
  return auditorController.addRequest(auditId);
};

const deleteRequest = async (auditId: string): Promise<ResponseI<Auditor>> => {
  return auditorController.deleteRequest(auditId);
};

export { addFinding, addRequest, attestToTerms, deleteRequest, leaveAudit };
