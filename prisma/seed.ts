// import { Role, Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma.server";
import { AuditorStatus, AuditStatus, HistoryAction, UserType } from "@prisma/client";
import { ethers } from "ethers";

import ERC20Abi from "@/contracts/abis/ERC20Token";
import BevorProtocolAbi from "@/contracts/abis/BevorProtocol";

const seed = async (): Promise<void> => {
  // In practice, users will only be created once they've gotten a role
  // asigned. Anyone can visit the application, but we won't need a dashboard
  // page for these users.

  const provider = new ethers.JsonRpcProvider();
  const signer = await provider.getSigner();
  const accounts = await provider.listAccounts();

  const tokenContract = new ethers.Contract(ERC20Abi.address, ERC20Abi.abi, signer);
  const bevorContract = new ethers.Contract(BevorProtocolAbi.address, BevorProtocolAbi.abi, signer);

  if (!process.env.BLOB_URL) {
    throw new Error("must set the BLOB_URL (vercel blob url prefix)");
  }

  // Wallets used align with the hardhat dev config, which are consistent given the mnemonic in the config.
  // Check bevor-v1 repo. We'll use the first 10 returned addresses.

  const WALLETS = accounts.slice(0, 10).map((acct) => acct.address);

  // Since we don't have a means of distribution, just initially seed all accounts with
  // some test token.
  for (let i = 0; i < WALLETS.length; i++) {
    await tokenContract.transfer(WALLETS[i], 25000);
  }

  const userData = [
    {
      address: WALLETS[0],
      auditeeRole: true,
      name: "My main auditee wallet",
    },
    {
      address: WALLETS[1],
      auditorRole: true,
      name: "My main auditor wallet",
    },
    {
      address: WALLETS[2],
      auditeeRole: true,
      auditorRole: true,
      name: "I have both roles",
    },
    {
      address: WALLETS[3],
      auditeeRole: true,
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
      prisma.users.create({
        data: {
          ...user,
        },
      }),
    ),
  );
  console.log("Seeded Users");

  //////////////////////////////////////////////////////////////////////////////
  // Create initial wishlist

  await prisma.users.update({
    where: {
      id: users[0].id,
    },
    data: {
      wishlistAsRequestor: {
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

  await prisma.audits.create({
    data: {
      title: "Empty audit - Open",
      description: "Open, no requestors, no auditors, no details provided",
      auditee: {
        connect: {
          address: WALLETS[0],
        },
      },
    },
  });

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  await prisma.audits.create({
    data: {
      title: "Requested Audit - Open",
      description: "Open, 1 requestor, no auditors, details provided",
      price: 10_000,
      duration: 30,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
      auditee: {
        connect: {
          address: WALLETS[0],
        },
      },
      auditors: {
        create: {
          status: AuditorStatus.REQUESTED,
          user: {
            connect: {
              address: WALLETS[1],
            },
          },
        },
      },
    },
  });

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  await prisma.audits.create({
    data: {
      title: "Auditor Audit - Open",
      description: "Open, 1 auditor, no details",
      price: 10_000,
      duration: 50,
      auditee: {
        connect: {
          address: WALLETS[0],
        },
      },
      auditors: {
        create: {
          status: AuditorStatus.VERIFIED,
          user: {
            connect: {
              address: WALLETS[1],
            },
          },
        },
      },
    },
  });

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  await prisma.audits.create({
    data: {
      title: "Auditor Audit - Locked",
      description: "Locked, 1 auditor, has not attested, details provided",
      price: 20_000,
      duration: 50,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
      status: AuditStatus.ATTESTATION,
      auditee: {
        connect: {
          address: WALLETS[0],
        },
      },
      auditors: {
        create: {
          status: AuditorStatus.VERIFIED,
          user: {
            connect: {
              address: WALLETS[1],
            },
          },
        },
      },
      history: {
        create: {
          action: HistoryAction.LOCKED,
          userType: UserType.AUDITEE,
        },
      },
    },
  });

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  let res;

  res = await prisma.audits.create({
    data: {
      title: "Auditor Audit - Locked, Rejected",
      description: "Locked, 1 auditor, rejected terms, detailed provided.",
      price: 20_000,
      duration: 50,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
      status: AuditStatus.ATTESTATION,
      auditee: {
        connect: {
          address: WALLETS[0],
        },
      },
      auditors: {
        create: {
          status: AuditorStatus.VERIFIED,
          attestedTerms: true,
          acceptedTerms: false,
          user: {
            connect: {
              address: WALLETS[1],
            },
          },
        },
      },
      history: {
        create: {
          action: HistoryAction.LOCKED,
          userType: UserType.AUDITEE,
          createdAt: new Date(new Date().getTime() - 1000),
        },
      },
    },
  });

  // need to independently create the history objects for auditors.
  // YOU'LL SEE THIS THROUGHOUT THE SEED SCRIPT.
  await prisma.auditors.update({
    where: {
      auditId_userId: {
        userId: users[1].id,
        auditId: res.id,
      },
    },
    data: {
      history: {
        create: {
          action: HistoryAction.REJECTED,
          userType: UserType.AUDITOR,
          comment: "I don't like the terms",
          audit: {
            connect: {
              id: res.id,
            },
          },
        },
      },
    },
  });

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  res = await prisma.audits.create({
    data: {
      title: "Auditor Audit - Locked, Accepted",
      description: "Locked, 1 auditor, accepted terms, details provided. Can be kicked off.",
      status: AuditStatus.ATTESTATION,
      price: 20_000,
      duration: 50,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
      auditee: {
        connect: {
          address: WALLETS[0],
        },
      },
      auditors: {
        create: {
          status: AuditorStatus.VERIFIED,
          attestedTerms: true,
          acceptedTerms: true,
          user: {
            connect: {
              address: WALLETS[1],
            },
          },
        },
      },
      history: {
        create: {
          action: HistoryAction.LOCKED,
          userType: UserType.AUDITEE,
          createdAt: new Date(new Date().getTime() - 1000),
        },
      },
    },
  });

  await prisma.auditors.update({
    where: {
      auditId_userId: {
        userId: users[1].id,
        auditId: res.id,
      },
    },
    data: {
      history: {
        create: {
          action: HistoryAction.APPROVED,
          userType: UserType.AUDITOR,
          audit: {
            connect: {
              id: res.id,
            },
          },
        },
      },
    },
  });

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  let auditId;
  let tokenId;

  auditId = await bevorContract.generateAuditId(
    accounts[0].address,
    [accounts[1].address, accounts[4].address],
    5 * 24 * 60 * 60,
    50 * 24 * 60 * 60,
    "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
    20000,
    ERC20Abi.address,
    "I am salt",
  );

  await tokenContract.transfer(accounts[0].address, 20000);

  await bevorContract
    .connect(accounts[0])
    // @ts-expect-error not recognized, but works.
    .prepareAudit(
      [accounts[1].address, accounts[4].address],
      5 * 24 * 60 * 60,
      50 * 24 * 60 * 60,
      "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
      20000,
      ERC20Abi.address,
      "I am salt",
    );

  res = await prisma.audits.create({
    data: {
      title: "Auditor Audit - Locked, Accepted, 1 Findings Submitted",
      description: "Ongoing, 2 auditors, 1 findings submitted, 1 pending.",
      status: AuditStatus.AUDITING,
      price: 20_000,
      duration: 50,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
      onchainAuditInfoId: BigInt(auditId as bigint).toString(),
      auditee: {
        connect: {
          address: WALLETS[0],
        },
      },
      auditors: {
        create: [
          {
            status: AuditorStatus.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            user: {
              connect: {
                address: WALLETS[1],
              },
            },
          },
          {
            status: AuditorStatus.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            user: {
              connect: {
                address: WALLETS[4],
              },
            },
            findings: `${process.env.BLOB_URL}/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md`,
          },
        ],
      },
      history: {
        createMany: {
          data: [
            {
              action: HistoryAction.LOCKED,
              userType: UserType.AUDITEE,
              createdAt: new Date(new Date().getTime() - 4000),
            },
            {
              action: HistoryAction.FINALIZED,
              userType: UserType.AUDITEE,
              createdAt: new Date(new Date().getTime() - 2000),
            },
          ],
        },
      },
    },
  });

  await prisma.auditors.update({
    where: {
      auditId_userId: {
        userId: users[1].id,
        auditId: res.id,
      },
    },
    data: {
      history: {
        create: {
          action: HistoryAction.APPROVED,
          userType: UserType.AUDITOR,
          createdAt: new Date(new Date().getTime() - 3600),
          audit: {
            connect: {
              id: res.id,
            },
          },
        },
      },
    },
  });

  await prisma.auditors.update({
    where: {
      auditId_userId: {
        userId: users[4].id,
        auditId: res.id,
      },
    },
    data: {
      history: {
        create: [
          {
            action: HistoryAction.APPROVED,
            userType: UserType.AUDITOR,
            createdAt: new Date(new Date().getTime() - 3500),
            audit: {
              connect: {
                id: res.id,
              },
            },
          },
          {
            action: HistoryAction.FINDINGS,
            userType: UserType.AUDITOR,
            audit: {
              connect: {
                id: res.id,
              },
            },
          },
        ],
      },
    },
  });

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  auditId = await bevorContract.generateAuditId(
    accounts[0].address,
    [accounts[1].address, accounts[4].address],
    5 * 24 * 60 * 60,
    50 * 24 * 60 * 60,
    "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
    20000,
    ERC20Abi.address,
    "I am salty",
  );

  await tokenContract.transfer(accounts[0].address, 20000);

  await bevorContract
    .connect(accounts[0])
    // @ts-expect-error not recognized, but works.
    .prepareAudit(
      [accounts[1].address, accounts[4].address],
      5 * 24 * 60 * 60,
      50 * 24 * 60 * 60,
      "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
      20000,
      ERC20Abi.address,
      "I am salty",
    );

  res = await prisma.audits.create({
    data: {
      title: "Auditor Audit - Ready for on-chain",
      description: "Ongoing, all parties submitted findings. Can be pushed on-chain",
      status: AuditStatus.AUDITING,
      price: 20_000,
      duration: 50,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
      onchainAuditInfoId: BigInt(auditId as bigint).toString(),
      auditee: {
        connect: {
          address: WALLETS[0],
        },
      },
      auditors: {
        create: [
          {
            status: AuditorStatus.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            user: {
              connect: {
                address: WALLETS[1],
              },
            },
            findings: `${process.env.BLOB_URL}/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md`,
          },
          {
            status: AuditorStatus.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            user: {
              connect: {
                address: WALLETS[4],
              },
            },
            findings: `${process.env.BLOB_URL}/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md`,
          },
        ],
      },
      history: {
        createMany: {
          data: [
            {
              action: HistoryAction.LOCKED,
              userType: UserType.AUDITEE,
              createdAt: new Date(new Date().getTime() - 4000),
            },
            {
              action: HistoryAction.FINALIZED,
              userType: UserType.AUDITEE,
              createdAt: new Date(new Date().getTime() - 2000),
            },
          ],
        },
      },
    },
  });

  await prisma.auditors.update({
    where: {
      auditId_userId: {
        userId: users[1].id,
        auditId: res.id,
      },
    },
    data: {
      history: {
        create: [
          {
            action: HistoryAction.APPROVED,
            userType: UserType.AUDITOR,
            createdAt: new Date(new Date().getTime() - 3600),
            audit: {
              connect: {
                id: res.id,
              },
            },
          },
          {
            action: HistoryAction.FINDINGS,
            userType: UserType.AUDITOR,
            createdAt: new Date(new Date().getTime() - 1000),
            audit: {
              connect: {
                id: res.id,
              },
            },
          },
        ],
      },
    },
  });

  await prisma.auditors.update({
    where: {
      auditId_userId: {
        userId: users[4].id,
        auditId: res.id,
      },
    },
    data: {
      history: {
        create: [
          {
            action: HistoryAction.APPROVED,
            userType: UserType.AUDITOR,
            createdAt: new Date(new Date().getTime() - 3500),
            audit: {
              connect: {
                id: res.id,
              },
            },
          },
          {
            action: HistoryAction.FINDINGS,
            userType: UserType.AUDITOR,
            createdAt: new Date(new Date().getTime() - 200),
            audit: {
              connect: {
                id: res.id,
              },
            },
          },
        ],
      },
    },
  });

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  await prisma.audits.create({
    data: {
      title: "Random Auditee Audit - Open",
      description: "Open, no requestors, no auditors, no details",
      auditee: {
        connect: {
          address: WALLETS[3],
        },
      },
    },
  });

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  await prisma.audits.create({
    data: {
      title: "Random Auditee Audit - Open",
      description: "Open, 1 requestor, 1 auditor, details provided",
      price: 10_000,
      duration: 30,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
      auditee: {
        connect: {
          address: WALLETS[2],
        },
      },
      auditors: {
        create: [
          {
            status: AuditorStatus.VERIFIED,
            user: {
              connect: {
                address: WALLETS[4],
              },
            },
          },
          {
            status: AuditorStatus.REQUESTED,
            user: {
              connect: {
                address: WALLETS[1],
              },
            },
          },
        ],
      },
      history: {
        createMany: {
          data: [
            {
              action: HistoryAction.LOCKED,
              userType: UserType.AUDITEE,
              createdAt: new Date(new Date().getTime() - 4000),
            },
            {
              action: HistoryAction.OPENED,
              userType: UserType.AUDITEE,
              createdAt: new Date(new Date().getTime() - 2000),
            },
          ],
        },
      },
    },
  });

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  auditId = await bevorContract.generateAuditId(
    accounts[3].address,
    [accounts[2].address, accounts[5].address],
    5 * 24 * 60 * 60,
    50 * 24 * 60 * 60,
    "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
    2000,
    ERC20Abi.address,
    "I am salt",
  );

  await tokenContract.transfer(accounts[3].address, 2000);

  await bevorContract
    .connect(accounts[3])
    // @ts-expect-error not recognized, but works.
    .prepareAudit(
      [accounts[2].address, accounts[5].address],
      5 * 24 * 60 * 60,
      50 * 24 * 60 * 60,
      "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
      2000,
      ERC20Abi.address,
      "I am salt",
    );

  tokenId = await bevorContract.generateTokenId(auditId, [
    "example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI",
    "example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI",
  ]);

  // @ts-expect-error not recognized, but works.
  await tokenContract.connect(accounts[3]).approve(BevorProtocolAbi.address, 2000);

  await bevorContract
    .connect(accounts[3])
    // @ts-expect-error not recognized, but works.
    .revealFindings(
      ["example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI", "example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI"],
      auditId,
    );

  res = await prisma.audits.create({
    data: {
      title: "Completed audit",
      description:
        "This audit is closed and will be viewable. Doesn't tell us if challengeable, \
that needs to come from on-chain",
      status: AuditStatus.CHALLENGEABLE,
      price: 2_000,
      duration: 50,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
      onchainAuditInfoId: BigInt(auditId as bigint).toString(),
      onchainNftId: BigInt(tokenId as bigint).toString(),
      auditee: {
        connect: {
          address: WALLETS[3],
        },
      },
      auditors: {
        create: [
          {
            status: AuditorStatus.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            user: {
              connect: {
                address: WALLETS[2],
              },
            },
            findings: `${process.env.BLOB_URL}/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md`,
          },
          {
            status: AuditorStatus.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            user: {
              connect: {
                address: WALLETS[5],
              },
            },
            findings: `${process.env.BLOB_URL}/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md`,
          },
        ],
      },
      history: {
        createMany: {
          data: [
            {
              action: HistoryAction.LOCKED,
              userType: UserType.AUDITEE,
              createdAt: new Date(new Date().getTime() - 4000),
            },
            {
              action: HistoryAction.FINALIZED,
              userType: UserType.AUDITEE,
              createdAt: new Date(new Date().getTime() - 2000),
            },
          ],
        },
      },
    },
  });

  await prisma.auditors.update({
    where: {
      auditId_userId: {
        userId: users[2].id,
        auditId: res.id,
      },
    },
    data: {
      history: {
        create: [
          {
            action: HistoryAction.APPROVED,
            userType: UserType.AUDITOR,
            createdAt: new Date(new Date().getTime() - 3600),
            audit: {
              connect: {
                id: res.id,
              },
            },
          },
          {
            action: HistoryAction.FINDINGS,
            userType: UserType.AUDITOR,
            createdAt: new Date(new Date().getTime() - 1000),
            audit: {
              connect: {
                id: res.id,
              },
            },
          },
        ],
      },
    },
  });

  await prisma.auditors.update({
    where: {
      auditId_userId: {
        userId: users[5].id,
        auditId: res.id,
      },
    },
    data: {
      history: {
        create: [
          {
            action: HistoryAction.APPROVED,
            userType: UserType.AUDITOR,
            createdAt: new Date(new Date().getTime() - 3500),
            audit: {
              connect: {
                id: res.id,
              },
            },
          },
          {
            action: HistoryAction.FINDINGS,
            userType: UserType.AUDITOR,
            createdAt: new Date(new Date().getTime() - 100),
            audit: {
              connect: {
                id: res.id,
              },
            },
          },
        ],
      },
    },
  });

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // this one is finicky as we can't simulate a finished contract by fast-forwarding
  // time in contract reads on the frontend (we can simulate it as a standalone script).
  auditId = await bevorContract.generateAuditId(
    accounts[3].address,
    [accounts[2].address, accounts[5].address],
    7 * 24 * 60 * 60,
    70 * 24 * 60 * 60,
    "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
    2000,
    ERC20Abi.address,
    "I am salt",
  );

  await tokenContract.transfer(accounts[3].address, 2000);

  await bevorContract
    .connect(accounts[3])
    // @ts-expect-error not recognized, but works.
    .prepareAudit(
      [accounts[2].address, accounts[5].address],
      7 * 24 * 60 * 60,
      70 * 24 * 60 * 60,
      "example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj",
      2000,
      ERC20Abi.address,
      "I am salt",
    );

  tokenId = await bevorContract.generateTokenId(auditId, [
    "example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI",
    "example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI",
  ]);

  // @ts-expect-error not recognized, but works.
  await tokenContract.connect(accounts[3]).approve(BevorProtocolAbi.address, 2000);

  await bevorContract
    .connect(accounts[3])
    // @ts-expect-error not recognized, but works.
    .revealFindings(
      ["example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI", "example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI"],
      auditId,
    );

  res = await prisma.audits.create({
    data: {
      title: "Completed audit",
      description:
        "This audit is closed and will be viewable. Doesn't tell us if challengeable, \
that needs to come from on-chain, but I'll mark is as such",
      status: AuditStatus.FINALIZED,
      price: 2_000,
      duration: 70,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
      onchainAuditInfoId: BigInt(auditId as bigint).toString(),
      onchainNftId: BigInt(tokenId as bigint).toString(),
      auditee: {
        connect: {
          address: WALLETS[3],
        },
      },
      auditors: {
        create: [
          {
            status: AuditorStatus.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            user: {
              connect: {
                address: WALLETS[2],
              },
            },
            findings: `${process.env.BLOB_URL}/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md`,
          },
          {
            status: AuditorStatus.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            user: {
              connect: {
                address: WALLETS[5],
              },
            },
            findings: `${process.env.BLOB_URL}/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md`,
          },
        ],
      },
      history: {
        createMany: {
          data: [
            {
              action: HistoryAction.LOCKED,
              userType: UserType.AUDITEE,
              createdAt: new Date(new Date().getTime() - 4000),
            },
            {
              action: HistoryAction.FINALIZED,
              userType: UserType.AUDITEE,
              createdAt: new Date(new Date().getTime() - 2000),
            },
          ],
        },
      },
    },
  });

  await prisma.auditors.update({
    where: {
      auditId_userId: {
        userId: users[2].id,
        auditId: res.id,
      },
    },
    data: {
      history: {
        create: [
          {
            action: HistoryAction.APPROVED,
            userType: UserType.AUDITOR,
            createdAt: new Date(new Date().getTime() - 3600),
            audit: {
              connect: {
                id: res.id,
              },
            },
          },
          {
            action: HistoryAction.FINDINGS,
            userType: UserType.AUDITOR,
            createdAt: new Date(new Date().getTime() - 1000),
            audit: {
              connect: {
                id: res.id,
              },
            },
          },
        ],
      },
    },
  });

  await prisma.auditors.update({
    where: {
      auditId_userId: {
        userId: users[5].id,
        auditId: res.id,
      },
    },
    data: {
      history: {
        create: [
          {
            action: HistoryAction.APPROVED,
            userType: UserType.AUDITOR,
            createdAt: new Date(new Date().getTime() - 3500),
            audit: {
              connect: {
                id: res.id,
              },
            },
          },
          {
            action: HistoryAction.FINDINGS,
            userType: UserType.AUDITOR,
            createdAt: new Date(new Date().getTime() - 100),
            audit: {
              connect: {
                id: res.id,
              },
            },
          },
        ],
      },
    },
  });

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
