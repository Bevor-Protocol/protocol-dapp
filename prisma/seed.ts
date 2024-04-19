// import { Role, Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma.server";
import { AuditorStatus, AuditStatus } from "@prisma/client";

const seed = async (): Promise<void> => {
  // In practice, users will only be created once they've gotten a role
  // asigned. Anyone can visit the application, but we won't need a dashboard
  // page for these users.

  // Can update this to be your dev wallet.

  // This will serve as the auditee initially.
  const MY_WALLET1 = process.env.MY_WALLET_AUDITEE;
  // This will serve as the auditor initially.
  const MY_WALLET2 = process.env.MY_WALLET_AUDITOR;
  if (!MY_WALLET1 || !MY_WALLET2) {
    throw new Error("must set 2 wallets in the .env file");
  }

  const userData = [
    {
      address: MY_WALLET1,
      auditeeRole: true,
      name: "My dev wallet",
    },
    {
      address: MY_WALLET2,
      auditorRole: true,
      name: "My rabby wallet",
    },
    {
      address: "0xc0ffee254729296a45a3885639AC7E10F9d54979",
      auditeeRole: true,
      auditorRole: true,
    },
    {
      address: "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E",
      auditeeRole: true,
      name: "Test User 1",
      available: true,
    },
    {
      address: "0x73F4aC126bF12DCe39080457FABdce9a43Bd1f70",
      auditorRole: true,
      name: "Test User 2",
      image: "https://cdn-images-1.medium.com/max/1200/1*Ty6tR7qRtx6yo3dM_drJBg.png",
    },
    {
      address: "0x3A1D14c5B007f2aC5a5e174663Eb3e69C78ADbB5",
      auditorRole: true,
      available: true,
    },
  ];

  await prisma.$transaction(
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

  // Include yourself as auditee.
  await prisma.audits.create({
    data: {
      title: "Empty audit - Open",
      description: "Open, no requestors, no auditors, no details provided",
      auditee: {
        connect: {
          address: MY_WALLET1,
        },
      },
    },
  });

  await prisma.audits.create({
    data: {
      title: "Requested Audit - Open",
      description: "Open, 1 requestor, no auditors, details provided",
      price: 10_000,
      duration: 3,
      details:
        "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md",
      auditee: {
        connect: {
          address: MY_WALLET1,
        },
      },
      auditors: {
        create: {
          status: AuditorStatus.REQUESTED,
          user: {
            connect: {
              address: MY_WALLET2,
            },
          },
        },
      },
    },
  });

  await prisma.audits.create({
    data: {
      title: "Auditor Audit - Open",
      description: "Open, 1 auditor, no details",
      price: 10_000,
      duration: 3,
      auditee: {
        connect: {
          address: MY_WALLET1,
        },
      },
      auditors: {
        create: {
          status: AuditorStatus.VERIFIED,
          user: {
            connect: {
              address: MY_WALLET2,
            },
          },
        },
      },
    },
  });

  await prisma.audits.create({
    data: {
      title: "Auditor Audit - Locked",
      description: "Locked, 1 auditor, has not attested, details provided",
      price: 20_000,
      duration: 5,
      details:
        "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md",
      status: AuditStatus.ATTESTATION,
      auditee: {
        connect: {
          address: MY_WALLET1,
        },
      },
      auditors: {
        create: {
          status: AuditorStatus.VERIFIED,
          user: {
            connect: {
              address: MY_WALLET2,
            },
          },
        },
      },
    },
  });

  await prisma.audits.create({
    data: {
      title: "Auditor Audit - Locked, Rejected",
      description: "Locked, 1 auditor, rejected terms, detailed provided.",
      price: 20_000,
      duration: 5,
      details:
        "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md",
      status: AuditStatus.ATTESTATION,
      auditee: {
        connect: {
          address: MY_WALLET1,
        },
      },
      auditors: {
        create: {
          status: AuditorStatus.VERIFIED,
          attestedTerms: true,
          acceptedTerms: false,
          user: {
            connect: {
              address: MY_WALLET2,
            },
          },
        },
      },
    },
  });

  await prisma.audits.create({
    data: {
      title: "Auditor Audit - Locked, Accepted",
      description: "Locked, 1 auditor, accepted terms, details provided. Can be kicked off.",
      status: AuditStatus.ATTESTATION,
      price: 20_000,
      duration: 5,
      details:
        "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md",
      auditee: {
        connect: {
          address: MY_WALLET1,
        },
      },
      auditors: {
        create: {
          status: AuditorStatus.VERIFIED,
          attestedTerms: true,
          acceptedTerms: true,
          user: {
            connect: {
              address: MY_WALLET2,
            },
          },
        },
      },
    },
  });

  await prisma.audits.create({
    data: {
      title: "Auditor Audit - Locked, Accepted, 1 Findings Submitted",
      description: "Ongoing, 2 auditors, 1 findings submitted, 1 pending.",
      status: AuditStatus.AUDITING,
      price: 20_000,
      duration: 5,
      details:
        "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md",
      auditee: {
        connect: {
          address: MY_WALLET1,
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
                address: MY_WALLET2,
              },
            },
          },
          {
            status: AuditorStatus.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            user: {
              connect: {
                address: "0x73F4aC126bF12DCe39080457FABdce9a43Bd1f70",
              },
            },
            findings:
              "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md",
          },
        ],
      },
    },
  });

  await prisma.audits.create({
    data: {
      title: "Auditor Audit - Ready for on-chain",
      description: "Ongoing, all parties submitted findings. Can be pushed on-chain",
      status: AuditStatus.AUDITING,
      price: 20_000,
      duration: 5,
      details:
        "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md",
      auditee: {
        connect: {
          address: MY_WALLET1,
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
                address: MY_WALLET2,
              },
            },
            findings:
              "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md",
          },
          {
            status: AuditorStatus.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            user: {
              connect: {
                address: "0x73F4aC126bF12DCe39080457FABdce9a43Bd1f70",
              },
            },
            findings:
              "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md",
          },
        ],
      },
    },
  });

  await prisma.audits.create({
    data: {
      title: "Random Auditee Audit - Open",
      description: "Open, no requestors, no auditors, no details",
      auditee: {
        connect: {
          address: "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E",
        },
      },
    },
  });

  await prisma.audits.create({
    data: {
      title: "Random Auditee Audit - Open",
      description: "Open, 1 requestor, 1 auditor, details provided",
      price: 10_000,
      duration: 3,
      details:
        "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md",
      auditee: {
        connect: {
          address: "0xc0ffee254729296a45a3885639AC7E10F9d54979",
        },
      },
      auditors: {
        create: [
          {
            status: AuditorStatus.VERIFIED,
            user: {
              connect: {
                address: "0x73F4aC126bF12DCe39080457FABdce9a43Bd1f70",
              },
            },
          },
          {
            status: AuditorStatus.REQUESTED,
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

  await prisma.audits.create({
    data: {
      title: "Contains an auditor",
      description: "Locked, 1 auditor accepted terms, can be kicked off",
      status: AuditStatus.ATTESTATION,
      price: 10_000,
      duration: 3,
      details:
        "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md",
      auditee: {
        connect: {
          address: "0xc0ffee254729296a45a3885639AC7E10F9d54979",
        },
      },
      auditors: {
        create: {
          status: AuditorStatus.VERIFIED,
          attestedTerms: true,
          acceptedTerms: true,
          user: {
            connect: {
              address: "0x73F4aC126bF12DCe39080457FABdce9a43Bd1f70",
            },
          },
        },
      },
    },
  });

  await prisma.audits.create({
    data: {
      title: "Completed audit",
      description: "Kicked off, 1 auditor completed audit, 1 has not",
      status: AuditStatus.AUDITING,
      price: 2_000,
      duration: 5,
      details:
        "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md",
      auditee: {
        connect: {
          address: "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E",
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
                address: "0xc0ffee254729296a45a3885639AC7E10F9d54979",
              },
            },
            findings:
              "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md",
          },
          {
            status: AuditorStatus.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            user: {
              connect: {
                address: "0x3A1D14c5B007f2aC5a5e174663Eb3e69C78ADbB5",
              },
            },
          },
        ],
      },
    },
  });

  await prisma.audits.create({
    data: {
      title: "Completed audit",
      description:
        "This audit is closed and will be viewable. Doesn't tell us if challengeable, \
that needs to come from on-chain",
      status: AuditStatus.CHALLENGEABLE,
      price: 2_000,
      duration: 5,
      details:
        "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md",
      auditee: {
        connect: {
          address: "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E",
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
                address: "0xc0ffee254729296a45a3885639AC7E10F9d54979",
              },
            },
            findings:
              "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md",
          },
          {
            status: AuditorStatus.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            user: {
              connect: {
                address: "0x3A1D14c5B007f2aC5a5e174663Eb3e69C78ADbB5",
              },
            },
            findings:
              "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md",
          },
        ],
      },
    },
  });

  await prisma.audits.create({
    data: {
      title: "Completed audit",
      description:
        "This audit is closed and will be viewable, is not challengeable. Doesn't tell us if challengeable, \
that needs to come from on-chain",
      status: AuditStatus.FINALIZED,
      price: 2_000,
      duration: 5,
      details:
        "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-details/example-7Ap1GR49l2yVbJtvIJ0dVnleKuM8pj.md",
      auditee: {
        connect: {
          address: "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E",
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
                address: "0xc0ffee254729296a45a3885639AC7E10F9d54979",
              },
            },
            findings:
              "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md",
          },
          {
            status: AuditorStatus.VERIFIED,
            attestedTerms: true,
            acceptedTerms: true,
            user: {
              connect: {
                address: "0x3A1D14c5B007f2aC5a5e174663Eb3e69C78ADbB5",
              },
            },
            findings:
              "https://v0ycfji0st2gd9rf.public.blob.vercel-storage.com/audit-findings/example-q0D5zQMv65hQJ4mWfJfstcnagI5kUI.md",
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
