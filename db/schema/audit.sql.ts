import { AuditStatusEnum } from "@/utils/types/enum";
import { sql } from "drizzle-orm";
import { check, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { auditStatusType } from "./enums.sql";
import { baseFields } from "./shared.helpers";
import { user } from "./user.sql";

export const audit = pgTable(
  "audit",
  {
    ...baseFields,
    owner_id: uuid()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    title: text().notNull(),
    description: text().notNull(),
    details: text(),
    price: integer().default(0).notNull(),
    duration: integer().default(30).notNull(),
    cliff: integer().default(3).notNull(),
    token: text(),
    onchain_audit_info_id: text(),
    onchain_nft_id: text(),
    status: auditStatusType().default(AuditStatusEnum.DISCOVERY).notNull(),
  },
  (table) => [
    check("price_check", sql`${table.price} >= 0`),
    check("duration_check", sql`${table.duration} >= 0`),
    check("cliff_check", sql`${table.cliff} >= 0`),
  ],
);
