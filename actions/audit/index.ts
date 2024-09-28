"use server";

import { AuditStateI, MarkdownAuditsI, ValidationResponseI } from "@/utils/types";
import { AuditDetailedI, AuditFindingsI, AuditI } from "@/utils/types/prisma";

import auditController from "./audit.controller";
import { Audit } from "@prisma/client";

const getAudit = async (id: string): Promise<AuditI | null> => {
  return auditController.getAudit(id);
};

const getAuditsDetailed = async (status?: string): Promise<AuditDetailedI[]> => {
  return auditController.getAuditsDetailed(status);
};

const addAuditInfo = async (id: string, infoId: string): Promise<ValidationResponseI<Audit>> => {
  return auditController.addAuditInfo(id, infoId);
};

const addNftInfo = async (id: string, nftId: string): Promise<ValidationResponseI<Audit>> => {
  return auditController.addNftInfo(id, nftId);
};

const getState = async (id: string): Promise<AuditStateI> => {
  return auditController.getState(id);
};

const safeMarkdown = async (id: string): Promise<MarkdownAuditsI> => {
  return auditController.safeMarkdown(id);
};

const getAuditFindings = async (id: string): Promise<AuditFindingsI | null> => {
  return auditController.getAuditFindings(id);
};

export {
  addAuditInfo,
  addNftInfo,
  getAudit,
  getAuditFindings,
  getAuditsDetailed,
  getState,
  safeMarkdown,
};
