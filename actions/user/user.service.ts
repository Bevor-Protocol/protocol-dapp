import { prisma } from "@/db/prisma.server";
import { UserSearchI } from "@/utils/types";
import { AuditTruncatedI, UserWithCount } from "@/utils/types/prisma";
import { AuditorStatus, AuditStatus, Prisma, User } from "@prisma/client";
import AuthService from "../auth/auth.service";

class UserService {
  constructor(private readonly authService: typeof AuthService) {}

  async currentUser(): Promise<{ address: string; user: User | null }> {
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

  getProfile(address: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        address,
      },
    });
  }

  createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
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
    return prisma.user
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
    return prisma.audit.findMany({
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  searchUsers(filter: UserSearchI): Promise<User[]> {
    const search = filter.search
      ? {
          OR: [
            {
              address: {
                contains: filter.search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              name: {
                contains: filter.search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : {};

    const roleFilters = [];
    if (filter.isAuditor) {
      roleFilters.push({ auditorRole: true });
    }
    if (filter.isOwner) {
      roleFilters.push({ auditeeRole: true });
    }

    return prisma.user.findMany({
      where: {
        AND: [
          search,
          {
            AND: roleFilters,
          },
        ],
      },
    });
  }

  searchAuditors(query?: string): Promise<User[]> {
    return this.searchUsers({
      search: query ?? "",
      isAuditor: true,
      isOwner: false,
    });
  }
}

const userService = new UserService(AuthService);
export default userService;
