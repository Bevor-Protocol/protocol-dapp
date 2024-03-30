import { Audit, User, Profile, Terms } from "@prisma/client";

export interface UserProfile extends User {
  profile: Profile | null;
}

export interface UserWithCount extends UserProfile {
  totalValue: number;
  totalActive: number;
  totalComplete: number;
}

export interface AuditFull extends Audit {
  terms?: Terms | null;
  auditors: (User & {
    profile: Profile | null;
  })[];
  auditee: User & {
    profile: Profile | null;
  };
}

export interface UserStats {
  moneyPaid: number;
  moneyEarned: number;
  numAuditsCreated: number;
  numAuditsAudited: number;
}
