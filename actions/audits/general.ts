"use server";

import { AuditorStatus, AuditStatus } from "@prisma/client";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import matter from "gray-matter";
import { prisma } from "@/db/prisma.server";

import { AuditListDetailedI, AuditListTruncatedI, AuditViewI } from "@/lib/types";

export const getAuditsDetailed = (status?: string): Promise<AuditListDetailedI[]> => {
  const statusFilter: Record<string, AuditStatus> = {
    locked: AuditStatus.ATTESTATION,
    ongoing: AuditStatus.ONGOING,
    completed: AuditStatus.FINAL,
    open: AuditStatus.OPEN,
  };

  return prisma.audits.findMany({
    where: {
      status: statusFilter[status ?? "open"],
    },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      duration: true,
      createdAt: true,
      auditee: {
        select: {
          address: true,
          image: true,
        },
      },
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

export const getAuditsTruncated = (status?: string): Promise<AuditListTruncatedI[]> => {
  const statusFilter: Record<string, AuditStatus> = {
    locked: AuditStatus.ATTESTATION,
    ongoing: AuditStatus.ONGOING,
    completed: AuditStatus.FINAL,
    open: AuditStatus.OPEN,
  };

  return prisma.audits.findMany({
    where: {
      status: statusFilter[status ?? "open"],
    },
    select: {
      id: true,
      title: true,
      description: true,
      auditee: {
        select: {
          address: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAudit = (id: string): Promise<AuditViewI | null> => {
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
