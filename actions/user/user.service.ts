import { db } from "@/db";
import { auditMembership } from "@/db/schema/audit-membership.sql";
import { audit } from "@/db/schema/audit.sql";
import { user } from "@/db/schema/user.sql";
import { wishlist } from "@/db/schema/wishlist.sql";
import { Leaderboard, UserSearch } from "@/utils/types/custom";
import { AuditStatusEnum, MembershipStatusEnum, RoleTypeEnum } from "@/utils/types/enum";
import { UserAudit } from "@/utils/types/relations";
import { User, UserInsert } from "@/utils/types/tables";
import { QueryResult } from "@neondatabase/serverless";
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
  SQL,
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

  updateUser(id: string, data: Partial<UserInsert>): Promise<QueryResult> {
    return db.update(user).set(data).where(eq(user.id, id));
  }

  getLeaderboard(key: string = "name", order: "asc" | "desc" = "desc"): Promise<Leaderboard[]> {
    // Can't currently sort on aggregations or further filtered counts of relations...
    // Handle these more unique cases post-query.
    const orderFct = order === "desc" ? desc : asc;
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

    const valuePotentialStatement = sql<number>`
    SUM(CASE 
      WHEN audits_filtered.status IN (${AuditStatusEnum.AUDITING}, ${AuditStatusEnum.CHALLENGEABLE}) 
      THEN audits_filtered.price 
      ELSE 0 
    END)
  `;
    const valueCompleteStatement: SQL<number> = sql<number>`
    SUM(CASE 
        WHEN audits_filtered.status = ${AuditStatusEnum.FINALIZED} 
        THEN audits_filtered.price 
        ELSE 0 
      END)
    `;
    const numActiveStatement = sql<number>`
    COUNT(CASE
      WHEN audits_filtered.status != ${AuditStatusEnum.FINALIZED}
      THEN 1
      ELSE NULL
    END)
  `;
    const numCompleteStatement = sql<number>`
    COUNT(CASE 
      WHEN audits_filtered.status = ${AuditStatusEnum.FINALIZED} 
      THEN 1 
      ELSE NULL 
    END)
  `;

    return db
      .select({
        ...getTableColumns(user),
        stats: {
          value_potential: valuePotentialStatement.as("value_potential"),
          value_complete: valueCompleteStatement.as("value_complete"),
          num_active: numActiveStatement.as("num_active"),
          num_complete: numCompleteStatement.as("num_complete"),
          num_wishlist: countDistinct(wishlist.sender_id).as("num_wishlist"),
        },
      })
      .from(user)
      .leftJoin(memberships, eq(memberships.user_id, user.id))
      .leftJoin(audits, eq(memberships.audit_id, audits.id))
      .leftJoin(wishlist, eq(user.id, wishlist.receiver_id))
      .where(eq(user.auditor_role, true))
      .groupBy(({ id }) => id)
      .orderBy((row) => {
        switch (key) {
          case "name":
            return [orderFct(row.name), orderFct(row.address)];
          case "value_potential":
            return orderFct(row.stats.value_potential);
          case "value_completed":
            return orderFct(row.stats.value_complete);
          case "num_active":
            return orderFct(row.stats.num_active);
          case "num_complete":
            return orderFct(row.stats.num_complete);
          case "num_wishlist":
            return orderFct(row.stats.num_wishlist);
          default:
            return orderFct(row.created_at);
        }
      });
  }

  userAudits(address: string): Promise<UserAudit[]> {
    const owner = aliasedTable(user, "owner");
    return db
      .select({
        ...getTableColumns(audit),
        role: auditMembership.role,
        owner: getTableColumns(owner),
      })
      .from(auditMembership)
      .innerJoin(audit, eq(auditMembership.audit_id, audit.id))
      .innerJoin(user, eq(auditMembership.user_id, user.id))
      .innerJoin(owner, eq(audit.owner_id, owner.id))
      .where(and(eq(user.address, address), eq(auditMembership.is_active, true)))
      .orderBy(({ created_at }) => desc(created_at));
  }

  searchUsers(filter: UserSearch): Promise<User[]> {
    const filters = [];
    if (filter.search) {
      filters.push(
        or(ilike(user.name, `%${filter.search}%`), ilike(user.address, `%${filter.search}%`)),
      );
    }
    if (filter.isAuditor) {
      filters.push(eq(user.auditor_role, true));
    }
    if (filter.isOwner) {
      filters.push(eq(user.owner_role, true));
    }

    return db.query.user.findMany({
      where: and(...filters),
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
