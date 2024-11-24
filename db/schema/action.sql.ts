import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { auditMembership } from "./audit-membership.sql";
import { actionType } from "./enums.sql";
import { baseFields } from "./shared.helpers";

export const action = pgTable("action", {
  ...baseFields,
  membership_id: uuid()
    .references(() => auditMembership.id, { onDelete: "cascade" })
    .notNull(),
  comment: text(),
  type: actionType().notNull(),
});
