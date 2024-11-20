import { sql } from "drizzle-orm";
import { timestamp, uuid } from "drizzle-orm/pg-core";

export const baseFields = {
  id: uuid().primaryKey().defaultRandom(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
};
