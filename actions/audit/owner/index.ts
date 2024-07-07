"use server";

import { Audits, Users } from "@prisma/client";
import { ValidationResponseI } from "@/utils/types";
import ownerController from "./owner.controller";
import { errorWrapperMutation } from "@/utils/error";
import { revalidatePath } from "next/cache";

const createAudit = async (
  id: string,
  formData: FormData,
  auditors: Users[],
): Promise<ValidationResponseI<Audits>> => {
  return errorWrapperMutation(() => ownerController.createAudit(id, formData, auditors));
};

const updateAudit = async (
  id: string,
  formData: FormData,
  auditors: Users[],
): Promise<ValidationResponseI<Audits>> => {
  return errorWrapperMutation(
    () => ownerController.updateAudit(id, formData, auditors),
    () => revalidatePath(`/audits/view/${id}`, "page"),
  );
};

const lockAudit = async (id: string): Promise<ValidationResponseI<Audits>> => {
  return errorWrapperMutation(
    () => ownerController.lockAudit(id),
    () => revalidatePath(`/audits/view/${id}`, "page"),
  );
};

const openAudit = async (id: string): Promise<ValidationResponseI<Audits>> => {
  return errorWrapperMutation(
    () => ownerController.openAudit(id),
    () => revalidatePath(`/audits/view/${id}`, "page"),
  );
};

const updateRequestors = async (
  id: string,
  auditorsApprove: string[],
  auditorsReject: string[],
): Promise<ValidationResponseI<{ rejected: number; verified: number }>> => {
  return errorWrapperMutation(
    () => ownerController.updateRequestors(id, auditorsApprove, auditorsReject),
    () => revalidatePath(`/audits/view/${id}`, "page"),
  );
};

export { createAudit, updateAudit, lockAudit, openAudit, updateRequestors };
