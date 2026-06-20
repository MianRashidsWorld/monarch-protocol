"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { processXpGain, hpMaxForLevel, mpMaxForLevel } from "@/lib/game/xp";
import { Recurrence } from "@prisma/client";
import { HABIT_TEMPLATES } from "@/lib/game/templates";

const createHabitSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  recurrence: z.nativeEnum(Recurrence),
  xpReward: z.coerce.number().int().min(1).max(500),
  goldReward: z.coerce.number().int().min(0).max(200),
  hpPenalty: z.coerce.number().int().min(0).max(50),
});

export type CreateHabitState = { error?: string; success?: boolean };

export async function createHabit(
  _prev: CreateHabitState,
  formData: FormData
): Promise<CreateHabitState> {
  const parsed = createHabitSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    recurrence: formData.get("recurrence"),
    xpReward: formData.get("xpReward"),
    goldReward: formData.get("goldReward"),
    hpPenalty: formData.get("hpPenalty"),
  });

  if (!parsed.success) {
    const errs = parsed.error.flatten().fieldErrors;
    return { error: Object.values(errs)[0]?.[0] ?? "Invalid input." };
  }

  await prisma.habit.create({
    data: { characterId: 1, ...parsed.data },
  });

  revalidatePath("/habits");
  return { success: true };
}

export async function checkHabit(habitId: number): Promise<{ error?: string; leveledUp?: boolean; newLevel?: number }> {
  return await prisma.$transaction(async (tx) => {
    const habit = await tx.habit.findFirst({
      where: { id: habitId, characterId: 1, status: "ACTIVE" },
    });

    if (!habit) return { error: "Habit not found." };

    if (habit.lastCheckedAt) {
      const now = new Date();
      const last = new Date(habit.lastCheckedAt);
      if (habit.recurrence === "DAILY") {
        const sameDay =
          last.getFullYear() === now.getFullYear() &&
          last.getMonth() === now.getMonth() &&
          last.getDate() === now.getDate();
        if (sameDay) return { error: "Already completed today." };
      } else {
        const diffMs = now.getTime() - last.getTime();
        if (diffMs < 7 * 24 * 60 * 60 * 1000) return { error: "Already completed this week." };
      }
    }

    const character = await tx.character.findUniqueOrThrow({ where: { id: 1 } });

    const newStreak = habit.streak + 1;
    const newLongestStreak = Math.max(newStreak, habit.longestStreak);

    await tx.habit.update({
      where: { id: habitId },
      data: { streak: newStreak, longestStreak: newLongestStreak, lastCheckedAt: new Date() },
    });

    const { newXp, newLevel, leveledUp, levelsGained, statPointsGranted } = processXpGain(
      character.xp,
      character.level,
      habit.xpReward
    );

    const newHpMax = hpMaxForLevel(newLevel);
    const newMpMax = mpMaxForLevel(newLevel);

    await tx.character.update({
      where: { id: 1 },
      data: {
        xp: newXp,
        level: newLevel,
        gold: { increment: habit.goldReward },
        hpMax: newHpMax,
        mpMax: newMpMax,
        hp: leveledUp ? newHpMax : Math.min(character.hp, newHpMax),
        mp: leveledUp ? newMpMax : Math.min(character.mp, newMpMax),
        unallocatedPoints: { increment: statPointsGranted },
      },
    });

    await tx.questLog.create({
      data: {
        characterId: 1,
        habitId,
        event: "HABIT_COMPLETE",
        xpDelta: habit.xpReward,
        goldDelta: habit.goldReward,
        note: `Streak: ${newStreak}`,
      },
    });

    if (leveledUp) {
      await tx.questLog.create({
        data: { characterId: 1, event: "LEVEL_UP", note: `Reached level ${newLevel}` },
      });
    }

    revalidatePath("/habits");
    revalidatePath("/dashboard");

    return { leveledUp, newLevel };
  });
}

export async function uncheckHabit(habitId: number): Promise<{ error?: string }> {
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, characterId: 1, status: "ACTIVE" },
  });
  if (!habit) return { error: "Habit not found." };

  await prisma.habit.update({
    where: { id: habitId },
    data: {
      lastCheckedAt: null,
      streak: Math.max(0, habit.streak - 1),
    },
  });

  revalidatePath("/habits");
  return {};
}

export async function retireHabit(habitId: number): Promise<{ error?: string }> {
  await prisma.habit.update({
    where: { id: habitId, characterId: 1 },
    data: { status: "COMPLETED" },
  });
  revalidatePath("/habits");
  return {};
}

export async function failHabit(habitId: number): Promise<{ error?: string }> {
  await prisma.habit.update({
    where: { id: habitId, characterId: 1 },
    data: { status: "FAILED" },
  });
  revalidatePath("/habits");
  return {};
}

export async function reactivateHabit(habitId: number): Promise<{ error?: string }> {
  await prisma.habit.update({
    where: { id: habitId, characterId: 1 },
    data: { status: "ACTIVE" },
  });
  revalidatePath("/habits");
  return {};
}

export async function deleteHabit(habitId: number): Promise<{ error?: string }> {
  await prisma.$transaction([
    prisma.questLog.updateMany({ where: { habitId }, data: { habitId: null } }),
    prisma.habit.delete({ where: { id: habitId } }),
  ]);
  revalidatePath("/habits");
  return {};
}

export async function addHabitFromTemplate(templateId: string): Promise<{ error?: string }> {
  const template = HABIT_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return { error: "Template not found." };

  await prisma.habit.create({
    data: {
      characterId: 1,
      title: template.title,
      description: template.description,
      recurrence: template.recurrence,
      xpReward: template.xpReward,
      goldReward: template.goldReward,
      hpPenalty: template.hpPenalty,
    },
  });

  revalidatePath("/habits");
  return {};
}
