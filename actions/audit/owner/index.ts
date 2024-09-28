"use server";

import { ResponseI } from "@/utils/types";
import { Audit, User } from "@prisma/client";
import ownerController from "./owner.controller";

const createAudit = async (formData: FormData, auditors: User[]): Promise<ResponseI<Audit>> => {
  return ownerController.createAudit(formData, auditors);
};

const updateAudit = async (
  id: string,
  formData: FormData,
  auditors: User[],
): Promise<ResponseI<Audit>> => {
  return ownerController.updateAudit(id, formData, auditors);
};

const lockAudit = async (id: string): Promise<ResponseI<Audit>> => {
  return ownerController.lockAudit(id);
};

const openAudit = async (id: string): Promise<ResponseI<Audit>> => {
  return ownerController.openAudit(id);
};

const updateRequestors = async (
  id: string,
  auditorsApprove: string[],
  auditorsReject: string[],
): Promise<ResponseI<{ rejected: number; verified: number }>> => {
  return ownerController.updateRequestors(id, auditorsApprove, auditorsReject);
};

export { createAudit, lockAudit, openAudit, updateAudit, updateRequestors };
