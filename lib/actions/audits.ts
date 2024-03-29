"use server";
import { prisma } from "@/lib/db/prisma.server";
import { PrismaPromise } from "@prisma/client";
import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import matter from "gray-matter";

import { AuditFull, UserProfile } from "@/lib/types/actions";

export const getAudits = (status?: string): Promise<AuditFull[]> => {
  let filter;
  switch (status) {
    case "open":
      filter = {
        terms: null,
      };
      break;
    case "pending":
      filter = {
        terms: {
          isFinal: false,
        },
      };
      break;
    case "closed":
      filter = {
        terms: {
          isFinal: true,
        },
      };
      break;
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

export const getAudit = (id: string): PrismaPromise<AuditFull> => {
  return prisma.audit.findUniqueOrThrow({
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

type CreateAuditI = {
  success: boolean;
  error?: string;
};

export const createAudit = (
  id: string,
  audit: FormData,
  auditors: UserProfile[],
): Promise<CreateAuditI> => {
  const data = Object.fromEntries(audit);
  const { title, description, price, duration } = data;
  const auditorsConnect = auditors.map((auditor) => {
    return { id: auditor.id };
  });
  // add zod validation.
  return prisma.audit
    .create({
      data: {
        title: title as string,
        auditeeId: id,
        description: description as string,
        auditors: {
          connect: auditorsConnect,
        },
        terms: {
          create: {
            price: Number(price) || 1_000,
            duration: Number(duration) || 3,
          },
        },
      },
    })
    .then(() => {
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
