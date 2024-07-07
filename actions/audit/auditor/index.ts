"use server";

import { ValidationResponseI } from "@/utils/types";
import auditorController from "./auditor.controller";
import { Auditors, Audits } from "@prisma/client";
import { errorWrapperMutation } from "@/utils/error";
import { revalidatePath } from "next/cache";

const attestToTerms = async (
  id: string,
  userId: string,
  status: boolean,
  comment: string,
): Promise<ValidationResponseI<Auditors>> => {
  return errorWrapperMutation(
    () => auditorController.attestToTerms(id, userId, status, comment),
    () => revalidatePath(`/audits/view/${id}`),
  );
};

const leaveAudit = async (id: string): Promise<ValidationResponseI<Audits>> => {
  return errorWrapperMutation(
    () => auditorController.leaveAudit(id),
    () => revalidatePath(`/audits/view/${id}`),
  );
};

const addFinding = async (
  id: string,
  formData: FormData,
): Promise<ValidationResponseI<Auditors>> => {
  return errorWrapperMutation(
    () => auditorController.addFinding(id, formData),
    () => revalidatePath(`/audits/view/${id}`),
  );
};

const addRequest = async (id: string): Promise<ValidationResponseI<Auditors>> => {
  return errorWrapperMutation(
    () => auditorController.addRequest(id),
    () => revalidatePath(`/audits/view/${id}`),
  );
};

const deleteRequest = async (id: string): Promise<ValidationResponseI<Auditors>> => {
  return errorWrapperMutation(
    () => auditorController.deleteRequest(id),
    () => revalidatePath(`/audits/view/${id}`),
  );
};

export { attestToTerms, leaveAudit, addFinding, addRequest, deleteRequest };
