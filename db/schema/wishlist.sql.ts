import { pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { baseFields } from "./shared.helpers";
import { user } from "./user.sql";

export const wishlist = pgTable(
  "wishlist",
  {
    ...baseFields,
    sender_id: uuid()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    receiver_id: uuid()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    uniqueIndex("wishlist_sender_id_receiver_id_key").using(
      "btree",
      table.sender_id.asc().nullsLast(),
      table.receiver_id.asc().nullsLast(),
    ),
  ],
);
