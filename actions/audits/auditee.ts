"use server";

import {
  AuditorStatus,
  Audits,
  Users,
  AuditStatus,
  Prisma,
  UserType,
  HistoryAction,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/db/prisma.server";

import { GenericUpdateI, AuditI } from "@/lib/types";
import { auditFormSchema } from "@/lib/validations";
import { putBlob } from "@/actions/blobs";
import { getAudit } from "@/actions/audits/general";

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
            details: data.url,
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

const updateAuditIso = (
  id: string,
  auditData: Prisma.AuditsUpdateInput,
  auditors: Users[],
  currentAudit: AuditI,
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
      history: {
        create: {
          userType: UserType.AUDITEE,
          action: HistoryAction.EDITED,
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

  if (
    currentAudit.status != AuditStatus.DISCOVERY &&
    currentAudit.status != AuditStatus.ATTESTATION
  ) {
    return Promise.resolve({
      success: false,
      error: "you can only update audits in the discovery or attestion periods",
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
        dataPass.details = data.url;
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
  // 1) check assertions, can only be performed on an OPEN audit
  // 2) move the audit to the ATTESTATION period
  // 3) remove unverified auditors... if reopened, they'll be able to re-request.
  const currentAudit = await getAudit(id);

  if (!currentAudit) {
    return Promise.resolve({
      success: false,
      error: "This audit does not exist",
    });
  }
  if (currentAudit.status !== AuditStatus.DISCOVERY) {
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
        history: {
          create: {
            action: HistoryAction.LOCKED,
            userType: UserType.AUDITEE,
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
        status: AuditStatus.DISCOVERY,
        auditors: {
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
        history: {
          create: {
            userType: UserType.AUDITEE,
            action: HistoryAction.OPENED,
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

export const auditUpdateRequestors = (
  id: string,
  auditors: string[],
  status: AuditorStatus,
): Promise<Prisma.BatchPayload> => {
  // To be called by the Auditee on a batch basis. Can approve or reject auditors,
  // but it won't hard delete them.

  return prisma.auditors.updateMany({
    where: {
      auditId: id,
      userId: {
        in: auditors,
      },
    },
    data: {
      status,
    },
  });
};

export const auditUpdateApprovalStatus = (
  id: string,
  auditorsApprove: string[],
  auditorsReject: string[],
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

export const auditAddAuditInfoId = (
  id: string,
  auditInfoId: string,
): Promise<GenericUpdateI<Audits>> => {
  return prisma.audits
    .update({
      where: {
        id,
      },
      data: {
        onchainAuditInfoId: auditInfoId,
        status: AuditStatus.AUDITING,
        history: {
          create: {
            userType: UserType.AUDITEE,
            action: HistoryAction.FINALIZED,
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
        error: error,
      };
    });
};

export const auditAddNftInfoId = (
  id: string,
  auditNftId: string,
): Promise<GenericUpdateI<Audits>> => {
  console.log(id, auditNftId);
  return prisma.audits
    .update({
      where: {
        id,
      },
      data: {
        onchainNftId: auditNftId,
        status: AuditStatus.CHALLENGEABLE,
        history: {
          create: {
            userType: UserType.AUDITEE,
            action: HistoryAction.MINTED,
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
        error: error,
      };
    });
};
