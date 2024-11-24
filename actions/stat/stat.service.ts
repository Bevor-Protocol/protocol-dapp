import { db } from "@/db";
import { auditMembership } from "@/db/schema/audit-membership.sql";
import { audit } from "@/db/schema/audit.sql";
import { user } from "@/db/schema/user.sql";
import { wishlist } from "@/db/schema/wishlist.sql";
import { AuditStatusEnum, MembershipStatusEnum, RoleTypeEnum } from "@/utils/types/enum";
import { and, count, eq, inArray, sum } from "drizzle-orm";

class StatService {
  getUserMoneyPaid(address: string): Promise<number> {
    // doesn't take into account the asset.
    return db
      .select({
        summed: sum(audit.price),
      })
      .from(audit)
      .leftJoin(user, eq(audit.owner_id, user.id))
      .where(and(eq(audit.status, AuditStatusEnum.FINALIZED), eq(user.address, address)))
      .then((res) => (res[0].summed || 0) as number);
  }

  getUserMoneyEarned(address: string): Promise<number> {
    // doesn't take into account the asset.
    return db
      .select({
        summed: sum(audit.price),
      })
      .from(audit)
      .leftJoin(user, eq(audit.owner_id, user.id))
      .leftJoin(auditMembership, eq(auditMembership.audit_id, audit.id))
      .where(
        and(
          eq(audit.status, AuditStatusEnum.FINALIZED),
          eq(user.address, address),
          eq(auditMembership.role, RoleTypeEnum.AUDITOR),
          eq(auditMembership.status, MembershipStatusEnum.VERIFIED),
          eq(auditMembership.is_active, true),
        ),
      )
      .then((res) => (res[0].summed || 0) as number);
  }

  getUserNumAuditsOwner(address: string): Promise<number> {
    return db
      .select({
        num: count(),
      })
      .from(audit)
      .leftJoin(user, eq(audit.owner_id, user.id))
      .where(eq(user.address, address))
      .then((res) => (res[0].num || 0) as number);
  }

  getUserNumAuditsAuditor(address: string): Promise<number> {
    return db
      .select({
        num: count(),
      })
      .from(auditMembership)
      .leftJoin(user, eq(auditMembership.user_id, user.id))
      .where(
        and(
          eq(user.address, address),
          eq(auditMembership.role, RoleTypeEnum.AUDITOR),
          eq(auditMembership.status, MembershipStatusEnum.VERIFIED),
        ),
      )
      .then((res) => (res[0].num || 0) as number);
  }

  getUserNumWishlistReciever(address: string): Promise<number> {
    return db
      .select({
        num: count(),
      })
      .from(wishlist)
      .leftJoin(user, eq(wishlist.receiver_id, user.id))
      .where(eq(user.address, address))
      .then((res) => (res[0].num || 0) as number);
  }

  getProtocolNumAudits(): Promise<number> {
    return db.$count(audit);
  }

  getProtocolDataFunds(): Promise<number> {
    return db
      .select({
        summed: sum(audit.price),
      })
      .from(audit)
      .where(
        inArray(audit.status, [
          AuditStatusEnum.AUDITING,
          AuditStatusEnum.CHALLENGEABLE,
          AuditStatusEnum.FINALIZED,
        ]),
      )
      .then((res) => (res[0].summed || 0) as number);
  }

  async getProtocolDataVulnerabilities(): Promise<number> {
    // simulate a longer lasting request until we have data for this.
    return new Promise<number>((resolve) => resolve(10_000));
    // return new Promise((resolve) => resolve(10_000));
  }

  getProtocolDataAuditors(): Promise<number> {
    return db.$count(user, eq(user.auditor_role, true));
  }
}

const statService = new StatService();
export default statService;
