"use client";

import { useState } from "react";
import { Plus, Check, ChevronDown, ChevronUp } from "lucide-react";
import { QUEST_TEMPLATES } from "@/lib/game/templates";
import { RANK_CONFIG } from "@/lib/game/ranks";
import { addQuestFromTemplate } from "@/actions/quest.actions";
import RankBadge from "./RankBadge";

interface QuestTemplatesProps {
  existingTitles: string[];
}

export default function QuestTemplates({ existingTitles }: QuestTemplatesProps) {
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAdd(templateId: string) {
    setLoading(templateId);
    await addQuestFromTemplate(templateId);
    setAdded((prev) => new Set(prev).add(templateId));
    setLoading(null);
  }

  return (
    <div className="bg-surface border border-border clip-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-2 transition-colors"
      >
        <div className="border-l-2 border-neon-blue pl-3">
          <p className="font-display font-bold text-foreground tracking-wide text-sm">
            STARTER QUEST TEMPLATES
          </p>
          <p className="text-muted text-xs mt-0.5">
            {QUEST_TEMPLATES.length} presets — click any to add to your quest board
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
          {QUEST_TEMPLATES.map((template) => {
            const alreadyExists = existingTitles.includes(template.title);
            const wasAdded = added.has(template.id);
            const done = alreadyExists || wasAdded;
            const rankConfig = RANK_CONFIG[template.rank];

            return (
              <div
                key={template.id}
                className={`flex items-start gap-3 p-3 border clip-card-sm transition-colors ${
                  done ? "border-neon-green/30 bg-neon-green/5" : "border-border bg-background hover:border-neon-yellow/30"
                }`}
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{template.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <RankBadge rank={template.rank} size="sm" />
                  </div>
                  <p className="text-sm font-semibold text-foreground leading-snug">{template.title}</p>
                  <p className="text-muted text-xs mt-0.5 line-clamp-2">{template.description}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs font-display font-semibold">
                    <span className="text-neon-yellow">+{rankConfig.xp} XP</span>
                    <span className="text-neon-yellow">+{rankConfig.gold}G</span>
                  </div>
                </div>
                <button
                  onClick={() => !done && handleAdd(template.id)}
                  disabled={done || loading === template.id}
                  className={`flex-shrink-0 w-8 h-8 border flex items-center justify-center transition-all ${
                    done
                      ? "border-neon-green/40 bg-neon-green/10 text-neon-green cursor-default"
                      : "border-border hover:border-neon-yellow hover:bg-neon-yellow/10 hover:text-neon-yellow text-muted"
                  } disabled:cursor-not-allowed`}
                  title={done ? "Already added" : "Add quest"}
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
