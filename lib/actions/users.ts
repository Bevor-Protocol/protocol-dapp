"use server";
import { prisma } from "@/lib/db/prisma.server";
import { AuditorStatus, AuditStatus, Prisma, Users } from "@prisma/client";

import type { UserWithCount, UserStats, AuditViewI, GenericUpdateI } from "@/lib/types/actions";
import { revalidatePath } from "next/cache";

export const getLeaderboard = (key?: string, order?: string): Promise<UserWithCount[]> => {
  // Can't currently sort on aggregations or further filtered counts of relations...
  // Handle these more unique cases post-query.
  const orderClause: { orderBy: { [key: string]: string }[] } = {
    orderBy: [],
  };
  if (key === "name") {
    orderClause.orderBy.push({
      [key ?? "name"]: order ?? "asc",
    });
    orderClause.orderBy.push({
      address: order ?? "asc",
    });
  }
  if (key == "date") {
    orderClause.orderBy.push({
      createdAt: order ?? "asc",
    });
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
              status: {
                not: AuditStatus.OPEN,
              },
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

        const valuePotential = auditors.reduce((acc, auditor) => {
          return acc + Number(auditor.audit.status != AuditStatus.FINAL) * auditor.audit.price;
        }, 0);

        const valueComplete = auditors.reduce((acc, auditor) => {
          return acc + Number(auditor.audit.status == AuditStatus.FINAL) * auditor.audit.price;
        }, 0);

        const numActive = auditors.filter(
          (auditor) => auditor.audit.status !== AuditStatus.FINAL,
        ).length;

        const numComplete = auditors.filter(
          (auditor) => auditor.audit.status === AuditStatus.FINAL,
        ).length;

        return {
          ...rest,
          stats: {
            valuePotential,
            valueComplete,
            numActive,
            numComplete,
          },
        };
      });
      if (key == "value_potential") {
        return toReturn.sort(
          (a, b) =>
            (a.stats.valuePotential - b.stats.valuePotential) * (2 * Number(order == "asc") - 1),
        );
      }
      if (key == "value_complete") {
        return toReturn.sort(
          (a, b) =>
            (a.stats.valueComplete - b.stats.valueComplete) * (2 * Number(order == "asc") - 1),
        );
      }
      if (key == "num_active") {
        return toReturn.sort(
          (a, b) => (a.stats.numActive - b.stats.numActive) * (2 * Number(order == "asc") - 1),
        );
      }
      if (key == "num_complete") {
        return toReturn.sort(
          (a, b) => (a.stats.numComplete - b.stats.numComplete) * (2 * Number(order == "asc") - 1),
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

export const getUserAuditsAuditee = (address: string): Promise<AuditViewI[]> => {
  return prisma.audits.findMany({
    where: {
      auditee: {
        address,
      },
    },
    include: {
      auditee: true,
      auditors: {
        where: {
          status: AuditorStatus.VERIFIED,
        },
        include: {
          user: true,
        },
      },
    },
  });
};

export const getUserAuditsVerifiedAuditor = (address: string): Promise<AuditViewI[]> => {
  return prisma.audits.findMany({
    where: {
      auditors: {
        some: {
          user: {
            address,
          },
          status: AuditorStatus.VERIFIED,
        },
      },
    },
    include: {
      auditee: true,
      auditors: {
        where: {
          status: AuditorStatus.VERIFIED,
        },
        include: {
          user: true,
        },
      },
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
        status: AuditStatus.FINAL,
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
        status: AuditStatus.FINAL,
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

export const createUser = (address: string, profileData: FormData): Promise<GenericUpdateI> => {
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

export const updateUser = async (id: string, form: FormData): Promise<GenericUpdateI> => {
  const data = Object.fromEntries(form);
  const profileData: Record<string, boolean | string> = {};
  // add zod validation
  if (data.auditeeRole) {
    profileData.auditeeRole = data.auditeeRole == "true";
  }
  if (data.auditorRole) {
    profileData.auditorRole = data.auditorRole == "true";
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
