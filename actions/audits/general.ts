"use server";

import { Auditors, AuditorStatus, AuditStatus } from "@prisma/client";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import matter from "gray-matter";
import { prisma } from "@/db/prisma.server";

import { AuditDetailedI, AuditStateI, AuditI, MarkdownAuditsI, AuditFindingsI } from "@/lib/types";

const statusFilter: Record<string, AuditStatus> = {
  open: AuditStatus.DISCOVERY,
  locked: AuditStatus.ATTESTATION,
  ongoing: AuditStatus.AUDITING,
  challengeable: AuditStatus.CHALLENGEABLE,
  completed: AuditStatus.FINALIZED,
};

export const getAuditsDetailed = (status?: string): Promise<AuditDetailedI[]> => {
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

export const getAudit = (id: string): Promise<AuditI | null> => {
  return prisma.audits.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      duration: true,
      createdAt: true,
      status: true,
      details: true,
      auditee: true,
      onchainAuditInfoId: true,
      onchainNftId: true,
      auditors: {
        select: {
          user: true,
          status: true,
          attestedTerms: true,
          acceptedTerms: true,
        },
      },
      history: {
        select: {
          id: true,
          action: true,
          userType: true,
          comment: true,
          createdAt: true,
          audit: {
            select: {
              auditee: true,
            },
          },
          auditor: {
            select: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
};

export const getAuditFindings = (id: string): Promise<AuditFindingsI | null> => {
  return prisma.audits.findUnique({
    where: {
      id,
    },
    select: {
      onchainAuditInfoId: true,
      duration: true,
      price: true,
      auditors: {
        where: {
          acceptedTerms: true,
          findings: {
            not: null,
          },
        },
        select: {
          findings: true,
          user: {
            select: {
              address: true,
            },
          },
        },
      },
    },
  });
};

export const getAuditState = (
  auditId: string,
  userId: string | undefined,
): Promise<AuditStateI> => {
  // Pushed the conditional logic for button actions to server-side
  const objOut = {
    isTheAuditee: false,
    isAnAuditor: false,
    userIsVerified: false,
    userIsRequested: false,
    userIsRejected: false,
    auditeeCanManageAuditors: false,
    auditeeCanLock: false,
    userAttested: false,
    userAccepted: false,
    userSubmitted: false,
    allAttested: false,
    allSubmitted: false,
  };
  return prisma.audits
    .findUnique({
      where: {
        id: auditId,
      },
      include: {
        auditors: {
          include: {
            user: true,
          },
        },
        auditee: true,
      },
    })
    .then((result) => {
      if (!result) return objOut;

      const verifiedAuditors = result.auditors.filter(
        (auditor) => auditor.status == AuditorStatus.VERIFIED,
      );
      const requestedAuditors = result.auditors.filter(
        (auditor) => auditor.status == AuditorStatus.REQUESTED,
      );
      const rejectedAuditors = result.auditors.filter(
        (auditor) => auditor.status == AuditorStatus.REJECTED,
      );

      const userAuditor: Auditors | undefined = result.auditors.find(
        (auditor) => auditor.userId == userId,
      );

      objOut.isTheAuditee = result.auditeeId == userId;

      if (userAuditor) {
        objOut.isAnAuditor = true;
        objOut.userIsVerified = userAuditor.status == AuditorStatus.VERIFIED;
        objOut.userIsRequested = userAuditor.status == AuditorStatus.REQUESTED;
        objOut.userIsRejected = userAuditor.status == AuditorStatus.REJECTED;

        objOut.userAttested = userAuditor.attestedTerms;
        objOut.userAccepted = userAuditor.acceptedTerms;
        objOut.userSubmitted = !!userAuditor.findings;
      }

      objOut.auditeeCanManageAuditors = requestedAuditors.length > 0 || rejectedAuditors.length > 0;
      objOut.auditeeCanLock = verifiedAuditors.length > 0 && !!result.details;

      objOut.allAttested =
        verifiedAuditors.filter((auditor) => auditor.acceptedTerms).length ==
        verifiedAuditors.length;

      objOut.allSubmitted =
        verifiedAuditors.filter((auditor) => !!auditor.findings).length == verifiedAuditors.length;

      return objOut;
    });
};

export const parseMarkdown = (path: string): Promise<string> => {
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

export const safeGetMarkdown = async (
  auditId: string,
  userId: string | undefined,
): Promise<MarkdownAuditsI> => {
  const markdownObject: MarkdownAuditsI = {
    details: "",
    globalReveal: false,
    findings: [],
  };

  const state = await getAuditState(auditId, userId);

  const audit = await prisma.audits.findUnique({
    where: {
      id: auditId,
    },
    include: {
      auditors: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!audit) return markdownObject;

  if (audit.details) {
    markdownObject.details = await parseMarkdown(audit.details);
  }

  if (audit.status == AuditStatus.DISCOVERY || audit.status == AuditStatus.ATTESTATION) {
    return markdownObject;
  }

  const globalReveal =
    audit.status == AuditStatus.CHALLENGEABLE || audit.status == AuditStatus.FINALIZED;
  markdownObject.globalReveal = globalReveal;

  for (const auditor of audit.auditors) {
    if (auditor.status === AuditorStatus.VERIFIED) {
      const user = auditor.user;
      const submitted = !!auditor.findings;
      const owner = auditor.userId === userId;
      const reveal = globalReveal || (state.userSubmitted && owner);

      let markdown = "";
      if (submitted && reveal) {
        markdown = await parseMarkdown(auditor.findings as string);
      }

      markdownObject.findings.push({
        user,
        owner,
        reveal,
        submitted,
        markdown,
      });
    }
  }

  return markdownObject;
};
