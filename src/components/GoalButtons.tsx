"use client";

import { useGym } from "@/context/GymContext";

const GOALS = [
  { label: "Lose Weight", value: "fat loss" },
  { label: "Gain Muscle", value: "muscle gain" },
  { label: "Endurance", value: "endurance" },
] as const;

export function GoalButtons() {
  const { state, setGoal } = useGym();

  return (
    <div className="flex flex-wrap gap-2">
      {GOALS.map((g) => (
        <button
          key={g.value}
          type="button"
          onClick={() => setGoal(g.value)}
          aria-pressed={state.goal === g.value}
          aria-label={`Set goal to ${g.label}`}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            state.goal === g.value
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
          }`}
        >
          {g.label}
        </button>
      ))}
    </div>
  );
}
