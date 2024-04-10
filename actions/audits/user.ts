"use server";

import { Auditors, AuditorStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/db/prisma.server";

import { GenericUpdateI } from "@/lib/types";

export const auditAddRequest = (id: string, userId: string): Promise<GenericUpdateI<Auditors>> => {
  // Add the request. To be called by the Auditor only.
  return prisma.users
    .findUnique({
      where: {
        id: userId,
      },
    })
    .then((result) => {
      if (!result) {
        throw new Error("user does not exist");
      }
      if (!result.auditorRole) {
        throw new Error("user does not have auditor role");
      }
      return prisma.auditors.create({
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
      });
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
        error: error.message,
      };
    });
};

export const auditDeleteRequest = (
  id: string,
  userId: string,
): Promise<GenericUpdateI<Auditors>> => {
  // Hard delete the request. Will no longer be in the Database.
  // Will also reset attestations for other auditors.
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
        error: error.message,
      };
    });
};
