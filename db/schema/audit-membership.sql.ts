import { boolean, index, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { audit } from "./audit.sql";
import { membershipStatusType, roleType } from "./enums.sql";
import { baseFields } from "./shared.helpers";
import { user } from "./user.sql";

export const auditMembership = pgTable(
  "audit_membership",
  {
    ...baseFields,
    user_id: uuid()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    audit_id: uuid()
      .references(() => audit.id, { onDelete: "cascade" })
      .notNull(),
    role: roleType().notNull(),
    status: membershipStatusType().notNull(),
    is_active: boolean().default(true).notNull(),
    attested_terms: boolean().default(false).notNull(),
    accepted_terms: boolean().default(false).notNull(),
    findings: text(),
  },
  (table) => [
    index("audit_membership_user_id_audit_id_is_active_idx").using(
      "btree",
      table.user_id.asc().nullsLast(),
      table.audit_id.asc().nullsLast(),
      table.is_active.asc().nullsLast(),
    ),
    index("audit_membership_user_id_audit_id_is_active_status_idx").using(
      "btree",
      table.user_id.asc().nullsLast(),
      table.audit_id.asc().nullsLast(),
      table.is_active.asc().nullsLast(),
      table.status.asc().nullsLast(),
    ),
    uniqueIndex("audit_membership_user_id_audit_id_key").using(
      "btree",
      table.user_id.asc().nullsLast(),
      table.audit_id.asc().nullsLast(),
    ),
  ],
);
