import { boolean, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { baseFields } from "./shared.helpers";

export const user = pgTable(
  "user",
  {
    ...baseFields,
    address: text().notNull(),
    owner_role: boolean().default(false).notNull(),
    auditor_role: boolean().default(false).notNull(),
    name: text(),
    image: text(),
    available: boolean().default(false).notNull(),
  },
  (table) => [uniqueIndex("user_address_key").using("btree", table.address.asc().nullsLast())],
);
