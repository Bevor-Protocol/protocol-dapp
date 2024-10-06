/* eslint-disable no-var */
import { PrismaClient } from "@prisma/client";

const omitConfig = {
  auditMembership: {
    findings: true,
  },
};

declare global {
  var prisma: PrismaClient<{ omit: typeof omitConfig }> | undefined;
}
let prisma: PrismaClient<{ omit: typeof omitConfig }>;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    omit: omitConfig,
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["info"],
      omit: omitConfig,
    });
  }

  prisma = global.prisma;
}

export { prisma };
