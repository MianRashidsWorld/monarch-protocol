"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const createRewardSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  cost: z.coerce.number().int().min(1).max(10000),
});

export type CreateRewardState = { error?: string; success?: boolean };

export async function createReward(
  _prev: CreateRewardState,
  formData: FormData
): Promise<CreateRewardState> {
  const parsed = createRewardSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    cost: formData.get("cost"),
  });

  if (!parsed.success) {
    return { error: Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ?? "Invalid input." };
  }

  await prisma.reward.create({ data: parsed.data });

  revalidatePath("/shop");
  return { success: true };
}

export async function redeemReward(rewardId: number): Promise<{ error?: string; success?: boolean }> {
  return await prisma.$transaction(async (tx) => {
    const reward = await tx.reward.findFirst({
      where: { id: rewardId, isAvailable: true },
    });

    if (!reward) return { error: "Reward not found or unavailable." };

    const character = await tx.character.findUniqueOrThrow({ where: { id: 1 } });

    if (character.gold < reward.cost) {
      return { error: `Insufficient Gold. Need ${reward.cost}G, have ${character.gold}G.` };
    }

    await tx.character.update({
      where: { id: 1 },
      data: { gold: { decrement: reward.cost } },
    });

    await tx.rewardRedemption.create({
      data: { characterId: 1, rewardId, goldSpent: reward.cost },
    });

    await tx.questLog.create({
      data: {
        characterId: 1,
        event: "REWARD_REDEEMED",
        goldDelta: -reward.cost,
        note: reward.title,
      },
    });

    revalidatePath("/shop");
    revalidatePath("/dashboard");

    return { success: true };
  });
}
