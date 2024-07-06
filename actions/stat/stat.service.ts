import { prisma } from "@/db/prisma.server";
import { AuditorStatus } from "@prisma/client";

export const getUserMoneyPaid = (address: string): Promise<number> => {
  return prisma.audits
    .findMany({
      where: {
        auditee: {
          address,
        },
        // status: AuditStatus.FINAL,
        price: {
          gt: 0,
        },
      },
      select: {
        price: true,
      },
    })
    .then((audits) => audits.reduce((a, audit) => audit.price + a, 0));
};

export const getUserMoneyEarned = (address: string): Promise<number> => {
  return prisma.audits
    .findMany({
      where: {
        // status: AuditStatus.FINAL, might add this back.
        auditors: {
          some: {
            user: {
              address,
            },
          },
        },
        price: {
          gt: 0,
        },
      },
      select: {
        price: true,
      },
    })
    .then((audits) => audits.reduce((a, audit) => audit.price + a, 0));
};

export const getUserNumAuditsOwner = (address: string): Promise<number> => {
  return prisma.audits.count({
    where: {
      auditee: {
        address,
      },
    },
  });
};

export const getUserNumAuditsAuditor = (address: string): Promise<number> => {
  return prisma.auditors.count({
    where: {
      user: {
        address,
      },
      status: AuditorStatus.VERIFIED,
    },
  });
};

export const getUserNumWishlistReciever = (address: string): Promise<number> => {
  return prisma.wishlist.count({
    where: {
      receiver: {
        address,
      },
    },
  });
};

export const getProtocolNumAudits = (): Promise<number> => {
  return prisma.audits.count();
};

export const getProtocolDataFunds = (): Promise<number> => {
  return prisma.audits
    .aggregate({
      // where: {
      //   isFinal: true,
      // },
      _sum: {
        price: true,
      },
    })
    .then((result: { _sum: { price: number | null } }) => result._sum.price || 0);
};

export const getProtocolDataVulnerabilities = async (): Promise<number> => {
  // simulate a longer lasting request until we have data for this.
  return new Promise<number>((resolve) => resolve(10_000));
  // return new Promise((resolve) => resolve(10_000));
};

export const getProtocolDataAuditors = (): Promise<number> => {
  return prisma.users.count({
    where: {
      auditorRole: true,
    },
  });
};
