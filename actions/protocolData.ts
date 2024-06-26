"use server";

import { prisma } from "@/db/prisma.server";

export const protocolDataAudits = (): Promise<number> => {
  return prisma.audits.count();
};

export const protocolDataFunds = (): Promise<number> => {
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

export const protocolDataVulnerabilities = async (): Promise<number> => {
  // simulate a longer lasting request until we have data for this.
  return new Promise<number>((resolve) => resolve(10_000));
  // return new Promise((resolve) => resolve(10_000));
};

export const protocolDataAuditors = (): Promise<number> => {
  return prisma.users.count({
    where: {
      auditorRole: true,
    },
  });
};
