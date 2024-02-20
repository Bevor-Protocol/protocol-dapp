import { prisma } from "@/lib/db/prisma.server";

const seed = async (): Promise<void> => {
  await prisma.user.upsert({
    where: {
      address: "0x600518fBA531148cb8ef4Ae52B6B28F0932acD2A",
    },
    update: {},
    create: {
      address: "0x600518fBA531148cb8ef4Ae52B6B28F0932acD2A",
      profile: {
        create: {
          name: "This is my name",
          available: false,
        },
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
