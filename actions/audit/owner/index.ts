"use server";

import { Audits, Users } from "@prisma/client";
import { ValidationResponseI, ValidationSuccessI } from "@/utils/types";
import ownerController from "./owner.controller";
import { handleValidationErrorReturn } from "@/utils/error";
import { revalidatePath } from "next/cache";

const createAudit = async (
  id: string,
  formData: FormData,
  auditors: Users[],
): Promise<ValidationResponseI<Audits>> => {
  return ownerController
    .createAudit(id, formData, auditors)
    .then((data): ValidationSuccessI<Audits> => {
      revalidatePath(`/user/${id}`);
      return { success: true, data };
    })
    .catch((error) => {
      return handleValidationErrorReturn(error);
    });
};

const updateAudit = async (
  id: string,
  formData: FormData,
  auditors: Users[],
): Promise<ValidationResponseI<Audits>> => {
  return ownerController
    .updateAudit(id, formData, auditors)
    .then((data): ValidationSuccessI<Audits> => {
      revalidatePath(`/audits/view/${id}`);
      return { success: true, data };
    })
    .catch((error) => {
      return handleValidationErrorReturn(error);
    });
};

const lockAudit = async (id: string): Promise<ValidationResponseI<Audits>> => {
  return ownerController
    .lockAudit(id)
    .then((data): ValidationSuccessI<Audits> => {
      revalidatePath(`/audits/view/${id}`);
      return { success: true, data };
    })
    .catch((error) => {
      return handleValidationErrorReturn(error);
    });
};

const openAudit = async (id: string): Promise<ValidationResponseI<Audits>> => {
  return ownerController
    .openAudit(id)
    .then((data): ValidationSuccessI<Audits> => {
      revalidatePath(`/audits/view/${id}`);
      return { success: true, data };
    })
    .catch((error) => {
      return handleValidationErrorReturn(error);
    });
};

const updateRequestors = async (
  id: string,
  auditorsApprove: string[],
  auditorsReject: string[],
): Promise<ValidationResponseI<{ rejected: number; verified: number }>> => {
  return ownerController
    .updateRequestors(id, auditorsApprove, auditorsReject)
    .then((data): ValidationSuccessI<{ rejected: number; verified: number }> => {
      revalidatePath(`/audits/view/${id}`);
      return {
        success: true,
        data: {
          rejected: data[0].count,
          verified: data[1].count,
        },
      };
    })
    .catch((error) => {
      return handleValidationErrorReturn(error);
    });
};

export { createAudit, updateAudit, lockAudit, openAudit, updateRequestors };
