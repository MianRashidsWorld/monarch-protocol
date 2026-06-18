"use client";

import { useState } from "react";
import { Plus, Check, ChevronDown, ChevronUp } from "lucide-react";
import { HABIT_TEMPLATES } from "@/lib/game/templates";
import { addHabitFromTemplate } from "@/actions/habit.actions";

interface HabitTemplatesProps {
  existingTitles: string[];
}

export default function HabitTemplates({ existingTitles }: HabitTemplatesProps) {
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAdd(templateId: string) {
    setLoading(templateId);
    await addHabitFromTemplate(templateId);
    setAdded((prev) => new Set(prev).add(templateId));
    setLoading(null);
  }

  return (
    <div className="bg-surface border border-border clip-card">
      {/* Toggle header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-2 transition-colors"
      >
        <div className="border-l-2 border-neon-blue pl-3">
          <p className="font-display font-bold text-foreground tracking-wide text-sm">
            STARTER HABIT TEMPLATES
          </p>
          <p className="text-muted text-xs mt-0.5">
            {HABIT_TEMPLATES.length} presets — click any to add instantly
          </p>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted flex-shrink-0" />
        )}
      </button>

      {open && (
        <div className="border-t border-border p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {HABIT_TEMPLATES.map((template) => {
            const alreadyExists = existingTitles.includes(template.title);
            const wasAdded = added.has(template.id);
            const done = alreadyExists || wasAdded;

            return (
              <div
                key={template.id}
                className={`flex items-start gap-3 p-3 border clip-card-sm transition-colors ${
                  done ? "border-neon-green/30 bg-neon-green/5" : "border-border bg-background hover:border-neon-blue/40"
                }`}
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{template.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-snug">{template.title}</p>
                  <p className="text-muted text-xs mt-0.5 line-clamp-2">{template.description}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs font-display font-semibold">
                    <span className="text-neon-yellow">+{template.xpReward} XP</span>
                    <span className="text-neon-yellow">+{template.goldReward}G</span>
                    <span className="text-muted capitalize">{template.recurrence.toLowerCase()}</span>
                  </div>
                </div>
                <button
                  onClick={() => !done && handleAdd(template.id)}
                  disabled={done || loading === template.id}
                  className={`flex-shrink-0 w-8 h-8 border flex items-center justify-center transition-all ${
                    done
                      ? "border-neon-green/40 bg-neon-green/10 text-neon-green cursor-default"
                      : "border-border hover:border-neon-blue hover:bg-neon-blue/10 hover:text-neon-blue text-muted"
                  } disabled:cursor-not-allowed`}
                  title={done ? "Already added" : "Add habit"}
                >
                  {done ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
