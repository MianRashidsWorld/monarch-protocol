"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Trash2, RotateCcw, Flame, Heart, Archive } from "lucide-react";
import type { Habit } from "@prisma/client";
import { checkHabit, uncheckHabit, retireHabit, failHabit, reactivateHabit, deleteHabit } from "@/actions/habit.actions";
import { STAT_CATEGORY_CONFIG, STAT_BONUS } from "@/lib/game/stats";

const RECURRENCE_CONFIG = {
  DAILY:  { label: "Daily",  accentBg: "bg-neon-blue",   badgeBg: "bg-neon-blue/20 border-neon-blue",   badgeText: "text-neon-blue"   },
  WEEKLY: { label: "Weekly", accentBg: "bg-neon-purple", badgeBg: "bg-neon-purple/20 border-neon-purple", badgeText: "text-neon-purple" },
} as const;

function getLatest6AM(): Date {
  const d = new Date();
  d.setHours(6, 0, 0, 0);
  if (d > new Date()) d.setDate(d.getDate() - 1);
  return d;
}

function getNext6AM(): Date {
  const d = new Date();
  d.setHours(6, 0, 0, 0);
  if (d <= new Date()) d.setDate(d.getDate() + 1);
  return d;
}

function formatHours(ms: number): string {
  if (ms <= 0) return "0m";
  const h = Math.floor(ms / (1000 * 60 * 60));
  const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

interface HabitRowProps {
  habit: Habit;
}

export default function HabitRow({ habit }: HabitRowProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localCheckedAt, setLocalCheckedAt] = useState<Date | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  // Bar state initialised with no time calls — consistent between SSR and client.
  // barVisible = true if lastCheckedAt is set (pure data, no Date.now()).
  // displayPct = 100 always (no time dep). After mount we animate down to actual.
  const [barVisible, setBarVisible] = useState(habit.lastCheckedAt !== null);
  const [displayPct, setDisplayPct] = useState(100);
  const [hoursText, setHoursText] = useState("");

  // effectivelyCompleted is time-dependent; gate on mounted to avoid SSR mismatch.
  const [mounted, setMounted] = useState(false);
  const animDone = useRef(false);

  const config = RECURRENCE_CONFIG[habit.recurrence];

  function isSameWindow(date: Date): boolean {
    if (habit.recurrence === "DAILY") return date.getTime() >= getLatest6AM().getTime();
    return Date.now() - date.getTime() < 7 * 24 * 60 * 60 * 1000;
  }

  const isCompletedThisWindow = mounted
    ? (habit.lastCheckedAt ? isSameWindow(new Date(habit.lastCheckedAt)) : false)
    : false;
  const effectivelyCompleted =
    mounted && (isCompletedThisWindow || (localCheckedAt !== null && isSameWindow(localCheckedAt)));

  useEffect(() => {
    setMounted(true);
  }, []);

  // Runs after mount and whenever the relevant deps change.
  // Computes bar values client-side and triggers the drain animation on first run.
  useEffect(() => {
    if (!mounted) return;

    const updateBar = () => {
      const ref = habit.lastCheckedAt ? new Date(habit.lastCheckedAt) : localCheckedAt;
      if (!ref) { setBarVisible(false); return; }

      const inWindow = habit.recurrence === "DAILY"
        ? ref.getTime() >= getLatest6AM().getTime()
        : Date.now() - ref.getTime() < 7 * 24 * 60 * 60 * 1000;

      if (!inWindow) { setBarVisible(false); return; }

      const ms = habit.recurrence === "DAILY"
        ? getNext6AM().getTime() - Date.now()
        : ref.getTime() + 7 * 24 * 60 * 60 * 1000 - Date.now();
      const total = habit.recurrence === "DAILY" ? 86_400_000 : 7 * 86_400_000;
      const pct = Math.max(0, Math.min(100, (ms / total) * 100));

      setBarVisible(true);

      if (!animDone.current) {
        animDone.current = true;
        // Defer both the text and the width update to the same rAF batch so the
        // time label and the drain animation appear simultaneously.
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            setDisplayPct(pct);
            setHoursText(formatHours(ms));
          })
        );
      } else {
        setDisplayPct(pct);
        setHoursText(formatHours(ms));
      }
    };

    updateBar();
    const id = setInterval(updateBar, 30_000);
    return () => clearInterval(id);
  }, [mounted, habit.lastCheckedAt, habit.recurrence, localCheckedAt]);

  async function handleCheck() {
    if (effectivelyCompleted) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3500);
      return;
    }
    setLoading(true);
    setError(null);
    const result = await checkHabit(habit.id, getLatest6AM().getTime());
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setLocalCheckedAt(new Date());
      router.refresh();
    }
  }

  async function handleUncheck() {
    setLoading(true);
    setError(null);
    const result = await uncheckHabit(habit.id);
    setLoading(false);
    if (result?.error) setError(result.error);
    else {
      setLocalCheckedAt(null);
      setShowWarning(false);
      router.refresh();
    }
  }

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
              {habit.statCategory && (
                <span className={STAT_CATEGORY_CONFIG[habit.statCategory].color}>
                  +{STAT_BONUS} {STAT_CATEGORY_CONFIG[habit.statCategory].statLabel}
                </span>
              )}
              <span className="flex items-center gap-0.5 text-neon-red">
                <Heart className="w-2.5 h-2.5" />
                -{habit.hpPenalty} on miss
              </span>
            </div>

            {barVisible && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs text-muted font-display">
                  <span>next check unlocks at 06:00</span>
                  {hoursText && <span>{hoursText} left</span>}
                </div>
                <div className="w-full h-1.5 bg-background border border-border overflow-hidden">
                  <div
                    className="h-full bg-neon-green/60"
                    style={{ width: `${displayPct}%`, transition: "width 1.8s ease-in-out" }}
                  />
                </div>
              </div>
            )}

            {showWarning && (
              <p className="text-neon-yellow text-xs mt-1.5 border border-neon-yellow/30 bg-neon-yellow/5 px-2 py-1 font-display">
                Streak locked — resets at 06:00 ({hoursText} left).
              </p>
            )}

            {error && <p className="text-neon-red text-xs mt-1">{error}</p>}
          </div>

          <div className="flex gap-1 flex-shrink-0 items-start">
            {habit.status === "ACTIVE" && (
              <>
                <button
                  onClick={handleCheck}
                  disabled={loading}
                  className={`p-1.5 transition-colors disabled:opacity-50 ${
                    effectivelyCompleted
                      ? "text-neon-green opacity-50 hover:opacity-100 hover:bg-neon-green/10"
                      : "text-neon-green hover:bg-neon-green/10"
                  }`}
                  title={effectivelyCompleted ? "Streak locked until 06:00" : "Mark complete"}
                >
                  <CheckCircle className="w-5 h-5" />
                </button>

                {effectivelyCompleted && (
                  <button
                    onClick={handleUncheck}
                    disabled={loading}
                    className="p-1.5 text-muted hover:text-neon-yellow hover:bg-neon-yellow/10 transition-colors disabled:opacity-50"
                    title="Undo completion"
                  >
                    <RotateCcw className="w-4 h-4" />
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
