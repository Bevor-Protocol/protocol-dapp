import { prisma } from "@/lib/db/prisma.server";
import { Audit, User, Profile, Terms, PrismaPromise } from "@prisma/client";

interface AuditsRelation extends Audit {
  auditee: User & {
    profile: Profile | null;
  };
  auditors: (User & {
    profile: Profile | null;
  })[];
  terms: {
    price: number;
  } | null;
}

export const getAudits = (status?: string): Promise<AuditsRelation[]> => {
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
      terms: {
        select: {
          price: true,
        },
      },
    },
  });
};

interface AuditRelation extends Audit {
  auditors: (User & {
    profile: Profile | null;
  })[];
  auditee: User & {
    profile: Profile | null;
  };
  terms: Terms | null;
}

export const getAudit = (id: string): PrismaPromise<AuditRelation> => {
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
