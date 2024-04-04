"use server";
import { prisma } from "@/lib/db/prisma.server";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import matter from "gray-matter";

import { AuditViewI, AuditViewDetailedI, GenericUpdateI } from "@/lib/types/actions";
import { revalidatePath } from "next/cache";
import { Auditors, AuditorStatus, AuditStatus, Prisma, Users } from "@prisma/client";

export const getAudits = (status?: string): Promise<AuditViewI[]> => {
  let statusFilter;
  switch (status) {
    case "locked":
      statusFilter = AuditStatus.ATTESTATION;
      break;
    case "ongoing":
      statusFilter = AuditStatus.ONGOING;
      break;
    case "completed":
      statusFilter = AuditStatus.FINAL;
      break;
    default:
      statusFilter = AuditStatus.OPEN;
      break;
  }
  return prisma.audits.findMany({
    where: {
      status: statusFilter,
    },
    include: {
      auditee: true,
      auditors: {
        where: {
          status: AuditorStatus.VERIFIED,
        },
        select: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAudit = (id: string): Promise<AuditViewDetailedI | null> => {
  // A more detailed view. Will show verified, rejected, and requested auditors as well.
  return prisma.audits.findUnique({
    where: {
      id,
    },
    include: {
      auditee: true,
      auditors: {
        include: {
          user: true,
        },
      },
    },
  });
};

export const getMarkdown = async (display?: "details" | "audit"): Promise<string> => {
  const displayUse = display ?? "details";

  const tempMapper: Record<string, string> = {
    details:
      "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md",
    audit:
      "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md",
  };

  return fetch(tempMapper[displayUse])
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch remote markdown file");
      }
      return response.text();
    })
    .then((result) => {
      const { content } = matter(result);
      return remark().use(html).use(remarkGfm).process(content);
    })
    .then((contents) => {
      return contents.toString();
    });
};

export const createAudit = (
  id: string,
  audit: FormData,
  auditors: Users[],
): Promise<GenericUpdateI> => {
  // This function doesn't require "requests" or "termsAccepted" connections/creations.
  // However, you can create a function with explicit auditors, who bypass the need for requests.
  const data = Object.fromEntries(audit);
  const { title, description, price, duration } = data;
  const auditorsConnect = auditors.map((auditor) => {
    return {
      status: AuditorStatus.VERIFIED,
      user: {
        connect: {
          id: auditor.id,
        },
      },
    };
  });
  // add zod validation.
  return prisma.audits
    .create({
      data: {
        auditeeId: id,
        title: title as string,
        description: description as string,
        price: Number(price) || 10_000,
        duration: Number(duration) || 3,
        auditors: {
          create: auditorsConnect,
        },
      },
    })
    .then(() => {
      revalidatePath(`{/user/${id}}`);
      return {
        success: true,
      };
    })
    .catch((error) => {
      return {
        success: false,
        error: error.name,
      };
    });
};

export const updateAudit = async (
  id: string,
  audit: FormData,
  auditors: Users[],
): Promise<GenericUpdateI> => {
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

  const data = Object.fromEntries(audit);
  const { title, description, price, duration } = data;
  const passedAuditorIds = auditors.map((auditor) => auditor.id);

  const currentAuditorIds = currentAudit.auditors.map((auditor) => auditor.user.id);

  const auditorsReject = currentAuditorIds.filter((auditor) => !passedAuditorIds.includes(auditor));

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

  return prisma.audits
    .update({
      where: {
        id,
      },
      data: {
        title: title as string,
        description: description as string,
        price: Number(price) || 1_000,
        duration: Number(duration) || 3,
        auditors: {
          create: auditorsCreate,
          updateMany: {
            where: {
              auditId: id,
              userId: {
                in: auditorsReject,
              },
            },
            data: {
              status: AuditorStatus.REJECTED,
            },
          },
        },
      },
    })
    .then(() => {
      revalidatePath(`{/audits/view/${id}}`);
      return {
        success: true,
      };
    })
    .catch((error) => {
      return {
        success: false,
        error: error.name,
      };
    });
};

export const auditAddRequest = (id: string, userId: string): Promise<GenericUpdateI> => {
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
    .then(() => {
      revalidatePath(`{/audits/view/${id}}`);
      return {
        success: true,
      };
    })
    .catch((error) => {
      return {
        success: false,
        error: error.name,
      };
    });
};

export const auditDeleteRequest = (id: string, userId: string): Promise<GenericUpdateI> => {
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
    .then(() => {
      revalidatePath(`{/audits/view/${id}}`);
      return {
        success: true,
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
): Promise<GenericUpdateI> => {
  return Promise.all([
    auditUpdateRequestors(id, auditorsReject, AuditorStatus.REJECTED),
    auditUpdateRequestors(id, auditorsApprove, AuditorStatus.VERIFIED),
  ])
    .then(() => {
      revalidatePath(`/audits/view/${id}`);
      return {
        success: true,
      };
    })
    .catch((error) => {
      return {
        success: false,
        error: error.name,
      };
    });
};

export const lockAudit = async (id: string): Promise<GenericUpdateI> => {
  const currentAudit = await getAudit(id);

  if (!currentAudit) {
    return new Promise((resolve) => {
      resolve({
        success: false,
        error: "This audit does not exist",
      });
    });
  }
  if (currentAudit.status !== AuditStatus.OPEN) {
    return new Promise((resolve) => {
      resolve({
        success: false,
        error: "This audit can't be reopened",
      });
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
    .then(() => {
      revalidatePath(`{/audits/view/${id}}`);
      return {
        success: true,
      };
    })
    .catch((error) => {
      return {
        success: false,
        error: error.name,
      };
    });
};

export const reopenAudit = async (id: string): Promise<GenericUpdateI> => {
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
        error: "This audit can't be reopened",
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
    .then(() => {
      revalidatePath(`{/audits/view/${id}}`);
      return {
        success: true,
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
): Promise<GenericUpdateI> => {
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
    .then(() => {
      revalidatePath(`{/audits/view/${id}}`);
      return {
        success: true,
      };
    })
    .catch((error) => {
      return {
        success: false,
        error: error.name,
      };
    });
};
