"use server";

import { prisma } from "@/lib/db/prisma.server";
import { list, head } from "@vercel/blob";

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
  const data = await list();
  const details = await head(
    "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md",
  );
  console.log(data);
  console.log(details);
  return new Promise<number>((resolve) => {
    setTimeout(() => {
      resolve(10_000);
    }, 3_000);
  });
  // return new Promise((resolve) => resolve(10_000));
};

export const protocolDataAuditors = (): Promise<number> => {
  return prisma.users.count({
    where: {
      auditorRole: true,
    },
  });
};
