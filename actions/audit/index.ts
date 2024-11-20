"use server";

import { AuditStateI, MarkdownAuditsI, ResponseI } from "@/utils/types";

import { AuditStatusEnum } from "@/utils/types/enum";
import {
  AuditWithOwnerInsecure,
  AuditWithOwnerSecure,
  AuditWithUsersInsecure,
  AuditWithUsersSecure,
} from "@/utils/types/relations";
import { AuditInsert, User } from "@/utils/types/tables";
import auditController from "./audit.controller";

const getAudit = async (id: string): Promise<AuditWithUsersSecure | undefined> => {
  return auditController.getAudit(id);
};

const getAuditActions = async (auditId: string): Promise<AuditWithUsersSecure[]> => {
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

const getState = async (audit: AuditWithOwnerInsecure, user: User): Promise<AuditStateI> => {
  return auditController.getState(audit, user);
};

const safeMarkdown = async (audit: AuditWithOwnerInsecure): Promise<MarkdownAuditsI> => {
  return auditController.safeMarkdown(audit);
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
