"use server";
import { prisma } from "@/lib/db/prisma.server";
import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import matter from "gray-matter";

import { AuditBriefI, AuditViewI, UserProfile, GenericUpdateI } from "@/lib/types/actions";
import { revalidatePath } from "next/cache";

export const getAudits = (status?: string): Promise<AuditBriefI[]> => {
  let filter = {};
  if (status) {
    filter = {
      isFinal: status == "closed",
      isLocked: status != "open",
    };
  }

  return prisma.audit.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      ...filter,
    },
    include: {
      auditee: {
        include: {
          profile: true,
        },
      },
      auditors: {
        include: {
          profile: true,
        },
      },
      terms: true,
    },
  });
};

export const getAudit = (id: string): Promise<AuditViewI | null> => {
  return prisma.audit.findUnique({
    where: {
      id,
    },
    include: {
      terms: true,
      auditors: {
        include: {
          profile: true,
        },
      },
      auditee: {
        include: {
          profile: true,
        },
      },
      requests: {
        include: {
          profile: true,
        },
      },
      termsAccepted: {
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      },
    },
  });
};

export const getMarkdown = async (display: string): Promise<string> => {
  if (!["details", "audit"].includes(display)) {
    display = "details";
  }

  let filePath: string;
  console.log(path.resolve("./public", display + ".md"));
  if (process.env.NODE_ENV === "development") {
    filePath = path.resolve("public", display + ".md");
  } else {
    filePath = path.resolve("./public", display + ".md");
  }
  const fileContents = fs.readFileSync(filePath, "utf8");

  const { content } = matter(fileContents);
  const processedContent = (await remark().use(html).use(remarkGfm).process(content)).toString();

  return processedContent;
};

export const createAudit = (
  id: string,
  audit: FormData,
  auditors: UserProfile[],
): Promise<GenericUpdateI> => {
  // This function doesn't require "requests" or "termsAccepted" connections/creations.
  // However, you can create a function with explicit auditors, who bypass the need for requests.
  const data = Object.fromEntries(audit);
  const { title, description, price, duration } = data;
  const auditorsConnect = auditors.map((auditor) => {
    return { id: auditor.id };
  });
  // add zod validation.
  return prisma.audit
    .create({
      data: {
        auditeeId: id,
        title: title as string,
        description: description as string,
        terms: {
          create: {
            price: Number(price) || 10_000,
            duration: Number(duration) || 3,
          },
        },
        auditors: {
          connect: auditorsConnect,
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
  auditors: UserProfile[],
): Promise<GenericUpdateI> => {
  // To be used for audit updates like creating an audit
  const currentAudit = await getAudit(id);

  const data = Object.fromEntries(audit);
  const { title, description, price, duration } = data;
  const passedAuditorIds = auditors.map((auditor) => auditor.id);

  const currentAuditorIds = currentAudit?.auditors.map((auditor) => auditor.id) || [];

  const auditorsDisconnect = currentAuditorIds
    .filter((auditor) => !passedAuditorIds.includes(auditor))
    .map((auditorId) => {
      return {
        id: auditorId,
      };
    });
  const auditorsConnect = passedAuditorIds
    .filter((auditor) => !currentAuditorIds.includes(auditor))
    .map((auditorId) => {
      return {
        id: auditorId,
      };
    });

  return prisma.audit
    .update({
      where: {
        id,
      },
      data: {
        title: title as string,
        description: description as string,
        auditors: {
          connect: auditorsConnect,
          disconnect: auditorsDisconnect,
        },
        terms: {
          update: {
            data: {
              price: Number(price) || 1_000,
              duration: Number(duration) || 3,
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
  return prisma.audit
    .update({
      where: {
        id,
      },
      data: {
        requests: {
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

export const auditClearRequests = (id: string): Promise<GenericUpdateI> => {
  return prisma.audit
    .update({
      where: {
        id,
      },
      data: {
        requests: {
          set: [],
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

export const auditRemoveRequest = (id: string, userId: string): Promise<GenericUpdateI> => {
  return prisma.audit
    .update({
      where: {
        id,
      },
      data: {
        requests: {
          disconnect: {
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

export const auditApproveRequest = (id: string, userId: string): Promise<GenericUpdateI> => {
  return prisma.audit
    .update({
      where: {
        id,
      },
      data: {
        requests: {
          disconnect: {
            id: userId,
          },
        },
        auditors: {
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

export const lockAudit = async (id: string): Promise<GenericUpdateI> => {
  const currentAudit = await getAudit(id);

  const termsCreate = currentAudit?.auditors.map((auditor) => {
    return {
      user: {
        connect: {
          id: auditor.id,
        },
      },
    };
  });

  return prisma.audit
    .update({
      where: {
        id,
      },
      data: {
        isLocked: true,
        termsAccepted: {
          // can't just connect these, need to create new observations entirely.
          create: termsCreate,
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
