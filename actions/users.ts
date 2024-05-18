"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/db/prisma.server";
import { AuditorStatus, AuditStatus, Prisma, Users } from "@prisma/client";
import { z } from "zod";

import type { UserWithCount, UserStats, AuditTruncatedI, GenericUpdateI } from "@/lib/types";
import { userSchema, userSchemaCreate } from "@/lib/validations";
import { putBlob } from "./blobs";
import { getUser } from "./siwe";

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
                not: AuditStatus.DISCOVERY,
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
          const include =
            auditor.audit.status == AuditStatus.AUDITING ||
            auditor.audit.status == AuditStatus.CHALLENGEABLE;
          return acc + Number(include) * auditor.audit.price;
        }, 0);

        const valueComplete = auditors.reduce((acc, auditor) => {
          return acc + Number(auditor.audit.status == AuditStatus.FINALIZED) * auditor.audit.price;
        }, 0);

        const numActive = auditors.filter(
          (auditor) => auditor.audit.status !== AuditStatus.FINALIZED,
        ).length;

        const numComplete = auditors.filter(
          (auditor) => auditor.audit.status === AuditStatus.FINALIZED,
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

export const getCurrentUser = (): Promise<{ address: string; user: Users | null }> => {
  let curAddress = "";
  return getUser()
    .then(({ address, success }) => {
      if (!success) {
        throw new Error("not authenticated");
      }
      curAddress = address!;
      return getUserProfile(curAddress);
    })
    .then((user) => {
      return { address: curAddress, user };
    })
    .catch(() => {
      return { address: "", user: null };
    });
};

export const getUserAudits = (address: string): Promise<AuditTruncatedI[]> => {
  return prisma.audits.findMany({
    where: {
      OR: [
        {
          auditee: {
            address,
          },
        },
        {
          auditors: {
            some: {
              user: {
                address,
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      auditee: true,
      history: {
        select: {
          id: true,
        },
        take: 1,
        orderBy: {
          createdAt: "desc",
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
        // status: AuditStatus.FINAL,
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
        // status: AuditStatus.FINAL,
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
  const [moneyPaid, moneyEarned, numAuditsCreated, numAuditsAudited] = await Promise.all([
    getUserMoneyPaid(address),
    getUserMoneyEarned(address),
    prisma.audits.count({
      where: {
        auditee: {
          address,
        },
      },
    }),
    prisma.auditors.count({
      where: {
        user: {
          address,
        },
        status: AuditorStatus.VERIFIED,
      },
    }),
  ]);

  return {
    moneyPaid,
    moneyEarned,
    numAuditsCreated,
    numAuditsAudited,
  };
};

export const createUser = (address: string, formData: FormData): Promise<GenericUpdateI<Users>> => {
  const form = Object.fromEntries(formData);
  const formParsed = userSchemaCreate.safeParse(form);
  if (!formParsed.success) {
    const formattedErrors: Record<string, string> = {};
    formParsed.error.errors.forEach((error) => {
      formattedErrors[error.path[0]] = error.message;
    });
    return Promise.resolve({
      success: false,
      error: "zod",
      validationErrors: formattedErrors,
    });
  }

  const { image, ...rest } = formParsed.data as z.infer<typeof userSchemaCreate>;
  const dataPass: Prisma.UsersCreateInput = {
    address,
    ...rest,
  };

  return putBlob("profile-images", image)
    .then((result) => {
      const { data, success } = result;
      if (success && data) {
        dataPass.image = result.data.url;
      }
      return prisma.users.create({
        data: {
          ...dataPass,
        },
      });
    })
    .then((data) => {
      return {
        success: true,
        data,
      };
    })
    .catch((error) => {
      return {
        success: false,
        error: error.name,
      };
    });
};

export const updateUser = (id: string, formData: FormData): Promise<GenericUpdateI<Users>> => {
  // Might need more Server Side validation to ensure that someone doesn't disable
  // the form on the frontend and allow for updating certain fields that shouldn't be
  // updated.
  const form = Object.fromEntries(formData);
  const formParsed = userSchema.safeParse(form);
  if (!formParsed.success) {
    const formattedErrors: Record<string, string> = {};
    formParsed.error.errors.forEach((error) => {
      formattedErrors[error.path[0]] = error.message;
    });
    return Promise.resolve({
      success: false,
      error: "zod",
      validationErrors: formattedErrors,
    });
  }
  const { image, ...rest } = formParsed.data as z.infer<typeof userSchema>;
  const dataPass: Prisma.UsersUpdateInput = {
    ...rest,
  };

  return putBlob("profile-images", image)
    .then((result) => {
      const { data, success } = result;
      if (success && data) {
        dataPass.image = result.data.url;
      }
      return prisma.users.update({
        where: {
          id,
        },
        data: {
          ...dataPass,
        },
      });
    })
    .then((data) => {
      revalidatePath(`/user/${id}`);
      return {
        success: true,
        data,
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
      auditorRole: true,
      ...search,
    },
  });
};
