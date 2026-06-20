import { StatCategory } from "@prisma/client";

export const STAT_BONUS = 5;

export const STAT_FIELD: Record<StatCategory, "str" | "intel" | "agi" | "wil"> = {
  STRENGTH:     "str",
  INTELLIGENCE: "intel",
  AGILITY:      "agi",
  WILLPOWER:    "wil",
};

export const STAT_CATEGORY_CONFIG: Record<StatCategory, { label: string; statLabel: string; color: string }> = {
  STRENGTH:     { label: "Strength",     statLabel: "STR", color: "text-neon-red"    },
  INTELLIGENCE: { label: "Intelligence", statLabel: "INT", color: "text-neon-blue"   },
  AGILITY:      { label: "Agility",      statLabel: "AGI", color: "text-neon-green"  },
  WILLPOWER:    { label: "Willpower",    statLabel: "WIL", color: "text-neon-purple" },
};
