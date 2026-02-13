"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { useGym } from "@/context/GymContext";
import { ExerciseWithGif } from "@/components/ExerciseWithGif";
import type { WorkoutDay, Meal, SleepTip } from "@/types/gym";

export function GymBuddyActions() {
  const {
    setGoal,
    setSchedule,
    setWorkoutPlan,
    setDietPref,
    setCalories,
    setCalorieMode,
    setSleepHours,
    setLastDietPlan,
    setLastSleepTips,
  } = useGym();

  useCopilotAction({
    name: "updateGoal",
    description:
      "Store the user's fitness goal. Call this when the user says they want to lose weight, gain muscle, build endurance, or similar.",
    parameters: [
      {
        name: "goal",
        type: "string",
        description: "Fitness goal: fat loss, muscle gain, endurance, or similar",
        required: true,
      },
    ],
    handler: async ({ goal }) => {
      try {
        if (!goal || typeof goal !== "string") {
          return "Error: Please provide a valid goal.";
        }
        setGoal(goal);
        return `Goal updated to: ${goal}`;
      } catch (err) {
        console.error("updateGoal failed:", err);
        return "Sorry, I couldn't update your goal. Please try again.";
      }
    },
  });

  useCopilotAction({
    name: "setRoutine",
    description:
      "Save a detailed weekly workout plan. ALWAYS provide workoutPlan with specific exercises for each day. Each day should include: day name, duration in minutes, optional focus (e.g. 'Upper body', 'Legs'), and exercises array. Each exercise should have: name, sets, reps (or duration for cardio), optional muscleGroup, optional notes.",
    parameters: [
      {
        name: "schedule",
        type: "object",
        description:
          "Object mapping day names to minutes, e.g. { Monday: 45, Wednesday: 45 }",
        required: true,
      },
      {
        name: "workoutPlan",
        type: "object[]",
        description:
          "REQUIRED. Array of workout days. Each item: { day, duration, focus?, exercises }. exercises: array of { name, sets?, reps?, duration?, muscleGroup?, notes? } or strings like 'Squats 3x12'. Example: [{ day: 'Monday', duration: 45, focus: 'Upper body', exercises: [{ name: 'Bench press', sets: 3, reps: 10, muscleGroup: 'Chest' }, { name: 'Rows', sets: 3, reps: 12, muscleGroup: 'Back' }] }]",
        required: true,
      },
    ],
    handler: async ({ schedule, workoutPlan }) => {
      try {
        const s = schedule as Record<string, number>;
        if (!s || typeof s !== "object") {
          return JSON.stringify({ schedule: {}, plan: [] });
        }
        setSchedule(s);
        const plan = (Array.isArray(workoutPlan) ? workoutPlan : []).map(
          (d: Record<string, unknown>) => ({
            day: d.day ?? "",
            duration: typeof d.duration === "number" ? d.duration : 30,
            focus: d.focus as string | undefined,
            exercises: Array.isArray(d.exercises)
              ? d.exercises.map((e: unknown) =>
                  typeof e === "object" && e !== null
                    ? (e as { name: string; sets?: number; reps?: number; duration?: number; muscleGroup?: string; notes?: string })
                    : String(e)
                )
              : [],
          })
        ) as WorkoutDay[];
        if (plan.length > 0) setWorkoutPlan(plan);
        return JSON.stringify({
          schedule: s,
          plan,
        });
      } catch (err) {
        console.error("setRoutine failed:", err);
        return JSON.stringify({ schedule: {}, plan: [] });
      }
    },
    render: ({ result }) => {
      try {
        const data = result ? JSON.parse(result) : { plan: [] };
        const plan = (data.plan || []) as WorkoutDay[];
        if (plan.length === 0) return <span className="text-zinc-500">Schedule saved.</span>;
        return (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="mb-3 font-semibold">Weekly Workout Plan</h3>
            <div className="space-y-3">
              {plan.map((d, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-white p-3 dark:bg-zinc-800"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">{d.day}</span>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {d.duration} min{d.focus ? ` • ${d.focus}` : ""}
                    </span>
                  </div>
                  {Array.isArray(d.exercises) && d.exercises.length > 0 && (
                    <div className="ml-1 space-y-2">
                      {d.exercises.map((e, j) => (
                        <ExerciseWithGif key={j} exercise={e} compact />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      } catch {
        return <span className="text-zinc-500">Schedule saved.</span>;
      }
    },
  });

  useCopilotAction({
    name: "saveFullPlan",
    description:
      "Save the ENTIRE plan (workout + meals + sleep tips) in ONE call. Use this when the user asks for a full plan, says 'add to my plan', 'update my plan', or 'save this'. Pass planData as a JSON string with keys: workoutPlan (array of {day, duration, focus, exercises}), meals (array of {name, calories, mealType, description?, ingredients?}), sleepTips (array of {category, tip, source?}).",
    parameters: [
      {
        name: "planData",
        type: "string",
        description:
          "JSON string. Example: {\"workoutPlan\":[{\"day\":\"Monday\",\"duration\":60,\"focus\":\"Upper body\",\"exercises\":[{\"name\":\"Bench press\",\"sets\":4,\"reps\":8,\"muscleGroup\":\"Chest\"}]}],\"meals\":[{\"name\":\"Omelette\",\"calories\":400,\"mealType\":\"breakfast\",\"description\":\"...\",\"ingredients\":[\"eggs\",\"spinach\"]}],\"sleepTips\":[{\"category\":\"Sleep hygiene\",\"tip\":\"Consistent sleep schedule\",\"source\":\"CDC\"}]}",
        required: true,
      },
    ],
    handler: async ({ planData }) => {
      try {
        const data = typeof planData === "string" ? JSON.parse(planData) : planData;
        const wp = data.workoutPlan;
        const m = data.meals;
        const st = data.sleepTips;
        if (Array.isArray(wp) && wp.length > 0) {
          const schedule: Record<string, number> = {};
          const plan = wp.map((d: Record<string, unknown>) => {
            schedule[(d.day as string) ?? ""] = (d.duration as number) ?? 30;
            return {
              day: d.day ?? "",
              duration: (d.duration as number) ?? 30,
              focus: d.focus as string | undefined,
              exercises: Array.isArray(d.exercises)
                ? d.exercises.map((e: unknown) =>
                    typeof e === "object" && e !== null ? (e as Record<string, unknown>) : String(e)
                  )
                : [],
            };
          });
          setSchedule(schedule);
          setWorkoutPlan(plan as WorkoutDay[]);
        }
        if (Array.isArray(m) && m.length > 0) setLastDietPlan(m as Meal[]);
        if (Array.isArray(st) && st.length > 0) setLastSleepTips(st as SleepTip[]);
        return JSON.stringify({
          workoutPlan: wp ?? [],
          meals: m ?? [],
          sleepTips: st ?? [],
        });
      } catch (err) {
        console.error("saveFullPlan failed:", err);
        return JSON.stringify({ workoutPlan: [], meals: [], sleepTips: [] });
      }
    },
    render: ({ result }) => {
      try {
        const data = result ? JSON.parse(result) : {};
        const hasWorkout = Array.isArray(data.workoutPlan) && data.workoutPlan.length > 0;
        const hasMeals = Array.isArray(data.meals) && data.meals.length > 0;
        const hasTips = Array.isArray(data.sleepTips) && data.sleepTips.length > 0;
        if (!hasWorkout && !hasMeals && !hasTips)
          return <span className="text-zinc-500">Plan saved.</span>;
        return (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/30">
            <p className="font-medium text-emerald-800 dark:text-emerald-200">
              Plan updated successfully
            </p>
            <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
              {[hasWorkout && "Workout", hasMeals && "Meals", hasTips && "Sleep tips"]
                .filter(Boolean)
                .join(" • ")}{" "}
              saved. Check the tabs to view your plan.
            </p>
          </div>
        );
      } catch {
        return <span className="text-zinc-500">Plan saved.</span>;
      }
    },
  });

  useCopilotAction({
    name: "dietSuggestion",
    description:
      "Suggest specific dishes and meal plans based on diet preference (vegetarian/vegan/non_vegetarian), calorie target, and calorie mode (deficit for fat loss, surplus for muscle gain). ALWAYS provide specific dish names and match the user's diet type.",
    parameters: [
      {
        name: "pref",
        type: "string",
        description: "Diet preference: vegetarian, vegan, non_vegetarian. Must match user preference.",
      },
      {
        name: "calories",
        type: "number",
        description: "Target daily calories",
      },
      {
        name: "calorieMode",
        type: "string",
        description: "deficit (fat loss), surplus (muscle gain), or maintenance",
      },
      {
        name: "meals",
        type: "object[]",
        description:
          "REQUIRED. Array of dishes. Each: { name, calories, mealType?, dietType?, protein?, carbs?, fat?, description?, ingredients? }. Use concrete dish names (e.g. 'Paneer tikka', 'Greek salad', 'Grilled chicken breast').",
        required: true,
      },
    ],
    handler: async ({ pref, calories, calorieMode, meals }) => {
      try {
        if (pref) setDietPref(pref);
        if (typeof calories === "number") setCalories(calories);
        if (calorieMode) setCalorieMode(calorieMode as "deficit" | "surplus" | "maintenance");
        const mealList = Array.isArray(meals) ? meals : [];
        if (mealList.length > 0) setLastDietPlan(mealList as Meal[]);
        return JSON.stringify({
          pref: pref ?? "non_vegetarian",
          calories: calories ?? 2000,
          calorieMode: calorieMode ?? "maintenance",
          meals: mealList,
        });
      } catch (err) {
        console.error("dietSuggestion failed:", err);
        return JSON.stringify({
          pref: "non_vegetarian",
          calories: 2000,
          calorieMode: "maintenance",
          meals: [],
        });
      }
    },
    render: ({ result }) => {
      try {
        const data = result ? JSON.parse(result) : { meals: [] };
        const meals = (data.meals || []) as Meal[];
        if (meals.length === 0)
          return <span className="text-zinc-500">Diet preferences updated.</span>;
        const mode = data.calorieMode ?? "maintenance";
        const modeLabel =
          mode === "deficit" ? "Calorie deficit" : mode === "surplus" ? "Calorie surplus" : "Maintenance";
        const modeColor =
          mode === "deficit"
            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
            : mode === "surplus"
              ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30"
              : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900";
        return (
          <div
            className={`rounded-lg border p-4 ${modeColor}`}
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">
                Meal plan • {data.calories} cal • {data.pref?.replace("_", "-")}
              </h3>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  mode === "deficit"
                    ? "bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100"
                    : mode === "surplus"
                      ? "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                      : "bg-zinc-200 text-zinc-700 dark:bg-zinc-600 dark:text-zinc-200"
                }`}
              >
                {modeLabel}
              </span>
            </div>
            <div className="space-y-2">
              {meals.map((m, i) => {
                const dietBadge =
                  (m.dietType ?? data.pref) === "vegetarian"
                    ? "🌱 Veg"
                    : (m.dietType ?? data.pref) === "vegan"
                      ? "🌿 Vegan"
                      : "🍗 Non-veg";
                const macro =
                  m.protein != null || m.carbs != null || m.fat != null
                    ? [
                      m.protein != null && `P ${m.protein}g`,
                      m.carbs != null && `C ${m.carbs}g`,
                      m.fat != null && `F ${m.fat}g`,
                    ]
                        .filter(Boolean)
                        .join(" • ")
                    : null;
                return (
                  <div
                    key={i}
                    className="rounded-lg bg-white p-3 shadow-sm dark:bg-zinc-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {m.calories} cal
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-zinc-500">
                      <span>{dietBadge}</span>
                      {m.mealType && (
                        <span className="capitalize">{m.mealType}</span>
                      )}
                      {macro && <span>{macro}</span>}
                    </div>
                    {m.description && (
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {m.description}
                      </p>
                    )}
                    {Array.isArray(m.ingredients) && m.ingredients.length > 0 && (
                      <p className="mt-1 text-xs text-zinc-500">
                        {m.ingredients.join(", ")}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      } catch {
        return <span className="text-zinc-500">Diet preferences updated.</span>;
      }
    },
  });

  useCopilotAction({
    name: "sleepTips",
    description:
      "Give science-backed sleep and recovery tips. Use research-supported advice: sleep hygiene (consistent schedule, dark room, no screens), circadian rhythm (light exposure, temperature), REM/deep sleep stages, NSF/CDC recommendations (7-9h), cortisol/melatonin. Structure tips with category and optional source.",
    parameters: [
      {
        name: "hours",
        type: "number",
        description: "Hours of sleep per night the user gets",
      },
      {
        name: "tips",
        type: "object[]",
        description:
          "REQUIRED. Array of { category, tip, source? }. Categories: Sleep hygiene, Circadian rhythm, Recovery, Sleep stages, Evidence-based. Source: e.g. 'CDC', 'National Sleep Foundation', 'Sleep Research Society'.",
        required: true,
      },
    ],
    handler: async ({ hours, tips }) => {
      try {
        if (typeof hours === "number") setSleepHours(hours);
        const tipList = Array.isArray(tips) ? tips : [];
        if (tipList.length > 0) {
          setLastSleepTips(
            tipList.map((t: { category?: string; tip: string; source?: string }) => ({
              category: t.category ?? "General",
              tip: typeof t.tip === "string" ? t.tip : String(t.tip),
              source: t.source,
            })) as SleepTip[]
          );
        }
        return JSON.stringify({
          hours: hours ?? 7,
          tips: tipList,
        });
      } catch (err) {
        console.error("sleepTips failed:", err);
        return JSON.stringify({ hours: 7, tips: [] });
      }
    },
    render: ({ result }) => {
      try {
        const data = result ? JSON.parse(result) : { tips: [] };
        const tips = (data.tips || []) as SleepTip[];
        if (tips.length === 0)
          return <span className="text-zinc-500">Sleep tips saved.</span>;
        return (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Sleep Tips ({data.hours}h)</h3>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                Evidence-based
              </span>
            </div>
            <div className="space-y-3">
              {tips.map((t, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-600 dark:bg-zinc-800"
                >
                  {t.category && (
                    <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                      {t.category}
                    </span>
                  )}
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    {t.tip}
                  </p>
                  {t.source && (
                    <p className="mt-1 text-xs text-zinc-500">
                      Source: {t.source}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      } catch {
        return <span className="text-zinc-500">Sleep tips saved.</span>;
      }
    },
  });

  return null;
}
