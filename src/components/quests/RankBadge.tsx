import { QuestRank } from "@prisma/client";
import { RANK_CONFIG } from "@/lib/game/ranks";
import { cn } from "@/lib/utils";

interface RankBadgeProps {
  rank: QuestRank;
  size?: "sm" | "md";
}

export default function RankBadge({ rank, size = "md" }: RankBadgeProps) {
  const config = RANK_CONFIG[rank];
  return (
    <span
      className={cn(
        "font-display font-bold tracking-widest uppercase border clip-card-sm inline-block",
        config.bgColor,
        config.color,
        size === "sm" ? "text-xs px-1.5 py-0.5" : "text-sm px-2.5 py-1"
      )}
    >
      {rank}
    </span>
  );
}
