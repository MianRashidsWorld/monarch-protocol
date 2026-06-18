"use client";

import { useState } from "react";
import { Flame, CheckCircle, Heart, Trash2 } from "lucide-react";
import type { Habit } from "@prisma/client";
import { checkHabit, deleteHabit } from "@/actions/habit.actions";

interface HabitRowProps {
  habit: Habit;
}

export default function HabitRow({ habit }: HabitRowProps) {
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCompletedToday = (() => {
    if (!habit.lastCheckedAt) return false;
    const last = new Date(habit.lastCheckedAt);
    const now = new Date();
    if (habit.recurrence === "DAILY") {
      return (
        last.getFullYear() === now.getFullYear() &&
        last.getMonth() === now.getMonth() &&
        last.getDate() === now.getDate()
      );
    }
    return now.getTime() - last.getTime() < 7 * 24 * 60 * 60 * 1000;
  })();

  async function handleCheck() {
    setLoading(true);
    setError(null);
    const result = await checkHabit(habit.id);
    setLoading(false);
    if (result.error) setError(result.error);
  }

  async function handleDelete() {
    setLoading(true);
    await deleteHabit(habit.id);
    setLoading(false);
  }

  return (
    <div className={`bg-surface border border-border clip-card p-4 flex items-center gap-4 ${isCompletedToday ? "opacity-60" : ""}`}>
      {/* Streak */}
      <div className="flex flex-col items-center flex-shrink-0 w-12">
        <Flame className={`w-5 h-5 ${habit.streak > 0 ? "text-neon-yellow" : "text-muted"}`} />
        <span className={`font-display font-bold text-lg leading-none ${habit.streak > 0 ? "text-neon-yellow" : "text-muted"}`}>
          {habit.streak}
        </span>
        <span className="text-muted text-xs">streak</span>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground text-sm">{habit.title}</h3>
        {habit.description && (
          <p className="text-muted text-xs mt-0.5 truncate">{habit.description}</p>
        )}
        <div className="flex items-center gap-3 mt-1 text-xs font-display font-semibold">
          <span className="text-neon-yellow">+{habit.xpReward} XP</span>
          <span className="text-neon-yellow">+{habit.goldReward}G</span>
          <span className="text-muted capitalize">{habit.recurrence.toLowerCase()}</span>
          <span className="flex items-center gap-0.5 text-neon-red">
            <Heart className="w-2.5 h-2.5" />
            -{habit.hpPenalty} on miss
          </span>
        </div>
        {error && <p className="text-neon-red text-xs mt-1">{error}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-1.5 flex-shrink-0">
        <button
          onClick={handleCheck}
          disabled={loading || isCompletedToday}
          className={`w-9 h-9 border flex items-center justify-center transition-all ${
            isCompletedToday
              ? "border-neon-green/40 bg-neon-green/10 text-neon-green"
              : "border-border hover:border-neon-yellow hover:bg-neon-yellow/10 hover:text-neon-yellow text-muted"
          } disabled:cursor-not-allowed`}
          title="Mark complete"
        >
          <CheckCircle className="w-4 h-4" />
        </button>

        {confirmDelete ? (
          <>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-9 h-9 border border-neon-red/60 bg-neon-red/10 text-neon-red flex items-center justify-center text-xs font-bold transition-all hover:bg-neon-red/20 disabled:opacity-50"
              title="Confirm remove"
            >
              ✓
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="w-9 h-9 border border-border text-muted flex items-center justify-center text-xs transition-all hover:text-foreground"
              title="Cancel"
            >
              ✕
            </button>
          </>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            disabled={loading}
            className="w-9 h-9 border border-border text-muted flex items-center justify-center transition-all hover:border-neon-red/50 hover:text-neon-red disabled:opacity-50"
            title="Remove habit"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
