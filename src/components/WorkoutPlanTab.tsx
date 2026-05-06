"use client";

import { useGym } from "@/context/GymContext";
import { ExerciseWithGif } from "@/components/ExerciseWithGif";
import { ProgressTracker } from "@/components/ProgressTracker";
import type { WorkoutDay } from "@/types/gym";

export function WorkoutPlanTab() {
  const { state } = useGym();
  const plan = state.workoutPlan;
  const schedule = state.schedule;

  if (plan.length > 0) {
    return (
      <div className="space-y-4">
        <ProgressTracker />
        <h3 className="font-semibold">Your Weekly Workout Plan</h3>
        <div className="space-y-3">
          {plan.map((d, i) => (
            <div
              key={i}
              className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800"
            >
              <div className="mb-2 flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-600">
                <span className="font-medium">{d.day}</span>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {d.duration} min{d.focus ? ` • ${d.focus}` : ""}
                </span>
              </div>
              {Array.isArray(d.exercises) && d.exercises.length > 0 ? (
                <div className="space-y-2">
                  {d.exercises.map((e, j) => (
                    <ExerciseWithGif key={j} exercise={e} compact />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No exercises listed</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (Object.keys(schedule).length > 0) {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold">Your Weekly Schedule</h3>
        <p className="text-sm text-zinc-500">
          Times saved. Ask the AI to add a detailed plan with specific
          exercises for each day.
        </p>
        <div className="grid gap-2">
          {Object.entries(schedule).map(([day, minutes]) => (
            <div
              key={day}
              className="flex items-center justify-between rounded-lg bg-zinc-100 px-4 py-2 dark:bg-zinc-800"
            >
              <span className="font-medium capitalize">{day}</span>
              <span className="text-zinc-600 dark:text-zinc-400">
                {minutes} min
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-zinc-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
      <p>No workout schedule yet.</p>
      <p className="mt-2 text-sm">
        Ask the AI: &quot;Create a detailed weekly workout plan for 45 min on
        Monday, Wednesday, Friday with specific exercises for each day&quot;
      </p>
    </div>
  );
}
