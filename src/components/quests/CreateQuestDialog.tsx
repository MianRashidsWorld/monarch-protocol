"use client";

import { useState, useRef, useActionState } from "react";
import { Plus, X } from "lucide-react";
import { createQuest } from "@/actions/quest.actions";
import { RANK_ORDER, RANK_CONFIG } from "@/lib/game/ranks";
import type { CreateQuestState } from "@/actions/quest.actions";

const initialState: CreateQuestState = {};

export default function CreateQuestDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(createQuest, initialState);
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
        New Quest
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div className="relative z-10 bg-surface border border-border clip-card w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="border-l-2 border-neon-yellow pl-3">
                <h2 className="font-display font-bold text-foreground tracking-wide">CREATE QUEST</h2>
                <p className="text-muted text-xs mt-0.5">Register a new objective</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form ref={formRef} action={formAction} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-widest text-muted uppercase">
                  Quest Title *
                </label>
                <input
                  name="title"
                  required
                  maxLength={200}
                  className="w-full bg-background border border-border text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-neon-yellow transition-colors"
                  placeholder="Complete morning workout"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-widest text-muted uppercase">
                  Description
                </label>
                <textarea
                  name="description"
                  maxLength={1000}
                  rows={2}
                  className="w-full bg-background border border-border text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-neon-yellow transition-colors resize-none"
                  placeholder="Optional details..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-widest text-muted uppercase">
                    Rank *
                  </label>
                  <select
                    name="rank"
                    required
                    defaultValue="E"
                    className="w-full bg-background border border-border text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-neon-yellow transition-colors"
                  >
                    {RANK_ORDER.map((rank) => (
                      <option key={rank} value={rank}>
                        {RANK_CONFIG[rank].label} (+{RANK_CONFIG[rank].xp} XP)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-widest text-muted uppercase">
                    Due Date
                  </label>
                  <input
                    name="dueAt"
                    type="date"
                    className="w-full bg-background border border-border text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-neon-yellow transition-colors"
                  />
                </div>
              </div>

              {state.error && (
                <p className="text-neon-red text-xs border border-neon-red/30 bg-neon-red/10 px-3 py-2">
                  {state.error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-neon-yellow text-background font-display font-bold text-sm tracking-widest uppercase py-3 clip-card-sm hover:bg-neon-yellow/90 transition-all"
              >
                REGISTER QUEST
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
