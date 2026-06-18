"use client";

import { useState, useActionState } from "react";
import { Plus, Minus } from "lucide-react";
import { allocateStats } from "@/actions/stats.actions";
import type { AllocateState } from "@/actions/stats.actions";

const STATS = [
  { key: "str", label: "STR", color: "text-neon-red", borderColor: "border-neon-red/40" },
  { key: "intel", label: "INT", color: "text-neon-blue", borderColor: "border-neon-blue/40" },
  { key: "agi", label: "AGI", color: "text-neon-green", borderColor: "border-neon-green/40" },
  { key: "wil", label: "WIL", color: "text-neon-purple", borderColor: "border-neon-purple/40" },
] as const;

const initialState: AllocateState = {};

interface StatAllocatorProps {
  unallocatedPoints: number;
}

export default function StatAllocator({ unallocatedPoints }: StatAllocatorProps) {
  const [state, formAction] = useActionState(allocateStats, initialState);
  const [allocation, setAllocation] = useState({ str: 0, intel: 0, agi: 0, wil: 0 });

  const totalAllocated = Object.values(allocation).reduce((a, b) => a + b, 0);
  const remaining = unallocatedPoints - totalAllocated;

  function increment(key: keyof typeof allocation) {
    if (remaining <= 0) return;
    setAllocation((prev) => ({ ...prev, [key]: prev[key] + 1 }));
  }

  function decrement(key: keyof typeof allocation) {
    if (allocation[key] <= 0) return;
    setAllocation((prev) => ({ ...prev, [key]: prev[key] - 1 }));
  }

  return (
    <div className="bg-surface border border-neon-yellow/30 clip-card p-5">
      <div className="border-l-2 border-neon-yellow pl-3 mb-4">
        <h2 className="font-display font-bold text-foreground tracking-wide">ALLOCATE STAT POINTS</h2>
        <p className="text-muted text-xs mt-0.5">
          {remaining} / {unallocatedPoints} points remaining
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        {/* Hidden inputs */}
        {STATS.map(({ key }) => (
          <input key={key} type="hidden" name={key} value={allocation[key]} />
        ))}

        <div className="grid grid-cols-2 gap-3">
          {STATS.map(({ key, label, color, borderColor }) => (
            <div key={key} className={`bg-background border ${borderColor} p-3 flex items-center justify-between`}>
              <span className={`font-display font-bold ${color} text-lg w-12`}>{label}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => decrement(key)}
                  disabled={allocation[key] <= 0}
                  className="w-7 h-7 border border-border flex items-center justify-center text-muted hover:text-foreground disabled:opacity-30"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className={`font-display font-bold text-xl w-6 text-center ${allocation[key] > 0 ? color : "text-muted"}`}>
                  {allocation[key]}
                </span>
                <button
                  type="button"
                  onClick={() => increment(key)}
                  disabled={remaining <= 0}
                  className="w-7 h-7 border border-border flex items-center justify-center text-muted hover:text-foreground disabled:opacity-30"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {state.error && (
          <p className="text-neon-red text-xs border border-neon-red/30 bg-neon-red/10 px-3 py-2">{state.error}</p>
        )}
        {state.success && (
          <p className="text-neon-green text-xs border border-neon-green/30 bg-neon-green/10 px-3 py-2">
            Stats allocated successfully!
          </p>
        )}

        <button
          type="submit"
          disabled={totalAllocated === 0}
          className="w-full bg-neon-yellow text-background font-display font-bold text-sm tracking-widest uppercase py-3 clip-card-sm hover:bg-neon-yellow/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          CONFIRM ALLOCATION ({totalAllocated} pts)
        </button>
      </form>
    </div>
  );
}
