import { prisma } from "@/db/prisma.server";
import { UserNotificationI } from "@/utils/types/prisma";
import { Action, ActionType, AuditMembership, Prisma, PrismaPromise } from "@prisma/client";

class NotificationService {
  async createAndBroadcastAction(
    membership: AuditMembership,
    type: ActionType,
    comment?: string,
  ): Promise<Action> {
    const usersBroadcast = await prisma.auditMembership.findMany({
      where: {
        auditId: membership.auditId,
        isActive: true,
        NOT: {
          userId: membership.userId,
        },
      },
      select: {
        userId: true,
      },
    });

    const userIdsBroadcast = usersBroadcast.map((user) => {
      return {
        userId: user.userId,
      };
    });

    return prisma.action.create({
      data: {
        membershipId: membership.id,
        type,
        comment,
        notifications: {
          create: userIdsBroadcast,
        },
      },
    });
  }

  deleteUserAuditNotifications(
    userId: string,
    auditId: string,
  ): PrismaPromise<Prisma.BatchPayload> {
    return prisma.notification.deleteMany({
      where: {
        action: {
          membership: {
            userId,
            auditId,
          },
        },
      },
    });
  }

  getUserNotications(userId: string): PrismaPromise<UserNotificationI[]> {
    return prisma.notification.findMany({
      where: {
        userId,
        hasViewed: false,
      },
      include: {
        action: {
          include: {
            membership: {
              include: {
                audit: true,
                user: true,
              },
            },
          },
        },
      },
    });
  }

  getUserNotificationUnreadCount(userId: string): PrismaPromise<number> {
    return prisma.notification.count({
      where: {
        userId,
      },
    });
  }

  getUserNotificationsUnreadCountByAuditId(userId: string, auditId: string): PrismaPromise<number> {
    return prisma.notification.count({
      where: {
        userId,
        hasViewed: false,
        action: {
          membership: {
            auditId,
          },
        },
      },
    });
  }

  updateNotificationByAudit(userId: string, auditId: string): PrismaPromise<Prisma.BatchPayload> {
    return prisma.notification.updateMany({
      where: {
        userId,
        action: {
          membership: {
            auditId,
          },
        },
      },
      data: {
        hasViewed: true,
      },
    });
  }
}

const notificationService = new NotificationService();
export default notificationService;
