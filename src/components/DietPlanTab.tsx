"use client";

import { useGym } from "@/context/GymContext";
import type { Meal } from "@/types/gym";

const DIET_PREFS = [
  { label: "Vegetarian", value: "vegetarian" as const },
  { label: "Vegan", value: "vegan" as const },
  { label: "Non-vegetarian", value: "non_vegetarian" as const },
];

const CALORIE_MODES = [
  { label: "Calorie deficit", value: "deficit" as const, desc: "For fat loss" },
  { label: "Maintenance", value: "maintenance" as const, desc: "Keep weight" },
  { label: "Calorie surplus", value: "surplus" as const, desc: "For muscle gain" },
];

function MealCard({ meal }: { meal: Meal }) {
  const dietBadge =
    meal.dietType === "vegetarian"
      ? "🌱 Veg"
      : meal.dietType === "vegan"
        ? "🌿 Vegan"
        : "🍗 Non-veg";
  const macro =
    meal.protein != null || meal.carbs != null || meal.fat != null
      ? [
        meal.protein != null && `P ${meal.protein}g`,
        meal.carbs != null && `C ${meal.carbs}g`,
        meal.fat != null && `F ${meal.fat}g`,
      ]
          .filter(Boolean)
          .join(" • ")
      : null;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-600 dark:bg-zinc-800">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium">{meal.name}</span>
        <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs dark:bg-zinc-700">
          {meal.calories} cal
        </span>
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="text-zinc-500">{dietBadge}</span>
        {meal.mealType && (
          <span className="text-zinc-500 capitalize">{meal.mealType}</span>
        )}
        {macro && <span className="text-zinc-500">{macro}</span>}
      </div>
      {meal.description && (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {meal.description}
        </p>
      )}
      {Array.isArray(meal.ingredients) && meal.ingredients.length > 0 && (
        <p className="mt-1 text-xs text-zinc-500">
          {meal.ingredients.join(", ")}
        </p>
      )}
    </div>
  );
}

export function DietPlanTab() {
  const {
    state,
    setDietPref,
    setCalorieMode,
  } = useGym();
  const { dietPref, calories, calorieMode, lastDietPlan } = state;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Diet Preferences</h3>

      <div>
        <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
          Diet type
        </p>
        <div className="flex flex-wrap gap-2">
          {DIET_PREFS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setDietPref(p.value)}
              aria-pressed={dietPref === p.value}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                dietPref === p.value
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
          Calorie mode
        </p>
        <div className="flex flex-wrap gap-2">
          {CALORIE_MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setCalorieMode(m.value)}
              aria-pressed={calorieMode === m.value}
              title={m.desc}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                calorieMode === m.value
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
        <p>
          <span className="text-zinc-600 dark:text-zinc-400">Target:</span>{" "}
          {calories} cal/day ({calorieMode})
        </p>
      </div>

      {lastDietPlan && lastDietPlan.length > 0 && (
        <div>
          <h4 className="mb-2 font-medium">Last suggested meals</h4>
          <div className="space-y-2">
            {lastDietPlan.map((m, i) => (
              <MealCard key={i} meal={m} />
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Try: &quot;Suggest vegetarian breakfast for calorie deficit&quot; or
        &quot;Non-veg muscle gain meal plan 2500 cal&quot;
      </p>
    </div>
  );
}
