import { prisma } from "@/db/prisma.server";
import { HistoryViewI } from "@/utils/types/prisma";
import { HistoryView, Prisma, PrismaPromise } from "@prisma/client";

class HistoryService {
  getUserHistory(
    address: string,
    filter: Prisma.HistoryViewWhereInput = {},
  ): Promise<HistoryViewI[]> {
    return prisma.historyView.findMany({
      where: {
        user: {
          address,
        },
        ...filter,
      },
      select: {
        history: {
          select: {
            id: true,
            audit: {
              select: {
                id: true,
                title: true,
              },
            },
            action: true,
            userType: true,
            comment: true,
            createdAt: true,
            user: true,
          },
        },
      },
      orderBy: {
        history: {
          createdAt: "desc",
        },
      },
    });
  }

  getUserHistoryUnreadCount(address: string): Promise<number> {
    return prisma.historyView.count({
      where: {
        user: {
          address,
        },
        hasViewed: false,
      },
    });
  }

  getUserHistoryPerAudit(address: string): Promise<Record<string, boolean>> {
    return prisma.audit
      .findMany({
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
          history: {
            select: {
              historyViews: {
                where: {
                  user: {
                    address,
                  },
                  hasViewed: false,
                },
              },
            },
          },
        },
      })
      .then((data) => {
        return data.reduce((prev: Record<string, boolean>, next) => {
          prev[next.id] = next.history.some((history) => history.historyViews.length > 0);
          return prev;
        }, {});
      });
  }

  getUserHistoryAuditUnreadCount(address: string, auditId: string): Promise<number> {
    return prisma.historyView.count({
      where: {
        hasViewed: false,
        user: {
          address,
        },
        history: {
          auditId,
        },
      },
    });
  }

  updateUserHistoryById(userId: string, historyId: string): Promise<HistoryView> {
    return prisma.historyView.update({
      where: {
        uniqueHistoryView: {
          userId,
          historyId,
        },
      },
      data: {
        hasViewed: true,
      },
    });
  }

  updateUserHistoryByAuditId(userId: string, auditId: string): PrismaPromise<Prisma.BatchPayload> {
    return prisma.historyView.updateMany({
      where: {
        userId,
        history: {
          auditId,
        },
      },
      data: {
        hasViewed: true,
      },
    });
  }
}

const historyService = new HistoryService();
export default historyService;
