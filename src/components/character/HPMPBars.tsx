"use client";

import { motion } from "framer-motion";
import { Heart, Zap } from "lucide-react";

interface HPMPBarsProps {
  hp: number;
  hpMax: number;
  mp: number;
  mpMax: number;
}

function StatBar({
  current,
  max,
  color,
  label,
  icon: Icon,
  delay = 0,
}: {
  current: number;
  max: number;
  color: string;
  label: string;
  icon: React.ElementType;
  delay?: number;
}) {
  const percent = Math.min((current / max) * 100, 100);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className={`w-3.5 h-3.5 ${color}`} />
          <span className={`text-xs font-semibold tracking-widest uppercase ${color}`}>{label}</span>
        </div>
        <span className="text-xs font-display font-semibold text-foreground">
          {current} / {max}
        </span>
      </div>
      <div className="h-4 bg-background border border-border relative overflow-hidden">
        <motion.div
          className="h-full relative"
          style={{ backgroundColor: color.includes("red") ? "#FF3B3B" : "#00BFFF" }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay }}
        />
        {/* Low threshold warning pulse */}
        {percent < 25 && (
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: color.includes("red") ? "#FF3B3B20" : "#00BFFF20",
              animation: "pulse-neon 1s ease-in-out infinite",
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function HPMPBars({ hp, hpMax, mp, mpMax }: HPMPBarsProps) {
  return (
    <div className="bg-surface border border-border clip-card p-5 space-y-5">
      <p className="text-muted text-xs tracking-widest uppercase font-semibold border-l-2 border-neon-red pl-2">
        Vitals
      </p>
      <StatBar
        current={hp}
        max={hpMax}
        color="text-neon-red"
        label="HP"
        icon={Heart}
        delay={0.1}
      />
      <StatBar
        current={mp}
        max={mpMax}
        color="text-neon-blue"
        label="MP"
        icon={Zap}
        delay={0.3}
      />
    </div>
  );
}
