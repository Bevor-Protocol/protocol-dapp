"use server";
import { prisma } from "@/db/prisma.server";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import matter from "gray-matter";

import { AuditViewI, AuditViewDetailedI } from "@/lib/types";
import { AuditorStatus, AuditStatus } from "@prisma/client";

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

export const getMarkdown = (path: string): Promise<string> => {
  // I should move this to inside Audit Page, since we're already fetching the Audit, which is what
  // we'd do here.
  return fetch(path)
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
