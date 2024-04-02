import { Users, Prisma } from "@prisma/client";

export interface UserWithCount extends Users {
  totalValue: number;
  totalActive: number;
  totalComplete: number;
}

export type AuditViewI = Prisma.AuditsGetPayload<{
  include: {
    auditee: true;
    auditors: true;
  };
}>;

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
