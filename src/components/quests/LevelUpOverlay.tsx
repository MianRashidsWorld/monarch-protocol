"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";

interface LevelUpOverlayProps {
  newLevel: number;
  levelsGained: number;
  onClose: () => void;
}

export default function LevelUpOverlay({ newLevel, levelsGained, onClose }: LevelUpOverlayProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

        {/* Content */}
        <motion.div
          className="relative z-10 text-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
        >
          {/* Glow rings */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-neon-yellow/30"
            animate={{ scale: [1, 2, 2.5], opacity: [1, 0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          <div className="bg-surface border-2 border-neon-yellow clip-card px-16 py-10 glow-yellow">
            <TrendingUp className="w-12 h-12 text-neon-yellow mx-auto mb-2" />
            <p className="font-display text-neon-yellow text-sm tracking-widest uppercase font-bold mb-1">
              Level Up!
            </p>
            <p className="font-display text-7xl font-bold text-neon-yellow text-glow-yellow">
              {newLevel}
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              {Array.from({ length: Math.min(levelsGained, 5) }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-neon-yellow fill-neon-yellow" />
              ))}
            </div>
            <p className="text-muted text-sm mt-3">
              +{levelsGained * 3} Stat Points Granted
            </p>
            <p className="text-muted text-xs mt-4 tracking-wider">Click to continue</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
