import { action } from "@/db/schema/action.sql";
import { auditMembership } from "@/db/schema/audit-membership.sql";
import { audit } from "@/db/schema/audit.sql";
import { notification } from "@/db/schema/notification.sql";
import { user } from "@/db/schema/user.sql";
import { wishlist } from "@/db/schema/wishlist.sql";

export type AuditMembershipInsert = typeof auditMembership.$inferInsert;
export type AuditInsert = typeof audit.$inferInsert;
export type UserInsert = typeof user.$inferInsert;
export type NotificationInsert = typeof notification.$inferInsert;
export type WishlistInsert = typeof wishlist.$inferInsert;
export type ActionInsert = typeof action.$inferInsert;

export type AuditMembership = typeof auditMembership.$inferSelect;
export type Audit = typeof audit.$inferSelect;
export type User = typeof user.$inferSelect;
export type Notification = typeof notification.$inferSelect;
export type Wishlist = typeof wishlist.$inferSelect;
export type Action = typeof action.$inferSelect;
