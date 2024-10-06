import { Prisma, User } from "@prisma/client";

export interface UserWithCount extends User {
  stats: {
    valuePotential: number;
    valueComplete: number;
    numActive: number;
    numComplete: number;
    numWishlist: number;
  };
}

export type MembershipAuditI = Prisma.AuditMembershipGetPayload<{
  include: {
    audit: true;
  };
}>;

export type MembershipUserI = Prisma.AuditMembershipGetPayload<{
  include: {
    user: true;
  };
}>;

export type AuditDetailedI = Prisma.AuditGetPayload<{
  include: {
    owner: true;
    memberships: {
      include: {
        user: true;
      };
    };
  };
}>;

export type AuditFindingsI = Prisma.AuditGetPayload<{
  include: {
    memberships: {
      omit: {
        findings: false;
      };
      include: {
        user: true;
      };
    };
  };
}>;

export type AuditI = Prisma.AuditGetPayload<{
  include: {
    owner: true;
    memberships: {
      include: {
        user: true;
      };
    };
  };
}>;

export type ActionI = Prisma.ActionGetPayload<{
  include: {
    membership: {
      include: {
        user: true;
      };
    };
  };
}>;

export type UserNotificationI = Prisma.NotificationGetPayload<{
  include: {
    action: {
      include: {
        membership: {
          include: {
            audit: true;
            user: true;
          };
        };
      };
    };
  };
}>;

export type WishlistI = Prisma.WishlistGetPayload<{
  include: {
    receiver: true;
  };
}>;
