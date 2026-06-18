import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StatAllocator from "@/components/stats/StatAllocator";
import { Dumbbell, Brain, Wind, Shield } from "lucide-react";
import type { Stats } from "@prisma/client";

export const dynamic = "force-dynamic";

const STAT_CONFIG = [
  { key: "str" as keyof Stats, label: "Strength", abbr: "STR", icon: Dumbbell, color: "text-neon-red", description: "Physical power, gym performance, martial arts" },
  { key: "intel" as keyof Stats, label: "Intelligence", abbr: "INT", icon: Brain, color: "text-neon-blue", description: "Learning, coding, reading, skill acquisition" },
  { key: "agi" as keyof Stats, label: "Agility", abbr: "AGI", icon: Wind, color: "text-neon-green", description: "Speed, cardio, step count, flexibility" },
  { key: "wil" as keyof Stats, label: "Willpower", abbr: "WIL", icon: Shield, color: "text-neon-purple", description: "Discipline, habit adherence, focus, meditation" },
];

export default async function StatsPage() {
  const character = await prisma.character.findUnique({
    where: { id: 1 },
    include: { stats: true },
  });

  if (!character || !character.stats) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-border pb-4">
        <p className="text-muted text-xs tracking-widest uppercase font-semibold">System</p>
        <h1 className="font-display text-3xl font-bold text-foreground tracking-wide mt-1">
          Attributes
        </h1>
      </div>

      {character.unallocatedPoints > 0 && (
        <div className="bg-neon-yellow/10 border border-neon-yellow/40 clip-card p-4 animate-pulse-neon">
          <p className="font-display font-bold text-neon-yellow tracking-widest uppercase text-sm">
            ⚡ {character.unallocatedPoints} Stat Point{character.unallocatedPoints !== 1 ? "s" : ""} Available
          </p>
          <p className="text-muted text-xs mt-1">Earned from leveling up. Distribute them below.</p>
        </div>
      )}

      {/* Current stats */}
      <div className="bg-surface border border-border clip-card p-5 space-y-4">
        <p className="text-muted text-xs tracking-widest uppercase font-semibold border-l-2 border-neon-blue pl-2">Current Attributes</p>
        {STAT_CONFIG.map(({ key, label, abbr, icon: Icon, color, description }) => (
          <div key={key} className="flex items-center gap-4">
            <div className="w-8 flex-shrink-0">
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className={`font-display font-bold text-sm ${color}`}>{abbr}</span>
                  <span className="text-muted text-xs ml-2">{description}</span>
                </div>
                <span className={`font-display font-bold text-xl ${color}`}>
                  {character.stats![key] as number}
                </span>
              </div>
              <div className="h-1.5 bg-background border border-border overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${Math.min(((character.stats![key] as number) / 100) * 100, 100)}%`,
                    backgroundColor: color.includes("red") ? "#FF3B3B" : color.includes("blue") ? "#00BFFF" : color.includes("green") ? "#00FF94" : "#BF5FFF",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Allocator */}
      {character.unallocatedPoints > 0 && (
        <StatAllocator unallocatedPoints={character.unallocatedPoints} />
      )}

      {character.unallocatedPoints === 0 && (
        <p className="text-center text-muted text-sm py-4">
          No unallocated points. Keep leveling up to earn more!
        </p>
      )}
    </div>
  );
}
