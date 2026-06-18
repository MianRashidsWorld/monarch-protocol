import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

// Protected cron endpoint — call with:  Authorization: Bearer <CRON_SECRET>
// Checks all active habits for missed completions and applies HP penalty
export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const dailyThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const weeklyThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const overdueHabits = await prisma.habit.findMany({
    where: {
      characterId: 1,
      isActive: true,
      OR: [
        // Never checked
        { lastCheckedAt: null },
        // Daily: not checked in 24h
        { recurrence: "DAILY", lastCheckedAt: { lt: dailyThreshold } },
        // Weekly: not checked in 7 days
        { recurrence: "WEEKLY", lastCheckedAt: { lt: weeklyThreshold } },
      ],
    },
  });

  if (overdueHabits.length === 0) {
    return NextResponse.json({ processed: 0, message: "All habits up to date." });
  }

  const character = await prisma.character.findUniqueOrThrow({ where: { id: 1 } });
  const totalPenalty = overdueHabits.reduce((sum, h) => sum + h.hpPenalty, 0);
  const newHp = Math.max(0, character.hp - totalPenalty);

  await prisma.$transaction([
    // Reset streaks for overdue habits
    ...overdueHabits.map((habit) =>
      prisma.habit.update({
        where: { id: habit.id },
        data: { streak: 0 },
      })
    ),
    // Deduct HP
    prisma.character.update({
      where: { id: 1 },
      data: { hp: newHp },
    }),
    // Log each failure
    ...overdueHabits.map((habit) =>
      prisma.questLog.create({
        data: {
          characterId: 1,
          habitId: habit.id,
          event: "HABIT_FAIL",
          hpDelta: -habit.hpPenalty,
          note: "Streak broken",
        },
      })
    ),
  ]);

  return NextResponse.json({
    processed: overdueHabits.length,
    hpLost: totalPenalty,
    newHp,
    habits: overdueHabits.map((h) => h.title),
  });
}
