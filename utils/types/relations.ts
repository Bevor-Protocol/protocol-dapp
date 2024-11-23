import { Action, Audit, AuditMembership, Notification, User, Wishlist } from "@/utils/types/tables";
import { RoleTypeEnum } from "./enum";

export type AuditMembershipsInsecure = AuditMembership & { user: User };
export type AuditMembershipSecure = Omit<AuditMembershipsInsecure, "findings">;

export type AuditWithUsersSecure = Audit & {
  owner: User;
  auditMemberships: AuditMembershipSecure[];
};

export type AuditWithUsersInsecure = Audit & {
  auditMemberships: AuditMembershipsInsecure[];
};

export type UserAudit = Audit & {
  role: RoleTypeEnum;
  owner: User;
};

export type ActionWithMembership = Action & {
  auditMembership: AuditMembershipSecure;
};

export type AuditWithOwnerSecure = AuditWithUsersSecure & { owner: User };

export type AuditWithOwnerInsecure = AuditWithUsersInsecure & { owner: User };

export type UserNotificationsDetails = Notification & {
  action: Action & {
    auditMembership: AuditMembership & {
      user: User;
      audit: Audit;
    };
  };
};

export type MembershipWithAudit = Omit<AuditMembership, "findings"> & {
  audit: Audit;
};

export type WishlistWithReceiver = Wishlist & {
  receiver: User;
};
