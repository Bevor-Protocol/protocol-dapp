"use server";
import { prisma } from "@/db/prisma.server";

import { GenericUpdateI } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { Auditors, AuditorStatus, Prisma } from "@prisma/client";

export const auditAddRequest = (id: string, userId: string): Promise<GenericUpdateI<Auditors>> => {
  // Add the request. To be called by the Auditor only.
  return prisma.auditors
    .create({
      data: {
        status: AuditorStatus.REQUESTED,
        audit: {
          connect: {
            id,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })
    .then((data) => {
      revalidatePath(`{/audits/view/${id}}`);
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

export const auditDeleteRequest = (
  id: string,
  userId: string,
): Promise<GenericUpdateI<Auditors>> => {
  // Hard delete the request. Will no longer be in the Database.
  return prisma.auditors
    .delete({
      where: {
        auditId_userId: {
          auditId: id,
          userId,
        },
      },
    })
    .then((data) => {
      revalidatePath(`{/audits/view/${id}}`);
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

export const auditUpdateRequestors = (
  id: string,
  auditors: Auditors[],
  status: AuditorStatus,
): Promise<Prisma.BatchPayload> => {
  // To be called by the Auditee on a batch basis. Can approve or reject auditors,
  // but it won't hard delete them.

  const auditorIds = auditors.map((auditor) => auditor.userId);

  return prisma.auditors.updateMany({
    where: {
      auditId: id,
      userId: {
        in: auditorIds,
      },
    },
    data: {
      status,
    },
  });
};

export const auditUpdateApprovalStatus = (
  id: string,
  auditorsApprove: Auditors[],
  auditorsReject: Auditors[],
): Promise<GenericUpdateI<{ rejected: number; verified: number }>> => {
  return Promise.all([
    auditUpdateRequestors(id, auditorsReject, AuditorStatus.REJECTED),
    auditUpdateRequestors(id, auditorsApprove, AuditorStatus.VERIFIED),
  ])
    .then((data) => {
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
      return {
        success: false,
        error: error.name,
      };
    });
};
