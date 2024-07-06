import { AuditStateI, MarkdownAuditsI } from "@/utils/types";
import { auditFindingsSchema, auditFormSchema, handleValidationErrors } from "@/utils/validations";
import {
  Auditors,
  AuditorStatus,
  Audits,
  AuditStatus,
  HistoryAction,
  Prisma,
  Users,
  UserType,
} from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/db/prisma.server";
import { AuditDetailedI, AuditFindingsI, AuditI } from "@/utils/types/prisma";
import * as UserController from "../user";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import matter from "gray-matter";
import * as ContractService from "../contract/contract.service";
import { ValidationError } from "@/utils/error";

export const parseAuditForm = (formData: FormData): z.infer<typeof auditFormSchema> => {
  const form = Object.fromEntries(formData);
  const formParsed = auditFormSchema.safeParse(form);
  if (!formParsed.success) {
    const validationErrors = handleValidationErrors(formParsed.error);
    throw new ValidationError("validation schema", validationErrors);
  }
  return formParsed.data;
};

export const parseAuditFindings = (formData: FormData): z.infer<typeof auditFindingsSchema> => {
  const fileUpload = formData.get("findings");
  const formParsed = auditFindingsSchema.safeParse(fileUpload);
  if (!formParsed.success) {
    const validationErrors = handleValidationErrors(formParsed.error);
    throw new ValidationError("validation schema", validationErrors);
  }
  return formParsed.data;
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
      cliff: true,
      createdAt: true,
      status: true,
      details: true,
      token: true,
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

export const getAuditsDetailed = (status?: string): Promise<AuditDetailedI[]> => {
  const statusFilter: Record<string, AuditStatus> = {
    open: AuditStatus.DISCOVERY,
    locked: AuditStatus.ATTESTATION,
    ongoing: AuditStatus.AUDITING,
    challengeable: AuditStatus.CHALLENGEABLE,
    completed: AuditStatus.FINALIZED,
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
      token: true,
      cliff: true,
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

export const getAuditFindings = (id: string): Promise<AuditFindingsI | null> => {
  return prisma.audits.findUnique({
    where: {
      id,
    },
    select: {
      onchainAuditInfoId: true,
      duration: true,
      price: true,
      cliff: true,
      token: true,
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

export const getAuditState = (id: string, userId: string | undefined): Promise<AuditStateI> => {
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
        id,
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

export const createAudit = (
  id: string,
  audit: {
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
      ...audit,
      auditors: {
        create: auditorsCreate,
      },
    },
  });
};

export const updateAudit = async (
  id: string,
  audit: Prisma.AuditsUpdateInput,
  auditors: Users[],
): Promise<Audits> => {
  // would throw before this function is ever called. We can assure currentAudit exists.
  const currentAudit = await getAudit(id);
  const passedAuditorIds = auditors.map((auditor) => auditor.id);
  const currentAuditorIds = currentAudit!.auditors.map((auditor) => auditor.user.id);

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
      ...audit,
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

export const isAuditOwner = async (
  id: string,
): Promise<{
  audit: AuditI | null;
  isOwner: boolean;
}> => {
  const audit = await getAudit(id);
  const { user } = await UserController.currentUser();
  if (!audit) {
    return { audit, isOwner: false };
  }
  if (!user) {
    return { audit, isOwner: false };
  }
  if (user.id !== audit.auditee.id) {
    return { audit, isOwner: false };
  }
  return { audit, isOwner: true };
};

export const isAuditAuditor = async (
  id: string,
): Promise<{
  audit: AuditI | null;
  auditor: Users | null;
}> => {
  const auditor = null;
  const audit = await getAudit(id);
  const { user } = await UserController.currentUser();
  if (!audit) {
    return { audit, auditor };
  }
  if (!user) {
    return { audit, auditor };
  }
  const foundAuditor = audit.auditors.find((a) => a.user.id == user.id);

  if (!foundAuditor) {
    return { audit, auditor };
  }
  return { audit, auditor: foundAuditor.user };
};

export const canAttest = async (id: string): Promise<boolean> => {
  const { audit, auditor } = await isAuditAuditor(id);
  if (!audit) {
    return false;
  }
  if (!auditor) {
    return false;
  }
  if (audit.status != AuditStatus.ATTESTATION) {
    return false;
  }
  return true;
};

export const canEdit = async (id: string): Promise<boolean> => {
  const { audit, isOwner } = await isAuditOwner(id);
  if (!audit) {
    return false;
  }
  if (!isOwner) {
    return false;
  }
  if (audit.status != AuditStatus.DISCOVERY && audit.status != AuditStatus.ATTESTATION) {
    return false;
  }

  return true;
};

export const canLock = async (id: string): Promise<boolean> => {
  const { audit, isOwner } = await isAuditOwner(id);
  if (!audit) {
    return false;
  }
  if (!isOwner) {
    return false;
  }
  if (audit.status !== AuditStatus.DISCOVERY) {
    return false;
  }
  const verifiedAuditorExists = audit.auditors.find(
    (auditor) => auditor.status === AuditorStatus.VERIFIED,
  );
  if (!verifiedAuditorExists) {
    return false;
  }
  if (!audit.details) {
    return false;
  }
  return true;
};

export const canOpen = async (id: string): Promise<boolean> => {
  const { audit, isOwner } = await isAuditOwner(id);
  if (!audit) {
    return false;
  }
  if (!isOwner) {
    return false;
  }
  if (audit.status !== AuditStatus.ATTESTATION) {
    return false;
  }
  return true;
};

export const lockAudit = (id: string): Promise<Audits> => {
  return prisma.audits.update({
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
  });
};

export const openAudit = (id: string): Promise<Audits> => {
  return prisma.audits.update({
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
  });
};

export const updateRequestors = (
  id: string,
  auditors: string[],
  status: AuditorStatus,
): Promise<Prisma.BatchPayload> => {
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

export const addAuditInfo = (id: string, infoId: string): Promise<Audits> => {
  return prisma.audits.update({
    where: {
      id,
    },
    data: {
      onchainAuditInfoId: infoId,
      status: AuditStatus.AUDITING,
      history: {
        create: {
          userType: UserType.AUDITEE,
          action: HistoryAction.FINALIZED,
        },
      },
    },
  });
};

export const addNftInfo = (id: string, nftId: string): Promise<Audits> => {
  return prisma.audits.update({
    where: {
      id,
    },
    data: {
      onchainNftId: nftId,
      status: AuditStatus.CHALLENGEABLE,
      history: {
        create: {
          userType: UserType.AUDITEE,
          action: HistoryAction.MINTED,
        },
      },
    },
  });
};

export const attestToTerms = (
  id: string,
  userId: string,
  status: boolean,
  comment: string,
): Promise<Auditors> => {
  return prisma.auditors.update({
    where: {
      auditId_userId: {
        auditId: id,
        userId,
      },
    },
    data: {
      acceptedTerms: status,
      attestedTerms: true,
      history: {
        create: {
          userType: UserType.AUDITOR,
          action: status ? HistoryAction.APPROVED : HistoryAction.REJECTED,
          comment: comment.length > 0 ? comment : null,
          audit: {
            connect: {
              id,
            },
          },
        },
      },
    },
  });
};

export const leaveAudit = async (audit: AuditI, auditor: Users): Promise<Audits> => {
  let historyObj = {};
  if (audit!.status == AuditStatus.AUDITING) {
    historyObj = {
      history: {
        create: {
          userType: UserType.AUDITOR,
          action: HistoryAction.LEFT,
          auditor: {
            connect: {
              id: auditor.id,
            },
          },
        },
      },
    };
  }

  return prisma.audits.update({
    where: {
      id: audit.id,
    },
    data: {
      auditors: {
        delete: {
          auditId_userId: {
            auditId: audit.id,
            userId: auditor.id,
          },
        },
        updateMany: {
          where: {
            auditId: auditor.id,
          },
          data: {
            acceptedTerms: false,
            attestedTerms: false,
          },
        },
      },
      ...historyObj,
    },
  });
};

export const addFindings = (
  auditId: string,
  userId: string,
  findings: string,
): Promise<Auditors> => {
  return prisma.auditors.update({
    where: {
      auditId_userId: {
        auditId: auditId,
        userId: userId,
      },
    },
    data: {
      findings,
      history: {
        create: {
          userType: UserType.AUDITOR,
          action: HistoryAction.FINDINGS,
          audit: {
            connect: {
              id: auditId,
            },
          },
        },
      },
    },
  });
};

export const addRequest = (id: string, userId: string): Promise<Auditors> => {
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
};

export const deleteRequest = (id: string, userId: string): Promise<Auditors> => {
  return prisma.auditors.delete({
    where: {
      auditId_userId: {
        auditId: id,
        userId,
      },
    },
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

export const safeMarkdownDisplay = async (
  id: string,
  userId: string | undefined,
): Promise<MarkdownAuditsI> => {
  const markdownObject: MarkdownAuditsI = {
    details: "",
    globalReveal: false,
    pendingCliff: false,
    findings: [],
  };

  const state = await getAuditState(id, userId);

  const audit = await prisma.audits.findUnique({
    where: {
      id,
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

  // if details exist, get them.
  if (audit.details) {
    markdownObject.details = await parseMarkdown(audit.details);
  }

  // can early stop
  if (audit.status == AuditStatus.DISCOVERY || audit.status == AuditStatus.ATTESTATION) {
    return markdownObject;
  }

  // if finalized, we'll reveal to everyone.
  let globalReveal = audit.status == AuditStatus.FINALIZED;
  // auditor can always see their own findings.
  // Protocol owner can see once they put money in escrow.
  const auditeeReveal =
    audit.auditeeId == userId && (globalReveal || audit.status == AuditStatus.CHALLENGEABLE);

  const now = Math.round(new Date().getTime() / 1000);
  // fetch on-chain information to get audit start
  if (audit.onchainAuditInfoId && audit.status == AuditStatus.CHALLENGEABLE) {
    try {
      const onchainAudit = await ContractService.getAudit(BigInt(audit.onchainAuditInfoId));
      if (onchainAudit) {
        const start = Number(onchainAudit[5]);
        const cliff = Number(onchainAudit[4]);
        if (now < start + cliff) {
          markdownObject.pendingCliff = true;
        } else {
          // cliff period is over, visible to all parties.
          globalReveal = true;
        }
      }
    } catch (error) {
      console.log(error);
      globalReveal = false;
    }
  }

  markdownObject.globalReveal = globalReveal;

  for (const auditor of audit.auditors) {
    if (auditor.status === AuditorStatus.VERIFIED) {
      const user = auditor.user;
      const submitted = !!auditor.findings;
      const owner = auditor.userId === userId;
      const reveal = globalReveal || (state.userSubmitted && owner) || auditeeReveal;

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
