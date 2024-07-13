"use server";

import { ValidationResponseI } from "@/utils/types";
import auditorController from "./auditor.controller";
import { Auditors, Audits } from "@prisma/client";

const attestToTerms = async (
  id: string,
  userId: string,
  status: boolean,
  comment: string,
): Promise<ValidationResponseI<Auditors>> => {
  return auditorController.attestToTerms(id, userId, status, comment);
};

const leaveAudit = async (id: string): Promise<ValidationResponseI<Audits>> => {
  return auditorController.leaveAudit(id);
};

const addFinding = async (
  id: string,
  formData: FormData,
): Promise<ValidationResponseI<Auditors>> => {
  return auditorController.addFinding(id, formData);
};

const addRequest = async (id: string): Promise<ValidationResponseI<Auditors>> => {
  return auditorController.addRequest(id);
};

const deleteRequest = async (id: string): Promise<ValidationResponseI<Auditors>> => {
  return auditorController.deleteRequest(id);
};

export { attestToTerms, leaveAudit, addFinding, addRequest, deleteRequest };
