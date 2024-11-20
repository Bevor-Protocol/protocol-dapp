import { handleErrors } from "@/utils/decorators";
import { ResponseI } from "@/utils/types";
import { UserNotificationsDetails } from "@/utils/types/relations";
import { NotificationInsert } from "@/utils/types/tables";
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
  ): Promise<Record<string, { meta: string; notifications: UserNotificationsDetails[] }>> {
    const notifications = await this.notificationService.getUserNotications(userId);

    const data = notifications.reduce(
      (prev: Record<string, { meta: string; notifications: UserNotificationsDetails[] }>, next) => {
        const { id, title } = next.action.auditMembership.audit;
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
  async updateUserNotificationByAuditId(auditId: string): Promise<ResponseI<NotificationInsert[]>> {
    const { id } = await this.roleService.requireAccount();
    const data = await this.notificationService.updateNotificationByAudit(id, auditId);

    revalidateTag(`HISTORY ${id}`);
    revalidateTag(`HISTORY ${id} ${auditId}`);
    return { success: true, data };
  }
}

const historyController = new NotificationController(NotificationService, RoleService);
export default historyController;
