import { prisma } from "@/lib/prisma";
import HabitRow from "@/components/habits/HabitRow";
import CreateHabitDialog from "@/components/habits/CreateHabitDialog";
import HabitTemplates from "@/components/habits/HabitTemplates";

export const dynamic = "force-dynamic";

export default async function HabitsPage() {
  const habits = await prisma.habit.findMany({
    where: { characterId: 1, isActive: true },
    orderBy: { createdAt: "asc" },
  });

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

      {habits.length === 0 && (
        <div className="text-center py-10 text-muted">
          <p className="font-display text-lg tracking-wider">NO HABITS REGISTERED</p>
          <p className="text-sm mt-1">Add from the templates below or create your own.</p>
        </div>
      )}

      {habits.length > 0 && (
        <div className="space-y-3">
          {habits.map((habit) => (
            <HabitRow key={habit.id} habit={habit} />
          ))}
        </div>
      )}

      {/* Starter templates */}
      <HabitTemplates existingTitles={habits.map((h) => h.title)} />

      {habits.length > 0 && (
        <div className="bg-surface border border-border/50 p-4 text-xs text-muted">
          <p className="font-semibold text-foreground mb-1">About HP Penalties</p>
          <p>
            Missing a habit resets its streak and deducts HP. Run{" "}
            <code className="bg-background px-1 py-0.5 text-neon-yellow">make habits-check</code>{" "}
            or call{" "}
            <code className="bg-background px-1 py-0.5 text-neon-yellow">
              POST /api/cron/habits
            </code>{" "}
            with your <code className="bg-background px-1">CRON_SECRET</code> to process overdue habits.
          </p>
        </div>
      )}
    </div>
  );
}
