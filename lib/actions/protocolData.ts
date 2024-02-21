"use server";

import { prisma } from "@/lib/db/prisma.server";

export const protocolDataAudits = async (): Promise<number> => {
  return prisma.audit.count();
};

export const protocolDataFunds = async (): Promise<number> => {
  return prisma.terms
    .aggregate({
      // where: {
      //   isFinal: true,
      // },
      _sum: {
        price: true,
      },
    })
    .then((result) => result._sum.price || 0);
};

export const protocolDataVulnerabilities = async (): Promise<number> => {
  // simulate a longer lasting request until we have data for this.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(10_000);
    }, 2_000);
  });
};

export const protocolDataAuditors = async (): Promise<number> => {
  return prisma.user.count({
    where: {
      auditorRole: true,
    },
  });
};
