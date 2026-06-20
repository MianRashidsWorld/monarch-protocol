import { Coins, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CharacterCardProps {
  name: string;
  level: number;
  title: string;
  gold: number;
  unallocatedPoints: number;
}

export default function CharacterCard({ name, level, title, gold, unallocatedPoints }: CharacterCardProps) {
  return (
    <div className="bg-surface border border-border clip-card p-5 relative overflow-hidden">
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-neon-yellow/5 border-b border-l border-neon-yellow/20" style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />

      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-background border border-neon-yellow/40 clip-card flex items-center justify-center flex-shrink-0 glow-yellow">
          <Image
            src="/sprites/avatar.png"
            alt="Character avatar"
            width={56}
            height={56}
            className="object-contain"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-muted text-xs tracking-widest uppercase font-semibold">{title}</p>
          <h2 className="font-display text-2xl font-bold text-foreground tracking-wide truncate">
            {name}
          </h2>

          <div className="flex items-center gap-4 mt-2">
            {/* Level badge */}
            <div className="flex items-center gap-1.5 bg-neon-yellow/10 border border-neon-yellow/30 px-2.5 py-1">
              <Star className="w-3 h-3 text-neon-yellow" />
              <span className="font-display font-bold text-neon-yellow text-sm tracking-wider">
                LVL {level}
              </span>
            </div>

            {/* Gold */}
            <div className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-neon-yellow" />
              <span className="font-display font-semibold text-neon-yellow text-sm">
                {gold.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stat points alert */}
      {unallocatedPoints > 0 && (
        <Link
          href="/stats"
          className="mt-4 flex items-center gap-2 bg-neon-yellow/10 border border-neon-yellow/40 px-3 py-2 text-xs font-semibold text-neon-yellow tracking-wider hover:bg-neon-yellow/20 transition-colors animate-pulse-neon"
        >
          <span className="w-2 h-2 rounded-full bg-neon-yellow" />
          {unallocatedPoints} STAT POINT{unallocatedPoints !== 1 ? "S" : ""} AVAILABLE — ALLOCATE NOW
        </Link>
      )}
    </div>
  );
}
