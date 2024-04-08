"use server";
import { prisma } from "@/db/prisma.server";
import { z } from "zod";

import { AuditViewDetailedI, GenericUpdateI } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { AuditorStatus, Audits, AuditStatus, Prisma, Users, Auditors } from "@prisma/client";
import { auditFormSchema } from "@/lib/validations";
import { putBlob } from "@/actions/blobs";
import { getAudit } from "@/actions/audits/get";

const updateAuditIso = (
  id: string,
  auditData: Prisma.AuditsUpdateInput,
  auditors: Users[],
  currentAudit: AuditViewDetailedI,
): Promise<Audits> => {
  // 1) Create newly verified auditors
  // 2) Remove auditors completely that were verified and are now not -> can still request to audit.
  // 3) For all other existing auditors, reset their attestations.

  const passedAuditorIds = auditors.map((auditor) => auditor.id);
  const currentAuditorIds = currentAudit.auditors.map((auditor) => auditor.user.id);

  const auditorsRemove = currentAuditorIds.filter((auditor) => !passedAuditorIds.includes(auditor));

  const auditorsCreate = passedAuditorIds
    .filter((auditor) => !currentAuditorIds.includes(auditor))
    .map((auditorId) => {
      return {
        status: AuditorStatus.VERIFIED,
        user: {
          connect: {
            id: auditorId,
          },
        },
      };
    });

  return prisma.audits.update({
    where: {
      id,
    },
    data: {
      ...auditData,
      auditors: {
        create: auditorsCreate,
        deleteMany: {
          auditId: id,
          userId: {
            in: auditorsRemove,
          },
        },
        updateMany: {
          where: {
            auditId: id,
          },
          data: {
            attestedTerms: false,
            acceptedTerms: false,
          },
        },
      },
    },
  });
};

export const updateAudit = async (
  id: string,
  audit: FormData,
  auditors: Users[],
): Promise<GenericUpdateI<Audits>> => {
  // To be used for audit updates like creating an audit
  // For more granular actions, we'll add different server actions.

  // Rather than deleting auditors' instances, I'll just update them to be rejected.
  const currentAudit = await getAudit(id);

  if (!currentAudit) {
    return new Promise((resolve) => {
      resolve({
        success: false,
        error: "This audit does not exist",
      });
    });
  }

  if (currentAudit.status == AuditStatus.ONGOING || currentAudit.status == AuditStatus.FINAL) {
    return Promise.resolve({
      success: false,
      error: "you can't update an ongoing or final audit",
    });
  }

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
  const dataPass: Prisma.AuditsUpdateInput = { ...rest };

  return putBlob("audit-details", details)
    .then((result) => {
      const { data, success } = result;
      if (success && data) {
        dataPass.details = result.data.url;
      }
      return updateAuditIso(id, { ...dataPass }, auditors, currentAudit);
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

export const lockAudit = async (id: string): Promise<GenericUpdateI<Audits>> => {
  const currentAudit = await getAudit(id);

  if (!currentAudit) {
    return Promise.resolve({
      success: false,
      error: "This audit does not exist",
    });
  }
  if (currentAudit.status !== AuditStatus.OPEN) {
    return Promise.resolve({
      success: false,
      error: "This audit cannot be locked, as it's not OPEN",
    });
  }

  const verifiedAuditorExists = currentAudit.auditors.find(
    (auditor) => auditor.status === AuditorStatus.VERIFIED,
  );
  if (!verifiedAuditorExists) {
    return Promise.resolve({
      success: false,
      error: "This audit cannot be locked, as there are no verified auditors",
    });
  }

  if (!currentAudit.details) {
    return Promise.resolve({
      success: false,
      error: "Can't lock an audit without providing markdown of details",
    });
  }

  return prisma.audits
    .update({
      where: {
        id,
      },
      data: {
        status: AuditStatus.ATTESTATION,
        auditors: {
          deleteMany: {
            auditId: id,
            status: {
              not: AuditorStatus.VERIFIED,
            },
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

export const reopenAudit = async (id: string): Promise<GenericUpdateI<Audits>> => {
  const currentAudit = await getAudit(id);

  if (!currentAudit) {
    return new Promise((resolve) => {
      resolve({
        success: false,
        error: "This audit does not exist",
      });
    });
  }
  if (currentAudit.status !== AuditStatus.ATTESTATION) {
    return new Promise((resolve) => {
      resolve({
        success: false,
        error: "This audit can't be reopened, as it's not LOCKED",
      });
    });
  }

  return prisma.audits
    .update({
      where: {
        id,
      },
      data: {
        status: AuditStatus.OPEN,
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

export const attestToTerms = (
  id: string,
  userId: string,
  status: boolean,
): Promise<GenericUpdateI<Auditors>> => {
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
