"use client";

import { useState } from "react";
import { ShoppingBag, Coins } from "lucide-react";
import type { Reward } from "@prisma/client";
import { redeemReward } from "@/actions/shop.actions";

interface RewardCardProps {
  reward: Reward;
  currentGold: number;
}

export default function RewardCard({ reward, currentGold }: RewardCardProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const canAfford = currentGold >= reward.cost;

  async function handleRedeem() {
    setLoading(true);
    setMessage(null);
    const result = await redeemReward(reward.id);
    setLoading(false);
    if (result.error) {
      setMessage({ text: result.error, ok: false });
    } else {
      setMessage({ text: "Redeemed! Enjoy your reward.", ok: true });
      setTimeout(() => setMessage(null), 3000);
    }
  }

  return (
    <div className={`bg-surface border border-border clip-card p-4 flex flex-col gap-3 ${!canAfford ? "opacity-60" : ""}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-neon-purple/10 border border-neon-purple/30 clip-card-sm flex items-center justify-center flex-shrink-0">
          <ShoppingBag className="w-5 h-5 text-neon-purple" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm">{reward.title}</h3>
          {reward.description && (
            <p className="text-muted text-xs mt-0.5">{reward.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1.5">
          <Coins className="w-4 h-4 text-neon-yellow" />
          <span className="font-display font-bold text-neon-yellow text-lg">{reward.cost}</span>
          <span className="text-muted text-xs">Gold</span>
        </div>

        <button
          onClick={handleRedeem}
          disabled={loading || !canAfford}
          className="font-display font-bold text-xs tracking-widest uppercase px-3 py-1.5 clip-card-sm transition-all border border-neon-purple/40 text-neon-purple hover:bg-neon-purple/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "..." : canAfford ? "REDEEM" : "INSUFFICIENT GOLD"}
        </button>
      </div>

      {message && (
        <p className={`text-xs ${message.ok ? "text-neon-green" : "text-neon-red"} border ${message.ok ? "border-neon-green/30 bg-neon-green/10" : "border-neon-red/30 bg-neon-red/10"} px-3 py-1.5`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
