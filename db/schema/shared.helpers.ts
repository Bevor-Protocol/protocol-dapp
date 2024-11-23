import { sql } from "drizzle-orm";
import { timestamp, uuid } from "drizzle-orm/pg-core";

export const baseFields = {
  id: uuid().primaryKey().defaultRandom(),
  created_at: timestamp({
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull(),
  updated_at: timestamp({
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`),
};
