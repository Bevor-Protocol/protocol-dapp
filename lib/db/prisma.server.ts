import { PrismaClient } from "@prisma/client";
// import { Pool, neonConfig } from "@neondatabase/serverless";
// import { PrismaNeon } from "@prisma/adapter-neon";
// import ws from "ws";

declare global {
  let prisma: PrismaClient;
}

type GlobalThis = typeof globalThis & {
  prisma: PrismaClient;
};

if (!(global as GlobalThis).prisma) {
  // neonConfig.webSocketConstructor = ws;
  // const connectionString = process.env.DB_URL;
  // const connectionString = "postgres://petersimone@localhost:5432/bevor";
  // const pool = new Pool({ connectionString });
  // const adapter = new PrismaNeon(pool);
  // (global as GlobalThis).prisma = new PrismaClient({ adapter });
  (global as GlobalThis).prisma = new PrismaClient();
  // (global as GlobalThis).prisma.$use(async (params, next) => {

  // })
}

export const prisma = (global as GlobalThis).prisma;
