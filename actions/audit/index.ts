"use server";

import { Auditors, AuditorStatus, Audits, Users } from "@prisma/client";
import * as AuditService from "./audit.service";
import * as BlobService from "../blob/blob.service";
import * as UserController from "../user";
import {
  AuditStateI,
  MarkdownAuditsI,
  ValidationResponseI,
  ValidationSuccessI,
} from "@/utils/types";
import { revalidatePath } from "next/cache";
import { AuditDetailedI, AuditFindingsI, AuditI } from "@/utils/types/prisma";
import { handleValidationErrorReturn, RoleError, ValidationError } from "@/utils/error";

export const getAudit = (id: string): Promise<AuditI | null> => {
  return AuditService.getAudit(id);
};

export const getAuditsDetailed = (status?: string): Promise<AuditDetailedI[]> => {
  return AuditService.getAuditsDetailed(status);
};

export const createAudit = async (
  id: string,
  formData: FormData,
  auditors: Users[],
): Promise<ValidationResponseI<Audits>> => {
  try {
    const parsed = AuditService.parseAuditForm(formData);

    const { details, ...rest } = parsed;
    const dataPass: {
      title: string;
      description: string;
      details?: string;
      price: number;
      duration: number;
    } = {
      ...rest,
    };

    const blobData = await BlobService.addBlob("audit-details", details);
    if (blobData) {
      dataPass.details = blobData.url;
    }

    return AuditService.createAudit(id, dataPass, auditors).then((result) => {
      revalidatePath(`/user/${id}`);
      return { success: true, data: result };
    });
  } catch (error) {
    return handleValidationErrorReturn(error);
  }
};

export const updateAudit = async (
  id: string,
  formData: FormData,
  auditors: Users[],
): Promise<ValidationResponseI<Audits>> => {
  try {
    const canEdit = await AuditService.canEdit(id);
    if (!canEdit) {
      throw new RoleError("you cannot update this audit");
    }

    const parsed = AuditService.parseAuditForm(formData);

    const { details, ...rest } = parsed;
    const dataPass: {
      title: string;
      description: string;
      details?: string;
      price: number;
      duration: number;
    } = { ...rest };

    const blobData = await BlobService.addBlob("audit-details", details);
    if (blobData) {
      dataPass.details = blobData.url;
    }

    return AuditService.updateAudit(id, dataPass, auditors).then((result) => {
      revalidatePath(`/audits/view/${id}`);
      return { success: true, data: result };
    });
  } catch (error) {
    return handleValidationErrorReturn(error);
  }
};

export const lockAudit = async (id: string): Promise<ValidationResponseI<Audits>> => {
  try {
    const canLock = await AuditService.canLock(id);
    if (!canLock) {
      throw new RoleError("you cannot lock this audit");
    }

    return AuditService.lockAudit(id).then((data) => {
      revalidatePath(`/audits/view/${id}`);
      return { success: true, data };
    });
  } catch (error) {
    return handleValidationErrorReturn(error);
  }
};

export const openAudit = async (id: string): Promise<ValidationResponseI<Audits>> => {
  try {
    const canOpen = AuditService.canOpen(id);
    if (!canOpen) {
      throw new RoleError("you cannot open this audit");
    }

    return AuditService.openAudit(id).then((data) => {
      revalidatePath(`/audits/view/${id}`);
      return { success: true, data };
    });
  } catch (error) {
    return handleValidationErrorReturn(error);
  }
};

export const updateRequestors = async (
  id: string,
  auditorsApprove: string[],
  auditorsReject: string[],
): Promise<ValidationResponseI<{ rejected: number; verified: number }>> => {
  try {
    const canEdit = await AuditService.canEdit(id);
    if (!canEdit) {
      throw new RoleError("you cannot edit this audit");
    }

    const promises = [
      AuditService.updateRequestors(id, auditorsReject, AuditorStatus.REJECTED),
      AuditService.updateRequestors(id, auditorsApprove, AuditorStatus.VERIFIED),
    ];

    return Promise.all(promises).then((data) => {
      revalidatePath(`/audits/view/${id}`);
      return {
        success: true,
        data: {
          rejected: data[0].count,
          verified: data[1].count,
        },
      };
    });
  } catch (error) {
    return handleValidationErrorReturn(error);
  }
};

