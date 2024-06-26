"use server";

import { Auditors, Audits, AuditStatus, HistoryAction, UserType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/db/prisma.server";
import { z } from "zod";

import { GenericUpdateI } from "@/lib/types";
import { putBlob } from "@/actions/blobs";

export const attestToTerms = (
  id: string,
  userId: string,
  status: boolean,
  comment: string,
): Promise<GenericUpdateI<Auditors>> => {
  // will always mark "attested" as true, but the fct passes "status" to tell us if they
  // accepted or rejected.

  if (comment.length > 160) {
    return Promise.resolve({
      success: false,
      error: "zod",
      validationErrors: {
        comment: "cannot be more thant 160 character",
      },
    });
  }

  if (!status && !comment) {
    return Promise.resolve({
      success: false,
      error: "zod",
      validationErrors: {
        comment: "must include a comment if you are rejecting the terms",
      },
    });
  }

  return prisma.auditors
    .update({
      where: {
        auditId_userId: {
          auditId: id,
          userId,
        },
      },
      data: {
        acceptedTerms: status,
        attestedTerms: true,
        history: {
          create: {
            userType: UserType.AUDITOR,
            action: status ? HistoryAction.APPROVED : HistoryAction.REJECTED,
            comment: comment.length > 0 ? comment : null,
            audit: {
              connect: {
                id,
              },
            },
          },
        },
      },
    })
    .then((data) => {
      revalidatePath(`/audits/view/${id}`);
      return {
        success: true,
        data,
      };
    })
    .catch((error) => {
      return {
        success: false,
        error: error.name,
      };
    });
};

export const leaveAudit = async (id: string, userId: string): Promise<GenericUpdateI<Audits>> => {
  // Hard delete the request. Will no longer be in the Database.
  // Will also reset attestations for other auditors.
  const audit = await prisma.audits.findUnique({ where: { id } });
  let historyObj = {};
  if (audit!.status == AuditStatus.AUDITING) {
    historyObj = {
      history: {
        create: {
          userType: UserType.AUDITOR,
          action: HistoryAction.LEFT,
          auditor: {
            connect: {
              id,
            },
          },
        },
      },
    };
  }

  return prisma.audits
    .update({
      where: {
        id,
      },
      data: {
        auditors: {
          delete: {
            auditId_userId: {
              auditId: id,
              userId,
            },
          },
          updateMany: {
            where: {
              auditId: id,
            },
            data: {
              acceptedTerms: false,
              attestedTerms: false,
            },
          },
        },
        ...historyObj,
      },
    })
    .then((data) => {
      revalidatePath(`/audits/view/${id}`);
      return {
        success: true,
        data,
      };
    })
    .catch((error) => {
      return {
        success: false,
        error: error.name,
      };
    });
};

export const addAuditFindings = (
  auditId: string,
  userId: string,
  formData: FormData,
): Promise<GenericUpdateI<Auditors>> => {
  // Can't accept just a File, but can accept a FormData input.
  const fileUpload = formData.get("findings");
  const findingsParser = z.custom<File>((file) => {
    if (!file) return true;
    if (!(file instanceof File)) return "This isn't a file";
    if (!file.name || file.size <= 0) return true;
    if (file.size > 4.5 * 1024 * 1024) return "Max file size in 4.5MB";
    return true;
  });

  const parsed = findingsParser.safeParse(fileUpload);
  if (!parsed.success) {
    const formattedErrors: Record<string, string> = {};
    parsed.error.errors.forEach((error) => {
      formattedErrors[error.path[0]] = error.message;
    });
    return Promise.resolve({
      success: false,
      error: "zod",
      validationErrors: formattedErrors,
    });
  }

  return putBlob("audit-findings", parsed.data)
    .then((result) => {
      const { data, success } = result;
      if (success && data) {
        return prisma.auditors.update({
          where: {
            auditId_userId: {
              auditId: auditId,
              userId: userId,
            },
          },
          data: {
            findings: data.url,
            history: {
              create: {
                userType: UserType.AUDITOR,
                action: HistoryAction.FINDINGS,
                audit: {
                  connect: {
                    id: auditId,
                  },
                },
              },
            },
          },
        });
      }
      throw new Error("could not parse input file");
    })
    .then((data) => {
      revalidatePath(`/audits/view/${auditId}`);
      return {
        success: true,
        data,
      };
    })
    .catch((error) => {
      return {
        success: false,
        error: error.message,
        validationErrors: {
          findings: "no input file selected",
        },
      };
    });
};
