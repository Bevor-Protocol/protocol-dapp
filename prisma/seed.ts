// import { Role, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma.server";

const seed = async (): Promise<void> => {
  // In practice, users will only be created once they've gotten a role
  // asigned. Anyone can visit the application, but we won't need a dashboard
  // page for these users.

  // Can update this to be your dev wallet.

  // This will serve as the auditee initially.
  const MY_WALLET1 = "0x239D3Ce2E15744C7EE6A76325c119C79BDa7aD7D";
  // This will serve as the auditor initially.
  const MY_WALLET2 = "0xe843D4315D34F200f97FA3dCCaB5D1184243bcA0";

  const userData = [
    {
      address: MY_WALLET1,
      auditeeRole: true,
      profile: {
        create: {
          name: "My dev wallet",
        },
      },
    },
    {
      address: MY_WALLET2,
      auditorRole: true,
      profile: {
        create: {
          name: "My rabby wallet",
        },
      },
    },
    {
      address: "0xc0ffee254729296a45a3885639AC7E10F9d54979",
      auditeeRole: true,
      auditorRole: true,
      profile: {
        create: {},
      },
    },
    {
      address: "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E",
      auditeeRole: true,
      profile: {
        create: {
          name: "Test User 1",
          available: true,
        },
      },
    },
    {
      address: "0x73F4aC126bF12DCe39080457FABdce9a43Bd1f70",
      auditorRole: true,
      profile: {
        create: {
          name: "Test User 2",
          image: "https://cdn-images-1.medium.com/max/1200/1*Ty6tR7qRtx6yo3dM_drJBg.png",
        },
      },
    },
    {
      address: "0x3A1D14c5B007f2aC5a5e174663Eb3e69C78ADbB5",
      auditorRole: true,
      profile: {
        create: {},
      },
    },
  ];

  await prisma.$transaction(
    userData.map((user) =>
      prisma.user.create({
        data: {
          ...user,
        },
      }),
    ),
  );
  console.log("Seeded Users");

  // NEWLY GENERATED AUDITS. NOT LOCKED, NOT FINAL

  // Include yourself as auditee.
  await prisma.audit.create({
    data: {
      title: "Empty audit - Open",
      description: "This is for my dev wallet, but has no auditors yet.",
      auditee: {
        connect: {
          address: MY_WALLET1,
        },
      },
      terms: {
        create: {},
      },
    },
  });

  await prisma.audit.create({
    data: {
      title: "Requested Audit - Open",
      description:
        "This is for my dev wallet, but my other wallet had requested to audit. It's still open.",
      auditee: {
        connect: {
          address: MY_WALLET1,
        },
      },
      terms: {
        create: {
          price: 10_000,
          duration: 3,
        },
      },
      requests: {
        connect: [
          {
            address: MY_WALLET2,
          },
        ],
      },
    },
  });

  await prisma.audit.create({
    data: {
      title: "Auditor Audit - Open",
      description:
        "This is for my dev wallet, but my other wallet is fully an auditor. It's still open.",
      auditee: {
        connect: {
          address: MY_WALLET1,
        },
      },
      terms: {
        create: {
          price: 100_000,
          duration: 10,
        },
      },
      auditors: {
        connect: [
          {
            address: MY_WALLET2,
          },
        ],
      },
    },
  });

  await prisma.audit.create({
    data: {
      title: "Auditor Audit - Locked",
      description:
        "This is for my dev wallet, but my other wallet is fully an auditor. It's locked.",
      isLocked: true,
      auditee: {
        connect: {
          address: MY_WALLET1,
        },
      },
      terms: {
        create: {
          price: 20_000,
          duration: 5,
        },
      },
      auditors: {
        connect: [
          {
            address: MY_WALLET2,
          },
        ],
      },
      termsAccepted: {
        create: [
          {
            user: {
              connect: {
                address: MY_WALLET2,
              },
            },
          },
        ],
      },
    },
  });

  await prisma.audit.create({
    data: {
      title: "Auditor Audit - Locked, Rejected",
      description:
        "This is for my dev wallet, but my other wallet is fully an auditor. \
Terms were attested to, but they were rejected (by my other wallet)",
      isLocked: true,
      auditee: {
        connect: {
          address: MY_WALLET1,
        },
      },
      terms: {
        create: {
          price: 20_000,
          duration: 5,
        },
      },
      auditors: {
        connect: [
          {
            address: MY_WALLET2,
          },
        ],
      },
      termsAccepted: {
        create: [
          {
            user: {
              connect: {
                address: MY_WALLET2,
              },
            },
            hasAttested: true,
          },
        ],
      },
    },
  });

  await prisma.audit.create({
    data: {
      title: "Auditor Audit - Locked, Accepted",
      description:
        "This is for my dev wallet, but my other wallet is fully an auditor. \
Terms were attested to and agreed on (by my other wallet)",
      isLocked: true,
      auditee: {
        connect: {
          address: MY_WALLET1,
        },
      },
      terms: {
        create: {
          price: 20_000,
          duration: 5,
        },
      },
      auditors: {
        connect: [
          {
            address: MY_WALLET2,
          },
        ],
      },
      termsAccepted: {
        create: [
          {
            user: {
              connect: {
                address: MY_WALLET2,
              },
            },
            hasAttested: true,
            hasAccepted: true,
          },
        ],
      },
    },
  });

  await prisma.audit.create({
    data: {
      title: "Random Auditee Audit - Open",
      description: "This audit was created but doesn't have any designated auditors yet.",
      auditee: {
        connect: {
          address: "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E",
        },
      },
      terms: {
        create: {},
      },
    },
  });

  await prisma.audit.create({
    data: {
      title: "Random Auditee Audit - Open",
      description: "Audit has an auditor and a request but isn't locked yet",
      auditee: {
        connect: {
          address: "0xc0ffee254729296a45a3885639AC7E10F9d54979",
        },
      },
      auditors: {
        connect: [
          {
            address: "0x73F4aC126bF12DCe39080457FABdce9a43Bd1f70",
          },
        ],
      },
      terms: {
        create: {
          price: 10_000,
          duration: 3,
        },
      },
      requests: {
        connect: [
          {
            address: MY_WALLET2,
          },
        ],
      },
    },
  });

  // audit is locked. Can't update terms or auditor set.
  await prisma.audit.create({
    data: {
      title: "Contains an auditor",
      description: "This audit was created and already has an auditor",
      isLocked: true,
      auditee: {
        connect: {
          address: "0xc0ffee254729296a45a3885639AC7E10F9d54979",
        },
      },
      auditors: {
        connect: [
          {
            address: "0x73F4aC126bF12DCe39080457FABdce9a43Bd1f70",
          },
        ],
      },
      terms: {
        create: {
          price: 10_000,
          duration: 3,
        },
      },
      termsAccepted: {
        create: [
          {
            user: {
              connect: {
                address: "0x73F4aC126bF12DCe39080457FABdce9a43Bd1f70",
              },
            },
            hasAttested: true,
            hasAccepted: true,
          },
        ],
      },
    },
  });

  // FINALIZED AUDIT
  await prisma.audit.create({
    data: {
      title: "Completed audit",
      description: "This audit is closed and will be viewable",
      isLocked: true,
      isFinal: true,
      auditee: {
        connect: {
          address: "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E",
        },
      },
      auditors: {
        connect: [
          {
            address: "0xc0ffee254729296a45a3885639AC7E10F9d54979",
          },
          {
            address: "0x3A1D14c5B007f2aC5a5e174663Eb3e69C78ADbB5",
          },
        ],
      },
      terms: {
        create: {
          price: 2_000,
          duration: 5,
        },
      },
      termsAccepted: {
        create: [
          {
            user: {
              connect: {
                address: "0xc0ffee254729296a45a3885639AC7E10F9d54979",
              },
            },
            hasAttested: true,
            hasAccepted: true,
          },
          {
            user: {
              connect: {
                address: "0x3A1D14c5B007f2aC5a5e174663Eb3e69C78ADbB5",
              },
            },
            hasAttested: true,
            hasAccepted: true,
          },
        ],
      },
    },
  });
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
