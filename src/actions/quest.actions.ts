"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { processXpGain, hpMaxForLevel, mpMaxForLevel } from "@/lib/game/xp";
import { RANK_CONFIG } from "@/lib/game/ranks";
import { QuestRank, StatCategory } from "@prisma/client";
import { QUEST_TEMPLATES } from "@/lib/game/templates";
import { STAT_BONUS, STAT_FIELD } from "@/lib/game/stats";

const createQuestSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  rank: z.nativeEnum(QuestRank),
  dueAt: z.string().optional(),
  statCategory: z.preprocess(
    (v) => (v === "" || v == null ? null : v),
    z.nativeEnum(StatCategory).nullable()
  ),
});

export type CreateQuestState = { error?: string; success?: boolean };

export async function createQuest(
  _prev: CreateQuestState,
  formData: FormData
): Promise<CreateQuestState> {
  const parsed = createQuestSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    rank: formData.get("rank"),
    dueAt: formData.get("dueAt") || undefined,
    statCategory: formData.get("statCategory"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors.title?.[0] ?? "Invalid input." };
  }

  const { title, description, rank, dueAt, statCategory } = parsed.data;
  const rankConfig = RANK_CONFIG[rank];

  await prisma.quest.create({
    data: {
      characterId: 1,
      title,
      description,
      rank,
      statCategory,
      xpReward: rankConfig.xp,
      goldReward: rankConfig.gold,
      dueAt: dueAt ? new Date(dueAt) : undefined,
    },
  });

  revalidatePath("/quests");
  return { success: true };
}

export type CompleteQuestResult = {
  error?: string;
  leveledUp?: boolean;
  newLevel?: number;
  levelsGained?: number;
};

export async function completeQuest(questId: number): Promise<CompleteQuestResult> {
  return await prisma.$transaction(async (tx) => {
    const quest = await tx.quest.findFirst({
      where: { id: questId, characterId: 1, status: "ACTIVE" },
    });

    if (!quest) return { error: "Quest not found or already completed." };

    const character = await tx.character.findUniqueOrThrow({ where: { id: 1 } });

    const { newXp, newLevel, leveledUp, levelsGained } =
      processXpGain(character.xp, character.level, quest.xpReward);

    const newHpMax = hpMaxForLevel(newLevel);
    const newMpMax = mpMaxForLevel(newLevel);

    await tx.quest.update({
      where: { id: questId },
      data: { status: "COMPLETED", completedAt: new Date() },
    });

    await tx.character.update({
      where: { id: 1 },
      data: {
        xp: newXp,
        level: newLevel,
        gold: { increment: quest.goldReward },
        hpMax: newHpMax,
        mpMax: newMpMax,
        hp: leveledUp ? newHpMax : Math.min(character.hp, newHpMax),
        mp: leveledUp ? newMpMax : Math.min(character.mp, newMpMax),
      },
    });

    if (quest.statCategory) {
      await tx.stats.update({
        where: { characterId: 1 },
        data: { [STAT_FIELD[quest.statCategory]]: { increment: STAT_BONUS } },
      });
    }

    await tx.questLog.create({
      data: {
        characterId: 1,
        questId,
        event: "QUEST_COMPLETE",
        xpDelta: quest.xpReward,
        goldDelta: quest.goldReward,
        note: quest.statCategory
          ? `+${STAT_BONUS} ${STAT_FIELD[quest.statCategory].toUpperCase()}`
          : undefined,
      },
    });

    if (leveledUp) {
      await tx.questLog.create({
        data: {
          characterId: 1,
          event: "LEVEL_UP",
          note: `Reached level ${newLevel}`,
        },
      });
    }

    revalidatePath("/quests");
    revalidatePath("/dashboard");

    return { leveledUp, newLevel, levelsGained };
  });
}

export async function failQuest(questId: number): Promise<{ error?: string }> {
  const quest = await prisma.quest.findFirst({
    where: { id: questId, characterId: 1, status: "ACTIVE" },
  });

  if (!quest) return { error: "Quest not found." };

  await prisma.$transaction([
    prisma.quest.update({
      where: { id: questId },
      data: { status: "FAILED" },
    }),
    prisma.questLog.create({
      data: {
        characterId: 1,
        questId,
        event: "QUEST_FAIL",
      },
    }),
  ]);

  revalidatePath("/quests");
  revalidatePath("/dashboard");
  return {};
}

export async function deleteQuest(questId: number): Promise<{ error?: string }> {
  await prisma.quest.delete({ where: { id: questId, characterId: 1 } });
  revalidatePath("/quests");
  return {};
}

export async function reactivateQuest(questId: number): Promise<{ error?: string }> {
  await prisma.quest.update({
    where: { id: questId, characterId: 1 },
    data: { status: "ACTIVE", completedAt: null },
  });
  revalidatePath("/quests");
  return {};
}

export async function addQuestFromTemplate(templateId: string): Promise<{ error?: string }> {
  const template = QUEST_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return { error: "Template not found." };

  const rankConfig = RANK_CONFIG[template.rank];

  await prisma.quest.create({
    data: {
      characterId: 1,
      title: template.title,
      description: template.description,
      rank: template.rank,
      statCategory: template.statCategory,
      xpReward: rankConfig.xp,
      goldReward: rankConfig.gold,
    },
  });

  revalidatePath("/quests");
  return {};
}
