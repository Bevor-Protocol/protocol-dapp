import { db } from "@/db";
import { auditMembership } from "@/db/schema/audit-membership.sql";
import { audit } from "@/db/schema/audit.sql";
import { user } from "@/db/schema/user.sql";
import { wishlist } from "@/db/schema/wishlist.sql";
import { UserSearchI } from "@/utils/types";
import { Leaderboard, UserAudit } from "@/utils/types/custom";
import { AuditStatusEnum, MembershipStatusEnum, RoleTypeEnum } from "@/utils/types/enum";
import { User, UserInsert } from "@/utils/types/tables";
import {
  aliasedTable,
  and,
  asc,
  countDistinct,
  desc,
  eq,
  getTableColumns,
  ilike,
  not,
  or,
  sql,
} from "drizzle-orm";

class UserService {
  getUserById(id: string): Promise<User | undefined> {
    return db.query.user.findFirst({
      where: eq(user.id, id),
    });
  }

  getProfile(address: string): Promise<User | undefined> {
    return db.query.user.findFirst({
      where: eq(user.address, address),
    });
  }

  createUser(data: UserInsert): Promise<User> {
    return db
      .insert(user)
      .values(data)
      .returning()
      .then((res) => res[0]);
  }

  updateUser(id: string, data: Partial<UserInsert>): Promise<User> {
    return db
      .update(user)
      .set(data)
      .where(eq(user.id, id))
      .returning()
      .then((res) => res[0]);
  }

  getLeaderboard(key: string = "name", order: "asc" | "desc" = "asc"): Promise<Leaderboard[]> {
    // Can't currently sort on aggregations or further filtered counts of relations...
    // Handle these more unique cases post-query.
    const orderFct = order == "desc" ? desc : asc;
    const audits = db
      .select()
      .from(audit)
      .where(not(eq(audit.status, AuditStatusEnum.DISCOVERY)))
      .as("audits_filtered");

    const memberships = db
      .select()
      .from(auditMembership)
      .where(
        and(
          eq(auditMembership.status, MembershipStatusEnum.VERIFIED),
          eq(auditMembership.role, RoleTypeEnum.AUDITOR),
          eq(auditMembership.is_active, true),
        ),
      )
      .as("memberships_filtered");

    return db
      .select({
        ...getTableColumns(user),
        value_potential: sql<number>`
          SUM(CASE 
            WHEN audits_filtered.status IN (${AuditStatusEnum.AUDITING}, ${AuditStatusEnum.CHALLENGEABLE}) 
            THEN audits_filtered.price 
            ELSE 0 
          END)
        `.as("value_potential"),
        value_complete: sql<number>`
          SUM(CASE 
              WHEN audits_filtered.status = ${AuditStatusEnum.FINALIZED} 
              THEN audits_filtered.price 
              ELSE 0 
            END)
          `.as("value_complete"),
        num_active: sql<number>`
          COUNT(CASE
            WHEN audits_filtered.status != ${AuditStatusEnum.FINALIZED}
            THEN 1
            ELSE NULL
          END)
        `.as("num_active"),
        num_complete: sql<number>`
          COUNT(CASE 
            WHEN audits_filtered.status = ${AuditStatusEnum.FINALIZED} 
            THEN 1 
            ELSE NULL 
          END)
        `.as("num_complete"),
        num_wishlist: countDistinct(wishlist.sender_id).as("num_wishlist"),
      })
      .from(user)
      .leftJoin(memberships, eq(memberships.user_id, user.id))
      .leftJoin(audits, eq(memberships.audit_id, audits.id))
      .leftJoin(wishlist, eq(user.id, wishlist.receiver_id))
      .where(and(eq(user.auditor_role, true)))
      .groupBy(({ id }) => id)
      .orderBy((row) => {
        switch (key) {
          case "date":
            return orderFct(row.created_at);
          case "value_potential":
            return orderFct(row.value_potential);
          case "value_completed":
            return orderFct(row.value_complete);
          case "num_active":
            return orderFct(row.num_active);
          case "num_complete":
            return orderFct(row.num_complete);
          case "num_wishlist":
            return orderFct(row.num_wishlist);
          default:
            return [orderFct(row.name), orderFct(row.address)];
        }
      });
  }

  userAudits(address: string): Promise<UserAudit[]> {
    const owner = aliasedTable(user, "owner");
    return db
      .select({
        ...getTableColumns(audit),
        auditMemberships: getTableColumns(auditMembership),
      })
      .from(auditMembership)
      .innerJoin(audit, eq(auditMembership.audit_id, audit.id))
      .innerJoin(user, eq(auditMembership.user_id, user.id))
      .innerJoin(owner, eq(audit.owner_id, owner.id))
      .where(and(eq(user.address, address), eq(auditMembership.is_active, true)))
      .orderBy(({ created_at }) => desc(created_at));
  }

  searchUsers(filter: UserSearchI): Promise<User[]> {
    const search = filter.search
      ? or(ilike(user.name, filter.search), ilike(user.address, filter.search))
      : or();

    const roleFilters = [];
    if (filter.isAuditor) {
      roleFilters.push(eq(user.auditor_role, true));
    }
    if (filter.isOwner) {
      roleFilters.push(eq(user.owner_role, true));
    }

    return db.query.user.findMany({
      where: and(search, and(...roleFilters)),
    });
  }

  searchAuditors(query?: string): Promise<User[]> {
    return this.searchUsers({
      search: query ?? "",
      isAuditor: true,
      isOwner: false,
    });
  }
}

const userService = new UserService();
export default userService;
