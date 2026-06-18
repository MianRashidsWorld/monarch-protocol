import { prisma } from "@/lib/prisma";
import QuestCard from "@/components/quests/QuestCard";
import CreateQuestDialog from "@/components/quests/CreateQuestDialog";
import QuestTemplates from "@/components/quests/QuestTemplates";
import { QuestStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const TABS: { label: string; status: QuestStatus }[] = [
  { label: "Active", status: "ACTIVE" },
  { label: "Completed", status: "COMPLETED" },
  { label: "Failed", status: "FAILED" },
];

interface QuestsPageProps {
  searchParams: { tab?: string };
}

export default async function QuestsPage({ searchParams }: QuestsPageProps) {
  const activeTab = (searchParams.tab as QuestStatus) ?? "ACTIVE";

  const [quests, allActiveQuests] = await Promise.all([
    prisma.quest.findMany({
      where: { characterId: 1, status: activeTab },
      orderBy: [{ rank: "desc" }, { createdAt: "desc" }],
    }),
    prisma.quest.findMany({
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
            Quest Board
          </h1>
        </div>
        <CreateQuestDialog />
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 border-b border-border">
        {TABS.map(({ label, status }) => (
          <a
            key={status}
            href={`/quests?tab=${status}`}
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

      {/* Quest list */}
      {quests.length === 0 && activeTab === "ACTIVE" && (
        <div className="text-center py-10 text-muted">
          <p className="font-display text-lg tracking-wider">NO ACTIVE QUESTS</p>
          <p className="text-sm mt-1">Add from templates below or create your own.</p>
        </div>
      )}

      {quests.length === 0 && activeTab !== "ACTIVE" && (
        <div className="text-center py-10 text-muted">
          <p className="font-display text-lg tracking-wider">NONE YET</p>
        </div>
      )}

      {quests.length > 0 && (
        <div className="space-y-3">
          {quests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      )}

      {/* Starter templates — only shown on Active tab */}
      {activeTab === "ACTIVE" && (
        <QuestTemplates existingTitles={allActiveQuests.map((q) => q.title)} />
      )}
    </div>
  );
}
