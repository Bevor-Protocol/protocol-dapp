// import { Role, Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma.server";
import { AuditorStatus, AuditStatus, HistoryAction, UserType } from "@prisma/client";

const seed = async (): Promise<void> => {
  // In practice, users will only be created once they've gotten a role
  // asigned. Anyone can visit the application, but we won't need a dashboard
  // page for these users.

  if (!process.env.BLOB_URL) {
    throw new Error("must set the BLOB_URL (vercel blob url prefix)");
  }

  // Wallets used align with the hardhat dev config, which are consistent given the mnemonic in the config.
  // Check bevor-v1 repo. We'll use the first 10 returned addresses.

  const WALLETS = [
    "0x97a25B755D6Df6e171d03B46F16D9b806827fcCd",
    "0x371dD800749329f81Ca39AFD856f90419C62Be16",
    "0x9C3f8EF6079C493aD85D59D53E10995B934eEf1d",
    "0x13F51E771343F775aEcECb1623C00514bB528da4",
    "0x8Fd14efbD661B620AfAC161A75d91cF545D02352",
    "0xA3c9AF67cFA0674B82A83d14Ac8e8c3564823462",
    "0x7f0996884dBF28C113B0DE279c497085673Df52d",
    "0xA02B5EFa27E9a0E1252f3304fB64D3A777747A16",
    "0x7a622712648eDA8747f308132E874e8e53Ae2C09",
    "0x4BBfBb6aa2C44bE94000aC443004ED8CBD5cc202",
  ];

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
      duration: 3,
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
      duration: 3,
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
      duration: 5,
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
      duration: 5,
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
      duration: 5,
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

  res = await prisma.audits.create({
    data: {
      title: "Auditor Audit - Locked, Accepted, 1 Findings Submitted",
      description: "Ongoing, 2 auditors, 1 findings submitted, 1 pending.",
      status: AuditStatus.AUDITING,
      price: 20_000,
      duration: 5,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
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

  res = await prisma.audits.create({
    data: {
      title: "Auditor Audit - Ready for on-chain",
      description: "Ongoing, all parties submitted findings. Can be pushed on-chain",
      status: AuditStatus.AUDITING,
      price: 20_000,
      duration: 5,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
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
      duration: 3,
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

  res = await prisma.audits.create({
    data: {
      title: "Completed audit",
      description:
        "This audit is closed and will be viewable. Doesn't tell us if challengeable, \
that needs to come from on-chain",
      status: AuditStatus.CHALLENGEABLE,
      price: 2_000,
      duration: 5,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
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

  res = await prisma.audits.create({
    data: {
      title: "Completed audit",
      description:
        "This audit is closed and will be viewable. Doesn't tell us if challengeable, \
that needs to come from on-chain, but I'll mark is as such",
      status: AuditStatus.FINALIZED,
      price: 2_000,
      duration: 5,
      details: `${process.env.BLOB_URL}/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md`,
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
