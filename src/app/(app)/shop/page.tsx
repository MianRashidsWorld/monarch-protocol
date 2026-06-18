import { prisma } from "@/lib/prisma";
import RewardCard from "@/components/shop/RewardCard";
import CreateRewardForm from "@/components/shop/CreateRewardForm";
import { Coins, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [rewards, character, recentRedemptions] = await Promise.all([
    prisma.reward.findMany({ where: { isAvailable: true }, orderBy: { cost: "asc" } }),
    prisma.character.findUniqueOrThrow({ where: { id: 1 }, select: { gold: true } }),
    prisma.rewardRedemption.findMany({
      where: { characterId: 1 },
      orderBy: { redeemedAt: "desc" },
      take: 5,
      include: { reward: true },
    }),
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-border pb-4 flex items-start justify-between">
        <div>
          <p className="text-muted text-xs tracking-widest uppercase font-semibold">System</p>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-wide mt-1">
            Reward Shop
          </h1>
        </div>
        <div className="flex items-center gap-1.5 bg-neon-yellow/10 border border-neon-yellow/30 px-4 py-2 clip-card-sm">
          <Coins className="w-4 h-4 text-neon-yellow" />
          <span className="font-display font-bold text-neon-yellow">{character.gold.toLocaleString()} Gold</span>
        </div>
      </div>

      {/* Shop grid */}
      {rewards.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <p className="font-display text-lg tracking-wider">SHOP IS EMPTY</p>
          <p className="text-sm mt-1">Add real-life rewards below.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <RewardCard key={reward.id} reward={reward} currentGold={character.gold} />
          ))}
        </div>
      )}

      {/* Add reward form */}
      <CreateRewardForm />

      {/* Purchase history */}
      {recentRedemptions.length > 0 && (
        <div className="bg-surface border border-border clip-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-muted" />
            <p className="text-muted text-xs tracking-widest uppercase font-semibold">Recent Redemptions</p>
          </div>
          <div className="space-y-2">
            {recentRedemptions.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-sm text-foreground">{r.reward.title}</span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-neon-red font-display font-semibold">-{r.goldSpent}G</span>
                  <span className="text-muted">{new Date(r.redeemedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
