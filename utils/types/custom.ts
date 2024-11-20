import { Audit, AuditMembership, User } from "./tables";

export type Leaderboard = User & {
  value_potential: number;
  value_complete: number;
  num_complete: number;
  num_active: number;
  num_wishlist: number;
};

export type UserAudit = Audit & {
  auditMemberships: AuditMembership;
};
