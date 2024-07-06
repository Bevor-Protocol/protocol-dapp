import { Prisma, Users } from "@prisma/client";

export interface UserWithCount extends Users {
  stats: {
    valuePotential: number;
    valueComplete: number;
    numActive: number;
    numComplete: number;
    numWishlist: number;
  };
}

export type AuditFindingsI = Prisma.AuditsGetPayload<{
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

export type AuditTruncatedI = Prisma.AuditsGetPayload<{
  select: {
    id: true;
    title: true;
    description: true;
    token: true;
    status: true;
    auditee: true;
    history: {
      select: {
        id: true;
      };
    };
  };
}>;

export type AuditDetailedI = Prisma.AuditsGetPayload<{
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

export type AuditI = Prisma.AuditsGetPayload<{
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
        audit: {
          select: {
            auditee: true;
          };
        };
        auditor: {
          select: {
            user: true;
          };
        };
      };
    };
  };
}>;

export type WishlistI = Prisma.WishlistGetPayload<{
  select: {
    receiver: true;
  };
}>;
