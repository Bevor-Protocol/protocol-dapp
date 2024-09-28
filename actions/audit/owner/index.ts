"use server";

import { ValidationResponseI } from "@/utils/types";
import { Audit, User } from "@prisma/client";
import ownerController from "./owner.controller";

const createAudit = async (
  formData: FormData,
  auditors: User[],
): Promise<ValidationResponseI<Audit>> => {
  return ownerController.createAudit(formData, auditors);
};

const updateAudit = async (
  id: string,
  formData: FormData,
  auditors: User[],
): Promise<ValidationResponseI<Audit>> => {
  return ownerController.updateAudit(id, formData, auditors);
};

const lockAudit = async (id: string): Promise<ValidationResponseI<Audit>> => {
  return ownerController.lockAudit(id);
};

const openAudit = async (id: string): Promise<ValidationResponseI<Audit>> => {
  return ownerController.openAudit(id);
};

const updateRequestors = async (
  id: string,
  auditorsApprove: string[],
  auditorsReject: string[],
): Promise<ValidationResponseI<{ rejected: number; verified: number }>> => {
  return ownerController.updateRequestors(id, auditorsApprove, auditorsReject);
};

export { createAudit, lockAudit, openAudit, updateAudit, updateRequestors };
