import { Audit, User, Profile, Terms } from "@prisma/client";

export interface UserProfile extends User {
  profile: Profile | null;
}

export interface UserWithCount extends UserProfile {
  totalValue: number;
  totalActive: number;
  totalComplete: number;
}

export interface AuditBriefI extends Audit {
  terms?: Terms | null;
  auditors: UserProfile[];
  auditee: UserProfile;
}

export interface AuditViewI extends AuditBriefI {
  requests: UserProfile[];
}

export interface UserStats {
  moneyPaid: number;
  moneyEarned: number;
  numAuditsCreated: number;
  numAuditsAudited: number;
}

export interface GenericUpdateI {
  success: boolean;
  error?: string;
}
