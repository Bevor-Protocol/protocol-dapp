import { db } from "@/db";
import { user } from "@/db/schema/user.sql";
import { ethers } from "ethers";
import { audit } from "../schema/audit.sql";

import ERC20ABI from "@/contracts/abis/ERC20Token";
import {
  ActionEnum,
  AuditStatusEnum,
  MembershipStatusEnum,
  RoleTypeEnum,
} from "@/utils/types/enum";
import { desc, inArray } from "drizzle-orm";
import { action } from "../schema/action.sql";
import { auditMembership } from "../schema/audit-membership.sql";
import { notification } from "../schema/notification.sql";
import { wishlist } from "../schema/wishlist.sql";

const seed = async (): Promise<void> => {
  const provider = new ethers.JsonRpcProvider();

  if (!provider) {
    throw new Error("make sure the local blockchain is running");
  }
  const tokenContract = new ethers.Contract(ERC20ABI.address, ERC20ABI.abi);
  const tokenAddress = await tokenContract.getAddress();

  // skip the signer for seeding, as the nonce is wrong due to deployer script.
  const [, ...accounts] = await provider.listAccounts();

  if (!process.env.BLOB_URL) {
    throw new Error("must set the BLOB_URL (vercel blob url prefix)");
  }

  // Wallets used align with the hardhat dev config, which are consistent given the mnemonic in the config.
  // Check bevor-v1 repo. We'll use the first 10 returned addresses.

  const WALLETS = accounts.slice(0, 10).map((acct) => acct.address);

  const userData = [
    {
      address: WALLETS[0],
      owner_role: true,
      name: "My main auditee wallet",
    },
    {
      address: WALLETS[1],
      auditor_role: true,
      name: "My main auditor wallet",
    },
    {
      address: WALLETS[2],
      owner_role: true,
      auditor_role: true,
      name: "I have both roles",
    },
    {
      address: WALLETS[3],
      owner_role: true,
      name: "Test User 1",
      available: true,
    },
    {
      address: WALLETS[4],
      auditor_role: true,
      name: "I am certique",
      image: "https://cdn-images-1.medium.com/max/1200/1*Ty6tR7qRtx6yo3dM_drJBg.png",
    },
    {
      address: WALLETS[5],
      auditor_role: true,
      available: true,
    },
  ];

  Array.from({ length: 4 }).forEach((_, ind) => {
    userData.push({
      address: WALLETS[ind + 6],
      auditor_role: true,
      available: true,
    });
  });

  let users = await db.insert(user).values(userData).onConflictDoNothing().returning();

  if (users.length != userData.length) {
    const usersAddedAddresses = users.map((u) => u.address);
    const addressesRemaining = userData
      .filter((u) => !usersAddedAddresses.includes(u.address))
      .map((u) => u.address);
    const usersExisted = await db.query.user.findMany({
      where: inArray(user.address, addressesRemaining),
    });
    users = [...users, ...usersExisted];
  }

  users.sort((a, b) => {
    const aIndex = userData.findIndex((u) => u.address === a.address);
    const bIndex = userData.findIndex((u) => u.address === b.address);
    return aIndex - bIndex;
  });

  console.log("Seeded Users");

  const wishlistData = [
    {
      receiver_id: users[0].id,
      sender_id: users[4].id,
    },
  ];

  let wishlists = await db.insert(wishlist).values(wishlistData).onConflictDoNothing().returning();

  if (wishlists.length != wishlists.length) {
    const wishlistRemaining = wishlists.filter((w) => {
      return !wishlists.some((wc) => {
        return wc.sender_id == w.sender_id && wc.receiver_id == w.receiver_id;
      });
    });
    const wishlistExisted = await db.query.wishlist.findMany({
      where: (w, { or, and, eq }) =>
        or(
          ...wishlistRemaining.map((wr) =>
            and(eq(w.sender_id, wr.sender_id), eq(w.receiver_id, wr.receiver_id)),
          ),
        ),
    });

    wishlists = [...wishlists, ...wishlistExisted];
  }

  console.log("Seeded Wishlist");

  let auditExists = await db.query.audit.findFirst({
    where: (a, { eq }) => eq(a.title, "Empty audit - Open"),
  });

  if (!auditExists) {
    await db.transaction(async (tx) => {
      const [auditCreated] = await tx
        .insert(audit)
        .values({
          title: "Empty audit - Open",
          description: "Open, no requestors, no auditors, no details provided",
          token: tokenAddress,
          owner_id: users[0].id,
        })
        .returning();

      await tx.insert(auditMembership).values({
        user_id: users[0].id,
        role: RoleTypeEnum.OWNER,
        status: MembershipStatusEnum.VERIFIED,
        audit_id: auditCreated.id,
      });
    });
  }

  auditExists = await db.query.audit.findFirst({
    where: (a, { eq }) => eq(a.title, "Requested Audit - Open"),
  });

  if (!auditExists) {
    await db.transaction(async (tx) => {
      const [auditCreated] = await tx
        .insert(audit)
        .values({
          title: "Requested Audit - Open",
          description: "Open, 1 requestor, no auditors, details provided",
          price: 10_000,
          duration: 30,
          token: tokenAddress,
          details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
          owner_id: users[0].id,
        })
        .returning();

      await tx.insert(auditMembership).values([
        {
          user_id: users[0].id,
          role: RoleTypeEnum.OWNER,
          status: MembershipStatusEnum.VERIFIED,
          audit_id: auditCreated.id,
        },
        {
          user_id: users[1].id,
          role: RoleTypeEnum.AUDITOR,
          status: MembershipStatusEnum.REQUESTED,
          audit_id: auditCreated.id,
        },
      ]);
    });
  }

  auditExists = await db.query.audit.findFirst({
    where: (a, { eq }) => eq(a.title, "Auditor Audit - Open"),
  });

  if (!auditExists) {
    await db.transaction(async (tx) => {
      const [auditCreated] = await tx
        .insert(audit)
        .values({
          title: "Auditor Audit - Open",
          description: "Open, 1 auditor, no details",
          price: 10_000,
          duration: 50,
          token: tokenAddress,
          owner_id: users[0].id,
        })
        .returning();

      await tx.insert(auditMembership).values([
        {
          user_id: users[0].id,
          role: RoleTypeEnum.OWNER,
          status: MembershipStatusEnum.VERIFIED,
          audit_id: auditCreated.id,
        },
        {
          user_id: users[1].id,
          role: RoleTypeEnum.AUDITOR,
          status: MembershipStatusEnum.REQUESTED,
          audit_id: auditCreated.id,
        },
      ]);
    });
  }

  const broadcastActions = async (): Promise<void> => {
    const firstAudit = await db.query.audit.findFirst({
      orderBy: [desc(audit.created_at)],
      with: {
        auditMemberships: {
          with: {
            actions: true,
          },
        },
      },
    });

    if (!firstAudit) return;

    const userIds: string[] = [];
    const allActions: { userId: string; actionId: string; createdAt: Date }[] = [];
    firstAudit.auditMemberships.forEach((membership) => {
      userIds.push(membership.user_id);
      membership.actions.forEach((a) =>
        allActions.push({
          userId: membership.user_id,
          actionId: a.id,
          createdAt: a.created_at,
        }),
      );
    });

    const actionsBroadcast: { user_id: string; action_id: string; created_at: Date }[] = [];
    for (const userId of userIds) {
      for (const a of allActions) {
        if (a.userId !== userId) {
          actionsBroadcast.push({
            user_id: userId,
            action_id: a.actionId,
            created_at: a.createdAt,
          });
        }
      }
    }
    await db.insert(notification).values(actionsBroadcast);
  };

  auditExists = await db.query.audit.findFirst({
    where: (a, { eq }) => eq(a.title, "Auditor Audit - Locked"),
  });

  if (!auditExists) {
    await db.transaction(async (tx) => {
      const [auditCreated] = await tx
        .insert(audit)
        .values({
          title: "Auditor Audit - Locked",
          description: "Locked, 1 auditor, has not attested, details provided",
          price: 20_000,
          duration: 50,
          token: tokenAddress,
          details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
          status: AuditStatusEnum.ATTESTATION,
          owner_id: users[0].id,
        })
        .returning();

      const memberships = await tx
        .insert(auditMembership)
        .values([
          {
            user_id: users[0].id,
            role: RoleTypeEnum.OWNER,
            status: MembershipStatusEnum.VERIFIED,
            audit_id: auditCreated.id,
          },
          {
            user_id: users[1].id,
            role: RoleTypeEnum.AUDITOR,
            status: MembershipStatusEnum.REQUESTED,
            audit_id: auditCreated.id,
          },
        ])
        .returning();

      await tx.insert(action).values({
        type: ActionEnum.OWNER_LOCKED,
        membership_id: memberships[0].id,
      });
    });

    await broadcastActions();
  }

  auditExists = await db.query.audit.findFirst({
    where: (a, { eq }) => eq(a.title, "Auditor Audit - Locked, Rejected"),
  });

  if (!auditExists) {
    await db.transaction(async (tx) => {
      const [auditCreated] = await tx
        .insert(audit)
        .values({
          title: "Auditor Audit - Locked, Rejected",
          description: "Locked, 1 auditor, rejected terms, detailed provided.",
          price: 20_000,
          duration: 50,
          token: tokenAddress,
          details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
          status: AuditStatusEnum.ATTESTATION,
          owner_id: users[0].id,
        })
        .returning();

      const memberships = await tx
        .insert(auditMembership)
        .values([
          {
            user_id: users[0].id,
            role: RoleTypeEnum.OWNER,
            status: MembershipStatusEnum.VERIFIED,
            audit_id: auditCreated.id,
          },
          {
            user_id: users[1].id,
            role: RoleTypeEnum.AUDITOR,
            status: MembershipStatusEnum.VERIFIED,
            audit_id: auditCreated.id,
            attested_terms: true,
          },
        ])
        .returning();

      await tx.insert(action).values([
        {
          type: ActionEnum.OWNER_LOCKED,
          membership_id: memberships[0].id,
          created_at: new Date(new Date().getTime() - 1000),
        },
        {
          type: ActionEnum.AUDITOR_TERMS_REJECTED,
          membership_id: memberships[1].id,
          comment: "I don't like the terms",
        },
      ]);
    });

    await broadcastActions();
  }

  auditExists = await db.query.audit.findFirst({
    where: (a, { eq }) => eq(a.title, "Auditor Audit - Locked, Accepted"),
  });

  if (!auditExists) {
    await db.transaction(async (tx) => {
      const [auditCreated] = await tx
        .insert(audit)
        .values({
          title: "Auditor Audit - Locked, Accepted",
          description: "Locked, 1 auditor, accepted terms, details provided. Can be kicked off.",
          status: AuditStatusEnum.ATTESTATION,
          price: 20_000,
          duration: 50,
          token: tokenAddress,
          details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
          owner_id: users[0].id,
        })
        .returning();

      const memberships = await tx
        .insert(auditMembership)
        .values([
          {
            user_id: users[0].id,
            role: RoleTypeEnum.OWNER,
            status: MembershipStatusEnum.VERIFIED,
            audit_id: auditCreated.id,
          },
          {
            user_id: users[1].id,
            role: RoleTypeEnum.AUDITOR,
            status: MembershipStatusEnum.VERIFIED,
            audit_id: auditCreated.id,
            attested_terms: true,
            accepted_terms: true,
          },
        ])
        .returning();

      await tx.insert(action).values([
        {
          type: ActionEnum.OWNER_LOCKED,
          membership_id: memberships[0].id,
          created_at: new Date(new Date().getTime() - 1000),
        },
        {
          type: ActionEnum.AUDITOR_TERMS_REJECTED,
          membership_id: memberships[1].id,
          comment: "I don't like the terms",
        },
      ]);
    });

    await broadcastActions();
  }

  auditExists = await db.query.audit.findFirst({
    where: (a, { eq }) => eq(a.title, "Require Onchain 1"),
  });

  if (!auditExists) {
    await db.transaction(async (tx) => {
      const [auditCreated] = await tx
        .insert(audit)
        .values({
          title: "Require Onchain 1",
          description: "Ongoing, 2 auditors, 1 findings submitted, 1 pending.",
          status: AuditStatusEnum.AUDITING,
          price: 20_000,
          duration: 50,
          token: tokenAddress,
          details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
          owner_id: users[0].id,
        })
        .returning();

      const memberships = await tx
        .insert(auditMembership)
        .values([
          {
            user_id: users[0].id,
            role: RoleTypeEnum.OWNER,
            status: MembershipStatusEnum.VERIFIED,
            audit_id: auditCreated.id,
          },
          {
            user_id: users[1].id,
            role: RoleTypeEnum.AUDITOR,
            status: MembershipStatusEnum.VERIFIED,
            audit_id: auditCreated.id,
            attested_terms: true,
            accepted_terms: true,
          },
          {
            user_id: users[4].id,
            role: RoleTypeEnum.AUDITOR,
            status: MembershipStatusEnum.VERIFIED,
            audit_id: auditCreated.id,
            attested_terms: true,
            accepted_terms: true,
            findings: `${process.env.BLOB_URL}/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md`,
          },
        ])
        .returning();

      await tx.insert(action).values([
        {
          type: ActionEnum.OWNER_LOCKED,
          membership_id: memberships[0].id,
          created_at: new Date(new Date().getTime() - 4000),
        },
        {
          type: ActionEnum.OWNER_FINALIZED,
          membership_id: memberships[0].id,
          created_at: new Date(new Date().getTime() - 2000),
        },
        {
          type: ActionEnum.AUDITOR_TERMS_APPROVED,
          membership_id: memberships[1].id,
          created_at: new Date(new Date().getTime() - 3600),
        },
        {
          type: ActionEnum.AUDITOR_TERMS_APPROVED,
          membership_id: memberships[2].id,
          created_at: new Date(new Date().getTime() - 3500),
        },
        {
          type: ActionEnum.AUDITOR_FINDINGS,
          membership_id: memberships[2].id,
          created_at: new Date(new Date().getTime() - 3000),
        },
      ]);
    });

    await broadcastActions();
  }

  auditExists = await db.query.audit.findFirst({
    where: (a, { eq }) => eq(a.title, "Require Onchain 2"),
  });

  if (!auditExists) {
    await db.transaction(async (tx) => {
      const [auditCreated] = await tx
        .insert(audit)
        .values({
          title: "Require Onchain 2",
          description: "Ongoing, all parties submitted findings. Can be pushed on-chain",
          status: AuditStatusEnum.AUDITING,
          price: 20_000,
          duration: 50,
          token: tokenAddress,
          details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
          owner_id: users[0].id,
        })
        .returning();

      const memberships = await tx
        .insert(auditMembership)
        .values([
          {
            user_id: users[0].id,
            role: RoleTypeEnum.OWNER,
            status: MembershipStatusEnum.VERIFIED,
            audit_id: auditCreated.id,
          },
          {
            user_id: users[1].id,
            role: RoleTypeEnum.AUDITOR,
            status: MembershipStatusEnum.VERIFIED,
            audit_id: auditCreated.id,
            attested_terms: true,
            accepted_terms: true,
            findings: `${process.env.BLOB_URL}/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md`,
          },
          {
            user_id: users[4].id,
            role: RoleTypeEnum.AUDITOR,
            status: MembershipStatusEnum.VERIFIED,
            audit_id: auditCreated.id,
            attested_terms: true,
            accepted_terms: true,
            findings: `${process.env.BLOB_URL}/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md`,
          },
        ])
        .returning();

      await tx.insert(action).values([
        {
          type: ActionEnum.OWNER_LOCKED,
          membership_id: memberships[0].id,
          created_at: new Date(new Date().getTime() - 4000),
        },
        {
          type: ActionEnum.OWNER_FINALIZED,
          membership_id: memberships[0].id,
          created_at: new Date(new Date().getTime() - 2000),
        },
        {
          type: ActionEnum.AUDITOR_TERMS_APPROVED,
          membership_id: memberships[1].id,
          created_at: new Date(new Date().getTime() - 3600),
        },
        {
          type: ActionEnum.AUDITOR_FINDINGS,
          membership_id: memberships[1].id,
          created_at: new Date(new Date().getTime() - 1000),
        },
        {
          type: ActionEnum.AUDITOR_TERMS_APPROVED,
          membership_id: memberships[2].id,
          created_at: new Date(new Date().getTime() - 3500),
        },
        {
          type: ActionEnum.AUDITOR_FINDINGS,
          membership_id: memberships[2].id,
          created_at: new Date(new Date().getTime() - 3000),
        },
      ]);
    });

    await broadcastActions();
  }

  auditExists = await db.query.audit.findFirst({
    where: (a, { eq }) => eq(a.title, "Require Onchain 3"),
  });

  if (!auditExists) {
    await db.transaction(async (tx) => {
      const [auditCreated] = await tx
        .insert(audit)
        .values({
          title: "Require Onchain 3",
          description:
            "This audit is closed and will be viewable. Doesn't tell us if challengeable, \
that needs to come from on-chain",
          status: AuditStatusEnum.CHALLENGEABLE,
          price: 2_000,
          duration: 50,
          token: tokenAddress,
          details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
          owner_id: users[3].id,
        })
        .returning();

      const memberships = await tx
        .insert(auditMembership)
        .values([
          {
            user_id: users[3].id,
            role: RoleTypeEnum.OWNER,
            status: MembershipStatusEnum.VERIFIED,
            audit_id: auditCreated.id,
          },
          {
            user_id: users[2].id,
            role: RoleTypeEnum.AUDITOR,
            status: MembershipStatusEnum.VERIFIED,
            audit_id: auditCreated.id,
            attested_terms: true,
            accepted_terms: true,
            findings: `${process.env.BLOB_URL}/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md`,
          },
          {
            user_id: users[5].id,
            role: RoleTypeEnum.AUDITOR,
            status: MembershipStatusEnum.VERIFIED,
            audit_id: auditCreated.id,
            attested_terms: true,
            accepted_terms: true,
            findings: `${process.env.BLOB_URL}/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md`,
          },
        ])
        .returning();

      await tx.insert(action).values([
        {
          type: ActionEnum.OWNER_LOCKED,
          membership_id: memberships[0].id,
          created_at: new Date(new Date().getTime() - 4000),
        },
        {
          type: ActionEnum.OWNER_FINALIZED,
          membership_id: memberships[0].id,
          created_at: new Date(new Date().getTime() - 2000),
        },
        {
          type: ActionEnum.AUDITOR_TERMS_APPROVED,
          membership_id: memberships[1].id,
          created_at: new Date(new Date().getTime() - 3600),
        },
        {
          type: ActionEnum.AUDITOR_FINDINGS,
          membership_id: memberships[1].id,
          created_at: new Date(new Date().getTime() - 1000),
        },
        {
          type: ActionEnum.AUDITOR_TERMS_APPROVED,
          membership_id: memberships[2].id,
          created_at: new Date(new Date().getTime() - 3500),
        },
        {
          type: ActionEnum.AUDITOR_FINDINGS,
          membership_id: memberships[2].id,
          created_at: new Date(new Date().getTime() - 3000),
        },
      ]);
    });

    await broadcastActions();
  }

  console.log("Seeded Audits");
};

seed()
  .then(() => console.log("Done Seededing Offchain Data"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
