import { db } from "@/db";
import { action } from "@/db/schema/action.sql";
import { auditMembership } from "@/db/schema/audit-membership.sql";
import { notification } from "@/db/schema/notification.sql";
import { ActionEnum } from "@/utils/types/enum";
import { MembershipWithAudit, UserNotificationsDetails } from "@/utils/types/relations";
import { ActionInsert, Notification } from "@/utils/types/tables";
import { QueryResult } from "@neondatabase/serverless";
import { and, eq, inArray, not } from "drizzle-orm";

class NotificationService {
  async createAndBroadcastAction(
    membership: MembershipWithAudit,
    type: ActionEnum,
    comment?: string,
  ): Promise<ActionInsert> {
    const usersToBroadcast = await db.query.auditMembership.findMany({
      where: and(
        eq(auditMembership.audit_id, membership.audit_id),
        eq(auditMembership.is_active, true),
        not(eq(auditMembership.user_id, membership.user_id)),
      ),
      columns: {
        user_id: true,
      },
    });

    return db.transaction(async (tx) => {
      const actionCreated = await tx
        .insert(action)
        .values({
          membership_id: membership.id,
          comment,
          type,
        })
        .returning()
        .then((res) => res[0]);

      const notificationsCreate = usersToBroadcast.map((u) => ({
        user_id: u.user_id,
        action_id: actionCreated.id,
      }));

      await tx.insert(notification).values(notificationsCreate);

      return actionCreated;
    });
  }

  deleteUserAuditNotifications(userId: string, auditId: string): Promise<Notification[]> {
    const relevantActions = db
      .select({ id: action.id })
      .from(action)
      .leftJoin(auditMembership, eq(action.membership_id, auditMembership.id))
      .where(eq(auditMembership.audit_id, auditId));

    return db
      .delete(notification)
      .where(
        and(eq(notification.user_id, userId), inArray(notification.action_id, relevantActions)),
      )
      .returning();
  }

  getUserNotications(userId: string): Promise<UserNotificationsDetails[]> {
    return db.query.notification.findMany({
      where: and(eq(notification.user_id, userId), eq(notification.has_viewed, false)),
      with: {
        action: {
          with: {
            auditMembership: {
              with: {
                user: true,
                audit: true,
              },
            },
          },
        },
      },
    });
  }

  getUserNotificationUnreadCount(userId: string): Promise<number> {
    return db.$count(notification, eq(notification.user_id, userId));
  }

  getUserNotificationsUnreadCountByAuditId(userId: string, auditId: string): Promise<number> {
    const relevantActions = db
      .select({ id: action.id })
      .from(action)
      .leftJoin(auditMembership, eq(action.membership_id, auditMembership.id))
      .where(eq(auditMembership.audit_id, auditId));

    return db.$count(
      notification,
      and(
        eq(notification.user_id, userId),
        eq(notification.has_viewed, false),
        inArray(notification.action_id, relevantActions),
      ),
    );
  }

  updateNotificationByAudit(userId: string, auditId: string): Promise<QueryResult> {
    const relevantActions = db
      .select({ id: action.id })
      .from(action)
      .innerJoin(auditMembership, eq(action.membership_id, auditMembership.id))
      .where(eq(auditMembership.audit_id, auditId));

    return db
      .update(notification)
      .set({
        has_viewed: not(notification.has_viewed),
      })
      .where(
        and(eq(notification.user_id, userId), inArray(notification.action_id, relevantActions)),
      );
  }
}

const notificationService = new NotificationService();
export default notificationService;
