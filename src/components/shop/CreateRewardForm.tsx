"use client";

import { useActionState } from "react";
import { Plus } from "lucide-react";
import { createReward } from "@/actions/shop.actions";
import type { CreateRewardState } from "@/actions/shop.actions";

const initialState: CreateRewardState = {};

export default function CreateRewardForm() {
  const [state, formAction] = useActionState(createReward, initialState);

  return (
    <div className="bg-surface border border-border clip-card p-5">
      <div className="border-l-2 border-neon-yellow pl-3 mb-4">
        <h2 className="font-display font-bold text-foreground tracking-wide text-sm">ADD REWARD</h2>
        <p className="text-muted text-xs mt-0.5">Create a new real-life reward to spend Gold on</p>
      </div>

      <form action={formAction} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input
          name="title"
          required
          maxLength={200}
          className="sm:col-span-2 bg-background border border-border text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-neon-yellow transition-colors"
          placeholder="Watch an anime episode"
        />
        <input
          name="description"
          maxLength={500}
          className="bg-background border border-border text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-neon-yellow transition-colors"
          placeholder="Description (optional)"
        />
        <input
          name="cost"
          type="number"
          required
          min={1}
          max={10000}
          className="bg-background border border-border text-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-neon-yellow transition-colors"
          placeholder="Cost (Gold)"
        />
        <button
          type="submit"
          className="sm:col-span-4 flex items-center justify-center gap-2 border border-neon-yellow/40 text-neon-yellow font-display font-bold text-xs tracking-widest uppercase py-2.5 clip-card-sm hover:bg-neon-yellow/10 transition-all"
        >
          <Plus className="w-4 h-4" />
          ADD TO SHOP
        </button>
      </form>

      {state.error && (
        <p className="text-neon-red text-xs mt-2">{state.error}</p>
      )}
      {state.success && (
        <p className="text-neon-green text-xs mt-2">Reward added to shop.</p>
      )}
    </div>
  );
}
