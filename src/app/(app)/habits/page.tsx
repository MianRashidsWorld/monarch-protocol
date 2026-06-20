import { prisma } from "@/lib/prisma";
import HabitRow from "@/components/habits/HabitRow";
import CreateHabitDialog from "@/components/habits/CreateHabitDialog";
import HabitTemplates from "@/components/habits/HabitTemplates";
import { HabitStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const TABS: { label: string; status: HabitStatus }[] = [
  { label: "Active",    status: "ACTIVE"    },
  { label: "Completed", status: "COMPLETED" },
  { label: "Failed",    status: "FAILED"    },
];

interface HabitsPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function HabitsPage({ searchParams }: HabitsPageProps) {
  const { tab } = await searchParams;
  const activeTab = (tab as HabitStatus) ?? "ACTIVE";

  const [habits, allActiveHabits] = await Promise.all([
    prisma.habit.findMany({
      where: { characterId: 1, status: activeTab },
      orderBy: { createdAt: "asc" },
    }),
    prisma.habit.findMany({
      where: { characterId: 1, status: "ACTIVE" },
      select: { title: true },
    }),
  ]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-border pb-4 flex items-start justify-between">
        <div>
          <p className="text-muted text-xs tracking-widest uppercase font-semibold">System</p>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-wide mt-1">
            Daily Habits
          </h1>
        </div>
        <CreateHabitDialog />
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 border-b border-border">
        {TABS.map(({ label, status }) => (
          <a
            key={status}
            href={`/habits?tab=${status}`}
            className={`px-4 py-2.5 text-sm font-semibold tracking-wide transition-colors border-b-2 -mb-px ${
              activeTab === status
                ? "text-neon-yellow border-neon-yellow"
                : "text-muted border-transparent hover:text-foreground"
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Habit list */}
      {habits.length === 0 && activeTab === "ACTIVE" && (
        <div className="text-center py-10 text-muted">
          <p className="font-display text-lg tracking-wider">NO ACTIVE HABITS</p>
          <p className="text-sm mt-1">Add from the templates below or create your own.</p>
        </div>
      )}

      {habits.length === 0 && activeTab !== "ACTIVE" && (
        <div className="text-center py-10 text-muted">
          <p className="font-display text-lg tracking-wider">NONE YET</p>
        </div>
      )}

      {habits.length > 0 && (
        <div className="space-y-3">
          {habits.map((habit) => (
            <HabitRow key={habit.id} habit={habit} />
          ))}
        </div>
      )}

      {/* Templates only shown on Active tab */}
      {activeTab === "ACTIVE" && (
        <HabitTemplates existingTitles={allActiveHabits.map((h) => h.title)} />
      )}

      {activeTab === "ACTIVE" && habits.length > 0 && (
        <div className="bg-surface border border-border/50 p-4 text-xs text-muted">
          <p className="font-semibold text-foreground mb-1">About HP Penalties</p>
          <p>
            Missing a habit resets its streak and deducts HP. Run{" "}
            <code className="bg-background px-1 py-0.5 text-neon-yellow">make habits-check</code>{" "}
            or call{" "}
            <code className="bg-background px-1 py-0.5 text-neon-yellow">POST /api/cron/habits</code>{" "}
            with your <code className="bg-background px-1">CRON_SECRET</code> to process overdue habits.
          </p>
        </div>
      )}
    </div>
  );
}
