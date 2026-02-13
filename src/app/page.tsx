"use client";

import { useState, useEffect } from "react";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { GoalButtons } from "@/components/GoalButtons";
import { WorkoutPlanTab } from "@/components/WorkoutPlanTab";
import { DietPlanTab } from "@/components/DietPlanTab";
import { SleepTipsTab } from "@/components/SleepTipsTab";

const TABS = [
  { id: "workout", label: "Workout Plan", content: <WorkoutPlanTab /> },
  { id: "diet", label: "Diet Plan", content: <DietPlanTab /> },
  { id: "sleep", label: "Sleep Tips", content: <SleepTipsTab /> },
] as const;

const QUICK_SUGGESTIONS = [
  {
    title: "Create my weekly plan",
    message: "Create a detailed weekly workout plan for 45 min on Monday, Wednesday, Friday with specific exercises for each day",
  },
  {
    title: "Add to my plan",
    message: "Add this to my plan (save the workout, meals, and sleep tips we discussed into my plan tabs)",
  },
  {
    title: "Veg calorie deficit meals",
    message: "Suggest vegetarian dishes for calorie deficit (1800 cal) - breakfast, lunch, dinner with specific recipes",
  },
  {
    title: "Non-veg muscle gain meals",
    message: "Suggest non-vegetarian meal plan for calorie surplus (2500 cal) for muscle gain with protein-rich dishes",
  },
  {
    title: "Set my goal to muscle gain",
    message: "Set my goal to muscle gain",
  },
  {
    title: "Science-backed sleep tips",
    message: "Give me evidence-based sleep tips for 6 hours - include sleep hygiene, circadian rhythm, and recovery advice with sources",
  },
];

const GYM_BUDDY_INSTRUCTIONS = `You are an AI Gym Buddy. CRITICAL: The user's Workout Plan, Diet Plan, and Sleep Tips tabs only update when you CALL the actions. Text responses alone do NOT save anything.

ALWAYS call actions when you produce plans:
- Workout plan → call setRoutine OR saveFullPlan
- Meal plan → call dietSuggestion OR saveFullPlan
- Sleep tips → call sleepTips OR saveFullPlan
- Full plan (workout + meals + sleep) → call saveFullPlan with planData JSON

When user says "add to my plan", "update my plan", "save this", "add this" → call saveFullPlan with the complete updated plan (merge new content with any existing).

Actions: updateGoal, setRoutine, dietSuggestion, sleepTips, saveFullPlan.

saveFullPlan: Pass planData as JSON string with workoutPlan, meals, sleepTips. Use when giving a complete plan or when user asks to add/update/save.

WORKOUT format: [{day, duration, focus, exercises: [{name, sets, reps?, duration?, muscleGroup}]}]
MEALS format: [{name, calories, mealType, description?, ingredients?, dietType?}]
SLEEP format: [{category, tip, source?}]

For 80kg, 6'1", muscle gain: ~2800-3000 cal surplus. Remote worker: optimize for home workouts, meal prep, screen-time sleep tips.

DIET: Specific dish names. vegetarian/vegan/non_vegetarian. surplus for muscle gain. Include recipes with ingredients when asked.
SLEEP: Science-backed tips. Categories: Sleep hygiene, Circadian rhythm, Recovery. Sources: CDC, National Sleep Foundation.`;

export default function Home() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("workout");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-bold">AI Gym Buddy</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Personalized workout & diet planning
        </p>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <section className="mb-6">
          <h2 className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Your goal
          </h2>
          <GoalButtons />
        </section>

        <section>
          <div
            className="mb-3 flex gap-2 border-b border-zinc-200 dark:border-zinc-700"
            role="tablist"
            aria-label="Plan sections"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={activeTab === t.id}
                aria-controls={`tabpanel-${t.id}`}
                aria-label={`View ${t.label}`}
                className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === t.id
                    ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                    : "border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div
            className="rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-900"
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            {TABS.find((t) => t.id === activeTab)?.content}
          </div>
        </section>
      </main>

      {mounted && (
        <CopilotSidebar
          instructions={GYM_BUDDY_INSTRUCTIONS}
          suggestions={QUICK_SUGGESTIONS}
          labels={{
            title: "AI Gym Buddy",
            initial:
              "Hi! I'm your AI Gym Buddy. Tell me your fitness goal, how much time you have, and your diet preferences. I'll help you plan workouts and meals.",
          }}
          defaultOpen={false}
        />
      )}
    </div>
  );
}
