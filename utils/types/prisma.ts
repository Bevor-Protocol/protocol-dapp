import { Prisma, User } from "@prisma/client";

export interface UserWithCount extends User {
  stats: {
    valuePotential: number;
    valueComplete: number;
    numActive: number;
    numComplete: number;
    numWishlist: number;
  };
}

export type AuditFindingsI = Prisma.AuditGetPayload<{
  select: {
    onchainAuditInfoId: true;
    duration: true;
    price: true;
    cliff: true;
    token: true;
    auditors: {
      select: {
        findings: true;
        user: {
          select: {
            address: true;
          };
        };
      };
    };
  };
}>;

export type AuditTruncatedI = Prisma.AuditGetPayload<{
  select: {
    id: true;
    title: true;
    description: true;
    token: true;
    status: true;
    auditee: true;
  };
}>;

export type AuditDetailedI = Prisma.AuditGetPayload<{
  select: {
    id: true;
    title: true;
    description: true;
    price: true;
    duration: true;
    cliff: true;
    token: true;
    createdAt: true;
    auditee: true;
    auditors: {
      select: {
        user: true;
      };
    };
  };
}>;

export type AuditI = Prisma.AuditGetPayload<{
  select: {
    id: true;
    title: true;
    description: true;
    price: true;
    duration: true;
    cliff: true;
    token: true;
    createdAt: true;
    status: true;
    auditee: true;
    details: true;
    onchainAuditInfoId: true;
    onchainNftId: true;
    auditors: {
      select: {
        user: true;
        status: true;
        attestedTerms: true;
        acceptedTerms: true;
      };
    };
    history: {
      select: {
        id: true;
        action: true;
        userType: true;
        comment: true;
        createdAt: true;
        user: true;
      };
    };
  };
}>;

export type WishlistI = Prisma.WishlistGetPayload<{
  select: {
    receiver: true;
  };
}>;

export type HistoryViewI = Prisma.HistoryViewGetPayload<{
  select: {
    history: {
      select: {
        id: true;
        auditId: true;
        action: true;
        userType: true;
        comment: true;
        createdAt: true;
        user: true;
      };
    };
  };
}>;
