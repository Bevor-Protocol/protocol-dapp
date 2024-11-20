import { relations } from "drizzle-orm/relations";
import { action } from "./action.sql";
import { auditMembership } from "./audit-membership.sql";
import { audit } from "./audit.sql";
import { notification } from "./notification.sql";
import { user } from "./user.sql";
import { wishlist } from "./wishlist.sql";

export const auditRelations = relations(audit, ({ one, many }) => ({
  owner: one(user, {
    fields: [audit.owner_id],
    references: [user.id],
  }),
  auditMemberships: many(auditMembership),
}));

export const userRelations = relations(user, ({ many }) => ({
  audits: many(audit),
  auditMemberships: many(auditMembership),
  notifications: many(notification),
  wishlists_sender_id: many(wishlist, {
    relationName: "wishlist_sender_id_user_id",
  }),
  wishlists_receiver_id: many(wishlist, {
    relationName: "wishlist_receiver_id_user_id",
  }),
}));

export const auditMembershipRelations = relations(auditMembership, ({ one, many }) => ({
  user: one(user, {
    fields: [auditMembership.user_id],
    references: [user.id],
  }),
  audit: one(audit, {
    fields: [auditMembership.audit_id],
    references: [audit.id],
  }),
  actions: many(action),
}));

export const actionRelations = relations(action, ({ one, many }) => ({
  auditMembership: one(auditMembership, {
    fields: [action.membership_id],
    references: [auditMembership.id],
  }),
  notifications: many(notification),
}));

export const notificationRelations = relations(notification, ({ one }) => ({
  user: one(user, {
    fields: [notification.user_id],
    references: [user.id],
  }),
  action: one(action, {
    fields: [notification.action_id],
    references: [action.id],
  }),
}));

export const wishlistRelations = relations(wishlist, ({ one }) => ({
  sender: one(user, {
    fields: [wishlist.sender_id],
    references: [user.id],
    relationName: "wishlist_sender_id_user_id",
  }),
  receiver: one(user, {
    fields: [wishlist.receiver_id],
    references: [user.id],
    relationName: "wishlist_receiver_id_user_id",
  }),
}));
