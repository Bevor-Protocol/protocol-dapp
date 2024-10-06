"use server";

import { AuditStateI, MarkdownAuditsI, ResponseI } from "@/utils/types";
import { ActionI, AuditDetailedI, AuditFindingsI, AuditI } from "@/utils/types/prisma";

import { Audit, AuditStatusType, User } from "@prisma/client";
import auditController from "./audit.controller";

const getAudit = async (id: string): Promise<AuditI | null> => {
  return auditController.getAudit(id);
};

const getAuditActions = async (auditId: string): Promise<ActionI[]> => {
  return auditController.getAuditActions(auditId);
};

const getAuditsDetailed = async (status?: AuditStatusType): Promise<AuditDetailedI[]> => {
  return auditController.getAuditsDetailed(status);
};

const addAuditInfo = async (id: string, infoId: string): Promise<ResponseI<Audit>> => {
  return auditController.addAuditInfo(id, infoId);
};

const addNftInfo = async (id: string, nftId: string): Promise<ResponseI<Audit>> => {
  return auditController.addNftInfo(id, nftId);
};

const getState = async (audit: AuditI, user: User): Promise<AuditStateI> => {
  return auditController.getState(audit, user);
};

const safeMarkdown = async (audit: AuditI): Promise<MarkdownAuditsI> => {
  return auditController.safeMarkdown(audit);
};

const getAuditFindings = async (id: string): Promise<AuditFindingsI | null> => {
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
