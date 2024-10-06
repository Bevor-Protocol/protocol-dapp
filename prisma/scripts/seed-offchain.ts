// import { Role, Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma.server";
import { ethers } from "ethers";

import ERC20ABI from "@/contracts/abis/ERC20Token";
import { ActionType, AuditStatusType, MembershipStatusType, RoleType } from "@prisma/client";

const seed = async (): Promise<void> => {
  // In practice, users will only be created once they've gotten a role
  // asigned. Anyone can visit the application, but we won't need a dashboard
  // page for these users.

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
      ownerRole: true,
      name: "My main auditee wallet",
    },
    {
      address: WALLETS[1],
      auditorRole: true,
      name: "My main auditor wallet",
    },
    {
      address: WALLETS[2],
      ownerRole: true,
      auditorRole: true,
      name: "I have both roles",
    },
    {
      address: WALLETS[3],
      ownerRole: true,
      name: "Test User 1",
      available: true,
    },
    {
      address: WALLETS[4],
      auditorRole: true,
      name: "I am certique",
      image: "https://cdn-images-1.medium.com/max/1200/1*Ty6tR7qRtx6yo3dM_drJBg.png",
    },
    {
      address: WALLETS[5],
      auditorRole: true,
      available: true,
    },
  ];

  Array.from({ length: 4 }).forEach((_, ind) => {
    userData.push({
      address: WALLETS[ind + 6],
      auditorRole: true,
      available: true,
    });
  });

  const users = await prisma.$transaction(
    userData.map((user) =>
      prisma.user.create({
        data: {
          ...user,
        },
      }),
    ),
  );
  console.log("Seeded Users");

  //////////////////////////////////////////////////////////////////////////////
  // Create initial wishlist

  await prisma.user.update({
    where: {
      id: users[0].id,
    },
    data: {
      wishlistAsSender: {
        create: {
          receiver: {
            connect: {
              id: users[4].id,
            },
          },
        },
      },
    },
  });

  // NEWLY GENERATED AUDITS. NOT LOCKED, NOT FINAL
  // This is admittedly quite gross since History will be created in real time,
  // but here we're retrospectively creating these instances. So we need access to the
  // auditId or userId when creating these.

  await prisma.audit.create({
    data: {
      title: "Empty audit - Open",
      description: "Open, no requestors, no auditors, no details provided",
      token: tokenAddress,
      owner: {
        connect: {
          address: WALLETS[0],
        },
      },
      memberships: {
        create: {
          user: {
            connect: {
              address: WALLETS[0],
            },
          },
          role: RoleType.OWNER,
          status: MembershipStatusType.VERIFIED,
        },
      },
    },
  });

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  await prisma.audit.create({
    data: {
      title: "Requested Audit - Open",
      description: "Open, 1 requestor, no auditors, details provided",
      price: 10_000,
      duration: 30,
      token: tokenAddress,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
      owner: {
        connect: {
          address: WALLETS[0],
        },
      },
      memberships: {
        create: [
          {
            userId: users[0].id,
            role: RoleType.OWNER,
            status: MembershipStatusType.VERIFIED,
          },
          {
            userId: users[1].id,
            role: RoleType.AUDITOR,
            status: MembershipStatusType.REQUESTED,
          },
        ],
      },
    },
  });

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  await prisma.audit.create({
    data: {
      title: "Auditor Audit - Open",
      description: "Open, 1 auditor, no details",
      price: 10_000,
      duration: 50,
      token: tokenAddress,
      owner: {
        connect: {
          address: WALLETS[0],
        },
      },
      memberships: {
        create: [
          {
            userId: users[0].id,
            role: RoleType.OWNER,
            status: MembershipStatusType.VERIFIED,
          },
          {
            userId: users[1].id,
            role: RoleType.AUDITOR,
            status: MembershipStatusType.VERIFIED,
          },
        ],
      },
    },
  });

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  const broadcastActions = async (): Promise<void> => {
    // can just use the most recent audit for this seeding process.
    // will exclude a noti for the person who created the action.
    const audit = await prisma.audit.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        memberships: {
          include: {
            actions: true,
          },
        },
      },
    });

    if (!audit) return;

    const userIds: string[] = [];
    const allActions: { userId: string; actionId: string; createdAt: Date }[] = [];
    audit.memberships.forEach((membership) => {
      const { userId, actions } = membership;
      userIds.push(userId);
      actions.forEach((action) =>
        allActions.push({
          userId: userId,
          actionId: action.id,
          createdAt: action.createdAt,
        }),
      );
    });

    const actionsBroadcast: { userId: string; actionId: string; createdAt: Date }[] = [];
    for (const userId of userIds) {
      for (const action of allActions) {
        if (action.userId !== userId) {
          actionsBroadcast.push({
            userId,
            actionId: action.actionId,
            createdAt: action.createdAt,
          });
        }
      }
    }

    await prisma.notification.createMany({
      data: actionsBroadcast,
    });
  };

  await prisma.audit.create({
    data: {
      title: "Auditor Audit - Locked",
      description: "Locked, 1 auditor, has not attested, details provided",
      price: 20_000,
      duration: 50,
      token: tokenAddress,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
      status: AuditStatusType.ATTESTATION,
      owner: {
        connect: {
          address: WALLETS[0],
        },
      },
      memberships: {
        create: [
          {
            userId: users[0].id,
            role: RoleType.OWNER,
            status: MembershipStatusType.VERIFIED,
            actions: {
              create: {
                type: ActionType.OWNER_LOCKED,
              },
            },
          },
          {
            userId: users[1].id,
            role: RoleType.AUDITOR,
            status: MembershipStatusType.REQUESTED,
          },
        ],
      },
    },
  });

  await broadcastActions();

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  await prisma.audit.create({
    data: {
      title: "Auditor Audit - Locked, Rejected",
      description: "Locked, 1 auditor, rejected terms, detailed provided.",
      price: 20_000,
      duration: 50,
      token: tokenAddress,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
      status: AuditStatusType.ATTESTATION,
      owner: {
        connect: {
          address: WALLETS[0],
        },
      },
      memberships: {
        create: [
          {
            userId: users[0].id,
            role: RoleType.OWNER,
            status: MembershipStatusType.VERIFIED,
            actions: {
              create: {
                type: ActionType.OWNER_LOCKED,
                createdAt: new Date(new Date().getTime() - 1000),
              },
            },
          },
          {
            userId: users[1].id,
            role: RoleType.AUDITOR,
            status: MembershipStatusType.VERIFIED,
            attestedTerms: true,
            acceptedTerms: false,
            actions: {
              create: {
                type: ActionType.AUDITOR_TERMS_REJECTED,
                comment: "I don't like the terms",
              },
            },
          },
        ],
      },
    },
  });

  await broadcastActions();

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  await prisma.audit.create({
    data: {
      title: "Auditor Audit - Locked, Accepted",
      description: "Locked, 1 auditor, accepted terms, details provided. Can be kicked off.",
      status: AuditStatusType.ATTESTATION,
      price: 20_000,
      duration: 50,
      token: tokenAddress,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
      owner: {
        connect: {
          address: WALLETS[0],
        },
      },
      memberships: {
        create: [
          {
            userId: users[0].id,
            role: RoleType.OWNER,
            status: MembershipStatusType.VERIFIED,
            actions: {
              create: {
                type: ActionType.OWNER_LOCKED,
                createdAt: new Date(new Date().getTime() - 1000),
              },
            },
          },
          {
            userId: users[1].id,
            role: RoleType.AUDITOR,
            status: MembershipStatusType.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            actions: {
              create: {
                type: ActionType.AUDITOR_TERMS_APPROVED,
              },
            },
          },
        ],
      },
    },
  });

  await broadcastActions();

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  await prisma.audit.create({
    data: {
      id: "number1",
      title: "Auditor Audit - Locked, Accepted, 1 Findings Submitted",
      description: "Ongoing, 2 auditors, 1 findings submitted, 1 pending.",
      status: AuditStatusType.AUDITING,
      price: 20_000,
      duration: 50,
      token: tokenAddress,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
      owner: {
        connect: {
          address: WALLETS[0],
        },
      },
      memberships: {
        create: [
          {
            userId: users[0].id,
            role: RoleType.OWNER,
            status: MembershipStatusType.VERIFIED,
            actions: {
              create: [
                {
                  type: ActionType.OWNER_LOCKED,
                  createdAt: new Date(new Date().getTime() - 4000),
                },
                {
                  type: ActionType.OWNER_FINALIZED,
                  createdAt: new Date(new Date().getTime() - 2000),
                },
              ],
            },
          },
          {
            userId: users[1].id,
            role: RoleType.AUDITOR,
            status: MembershipStatusType.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            actions: {
              create: [
                {
                  type: ActionType.AUDITOR_TERMS_APPROVED,
                  createdAt: new Date(new Date().getTime() - 3600),
                },
              ],
            },
          },
          {
            userId: users[4].id,
            role: RoleType.AUDITOR,
            status: MembershipStatusType.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            findings: `${process.env.BLOB_URL}/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md`,
            actions: {
              create: [
                {
                  type: ActionType.AUDITOR_TERMS_APPROVED,
                  createdAt: new Date(new Date().getTime() - 3500),
                },
                {
                  type: ActionType.AUDITOR_FINDINGS,
                  createdAt: new Date(new Date().getTime() - 3500),
                },
              ],
            },
          },
        ],
      },
    },
  });

  await broadcastActions();

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  await prisma.audit.create({
    data: {
      id: "number2",
      title: "Auditor Audit - Ready for on-chain",
      description: "Ongoing, all parties submitted findings. Can be pushed on-chain",
      status: AuditStatusType.AUDITING,
      price: 20_000,
      duration: 50,
      token: tokenAddress,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
      owner: {
        connect: {
          address: WALLETS[0],
        },
      },
      memberships: {
        create: [
          {
            userId: users[0].id,
            role: RoleType.OWNER,
            status: MembershipStatusType.VERIFIED,
            actions: {
              create: [
                {
                  type: ActionType.OWNER_LOCKED,
                  createdAt: new Date(new Date().getTime() - 4000),
                },
                {
                  type: ActionType.OWNER_FINALIZED,
                  createdAt: new Date(new Date().getTime() - 2000),
                },
              ],
            },
          },
          {
            userId: users[1].id,
            role: RoleType.AUDITOR,
            status: MembershipStatusType.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            findings: `${process.env.BLOB_URL}/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md`,
            actions: {
              create: [
                {
                  type: ActionType.AUDITOR_TERMS_APPROVED,
                  createdAt: new Date(new Date().getTime() - 3600),
                },
                {
                  type: ActionType.AUDITOR_FINDINGS,
                  createdAt: new Date(new Date().getTime() - 1000),
                },
              ],
            },
          },
          {
            userId: users[4].id,
            role: RoleType.AUDITOR,
            status: MembershipStatusType.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            findings: `${process.env.BLOB_URL}/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md`,
            actions: {
              create: [
                {
                  type: ActionType.AUDITOR_TERMS_APPROVED,
                  createdAt: new Date(new Date().getTime() - 3500),
                },
                {
                  type: ActionType.AUDITOR_FINDINGS,
                  createdAt: new Date(new Date().getTime() - 200),
                },
              ],
            },
          },
        ],
      },
    },
  });

  await broadcastActions();

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  await prisma.audit.create({
    data: {
      title: "Random Auditee Audit - Open",
      description: "Open, no requestors, no auditors, no details",
      token: tokenAddress,
      owner: {
        connect: {
          address: WALLETS[3],
        },
      },
      memberships: {
        create: {
          user: {
            connect: {
              address: WALLETS[3],
            },
          },
          role: RoleType.OWNER,
          status: MembershipStatusType.VERIFIED,
        },
      },
    },
  });

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  await prisma.audit.create({
    data: {
      title: "Random Auditee Audit - Open",
      description: "Open, 1 requestor, 1 auditor, details provided",
      price: 10_000,
      duration: 30,
      token: tokenAddress,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
      owner: {
        connect: {
          address: WALLETS[2],
        },
      },
      memberships: {
        create: [
          {
            userId: users[2].id,
            role: RoleType.OWNER,
            status: MembershipStatusType.VERIFIED,
            actions: {
              create: [
                {
                  type: ActionType.OWNER_LOCKED,
                  createdAt: new Date(new Date().getTime() - 4000),
                },
                {
                  type: ActionType.OWNER_OPENED,
                  createdAt: new Date(new Date().getTime() - 2000),
                },
              ],
            },
          },
          {
            userId: users[1].id,
            role: RoleType.AUDITOR,
            status: MembershipStatusType.REQUESTED,
          },
          {
            userId: users[4].id,
            role: RoleType.AUDITOR,
            status: MembershipStatusType.VERIFIED,
          },
        ],
      },
    },
  });

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  await prisma.audit.create({
    data: {
      id: "number3",
      title: "Completed audit",
      description:
        "This audit is closed and will be viewable. Doesn't tell us if challengeable, \
that needs to come from on-chain",
      status: AuditStatusType.CHALLENGEABLE,
      price: 2_000,
      duration: 50,
      token: tokenAddress,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
      owner: {
        connect: {
          address: WALLETS[3],
        },
      },
      memberships: {
        create: [
          {
            userId: users[3].id,
            role: RoleType.OWNER,
            status: MembershipStatusType.VERIFIED,
            actions: {
              create: [
                {
                  type: ActionType.OWNER_LOCKED,
                  createdAt: new Date(new Date().getTime() - 4000),
                },
                {
                  type: ActionType.OWNER_FINALIZED,
                  createdAt: new Date(new Date().getTime() - 2000),
                },
              ],
            },
          },
          {
            userId: users[2].id,
            role: RoleType.AUDITOR,
            status: MembershipStatusType.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            findings: `${process.env.BLOB_URL}/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md`,
            actions: {
              create: [
                {
                  type: ActionType.AUDITOR_TERMS_APPROVED,
                  createdAt: new Date(new Date().getTime() - 3600),
                },
                {
                  type: ActionType.AUDITOR_FINDINGS,
                  createdAt: new Date(new Date().getTime() - 1000),
                },
              ],
            },
          },
          {
            userId: users[5].id,
            role: RoleType.AUDITOR,
            status: MembershipStatusType.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            findings: `${process.env.BLOB_URL}/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md`,

            actions: {
              create: [
                {
                  type: ActionType.AUDITOR_TERMS_APPROVED,
                  createdAt: new Date(new Date().getTime() - 3500),
                },
                {
                  type: ActionType.AUDITOR_FINDINGS,
                  createdAt: new Date(new Date().getTime() - 100),
                },
              ],
            },
          },
        ],
      },
    },
  });

  await broadcastActions();

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // this one is finicky as we can't simulate a finished contract by fast-forwarding
  // time in contract reads on the frontend (we can simulate it as a standalone script).

  await prisma.audit.create({
    data: {
      id: "number4",
      title: "Completed audit",
      description:
        "This audit is closed and will be viewable. Doesn't tell us if challengeable, \
that needs to come from on-chain, but I'll mark is as such",
      status: AuditStatusType.FINALIZED,
      price: 2_000,
      duration: 70,
      token: tokenAddress,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
      owner: {
        connect: {
          address: WALLETS[3],
        },
      },
      memberships: {
        create: [
          {
            userId: users[3].id,
            role: RoleType.OWNER,
            status: MembershipStatusType.VERIFIED,
            actions: {
              create: [
                {
                  type: ActionType.OWNER_LOCKED,
                  createdAt: new Date(new Date().getTime() - 4000),
                },
                {
                  type: ActionType.OWNER_FINALIZED,
                  createdAt: new Date(new Date().getTime() - 2000),
                },
              ],
            },
          },
          {
            userId: users[2].id,
            role: RoleType.AUDITOR,
            status: MembershipStatusType.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            findings: `${process.env.BLOB_URL}/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md`,

            actions: {
              create: [
                {
                  type: ActionType.AUDITOR_TERMS_APPROVED,
                  createdAt: new Date(new Date().getTime() - 3600),
                },
                {
                  type: ActionType.AUDITOR_FINDINGS,
                  createdAt: new Date(new Date().getTime() - 1000),
                },
              ],
            },
          },
          {
            userId: users[5].id,
            role: RoleType.AUDITOR,
            status: MembershipStatusType.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            findings: `${process.env.BLOB_URL}/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md`,

            actions: {
              create: [
                {
                  type: ActionType.AUDITOR_TERMS_APPROVED,
                  createdAt: new Date(new Date().getTime() - 3500),
                },
                {
                  type: ActionType.AUDITOR_FINDINGS,
                  createdAt: new Date(new Date().getTime() - 100),
                },
              ],
            },
          },
        ],
      },
    },
  });

  await broadcastActions();

  console.log("Seeded Audits + Auditors");
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
