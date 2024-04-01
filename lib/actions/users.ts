"use server";
import { prisma } from "@/lib/db/prisma.server";
import { AuditorStatus, Audits, AuditStatus, Prisma, Users } from "@prisma/client";

import type { UserWithCount, UserStats } from "@/lib/types/actions";
import { revalidatePath } from "next/cache";

export const getLeaderboard = (key?: string, order?: string): Promise<UserWithCount[]> => {
  let orderClause = {};
  // Can't currently sort on aggregations or further filtered counts of relations...
  // Handle these more unique cases post-query.
  switch (key) {
    case "name":
      orderClause = {
        orderBy: [
          {
            [key ?? "name"]: order ?? "asc",
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
          available: order ?? "asc",
        },
      };
      break;
  }
  // come back to this.
  return prisma.users
    .findMany({
      where: {
        auditorRole: true,
      },
      include: {
        auditors: {
          where: {
            status: AuditorStatus.VERIFIED,
            audit: {
              status: AuditStatus.ATTESTATION,
            },
          },
          include: {
            audit: true,
          },
        },
      },
      ...orderClause,
    })
    .then((users) => {
      const toReturn = users.map((user) => {
        const { auditors, ...rest } = user;

        const totalValue = auditors.reduce((acc, auditor) => acc + auditor.audit.price, 0);
        const totalActive = auditors.filter(
          (auditor) => auditor.audit.status !== AuditStatus.ATTESTATION,
        ).length;
        const totalComplete = auditors.filter(
          (auditor) => auditor.audit.status === AuditStatus.ATTESTATION,
        ).length;

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

export const getUserProfile = (address: string): Promise<Users | null> => {
  return prisma.users.findUnique({
    where: {
      address,
    },
  });
};

export const getUserAuditsAuditee = (address: string): Promise<Audits[]> => {
  return prisma.audits.findMany({
    where: {
      auditee: {
        address,
      },
    },
    include: {
      auditee: true,
      auditors: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getUserAuditsAuditor = (address: string): Promise<Audits[]> => {
  return prisma.audits.findMany({
    where: {
      auditors: {
        some: {
          user: {
            address,
          },
        },
      },
    },
    include: {
      auditee: true,
      auditors: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getUserMoneyPaid = (address: string): Promise<number> => {
  return prisma.audits
    .findMany({
      where: {
        auditee: {
          address,
        },
        price: {
          gt: 0,
        },
      },
      select: {
        price: true,
      },
    })
    .then((audits) => audits.reduce((a, audit) => audit.price + a, 0));
};

const getUserMoneyEarned = (address: string): Promise<number> => {
  return prisma.audits
    .findMany({
      where: {
        auditors: {
          some: {
            user: {
              address,
            },
          },
        },
        price: {
          gt: 0,
        },
      },
      select: {
        price: true,
      },
    })
    .then((audits) => audits.reduce((a, audit) => audit.price + a, 0));
};

export const getUserStats = async (address: string): Promise<UserStats> => {
  const moneyPaid = await getUserMoneyPaid(address);
  const moneyEarned = await getUserMoneyEarned(address);

  const numAuditsCreated = await prisma.audits.count({
    where: {
      auditee: {
        address,
      },
    },
  });

  const numAuditsAudited = await prisma.auditors.count({
    where: {
      user: {
        address,
      },
      status: AuditorStatus.VERIFIED,
    },
  });

  return {
    moneyPaid,
    moneyEarned,
    numAuditsCreated,
    numAuditsAudited,
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

  return prisma.users
    .create({
      data: {
        address,
        auditorRole: auditor == "true", // add zod validation
        auditeeRole: auditee == "true", // add zod validation
        available: profile.available == "true", // add zod validation
        ...profile,
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

export const updateUser = async (id: string, form: FormData): Promise<CreateUserI> => {
  const data = Object.fromEntries(form);
  const userData: Record<string, boolean> = {};
  const profileData: Record<string, boolean | string> = {};
  // add zod validation
  if (data.auditeeRole) {
    userData.auditeeRole = data.auditeeRole == "true";
  }
  if (data.auditorRole) {
    userData.auditorRole = data.auditorRole == "true";
  }
  if (data.available) {
    profileData.available = data.available == "true";
  }
  if (data.name) {
    profileData.name = data.name as string;
  }
  return prisma.users
    .update({
      where: {
        id,
      },
      data: {
        ...userData,
        ...profileData,
      },
    })
    .then(() => {
      // currently revalidates entire path, which contains several server functions
      // revalidateTag exists, but using server actions you can't directly tag calls.
      revalidatePath("/user/[slug]");
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

export const searchAuditors = (query?: string): Promise<Users[]> => {
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
            name: {
              contains: query,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }
    : {};
  return prisma.users.findMany({
    where: {
      auditeeRole: true,
      ...search,
    },
  });
};
