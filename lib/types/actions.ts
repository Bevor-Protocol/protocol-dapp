import { Audits, Users, Auditors } from "@prisma/client";

export interface UserWithCount extends Users {
  totalValue: number;
  totalActive: number;
  totalComplete: number;
}

export interface AuditViewI extends Audits {
  auditors: Auditors[];
  auditee: Users;
}

export interface UserStats {
  moneyPaid: number;
  moneyEarned: number;
  numAuditsCreated: number;
  numAuditsAudited: number;
}

export interface GenericUpdateI {
  success: boolean;
  error?: string;
}
