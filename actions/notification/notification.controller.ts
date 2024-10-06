import { handleErrors } from "@/utils/decorators";
import { ResponseI } from "@/utils/types";
import { UserNotificationI } from "@/utils/types/prisma";
import { Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";
import RoleService from "../roles/roles.service";
import NotificationService from "./notification.service";

class NotificationController {
  constructor(
    private readonly notificationService: typeof NotificationService,
    private readonly roleService: typeof RoleService,
  ) {}

  async getUserNotifications(
    userId: string,
  ): Promise<Record<string, { meta: string; notifications: UserNotificationI[] }>> {
    const notifications = await this.notificationService.getUserNotications(userId);

    const data = notifications.reduce(
      (prev: Record<string, { meta: string; notifications: UserNotificationI[] }>, next) => {
        const { id, title } = next.action.membership.audit;
        if (!(id in prev)) {
          prev[id] = {
            meta: title,
            notifications: [],
          };
        }

        prev[id].notifications.push(next);
        return prev;
      },
      {},
    );

    revalidateTag(`NOTIFICATION ${userId}`);

    return data;
  }

  async getUserNotificationUnreadCount(userId: string): Promise<number> {
    return this.notificationService.getUserNotificationUnreadCount(userId);
  }

  async getUserHistoryCountByAuditId(userId: string, auditId: string): Promise<number> {
    const data = await this.notificationService.getUserNotificationsUnreadCountByAuditId(
      userId,
      auditId,
    );

    revalidateTag(`NOTIFICATION ${userId} ${auditId}`);
    return data;
  }

  @handleErrors
  async updateUserNotificationByAuditId(auditId: string): Promise<ResponseI<Prisma.BatchPayload>> {
    const user = await this.roleService.requireAuth();
    const data = await this.notificationService.updateNotificationByAudit(user.id, auditId);

    revalidateTag(`HISTORY ${user.address}`);
    revalidateTag(`HISTORY ${user.address} ${auditId}`);
    return { success: true, data };
  }
}

const historyController = new NotificationController(NotificationService, RoleService);
export default historyController;
