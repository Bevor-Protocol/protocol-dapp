"use server";

import { ResponseI } from "@/utils/types/api";
import { Audit, User } from "@/utils/types/tables";
import ownerController from "./owner.controller";

const createAudit = async (formData: FormData, auditors: User[]): Promise<ResponseI<Audit>> => {
  return ownerController.createAudit(formData, auditors);
};

const updateAudit = async (
  id: string,
  formData: FormData,
  auditors: User[],
): Promise<ResponseI<boolean>> => {
  return ownerController.updateAudit(id, formData, auditors);
};

const lockAudit = async (id: string): Promise<ResponseI<boolean>> => {
  return ownerController.lockAudit(id);
};

const openAudit = async (id: string): Promise<ResponseI<boolean>> => {
  return ownerController.openAudit(id);
};

const updateRequestors = async (
  id: string,
  auditorsApprove: string[],
  auditorsReject: string[],
): Promise<ResponseI<boolean>> => {
  return ownerController.updateRequestors(id, auditorsApprove, auditorsReject);
};

export { createAudit, lockAudit, openAudit, updateAudit, updateRequestors };
