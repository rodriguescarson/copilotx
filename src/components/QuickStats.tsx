"use client";

import { useGym } from "@/context/GymContext";

type Stat = {
  key: string;
  label: string;
  value: string;
  unit?: string;
  empty: boolean;
  accent: string;
};

function formatGoal(goal: string): string {
  if (!goal) return "Not set";
  // accept "muscle_gain", "muscle gain", or "muscle-gain" — render Title Case
  const cleaned = goal.replace(/[_-]+/g, " ").trim();
  if (!cleaned) return "Not set";
  return cleaned
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function QuickStats() {
  const { state } = useGym();

  const workoutDays =
    state.workoutPlan.length || Object.keys(state.schedule).length || 0;

  const stats: Stat[] = [
    {
      key: "goal",
      label: "Goal",
      value: formatGoal(state.goal),
      empty: !state.goal,
      accent: "var(--color-volt-300)",
    },
    {
      key: "calories",
      label: "Daily calories",
      value: state.calories ? state.calories.toLocaleString() : "—",
      unit: state.calories ? "kcal" : undefined,
      empty: !state.calories,
      accent: "var(--color-citrus)",
    },
    {
      key: "sleep",
      label: "Sleep target",
      value: state.sleepHours ? String(state.sleepHours) : "—",
      unit: state.sleepHours ? "hours" : undefined,
      empty: !state.sleepHours,
      accent: "var(--color-deep)",
    },
    {
      key: "workouts",
      label: "Workout days",
      value: workoutDays ? String(workoutDays) : "—",
      unit: workoutDays ? (workoutDays === 1 ? "day / wk" : "days / wk") : undefined,
      empty: !workoutDays,
      accent: "var(--color-ember)",
    },
  ];

  return (
    <section aria-label="Plan summary" className="relative">
      <div className="mb-3 flex items-center gap-3">
        <span className="eyebrow">Live status</span>
        <span
          aria-hidden
          className="h-px flex-1"
          style={{ background: "var(--color-ink-700)" }}
        />
      </div>

      <ul
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
        role="list"
      >
        {stats.map((s) => (
          <li
            key={s.key}
            className="cx-card-flat relative overflow-hidden p-5"
          >
            {/* accent rail */}
            <span
              aria-hidden
              className="absolute left-0 top-0 h-full w-[2px]"
              style={{
                background: s.empty
                  ? "var(--color-ink-600)"
                  : s.accent,
                opacity: s.empty ? 0.6 : 0.85,
              }}
            />

            <div
              className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.18em]"
              style={{ color: "var(--color-ink-400)" }}
            >
              <span>{s.label}</span>
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{
                  background: s.empty ? "var(--color-ink-600)" : s.accent,
                  boxShadow: s.empty
                    ? "none"
                    : `0 0 10px ${s.accent}`,
                }}
              />
            </div>

            <div className="mt-3 flex items-baseline gap-1.5">
              <span
                className="display-headline text-[40px] leading-none"
                style={{
                  color: s.empty ? "var(--color-ink-500)" : "var(--color-ink-50)",
                }}
              >
                {s.value}
              </span>
              {s.unit && (
                <span
                  className="font-mono text-[11px] uppercase tracking-wider"
                  style={{ color: "var(--color-ink-400)" }}
                >
                  {s.unit}
                </span>
              )}
            </div>

            {s.empty && (
              <p
                className="mt-2 text-[12px]"
                style={{ color: "var(--color-ink-400)" }}
              >
                Ask your coach to set this.
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
