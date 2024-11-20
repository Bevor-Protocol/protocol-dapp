"use server";

import { ResponseI } from "@/utils/types";
import { UserNotificationI } from "@/utils/types/prisma";
import { NotificationInsert } from "@/utils/types/tables";
import notificationController from "./notification.controller";

const getUserNotifications = async (
  address: string,
): Promise<Record<string, { meta: string; notifications: UserNotificationI[] }>> => {
  return notificationController.getUserNotifications(address);
};

const getUserNotificationUnreadCount = async (userId: string): Promise<number> => {
  return notificationController.getUserNotificationUnreadCount(userId);
};

const getUserHistoryCountByAuditId = async (userId: string, auditId: string): Promise<number> => {
  return notificationController.getUserHistoryCountByAuditId(userId, auditId);
};

const updateUserNotificationByAuditId = async (
  auditId: string,
): Promise<ResponseI<NotificationInsert[]>> => {
  return notificationController.updateUserNotificationByAuditId(auditId);
};

export {
  getUserHistoryCountByAuditId,
  getUserNotifications,
  getUserNotificationUnreadCount,
  updateUserNotificationByAuditId,
};
