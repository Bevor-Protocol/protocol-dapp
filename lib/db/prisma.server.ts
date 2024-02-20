import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ log: ["query", "info"] });

// We handle this as a global variable so we can cache the prisma instance
// and prevent multiple unwanted connections during local development.
// This prevents hot reloading from creating new unwanted PrismaClient in dev env.

// Could update this for Neon's serverless driver.
if (process.env.NODE_ENV !== "development") {
  globalForPrisma.prisma = prisma;
}

