"use server";
import { prisma } from "@/db/prisma.server";
import { z } from "zod";

import { GenericUpdateI } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { AuditorStatus, Audits, Users } from "@prisma/client";
import { auditFormSchema } from "@/lib/validations";
import { putBlob } from "@/actions/blobs";

const createAuditIso = (
  id: string,
  auditData: {
    title: string;
    description: string;
    details?: string;
    price: number;
    duration: number;
  },
  auditors: Users[],
): Promise<Audits> => {
  const auditorsCreate = auditors.map((auditor) => {
    return {
      status: AuditorStatus.VERIFIED,
      user: {
        connect: {
          id: auditor.id,
        },
      },
    };
  });

  return prisma.audits.create({
    data: {
      auditee: {
        connect: {
          id,
        },
      },
      ...auditData,
      auditors: {
        create: auditorsCreate,
      },
    },
  });
};

export const createAudit = (
  id: string,
  audit: FormData,
  auditors: Users[],
): Promise<GenericUpdateI<Audits>> => {
  // This function doesn't require "requests" or "termsAccepted" connections/creations.
  // However, you can create a function with explicit auditors, who bypass the need for requests.
  const form = Object.fromEntries(audit);
  const formParsed = auditFormSchema.safeParse(form);
  if (!formParsed.success) {
    const formattedErrors: Record<string, string> = {};
    formParsed.error.errors.forEach((error) => {
      formattedErrors[error.path[0]] = error.message;
    });
    return Promise.resolve({
      success: false,
      error: "zod",
      validationErrors: formattedErrors,
    });
  }
  const { details, ...rest } = formParsed.data as z.infer<typeof auditFormSchema>;

  return putBlob("audit-details", details)
    .then((result) => {
      const { data, success } = result;
      if (success && data) {
        return createAuditIso(
          id,
          {
            ...rest,
            details: result.data.url,
          },
          auditors,
        );
      }
      return createAuditIso(id, { ...rest }, auditors);
    })
    .then((data) => {
      revalidatePath(`{/user/${id}}`);
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
