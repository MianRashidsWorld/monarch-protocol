import { QuestRank } from "@prisma/client";

export const RANK_CONFIG: Record<
  QuestRank,
  { label: string; xp: number; gold: number; color: string; bgColor: string }
> = {
  E: { label: "E-Rank", xp: 25, gold: 10, color: "text-rank-e", bgColor: "bg-rank-e/20 border-rank-e" },
  D: { label: "D-Rank", xp: 75, gold: 25, color: "text-rank-d", bgColor: "bg-rank-d/20 border-rank-d" },
  C: { label: "C-Rank", xp: 150, gold: 50, color: "text-rank-c", bgColor: "bg-rank-c/20 border-rank-c" },
  B: { label: "B-Rank", xp: 300, gold: 100, color: "text-rank-b", bgColor: "bg-rank-b/20 border-rank-b" },
  A: { label: "A-Rank", xp: 600, gold: 200, color: "text-rank-a", bgColor: "bg-rank-a/20 border-rank-a" },
  S: { label: "S-Rank", xp: 1500, gold: 500, color: "text-rank-s", bgColor: "bg-rank-s/20 border-rank-s" },
};

export const RANK_ORDER: QuestRank[] = ["E", "D", "C", "B", "A", "S"];

export function getTitleForLevel(level: number): string {
  if (level < 5) return "Awakened";
  if (level < 10) return "E-Rank Hunter";
  if (level < 20) return "D-Rank Hunter";
  if (level < 35) return "C-Rank Hunter";
  if (level < 50) return "B-Rank Hunter";
  if (level < 70) return "A-Rank Hunter";
  if (level < 90) return "S-Rank Hunter";
  return "Shadow Monarch";
}
