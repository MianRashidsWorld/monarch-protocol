import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Dumbbell, Brain, Wind, Shield } from "lucide-react";
import type { Stats } from "@prisma/client";

export const dynamic = "force-dynamic";

const STAT_CONFIG = [
  { key: "str" as keyof Stats, label: "Strength", abbr: "STR", icon: Dumbbell, color: "text-neon-red", barColor: "#FF3B3B", description: "Gym training, martial arts, strength work" },
  { key: "intel" as keyof Stats, label: "Intelligence", abbr: "INT", icon: Brain, color: "text-neon-blue", barColor: "#00BFFF", description: "Studying, reading, certifications" },
  { key: "agi" as keyof Stats, label: "Agility", abbr: "AGI", icon: Wind, color: "text-neon-green", barColor: "#00FF94", description: "Cardio, running, cycling, steps" },
  { key: "wil" as keyof Stats, label: "Willpower", abbr: "WIL", icon: Shield, color: "text-neon-purple", barColor: "#BF5FFF", description: "Sleep, diet, meditation, discipline habits" },
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

      <div className="bg-surface border border-border clip-card p-5 space-y-4">
        <p className="text-muted text-xs tracking-widest uppercase font-semibold border-l-2 border-neon-blue pl-2">Current Attributes</p>
        {STAT_CONFIG.map(({ key, label, abbr, icon: Icon, color, barColor, description }) => {
          const value = character.stats![key] as number;
          return (
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
                  <span className={`font-display font-bold text-xl ${color}`}>{value}</span>
                </div>
                <div className="h-1.5 bg-background border border-border overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${Math.min((value / 100) * 100, 100)}%`, backgroundColor: barColor }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-muted text-xs py-2">
        Stats grow automatically when you complete categorized habits and quests.
      </p>
    </div>
  );
}
