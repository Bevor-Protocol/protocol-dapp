import { prisma } from "@/db/prisma.server";
import { AuditStatusType, MembershipStatusType, RoleType } from "@prisma/client";

class StatService {
  getUserMoneyPaid(address: string): Promise<number> {
    // doesn't take into account the asset.
    return prisma.audit
      .aggregate({
        where: {
          status: AuditStatusType.FINALIZED,
          owner: {
            address,
          },
        },
        _sum: {
          price: true,
        },
      })
      .then((result) => result._sum.price || 0);
  }

  getUserMoneyEarned(address: string): Promise<number> {
    // doesn't take into account the asset.
    return prisma.audit
      .aggregate({
        where: {
          status: AuditStatusType.FINALIZED,
          memberships: {
            some: {
              user: {
                address,
              },
              role: RoleType.AUDITOR,
              status: MembershipStatusType.VERIFIED,
              isActive: true,
            },
          },
        },
        _sum: {
          price: true,
        },
      })
      .then((result) => result._sum.price || 0);
  }

  getUserNumAuditsOwner(address: string): Promise<number> {
    return prisma.auditMembership.count({
      where: {
        user: {
          address,
        },
        role: RoleType.OWNER,
        status: MembershipStatusType.VERIFIED,
      },
    });
  }

  getUserNumAuditsAuditor(address: string): Promise<number> {
    return prisma.audit.count({
      where: {
        owner: {
          address,
        },
      },
    });
  }

  getUserNumWishlistReciever(address: string): Promise<number> {
    return prisma.wishlist.count({
      where: {
        receiver: {
          address,
        },
      },
    });
  }

  getProtocolNumAudits(): Promise<number> {
    return prisma.audit.count();
  }

  getProtocolDataFunds(): Promise<number> {
    return prisma.audit
      .aggregate({
        where: {
          status: {
            in: [
              AuditStatusType.AUDITING,
              AuditStatusType.CHALLENGEABLE,
              AuditStatusType.FINALIZED,
            ],
          },
        },
        _sum: {
          price: true,
        },
      })
      .then((result) => result._sum.price || 0);
  }

  async getProtocolDataVulnerabilities(): Promise<number> {
    // simulate a longer lasting request until we have data for this.
    return new Promise<number>((resolve) => resolve(10_000));
    // return new Promise((resolve) => resolve(10_000));
  }

  getProtocolDataAuditors(): Promise<number> {
    return prisma.user.count({
      where: {
        auditorRole: true,
      },
    });
  }
}

const statService = new StatService();
export default statService;
