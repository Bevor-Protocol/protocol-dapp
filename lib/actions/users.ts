import { prisma } from "@/lib/db/prisma.server";
import { User, Profile, Audit, Terms } from "@prisma/client";

interface UserWithCount extends User {
  profile?: {
    name?: string | null;
    image?: string | null;
    available: boolean;
  } | null;
  totalValue: number;
  totalActive: number;
  totalComplete: number;
}

interface UserFull extends User {
  profile?: Profile | null;
  auditee?: (Audit & {
    auditee: User & {
      profile: Profile | null;
    };
    terms?: Terms | null;
    auditors?: (User & {
      profile: Profile | null;
    })[];
  })[];
  auditor?: (Audit & {
    auditee: User & {
      profile: Profile | null;
    };
    terms?: Terms | null;
    auditors?: (User & {
      profile: Profile | null;
    })[];
  })[];
}

type UserStats = {
  auditorCount: number;
  auditeeCount: number;
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
        profile: {
          select: {
            name: true,
            image: true,
            available: true,
          },
        },
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

export const getUserProfile = (address: string): Promise<UserFull | null> => {
  return prisma.user.findUnique({
    where: {
      address,
    },
    include: {
      profile: true,
      auditee: {
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
      },
      auditor: {
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
      },
    },
  });
};

const getUserAuditorCount = (address: string): Promise<number> => {
  return prisma.audit.count({
    where: {
      auditors: {
        some: {
          address,
        },
      },
    },
  });
};

const getUserAuditeeCount = (address: string): Promise<number> => {
  return prisma.audit.count({
    where: {
      auditee: {
        address,
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
  const auditorCount = await getUserAuditorCount(address);
  const auditeeCount = await getUserAuditeeCount(address);
  const moneyPaid = await getUserMoneyPaid(address);
  const moneyEarned = await getUserMoneyEarned(address);

  return {
    auditorCount,
    auditeeCount,
    moneyPaid,
    moneyEarned,
  };
};

export const updateProfile = (id: string, profileData: Profile): Promise<Profile> => {
  return prisma.profile.update({
    where: {
      userId: id,
    },
    data: {
      ...profileData,
    },
  });
};
