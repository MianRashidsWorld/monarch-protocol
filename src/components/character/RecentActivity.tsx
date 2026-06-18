import { LogEvent } from "@prisma/client";
import { CheckCircle, XCircle, TrendingUp, Star, ShoppingBag, Flame } from "lucide-react";
import type { QuestLog, Quest, Habit } from "@prisma/client";

type LogWithRelations = QuestLog & { quest: Quest | null; habit: Habit | null };

const EVENT_CONFIG: Record<LogEvent, { label: string; icon: React.ElementType; color: string }> = {
  QUEST_COMPLETE: { label: "Quest Complete", icon: CheckCircle, color: "text-neon-green" },
  QUEST_FAIL: { label: "Quest Failed", icon: XCircle, color: "text-neon-red" },
  HABIT_COMPLETE: { label: "Habit Complete", icon: Flame, color: "text-neon-yellow" },
  HABIT_FAIL: { label: "Habit Missed", icon: XCircle, color: "text-neon-red" },
  LEVEL_UP: { label: "Level Up!", icon: TrendingUp, color: "text-neon-yellow" },
  STAT_ALLOCATED: { label: "Stat Allocated", icon: Star, color: "text-neon-blue" },
  REWARD_REDEEMED: { label: "Reward Redeemed", icon: ShoppingBag, color: "text-neon-purple" },
};

interface RecentActivityProps {
  logs: LogWithRelations[];
}

export default function RecentActivity({ logs }: RecentActivityProps) {
  if (logs.length === 0) return null;

  return (
    <div className="bg-surface border border-border clip-card p-5">
      <p className="text-muted text-xs tracking-widest uppercase font-semibold border-l-2 border-neon-purple pl-2 mb-4">
        Recent Activity
      </p>
      <div className="space-y-2">
        {logs.map((log) => {
          const config = EVENT_CONFIG[log.event];
          const Icon = config.icon;
          const subject = log.quest?.title ?? log.habit?.title ?? log.note ?? log.event;

          return (
            <div key={log.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
              <Icon className={`w-4 h-4 ${config.color} flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{subject}</p>
                <p className={`text-xs font-semibold ${config.color}`}>{config.label}</p>
              </div>
              <div className="text-right text-xs font-display space-y-0.5 flex-shrink-0">
                {log.xpDelta !== 0 && (
                  <p className={log.xpDelta > 0 ? "text-neon-yellow" : "text-neon-red"}>
                    {log.xpDelta > 0 ? "+" : ""}{log.xpDelta} XP
                  </p>
                )}
                {log.goldDelta !== 0 && (
                  <p className={log.goldDelta > 0 ? "text-neon-yellow" : "text-neon-red"}>
                    {log.goldDelta > 0 ? "+" : ""}{log.goldDelta}G
                  </p>
                )}
                {log.hpDelta !== 0 && (
                  <p className={log.hpDelta > 0 ? "text-neon-green" : "text-neon-red"}>
                    {log.hpDelta > 0 ? "+" : ""}{log.hpDelta} HP
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
