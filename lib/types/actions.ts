import { Users, Prisma } from "@prisma/client";

export interface UserWithCount extends Users {
  stats: {
    valuePotential: number;
    valueComplete: number;
    numActive: number;
    numComplete: number;
  };
}

export type AuditViewDetailedI = Prisma.AuditsGetPayload<{
  include: {
    auditee: true;
    auditors: {
      include: {
        user: true;
      };
    };
  };
}>;

export type AuditViewI = Prisma.AuditsGetPayload<{
  include: {
    auditee: true;
    auditors: {
      select: {
        user: true;
      };
    };
  };
}>;

export type UserAuditsI = Prisma.UsersGetPayload<{
  select: {
    auditees: {
      select: {
        auditors: {
          include: {
            user: true;
          };
        };
      };
    };
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
