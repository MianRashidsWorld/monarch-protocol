import { Dumbbell, Brain, Wind, Shield } from "lucide-react";
import type { Stats } from "@prisma/client";

const STAT_CONFIG = [
  { key: "str" as const, label: "Strength", abbr: "STR", icon: Dumbbell, color: "text-neon-red", border: "border-neon-red/40", bg: "bg-neon-red/10" },
  { key: "intel" as const, label: "Intelligence", abbr: "INT", icon: Brain, color: "text-neon-blue", border: "border-neon-blue/40", bg: "bg-neon-blue/10" },
  { key: "agi" as const, label: "Agility", abbr: "AGI", icon: Wind, color: "text-neon-green", border: "border-neon-green/40", bg: "bg-neon-green/10" },
  { key: "wil" as const, label: "Willpower", abbr: "WIL", icon: Shield, color: "text-neon-purple", border: "border-neon-purple/40", bg: "bg-neon-purple/10" },
];

interface StatGridProps {
  stats: Stats;
}

export default function StatGrid({ stats }: StatGridProps) {
  return (
    <div className="bg-surface border border-border clip-card p-5">
      <p className="text-muted text-xs tracking-widest uppercase font-semibold border-l-2 border-neon-blue pl-2 mb-4">
        Attributes
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STAT_CONFIG.map(({ key, label, abbr, icon: Icon, color, border, bg }) => (
          <div
            key={key}
            className={`${bg} border ${border} clip-card-sm p-3 text-center`}
          >
            <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
            <p className={`font-display text-2xl font-bold ${color}`}>{stats[key]}</p>
            <p className="text-muted text-xs tracking-widest uppercase font-semibold mt-0.5">{abbr}</p>
            <p className="text-muted text-xs mt-0.5 hidden md:block">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
