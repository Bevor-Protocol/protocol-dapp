import { boolean, index, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { action } from "./action.sql";
import { baseFields } from "./shared.helpers";
import { user } from "./user.sql";

export const notification = pgTable(
  "notification",
  {
    ...baseFields,
    user_id: uuid()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    action_id: uuid()
      .references(() => action.id, { onDelete: "cascade" })
      .notNull(),
    has_viewed: boolean().default(false).notNull(),
  },
  (table) => [
    uniqueIndex("notification_user_id_action_id_key").using(
      "btree",
      table.user_id.asc().nullsLast(),
      table.action_id.asc().nullsLast(),
    ),
    index("notification_user_id_has_viewed_idx").using(
      "btree",
      table.user_id.asc().nullsLast(),
      table.has_viewed.asc().nullsLast(),
    ),
    index("notification_user_id_idx").using("btree", table.user_id.asc().nullsLast()),
  ],
);
