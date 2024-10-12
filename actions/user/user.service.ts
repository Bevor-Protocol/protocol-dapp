import { prisma } from "@/db/prisma.server";
import { UserSearchI } from "@/utils/types";
import { AuditDetailedI, UserWithCount } from "@/utils/types/prisma";
import {
  AuditStatusType,
  MembershipStatusType,
  Prisma,
  PrismaPromise,
  RoleType,
  User,
} from "@prisma/client";

class UserService {
  getProfile(address: string): PrismaPromise<User | null> {
    return prisma.user.findUnique({
      where: {
        address,
      },
    });
  }

  createUser(data: Prisma.UserCreateInput): PrismaPromise<User> {
    return prisma.user.create({
      data,
    });
  }

  updateUser(id: string, data: Prisma.UserUpdateInput): PrismaPromise<User> {
    return prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  getLeaderboard(key?: string, order?: "asc" | "desc"): Promise<UserWithCount[]> {
    // Can't currently sort on aggregations or further filtered counts of relations...
    // Handle these more unique cases post-query.
    const orderClause: { orderBy: Prisma.UserOrderByWithRelationInput[] } = {
      orderBy: [],
    };
    if (key === "name") {
      orderClause.orderBy.push({
        name: order ?? "asc",
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
          memberships: {
            where: {
              status: MembershipStatusType.VERIFIED,
              role: RoleType.AUDITOR,
              isActive: true,
              audit: {
                status: {
                  not: AuditStatusType.DISCOVERY,
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
          const { memberships, wishlistAsReceiver, ...rest } = user;

          const numWishlist = wishlistAsReceiver.length;
          let valuePotential = 0;
          let valueComplete = 0;
          let numActive = 0;
          let numComplete = 0;

          memberships.forEach((member) => {
            const { status, price } = member.audit;
            if (status === AuditStatusType.AUDITING || status === AuditStatusType.CHALLENGEABLE) {
              valuePotential += price;
            }
            if (status === AuditStatusType.FINALIZED) {
              valueComplete += price;
              numComplete += 1;
            } else {
              numActive += 1;
            }
          });

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

  userAudits(address: string): PrismaPromise<AuditDetailedI[]> {
    return prisma.audit.findMany({
      where: {
        memberships: {
          some: {
            user: {
              address,
            },
            isActive: true,
          },
        },
      },
      include: {
        owner: true,
        memberships: {
          where: {
            isActive: true,
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
  }

  searchUsers(filter: UserSearchI): PrismaPromise<User[]> {
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
      roleFilters.push({ ownerRole: true });
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

  searchAuditors(query?: string): PrismaPromise<User[]> {
    return this.searchUsers({
      search: query ?? "",
      isAuditor: true,
      isOwner: false,
    });
  }
}

const userService = new UserService();
export default userService;
