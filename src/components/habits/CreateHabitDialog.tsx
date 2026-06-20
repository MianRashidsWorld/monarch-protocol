"use client";

import { useState, useRef, useActionState } from "react";
import { Plus, X } from "lucide-react";
import { createHabit } from "@/actions/habit.actions";
import type { CreateHabitState } from "@/actions/habit.actions";
import { STAT_CATEGORY_CONFIG } from "@/lib/game/stats";
import { StatCategory } from "@prisma/client";

const initialState: CreateHabitState = {};

export default function CreateHabitDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(createHabit, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  if (state.success && open) {
    setOpen(false);
    formRef.current?.reset();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-neon-yellow text-background font-display font-bold text-sm tracking-widest uppercase px-4 py-2.5 clip-card-sm hover:bg-neon-yellow/90 transition-all"
      >
        <Plus className="w-4 h-4" />
        New Habit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative z-10 bg-surface border border-border clip-card w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="border-l-2 border-neon-yellow pl-3">
                <h2 className="font-display font-bold text-foreground tracking-wide">CREATE HABIT</h2>
                <p className="text-muted text-xs mt-0.5">Add a recurring daily/weekly objective</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form ref={formRef} action={formAction} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-widest text-muted uppercase">Habit Name *</label>
                <input name="title" required maxLength={200} className="w-full bg-background border border-border text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-neon-yellow transition-colors" placeholder="Morning workout" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-widest text-muted uppercase">Description</label>
                <textarea name="description" rows={2} maxLength={500} className="w-full bg-background border border-border text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-neon-yellow transition-colors resize-none" placeholder="Optional details..." />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-widest text-muted uppercase">Recurrence *</label>
                  <select name="recurrence" defaultValue="DAILY" className="w-full bg-background border border-border text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-neon-yellow transition-colors">
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-widest text-muted uppercase">XP Reward *</label>
                  <input name="xpReward" type="number" required min={1} max={500} defaultValue={25} className="w-full bg-background border border-border text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-neon-yellow transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-widest text-muted uppercase">Gold Reward *</label>
                  <input name="goldReward" type="number" required min={0} max={200} defaultValue={10} className="w-full bg-background border border-border text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-neon-yellow transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-widest text-muted uppercase">HP Penalty on Miss</label>
                  <input name="hpPenalty" type="number" required min={0} max={50} defaultValue={10} className="w-full bg-background border border-border text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-neon-yellow transition-colors" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-widest text-muted uppercase">Stat Bonus on Completion</label>
                <select name="statCategory" defaultValue="" className="w-full bg-background border border-border text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-neon-yellow transition-colors">
                  <option value="">None</option>
                  {(Object.keys(STAT_CATEGORY_CONFIG) as StatCategory[]).map((cat) => (
                    <option key={cat} value={cat}>
                      +5 {STAT_CATEGORY_CONFIG[cat].statLabel} — {STAT_CATEGORY_CONFIG[cat].label}
                    </option>
                  ))}
                </select>
              </div>

              {state.error && (
                <p className="text-neon-red text-xs border border-neon-red/30 bg-neon-red/10 px-3 py-2">{state.error}</p>
              )}

              <button type="submit" className="w-full bg-neon-yellow text-background font-display font-bold text-sm tracking-widest uppercase py-3 clip-card-sm hover:bg-neon-yellow/90 transition-all">
                ADD HABIT
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
