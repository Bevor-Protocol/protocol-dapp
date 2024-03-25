"use server";

import { prisma } from "@/lib/db/prisma.server";

export const protocolDataAudits = (): Promise<number> => {
  return prisma.audit.count();
};

export const protocolDataFunds = (): Promise<number> => {
  return prisma.terms
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

export const protocolDataVulnerabilities = (): Promise<number> => {
  // simulate a longer lasting request until we have data for this.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(10_000);
    }, 5_000);
  });
  return new Promise((resolve) => resolve(10_000));
};

export const protocolDataAuditors = (): Promise<number> => {
  return prisma.user.count({
    where: {
      auditorRole: true,
    },
  });
};
