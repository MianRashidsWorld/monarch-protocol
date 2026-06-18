import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Upsert the single character (id=1 is always the one user)
  await prisma.character.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      name: "Shadow Monarch",
      stats: {
        create: { str: 5, intel: 5, agi: 5, wil: 5 },
      },
    },
    update: {},
  });

  // Seed a few starter rewards
  const starterRewards = [
    { title: "Watch an anime episode", description: "30 min screen time reward", cost: 30 },
    { title: "Order takeout", description: "Skip cooking for a night", cost: 100 },
    { title: "Buy a game", description: "New game purchase", cost: 300 },
    { title: "Rest day", description: "Full day off training", cost: 150 },
  ];

  for (const reward of starterRewards) {
    await prisma.reward.upsert({
      where: { id: starterRewards.indexOf(reward) + 1 },
      create: reward,
      update: {},
    });
  }

  console.log("Seed complete. Character #1 ready.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
