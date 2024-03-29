"use server";
import { prisma } from "@/lib/db/prisma.server";
import { Profile, Prisma } from "@prisma/client";

import type { UserProfile, UserWithCount, AuditFull } from "@/lib/types/actions";
import { revalidatePath } from "next/cache";

type UserStats = {
  moneyPaid: number;
  moneyEarned: number;
};

export const getLeaderboard = (key?: string, order?: string): Promise<UserWithCount[]> => {
  let orderClause = {};
  // Can't currently sort on aggregations or further filtered counts of relations...
  // Handle these more unique cases post-query.
  switch (key) {
    case "name":
      orderClause = {
        orderBy: [
          {
            profile: {
              [key ?? "name"]: order ?? "asc",
            },
          },
          {
            address: order ?? "asc",
          },
        ],
      };
      break;
    case "available":
      orderClause = {
        orderBy: {
          profile: {
            available: order ?? "asc",
          },
        },
      };
      break;
  }

  return prisma.user
    .findMany({
      ...orderClause,
      where: {
        auditorRole: true,
      },
      include: {
        profile: true,
        auditor: {
          include: {
            terms: true,
          },
        },
      },
    })
    .then((users) => {
      const toReturn = users.map((user) => {
        const { auditor, ...rest } = user;
        const totalValue = auditor.reduce((acc, audit) => {
          return acc + (audit.terms?.price || 0);
        }, 0);
        const totalActive = auditor.filter((audit) => !audit.terms?.isFinal).length;
        const totalComplete = auditor.filter((audit) => audit.terms?.isFinal).length;
        return {
          ...rest,
          totalValue,
          totalActive,
          totalComplete,
        };
      });
      if (key == "completed") {
        return toReturn.sort(
          (a, b) => (a.totalComplete - b.totalComplete) * (2 * Number(order == "asc") - 1),
        );
      }
      if (key == "money") {
        return toReturn.sort(
          (a, b) => (a.totalValue - b.totalValue) * (2 * Number(order == "asc") - 1),
        );
      }
      if (key == "active") {
        return toReturn.sort(
          (a, b) => (a.totalActive - b.totalActive) * (2 * Number(order == "asc") - 1),
        );
      }
      return toReturn;
    });
};

export const getUserProfile = (address: string): Promise<UserProfile | null> => {
  return prisma.user.findUnique({
    where: {
      address,
    },
    include: {
      profile: true,
    },
  });
};

export const getUserAuditsAuditee = (address: string): Promise<AuditFull[]> => {
  return prisma.audit.findMany({
    where: {
      auditee: {
        address,
      },
    },
    include: {
      auditee: {
        include: {
          profile: true,
        },
      },
      terms: true,
      auditors: {
        include: {
          profile: true,
        },
      },
    },
  });
};

export const getUserAuditsAuditor = (address: string): Promise<AuditFull[]> => {
  return prisma.audit.findMany({
    where: {
      auditors: {
        some: {
          address,
        },
      },
    },
    include: {
      auditee: {
        include: {
          profile: true,
        },
      },
      terms: true,
      auditors: {
        include: {
          profile: true,
        },
      },
    },
  });
};

const getUserMoneyPaid = (address: string): Promise<number> => {
  return prisma.audit
    .findMany({
      where: {
        auditee: {
          address,
        },
        terms: {
          price: {
            gt: 0,
          },
        },
      },
      select: {
        terms: {
          select: {
            price: true,
          },
        },
      },
    })
    .then((audits) => audits.reduce((a, audit) => audit.terms?.price ?? 0 + a, 0));
};

const getUserMoneyEarned = (address: string): Promise<number> => {
  return prisma.audit
    .findMany({
      where: {
        auditors: {
          some: {
            address,
          },
        },
        terms: {
          price: {
            gt: 0,
          },
        },
      },
      select: {
        terms: {
          select: {
            price: true,
          },
        },
      },
    })
    .then((audits) => audits.reduce((a, audit) => audit.terms?.price ?? 0 + a, 0));
};

export const getUserStats = async (address: string): Promise<UserStats> => {
  const moneyPaid = await getUserMoneyPaid(address);
  const moneyEarned = await getUserMoneyEarned(address);

  return {
    moneyPaid,
    moneyEarned,
  };
};

type CreateUserI = {
  success: boolean;
  error?: string;
};

export const createUser = (address: string, profileData: FormData): Promise<CreateUserI> => {
  const data = Object.fromEntries(profileData);
  const { auditor, auditee, ...profile } = data;

  if (auditor != "true" && auditee != "true") {
    return new Promise((resolve) =>
      resolve({
        success: false,
        error: "must claim an auditor or auditee role",
      }),
    );
  }

  return prisma.user
    .create({
      data: {
        address,
        auditorRole: auditor == "true", // add zod validation
        auditeeRole: auditee == "true", // add zod validation
        profile: {
          create: {
            ...profile,
            available: profile.available == "true", // add zod validation
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

export const updateProfile = async (id: string, profileData: FormData): Promise<Profile> => {
  const data = Object.fromEntries(profileData);
  const updated = await prisma.profile.update({
    where: {
      userId: id,
    },
    data: {
      ...data,
      available: data.available == "true", // add zod validation
    },
  });
  revalidatePath(`/user/${id}`);
  return updated;
};

export const searchAuditors = (query?: string): Promise<UserProfile[]> => {
  // I'll do filtering on frontend to exclude selected auditors from response.
  const search = query
    ? {
        OR: [
          {
            address: {
              contains: query,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            profile: {
              name: {
                contains: query,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        ],
      }
    : {};
  return prisma.user.findMany({
    where: {
      auditeeRole: true,
      ...search,
    },
    include: {
      profile: true,
    },
  });
};
