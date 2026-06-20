"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Trash2, RotateCcw, Flame, Heart, Archive } from "lucide-react";
import type { Habit } from "@prisma/client";
import { checkHabit, uncheckHabit, retireHabit, failHabit, reactivateHabit, deleteHabit } from "@/actions/habit.actions";

const RECURRENCE_CONFIG = {
  DAILY:  { label: "Daily",  accentBg: "bg-neon-blue",   badgeBg: "bg-neon-blue/20 border-neon-blue",   badgeText: "text-neon-blue"   },
  WEEKLY: { label: "Weekly", accentBg: "bg-neon-purple", badgeBg: "bg-neon-purple/20 border-neon-purple", badgeText: "text-neon-purple" },
} as const;

interface HabitRowProps {
  habit: Habit;
}

export default function HabitRow({ habit }: HabitRowProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = RECURRENCE_CONFIG[habit.recurrence];

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

  async function run(fn: () => Promise<{ error?: string } | void>) {
    setLoading(true);
    setError(null);
    const result = await fn();
    setLoading(false);
    if (result && result.error) setError(result.error);
    else router.refresh();
  }

  return (
    <div className="bg-surface border border-border clip-card p-4 relative">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.accentBg}`} />

      <div className="pl-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-display font-bold tracking-widest uppercase border clip-card-sm inline-block text-xs px-1.5 py-0.5 ${config.badgeBg} ${config.badgeText}`}>
                {config.label}
              </span>
              {habit.streak > 0 && (
                <span className="flex items-center gap-1 text-xs font-display font-semibold text-neon-yellow">
                  <Flame className="w-3 h-3" />
                  {habit.streak}
                </span>
              )}
            </div>

            <h3 className="font-semibold text-foreground text-sm leading-snug">{habit.title}</h3>
            {habit.description && (
              <p className="text-muted text-xs mt-1 line-clamp-2">{habit.description}</p>
            )}

            <div className="flex items-center gap-3 mt-2 text-xs font-display font-semibold">
              <span className="text-neon-yellow">+{habit.xpReward} XP</span>
              <span className="text-neon-yellow">+{habit.goldReward}G</span>
              <span className="flex items-center gap-0.5 text-neon-red">
                <Heart className="w-2.5 h-2.5" />
                -{habit.hpPenalty} on miss
              </span>
            </div>

            {error && <p className="text-neon-red text-xs mt-1">{error}</p>}
          </div>

          {/* Action buttons */}
          <div className="flex gap-1 flex-shrink-0 items-start">
            {habit.status === "ACTIVE" && (
              <>
                {isCompletedToday ? (
                  <>
                    <button
                      disabled
                      className="p-1.5 text-neon-green opacity-80 cursor-not-allowed"
                      title="Completed today"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => run(() => uncheckHabit(habit.id))}
                      disabled={loading}
                      className="p-1.5 text-muted hover:text-neon-yellow hover:bg-neon-yellow/10 transition-colors disabled:opacity-50"
                      title="Undo today's completion (XP/Gold already awarded)"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => run(() => checkHabit(habit.id))}
                    disabled={loading}
                    className="p-1.5 text-neon-green hover:bg-neon-green/10 transition-colors disabled:opacity-50"
                    title="Mark complete for today"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}

                <button
                  onClick={() => run(() => retireHabit(habit.id))}
                  disabled={loading}
                  className="p-1.5 text-muted hover:text-neon-blue hover:bg-neon-blue/10 transition-colors disabled:opacity-50"
                  title="Retire (habit mastered)"
                >
                  <Archive className="w-4 h-4" />
                </button>

                <button
                  onClick={() => run(() => failHabit(habit.id))}
                  disabled={loading}
                  className="p-1.5 text-neon-red hover:bg-neon-red/10 transition-colors disabled:opacity-50"
                  title="Give up"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </>
            )}

            {(habit.status === "COMPLETED" || habit.status === "FAILED") && (
              <button
                onClick={() => run(() => reactivateHabit(habit.id))}
                disabled={loading}
                className="p-1.5 text-muted hover:text-neon-yellow hover:bg-neon-yellow/10 transition-colors disabled:opacity-50"
                title="Reactivate habit"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {confirmDelete ? (
              <>
                <button
                  onClick={() => run(() => deleteHabit(habit.id))}
                  disabled={loading}
                  className="p-1.5 text-neon-red hover:bg-neon-red/20 transition-colors disabled:opacity-50 text-xs font-bold"
                  title="Confirm delete"
                >
                  ✓
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="p-1.5 text-muted hover:text-foreground transition-colors text-xs"
                  title="Cancel"
                >
                  ✕
                </button>
              </>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                disabled={loading}
                className="p-1.5 text-muted hover:text-neon-red hover:bg-neon-red/10 transition-colors disabled:opacity-50"
                title="Delete permanently"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
