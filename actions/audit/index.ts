"use server";

import { ResponseI } from "@/utils/types/api";

import { AuditState, MarkdownAudits } from "@/utils/types/custom";
import { AuditStatusEnum } from "@/utils/types/enum";
import {
  ActionWithMembership,
  AuditWithOwnerSecure,
  AuditWithUsersInsecure,
} from "@/utils/types/relations";
import { AuditInsert, User } from "@/utils/types/tables";
import auditController from "./audit.controller";

const getAudit = async (id: string): Promise<AuditWithOwnerSecure | undefined> => {
  return auditController.getAudit(id);
};

const getAuditActions = async (auditId: string): Promise<ActionWithMembership[]> => {
  return auditController.getAuditActions(auditId);
};

const getAuditsDetailed = async (status?: AuditStatusEnum): Promise<AuditWithOwnerSecure[]> => {
  return auditController.getAuditsDetailed(status);
};

const addAuditInfo = async (id: string, infoId: string): Promise<ResponseI<AuditInsert>> => {
  return auditController.addAuditInfo(id, infoId);
};

const addNftInfo = async (id: string, nftId: string): Promise<ResponseI<AuditInsert>> => {
  return auditController.addNftInfo(id, nftId);
};

const getState = async (auditId: string, user: User): Promise<AuditState> => {
  return auditController.getState(auditId, user);
};

const safeMarkdown = async (auditId: string): Promise<MarkdownAudits> => {
  return auditController.safeMarkdown(auditId);
};

const getAuditFindings = async (id: string): Promise<AuditWithUsersInsecure | undefined> => {
  return auditController.getAuditFindings(id);
};

export {
  addAuditInfo,
  addNftInfo,
  getAudit,
  getAuditActions,
  getAuditFindings,
  getAuditsDetailed,
  getState,
  safeMarkdown,
};
