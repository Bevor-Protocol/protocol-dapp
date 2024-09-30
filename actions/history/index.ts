"use server";

import { HistoryI, ResponseI } from "@/utils/types";
import { HistoryView, Prisma } from "@prisma/client";
import historyController from "./history.controller";

const getUserHistory = async (
  address: string,
  filter: Prisma.HistoryViewWhereInput = {},
): Promise<Record<string, { meta: string; history: HistoryI[] }>> => {
  return historyController.getUserHistory(address, filter);
};

const getUserHistoryAuditUnreadCount = async (
  address: string,
  auditId: string,
): Promise<number> => {
  return historyController.getUserHistoryAuditUnreadCount(address, auditId);
};

const updateUserHistoryById = async (historyId: string): Promise<ResponseI<HistoryView>> => {
  return historyController.updateUserHistoryById(historyId);
};

const getUserHistoryPerAudit = async (address: string): Promise<Record<string, boolean>> => {
  return historyController.getUserHistoryPerAudit(address);
};

const updateUserHistoryByAuditId = async (
  auditId: string,
): Promise<ResponseI<Prisma.BatchPayload>> => {
  return historyController.updateUserHistoryByAuditId(auditId);
};

export {
  getUserHistory,
  getUserHistoryAuditUnreadCount,
  getUserHistoryPerAudit,
  updateUserHistoryByAuditId,
  updateUserHistoryById,
};
