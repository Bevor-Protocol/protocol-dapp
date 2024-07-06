"use server";

import { ValidationResponseI, ValidationSuccessI } from "@/utils/types";
import auditorController from "./auditor.controller";
import { Auditors, Audits } from "@prisma/client";
import { handleValidationErrorReturn } from "@/utils/error";
import { revalidatePath } from "next/cache";

const attestToTerms = async (
  id: string,
  userId: string,
  status: boolean,
  comment: string,
): Promise<ValidationResponseI<Auditors>> => {
  return auditorController
    .attestToTerms(id, userId, status, comment)
    .then((data): ValidationSuccessI<Auditors> => {
      revalidatePath(`/audits/view/${id}`);
      return { success: true, data };
    })
    .catch((error) => {
      return handleValidationErrorReturn(error);
    });
};

const leaveAudit = async (id: string): Promise<ValidationResponseI<Audits>> => {
  return auditorController
    .leaveAudit(id)
    .then((data): ValidationSuccessI<Audits> => {
      revalidatePath(`/audits/view/${id}`);
      return { success: true, data };
    })
    .catch((error) => {
      return handleValidationErrorReturn(error);
    });
};

const addFinding = async (
  id: string,
  formData: FormData,
): Promise<ValidationResponseI<Auditors>> => {
  return auditorController
    .addFinding(id, formData)
    .then((data): ValidationSuccessI<Auditors> => {
      revalidatePath(`/audits/view/${id}`);
      return { success: true, data };
    })
    .catch((error) => {
      return handleValidationErrorReturn(error);
    });
};

const addRequest = async (id: string): Promise<ValidationResponseI<Auditors>> => {
  return auditorController
    .addRequest(id)
    .then((data): ValidationSuccessI<Auditors> => {
      revalidatePath(`/audits/view/${id}`);
      return { success: true, data };
    })
    .catch((error) => {
      return handleValidationErrorReturn(error);
    });
};

const deleteRequest = async (id: string): Promise<ValidationResponseI<Auditors>> => {
  return auditorController
    .deleteRequest(id)
    .then((data): ValidationSuccessI<Auditors> => {
      revalidatePath(`/audits/view/${id}`);
      return { success: true, data };
    })
    .catch((error) => {
      return handleValidationErrorReturn(error);
    });
};

export { attestToTerms, leaveAudit, addFinding, addRequest, deleteRequest };
