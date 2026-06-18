"use client";

import { motion } from "framer-motion";

interface XPBarProps {
  currentXp: number;
  xpNeeded: number;
  level: number;
}

export default function XPBar({ currentXp, xpNeeded, level }: XPBarProps) {
  const percent = Math.min((currentXp / xpNeeded) * 100, 100);

  return (
    <div className="bg-surface border border-border p-4 clip-card">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold tracking-widest text-muted uppercase">Experience</p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-display font-semibold text-foreground">
            {currentXp.toLocaleString()}
          </span>
          <span className="text-muted text-xs">/</span>
          <span className="text-xs font-display font-semibold text-muted">
            {xpNeeded.toLocaleString()} XP
          </span>
          <span className="text-xs text-muted ml-1">to Lv.{level + 1}</span>
        </div>
      </div>

      {/* Track */}
      <div className="h-3 bg-background border border-border relative overflow-hidden">
        <motion.div
          className="h-full bg-neon-yellow relative"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          {/* Shimmer effect */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: "linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2s infinite linear",
            }}
          />
        </motion.div>
      </div>

      {/* Percentage */}
      <p className="text-right text-xs text-muted mt-1 font-display">
        {percent.toFixed(1)}%
      </p>
    </div>
  );
}
