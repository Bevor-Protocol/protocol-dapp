import { AuditorStatus, AuditStatus, Prisma, Users } from "@prisma/client";
import { prisma } from "@/db/prisma.server";
import { AuditTruncatedI, UserWithCount } from "@/utils/types/prisma";
import AuthService from "../auth/auth.service";

class UserService {
  constructor(private readonly authService: typeof AuthService) {}

  async currentUser(): Promise<{ address: string; user: Users | null }> {
    const session = await this.authService.getSession();
    if (!session?.siwe) {
      return {
        address: "",
        user: null,
      };
    }
    const { address } = session.siwe;

    return this.getProfile(address)
      .then((user) => {
        return { address, user };
      })
      .catch(() => {
        return { address, user: null };
      });
  }

  getProfile(address: string): Promise<Users | null> {
    return prisma.users.findUnique({
      where: {
        address,
      },
    });
  }

  createUser(data: Prisma.UsersCreateInput): Promise<Users> {
    return prisma.users.create({
      data,
    });
  }

  updateUser(id: string, data: Prisma.UsersUpdateInput): Promise<Users> {
    return prisma.users.update({
      where: {
        id,
      },
      data,
    });
  }

  getLeaderboard(key?: string, order?: string): Promise<UserWithCount[]> {
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
          wishlistAsReceiver: true,
        },
        ...orderClause,
      })
      .then((users) => {
        const toReturn = users.map((user) => {
          const { auditors, wishlistAsReceiver, ...rest } = user;

          const valuePotential = auditors.reduce((acc, auditor) => {
            const include =
              auditor.audit.status == AuditStatus.AUDITING ||
              auditor.audit.status == AuditStatus.CHALLENGEABLE;
            return acc + Number(include) * auditor.audit.price;
          }, 0);

          const valueComplete = auditors.reduce((acc, auditor) => {
            return (
              acc + Number(auditor.audit.status == AuditStatus.FINALIZED) * auditor.audit.price
            );
          }, 0);

          const numActive = auditors.filter(
            (auditor) => auditor.audit.status !== AuditStatus.FINALIZED,
          ).length;

          const numComplete = auditors.filter(
            (auditor) => auditor.audit.status === AuditStatus.FINALIZED,
          ).length;

          const numWishlist = wishlistAsReceiver.length;

          return {
            ...rest,
            stats: {
              valuePotential,
              valueComplete,
              numActive,
              numComplete,
              numWishlist,
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
            (a, b) =>
              (a.stats.numComplete - b.stats.numComplete) * (2 * Number(order == "asc") - 1),
          );
        }
        if (key == "num_wishlist") {
          return toReturn.sort(
            (a, b) =>
              (a.stats.numWishlist - b.stats.numWishlist) * (2 * Number(order == "asc") - 1),
          );
        }
        return toReturn;
      });
  }

  userAudits(address: string): Promise<AuditTruncatedI[]> {
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
        token: true,
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
  }

  searchAuditors(query?: string): Promise<Users[]> {
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
  }
}

const userService = new UserService(AuthService);
export default userService;
