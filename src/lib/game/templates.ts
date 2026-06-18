import { QuestRank, Recurrence } from "@prisma/client";

export interface HabitTemplate {
  id: string;
  title: string;
  description: string;
  recurrence: Recurrence;
  xpReward: number;
  goldReward: number;
  hpPenalty: number;
  emoji: string;
}

export interface QuestTemplate {
  id: string;
  title: string;
  description: string;
  rank: QuestRank;
  emoji: string;
}

export const HABIT_TEMPLATES: HabitTemplate[] = [
  {
    id: "workout",
    emoji: "🏋️",
    title: "Train at the Gym",
    description: "Lift weights or attend a training session. Strength is built in the grind.",
    recurrence: "DAILY",
    xpReward: 60,
    goldReward: 25,
    hpPenalty: 20,
  },
  {
    id: "cardio",
    emoji: "🏃",
    title: "Cardio / Run",
    description: "30+ minutes of cardio — run, cycle, or HIIT. Keep the engine running.",
    recurrence: "DAILY",
    xpReward: 40,
    goldReward: 15,
    hpPenalty: 15,
  },
  {
    id: "certification",
    emoji: "📖",
    title: "Study / Certification",
    description: "Read chapters or complete lessons toward a certification or skill goal.",
    recurrence: "DAILY",
    xpReward: 50,
    goldReward: 20,
    hpPenalty: 15,
  },
  {
    id: "skincare",
    emoji: "✨",
    title: "Skincare Routine",
    description: "Full AM or PM skincare routine. Consistency is the only cheat code.",
    recurrence: "DAILY",
    xpReward: 20,
    goldReward: 10,
    hpPenalty: 5,
  },
  {
    id: "sleep",
    emoji: "🌙",
    title: "Sleep 7–8 Hours",
    description: "Log a full 7–8 hours of sleep. Recovery is part of the grind.",
    recurrence: "DAILY",
    xpReward: 35,
    goldReward: 10,
    hpPenalty: 25,
  },
  {
    id: "eating",
    emoji: "🥗",
    title: "Eat Clean Today",
    description: "No junk food, fast food, or excessive sugar. Fuel the body right.",
    recurrence: "DAILY",
    xpReward: 30,
    goldReward: 15,
    hpPenalty: 10,
  },
  {
    id: "hydration",
    emoji: "💧",
    title: "Drink 2L of Water",
    description: "Hit your daily water intake target. Hydration is discipline.",
    recurrence: "DAILY",
    xpReward: 15,
    goldReward: 5,
    hpPenalty: 5,
  },
  {
    id: "meditation",
    emoji: "🧘",
    title: "Meditate / Breathwork",
    description: "10+ minutes of meditation, breathwork, or intentional stillness.",
    recurrence: "DAILY",
    xpReward: 25,
    goldReward: 10,
    hpPenalty: 5,
  },
  {
    id: "no-phone-morning",
    emoji: "📵",
    title: "No Phone First Hour",
    description: "No screen time for the first hour after waking. Own your morning.",
    recurrence: "DAILY",
    xpReward: 20,
    goldReward: 10,
    hpPenalty: 10,
  },
  {
    id: "steps",
    emoji: "👟",
    title: "10,000 Steps",
    description: "Hit 10k steps today. Movement is medicine.",
    recurrence: "DAILY",
    xpReward: 25,
    goldReward: 10,
    hpPenalty: 5,
  },
  {
    id: "weekly-review",
    emoji: "📋",
    title: "Weekly Review",
    description: "Review progress, plan the coming week, and update your goals.",
    recurrence: "WEEKLY",
    xpReward: 80,
    goldReward: 30,
    hpPenalty: 10,
  },
  {
    id: "cold-shower",
    emoji: "🚿",
    title: "Cold Shower",
    description: "End your shower cold. Mental toughness is built in the discomfort.",
    recurrence: "DAILY",
    xpReward: 20,
    goldReward: 10,
    hpPenalty: 10,
  },
];

export const QUEST_TEMPLATES: QuestTemplate[] = [
  {
    id: "q-pr",
    emoji: "🏆",
    rank: "C",
    title: "Hit a New Personal Record",
    description: "Beat your best lift, run time, or any measurable fitness benchmark.",
  },
  {
    id: "q-cert-chapter",
    emoji: "📚",
    rank: "D",
    title: "Complete a Certification Module",
    description: "Finish one full module or section of a certification course.",
  },
  {
    id: "q-cert-full",
    emoji: "🎓",
    rank: "A",
    title: "Pass a Certification Exam",
    description: "Study, sit, and pass a professional certification exam.",
  },
  {
    id: "q-5k",
    emoji: "🏃",
    rank: "D",
    title: "Run 5km Without Stopping",
    description: "Complete a 5km run at any pace without walking breaks.",
  },
  {
    id: "q-10k",
    emoji: "🏅",
    rank: "C",
    title: "Run 10km",
    description: "Complete a 10km run. Double the distance, double the discipline.",
  },
  {
    id: "q-30day-habit",
    emoji: "🔥",
    rank: "B",
    title: "30-Day Streak on Any Habit",
    description: "Maintain a habit without breaking the chain for 30 consecutive days.",
  },
  {
    id: "q-meal-prep",
    emoji: "🍱",
    rank: "E",
    title: "Meal Prep for the Week",
    description: "Cook and portion meals for the entire week in one session.",
  },
  {
    id: "q-book",
    emoji: "📖",
    rank: "C",
    title: "Read an Entire Book",
    description: "Finish a full non-fiction or educational book cover to cover.",
  },
  {
    id: "q-sleep-week",
    emoji: "🌙",
    rank: "D",
    title: "7 Nights of Quality Sleep",
    description: "Get 7–8 hours for 7 consecutive nights. Sleep is the superpower.",
  },
  {
    id: "q-skincare-30",
    emoji: "✨",
    rank: "C",
    title: "30-Day Skincare Consistency",
    description: "Complete your skincare routine every single day for 30 days.",
  },
  {
    id: "q-cut-sugar",
    emoji: "🚫",
    rank: "B",
    title: "30 Days No Added Sugar",
    description: "Eliminate added sugar from your diet for an entire month.",
  },
  {
    id: "q-martial-arts",
    emoji: "🥊",
    rank: "E",
    title: "Attend a Martial Arts Class",
    description: "Show up to boxing, BJJ, MMA, or any combat sports session.",
  },
];
