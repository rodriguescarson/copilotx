"use client";

import { useState, useEffect } from "react";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { QuickStats } from "@/components/QuickStats";
import { GoalButtons } from "@/components/GoalButtons";
import { WorkoutPlanTab } from "@/components/WorkoutPlanTab";
import { DietPlanTab } from "@/components/DietPlanTab";
import { SleepTipsTab } from "@/components/SleepTipsTab";

const TABS = [
  { id: "workout", label: "Workout", numeral: "01", content: <WorkoutPlanTab /> },
  { id: "diet", label: "Diet", numeral: "02", content: <DietPlanTab /> },
  { id: "sleep", label: "Sleep", numeral: "03", content: <SleepTipsTab /> },
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
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]["id"]>("workout");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Defer to a microtask so we don't trigger a cascading render inside the
    // effect body — keeps the mount-gate pattern needed for CopilotSidebar
    // (it must only render after hydration) without violating the lint rule.
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />

      <main className="relative z-10 mx-auto w-full max-w-[1280px] px-6 lg:px-10">
        <Hero />

        {/* goal selector — quietly placed under hero */}
        <section
          aria-labelledby="goal-heading"
          className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3"
        >
          <h2
            id="goal-heading"
            className="eyebrow"
            style={{ color: "var(--color-ink-300)" }}
          >
            Pick a goal
          </h2>
          <GoalButtons />
        </section>

        {/* divider */}
        <div className="cx-divider mt-12" aria-hidden />

        {/* live status strip */}
        <div className="mt-12">
          <QuickStats />
        </div>

        {/* plan tabs */}
        <section
          id="plan"
          aria-labelledby="plan-heading"
          className="mt-16 mb-24"
        >
          <div className="mb-6 flex items-end justify-between gap-6">
            <div>
              <span className="eyebrow">This week</span>
              <h2
                id="plan-heading"
                className="display-headline mt-2 text-4xl sm:text-5xl"
                style={{ color: "var(--color-ink-50)" }}
              >
                Your plan,{" "}
                <span style={{ color: "var(--color-volt-300)" }} className="italic">
                  in three layers
                </span>
                .
              </h2>
            </div>
          </div>

          <div
            className="mb-5 flex flex-wrap gap-1 rounded-full border p-1"
            role="tablist"
            aria-label="Plan sections"
            style={{
              borderColor: "var(--color-ink-700)",
              background: "var(--color-ink-900)",
              width: "fit-content",
            }}
          >
            {TABS.map((t) => {
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={active}
                  aria-controls={`tabpanel-${t.id}`}
                  aria-label={`View ${t.label} plan`}
                  className="group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors"
                  style={{
                    color: active
                      ? "var(--color-ink-950)"
                      : "var(--color-ink-300)",
                    background: active ? "var(--color-volt-300)" : "transparent",
                  }}
                >
                  <span
                    className="font-mono text-[10px] tracking-widest"
                    style={{
                      color: active
                        ? "var(--color-ink-950)"
                        : "var(--color-ink-400)",
                      opacity: active ? 0.65 : 1,
                    }}
                  >
                    {t.numeral}
                  </span>
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <div
            className="cx-card relative overflow-hidden p-6 sm:p-8"
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            {TABS.find((t) => t.id === activeTab)?.content}
          </div>
        </section>

        <footer
          className="border-t pt-8 pb-12 text-[12px]"
          style={{ borderColor: "var(--color-ink-700)", color: "var(--color-ink-400)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono uppercase tracking-[0.18em]">
            <span>copilotx — built with copilotkit</span>
            <a
              href="https://github.com/rodriguescarson/copilotx"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
              style={{ color: "var(--color-ink-200)" }}
            >
              github ↗
            </a>
          </div>
        </footer>
      </main>

      {mounted && (
        <CopilotSidebar
          instructions={GYM_BUDDY_INSTRUCTIONS}
          suggestions={QUICK_SUGGESTIONS}
          labels={{
            title: "copilotx coach",
            initial:
              "Hi — I'm your copilotx coach. Tell me your goal, the time you have to train, and your diet preferences. I'll build your week.",
          }}
          defaultOpen={false}
        />
      )}
    </div>
  );
}
