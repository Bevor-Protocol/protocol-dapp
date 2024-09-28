import { prisma } from "@/db/prisma.server";
import { AuditorStatus } from "@prisma/client";

class StatService {
  getUserMoneyPaid(address: string): Promise<number> {
    return prisma.audit
      .findMany({
        where: {
          auditee: {
            address,
          },
          // status: AuditStatus.FINAL,
          price: {
            gt: 0,
          },
        },
        select: {
          price: true,
        },
      })
      .then((audits) => audits.reduce((a, audit) => audit.price + a, 0));
  }

  getUserMoneyEarned(address: string): Promise<number> {
    return prisma.audit
      .findMany({
        where: {
          // status: AuditStatus.FINAL, might add this back.
          auditors: {
            some: {
              user: {
                address,
              },
            },
          },
          price: {
            gt: 0,
          },
        },
        select: {
          price: true,
        },
      })
      .then((audits) => audits.reduce((a, audit) => audit.price + a, 0));
  }

  getUserNumAuditsOwner(address: string): Promise<number> {
    return prisma.audit.count({
      where: {
        auditee: {
          address,
        },
      },
    });
  }

  getUserNumAuditsAuditor(address: string): Promise<number> {
    return prisma.auditor.count({
      where: {
        user: {
          address,
        },
        status: AuditorStatus.VERIFIED,
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
        // where: {
        //   isFinal: true,
        // },
        _sum: {
          price: true,
        },
      })
      .then((result: { _sum: { price: number | null } }) => result._sum.price || 0);
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
