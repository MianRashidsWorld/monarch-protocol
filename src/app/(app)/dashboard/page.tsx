import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CharacterCard from "@/components/character/CharacterCard";
import XPBar from "@/components/character/XPBar";
import HPMPBars from "@/components/character/HPMPBars";
import StatGrid from "@/components/character/StatGrid";
import { xpToNextLevel } from "@/lib/game/xp";
import { getTitleForLevel } from "@/lib/game/ranks";
import RecentActivity from "@/components/character/RecentActivity";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const character = await prisma.character.findUnique({
    where: { id: 1 },
    include: { stats: true },
  });

  if (!character || !character.stats) notFound();

  const recentLogs = await prisma.questLog.findMany({
    where: { characterId: 1 },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { quest: true, habit: true },
  });

  const xpNeeded = xpToNextLevel(character.level);
  const title = getTitleForLevel(character.level);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page header */}
      <div className="border-b border-border pb-4">
        <p className="text-muted text-xs tracking-widest uppercase font-semibold">System</p>
        <h1 className="font-display text-3xl font-bold text-foreground tracking-wide mt-1">
          Character Sheet
        </h1>
      </div>

      {/* Top row: Character Card + HP/MP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CharacterCard
          name={character.name}
          level={character.level}
          title={title}
          gold={character.gold}
          unallocatedPoints={character.unallocatedPoints}
        />
        <HPMPBars
          hp={character.hp}
          hpMax={character.hpMax}
          mp={character.mp}
          mpMax={character.mpMax}
        />
      </div>

      {/* XP Bar */}
      <XPBar currentXp={character.xp} xpNeeded={xpNeeded} level={character.level} />

      {/* Stats */}
      <StatGrid stats={character.stats} />

      {/* Recent Activity */}
      <RecentActivity logs={recentLogs} />
    </div>
  );
}
