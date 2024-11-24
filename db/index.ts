import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import { action } from "./schema/action.sql";
import { auditMembership } from "./schema/audit-membership.sql";
import { audit } from "./schema/audit.sql";
import { actionType, auditStatusType, membershipStatusType, roleType } from "./schema/enums.sql";
import { notification } from "./schema/notification.sql";
import * as relations from "./schema/relations.helpers";
import { user } from "./schema/user.sql";
import { wishlist } from "./schema/wishlist.sql";

if (process.env.NODE_ENV !== "production") {
  neonConfig.webSocketConstructor = ws;
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

export const db = drizzle(pool, {
  schema: {
    user,
    action,
    audit,
    auditMembership,
    notification,
    wishlist,
    actionType,
    auditStatusType,
    membershipStatusType,
    roleType,
    ...relations,
  },
  casing: "snake_case",
});

// import { drizzle } from "drizzle-orm/neon-serverless";

// export const db = drizzle(process.env.DATABASE_URL_NEON!);
