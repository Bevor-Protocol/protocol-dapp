import { prisma } from "@/lib/db/prisma.server";
import { Audit, User, Profile } from "@prisma/client";

interface AuditRelation extends Audit {
  auditee: User & {
    profile: Profile | null;
  };
  auditors: User[];
  terms: {
    price: number;
  } | null;
}

export const getAudits = (status?: string): Promise<AuditRelation[]> => {
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
      auditors: true,
      terms: {
        select: {
          price: true,
        },
      },
    },
  });
};
