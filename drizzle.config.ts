// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./db/migrations",
  schema: "./db/schema/**sql.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  entities: {
    roles: {
      provider: "neon",
    },
  },
});
