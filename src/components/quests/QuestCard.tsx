"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Clock, Trash2, RotateCcw } from "lucide-react";
import type { Quest } from "@prisma/client";
import { completeQuest, failQuest, deleteQuest, reactivateQuest } from "@/actions/quest.actions";
import RankBadge from "./RankBadge";
import { RANK_CONFIG } from "@/lib/game/ranks";
import LevelUpOverlay from "./LevelUpOverlay";
import type { QuestRank } from "@prisma/client";

const RANK_ACCENT_COLOR: Record<QuestRank, string> = {
  E: "bg-rank-e",
  D: "bg-rank-d",
  C: "bg-rank-c",
  B: "bg-rank-b",
  A: "bg-rank-a",
  S: "bg-neon-yellow",
};

interface QuestCardProps {
  quest: Quest;
}

export default function QuestCard({ quest }: QuestCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [levelUp, setLevelUp] = useState<{ newLevel: number; levelsGained: number } | null>(null);
  const rankConfig = RANK_CONFIG[quest.rank];

  async function handleComplete() {
    setLoading(true);
    const result = await completeQuest(quest.id);
    setLoading(false);
    if (result.leveledUp && result.newLevel && result.levelsGained) {
      setLevelUp({ newLevel: result.newLevel, levelsGained: result.levelsGained });
    }
  }

  async function handleFail() {
    setLoading(true);
    await failQuest(quest.id);
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);
    await deleteQuest(quest.id);
    router.refresh();
  }

  async function handleReactivate() {
    setLoading(true);
    await reactivateQuest(quest.id);
    setLoading(false);
  }

  const isOverdue = quest.dueAt && new Date(quest.dueAt) < new Date() && quest.status === "ACTIVE";

  return (
    <>
      {levelUp && (
        <LevelUpOverlay
          newLevel={levelUp.newLevel}
          levelsGained={levelUp.levelsGained}
          onClose={() => setLevelUp(null)}
        />
      )}
      <div className={`bg-surface border border-border clip-card p-4 relative ${isOverdue ? "border-neon-red/50" : ""}`}>
        {/* Rank accent line */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${RANK_ACCENT_COLOR[quest.rank]}`} />

        <div className="pl-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <RankBadge rank={quest.rank} size="sm" />
                {isOverdue && (
                  <span className="text-xs text-neon-red font-semibold tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3" /> OVERDUE
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-foreground text-sm leading-snug">{quest.title}</h3>
              {quest.description && (
                <p className="text-muted text-xs mt-1 line-clamp-2">{quest.description}</p>
              )}
              <div className="flex items-center gap-3 mt-2 text-xs font-display font-semibold">
                <span className="text-neon-yellow">+{quest.xpReward} XP</span>
                <span className="text-neon-yellow">+{quest.goldReward}G</span>
                {quest.dueAt && (
                  <span className="text-muted">
                    Due {new Date(quest.dueAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-1 flex-shrink-0 items-start">
              {quest.status === "ACTIVE" && (
                <>
                  <button
                    onClick={handleComplete}
                    disabled={loading}
                    className="p-1.5 text-neon-green hover:bg-neon-green/10 transition-colors disabled:opacity-50"
                    title="Complete"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleFail}
                    disabled={loading}
                    className="p-1.5 text-neon-red hover:bg-neon-red/10 transition-colors disabled:opacity-50"
                    title="Fail"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </>
              )}

              {quest.status === "COMPLETED" && (
                <button
                  onClick={handleReactivate}
                  disabled={loading}
                  className="p-1.5 text-muted hover:text-neon-yellow hover:bg-neon-yellow/10 transition-colors disabled:opacity-50"
                  title="Undo completion (XP/Gold already awarded)"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              {quest.status === "FAILED" && (
                <button
                  onClick={handleReactivate}
                  disabled={loading}
                  className="p-1.5 text-muted hover:text-neon-yellow hover:bg-neon-yellow/10 transition-colors disabled:opacity-50"
                  title="Reactivate quest"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              {confirmDelete ? (
                <>
                  <button
                    onClick={handleDelete}
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
                  title="Delete quest"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
