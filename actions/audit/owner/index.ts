"use server";

import { Audits, Users } from "@prisma/client";
import { ValidationResponseI } from "@/utils/types";
import ownerController from "./owner.controller";

const createAudit = async (
  id: string,
  formData: FormData,
  auditors: Users[],
): Promise<ValidationResponseI<Audits>> => {
  return ownerController.createAudit(id, formData, auditors);
};

const updateAudit = async (
  id: string,
  formData: FormData,
  auditors: Users[],
): Promise<ValidationResponseI<Audits>> => {
  return ownerController.updateAudit(id, formData, auditors);
};

const lockAudit = async (id: string): Promise<ValidationResponseI<Audits>> => {
  return ownerController.lockAudit(id);
};

const openAudit = async (id: string): Promise<ValidationResponseI<Audits>> => {
  return ownerController.openAudit(id);
};

const updateRequestors = async (
  id: string,
  auditorsApprove: string[],
  auditorsReject: string[],
): Promise<ValidationResponseI<{ rejected: number; verified: number }>> => {
  return ownerController.updateRequestors(id, auditorsApprove, auditorsReject);
};

export { createAudit, updateAudit, lockAudit, openAudit, updateRequestors };