export const addAuditInfo = (id: string, infoId: string): Promise<ValidationResponseI<Audits>> => {
  return AuditService.addAuditInfo(id, infoId)
    .then((data): ValidationSuccessI<Audits> => {
      revalidatePath(`/audits/view/${id}`);
      return { success: true, data };
    })
    .catch((error) => {
      return handleValidationErrorReturn(error);
    });
};

export const addNftInfo = (id: string, nftId: string): Promise<ValidationResponseI<Audits>> => {
  return AuditService.addNftInfo(id, nftId)
    .then((data): ValidationSuccessI<Audits> => {
      revalidatePath(`/audits/view/${id}`);
      return { success: true, data };
    })
    .catch((error) => {
      return handleValidationErrorReturn(error);
    });
};

export const leaveAudit = async (id: string): Promise<ValidationResponseI<Audits>> => {
  try {
    const { audit, auditor } = await AuditService.isAuditAuditor(id);
    if (!audit) {
      throw new Error("audit does not exist");
    }
    if (!auditor) {
      throw new RoleError("you cannot leave this audit");
    }

    return AuditService.leaveAudit(audit, auditor).then((data) => {
      revalidatePath(`/audits/view/${id}`);
      return { success: true, data };
    });
  } catch (error) {
    return handleValidationErrorReturn(error);
  }
};

export const addFinding = async (
  id: string,
  formData: FormData,
): Promise<ValidationResponseI<Auditors>> => {
  try {
    const { audit, auditor } = await AuditService.isAuditAuditor(id);
    if (!audit) {
      throw new Error("audit does not exist");
    }
    if (!auditor) {
      throw new RoleError("you cannot add findings to this audit");
    }

    const parsed = AuditService.parseAuditFindings(formData);

    const blobData = await BlobService.addBlob("audit-details", parsed);
    if (!blobData) {
      throw new ValidationError("no file exists", { image: "no file exists" });
    }

    return AuditService.addFindings(id, auditor.id, blobData.url).then((data) => {
      revalidatePath(`/audits/view/${id}`);
      return { success: true, data };
    });
  } catch (error) {
    return handleValidationErrorReturn(error);
  }
};

export const addRequest = async (id: string): Promise<ValidationResponseI<Auditors>> => {
  try {
    const { user } = await UserController.currentUser();
    if (!user) {
      throw new RoleError("not a user");
    }
    if (!user.auditorRole) {
      throw new RoleError("not an auditor");
    }

    return AuditService.addRequest(id, user.id).then((data) => {
      revalidatePath(`/audits/view/${id}`);
      return { success: true, data };
    });
  } catch (error) {
    return handleValidationErrorReturn(error);
  }
};

export const deleteRequest = async (id: string): Promise<ValidationResponseI<Auditors>> => {
  try {
    const { user } = await UserController.currentUser();
    if (!user) {
      throw new RoleError("not a user");
    }
    if (!user.auditorRole) {
      throw new RoleError("not an auditor");
    }

    return AuditService.deleteRequest(id, user.id).then((data) => {
      revalidatePath(`/audits/view/${id}`);
      return { success: true, data };
    });
  } catch (error) {
    return handleValidationErrorReturn(error);
  }
};

export const getState = async (id: string): Promise<AuditStateI> => {
  const { user } = await UserController.currentUser();

  return AuditService.getAuditState(id, user?.id);
};

export const safeMarkdown = async (id: string): Promise<MarkdownAuditsI> => {
  const { user } = await UserController.currentUser();

  return AuditService.safeMarkdownDisplay(id, user?.id);
};

export const getAuditFindings = (id: string): Promise<AuditFindingsI | null> => {
  return AuditService.getAuditFindings(id);
};

export const attestToTerms = async (
  id: string,
  userId: string,
  status: boolean,
  comment: string,
): Promise<ValidationResponseI<Auditors>> => {
  try {
    const canAttest = await AuditService.canAttest(id);
    if (!canAttest) {
      throw new RoleError("cannot attest to terms");
    }
    return AuditService.attestToTerms(id, userId, status, comment).then((data) => {
      revalidatePath(`/audits/view/${id}`);
      return { success: true, data };
    });
  } catch (error) {
    return handleValidationErrorReturn(error);
  }
};
