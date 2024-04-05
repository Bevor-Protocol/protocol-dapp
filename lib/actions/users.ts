"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma.server";
import { AuditorStatus, AuditStatus, Prisma, Users } from "@prisma/client";
import { put, type PutBlobResult } from "@vercel/blob";

import type { UserWithCount, UserStats, AuditViewI, GenericUpdateI } from "@/lib/types/actions";
import { userSchema } from "@/lib/validations";
import { z } from "zod";

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

export const createUser = (address: string, formData: FormData): Promise<GenericUpdateI<Users>> => {
  const form = Object.fromEntries(formData);
  const { auditor, auditee, ...profile } = form;

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

const updateProfileData = (id: string, profileData: Prisma.UsersUpdateInput): Promise<Users> => {
  return prisma.users.update({
    where: {
      id,
    },
    data: {
      ...profileData,
    },
  });
};

const putProfileBlob = (file: File | undefined): Promise<GenericUpdateI<PutBlobResult>> => {
  if (!file || file.size <= 0 || !file.name) {
    return Promise.resolve({
      success: false,
      error: "no file exists",
    });
  }
  return put(`profile-images/${file.name}`, file, { access: "public" })
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

export const updateUser = (
  id: string,
  formData: FormData,
  allowAuditeeUpdate: boolean,
  allowAuditorUpdate: boolean,
): Promise<GenericUpdateI<Users>> => {
  const form = Object.fromEntries(formData);
  // Disabled elements on forms don't appear in form data, explicitly handle these.
  const partials: Record<string, true> = {};
  if (!allowAuditeeUpdate) {
    partials.auditeeRole = true;
  }
  if (!allowAuditorUpdate) {
    partials.auditorRole = true;
  }
  const formParsed = userSchema.omit({ ...partials }).safeParse(form);
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
  return putProfileBlob(image)
    .then((result) => {
      const { data, success } = result;
      if (success && data) {
        return updateProfileData(id, {
          ...rest,
          image: result.data.url,
        });
      }
      return updateProfileData(id, { ...rest });
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
