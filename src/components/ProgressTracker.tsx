"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { useGym } from "@/context/GymContext";
import type { WorkoutExercise } from "@/types/gym";

const STORAGE_KEY = "gym-progress";
const STORAGE_VERSION = 1;
const STREAK_WINDOW_DAYS = 7;

interface ProgressData {
  version: number;
  completed: string[];
  history: { date: string }[];
}

const EMPTY_DATA: ProgressData = {
  version: STORAGE_VERSION,
  completed: [],
  history: [],
};

function todayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function exerciseLabel(e: WorkoutExercise | string): string {
  return typeof e === "string" ? e : e.name;
}

function parseStorage(raw: string | null): ProgressData {
  if (!raw) return EMPTY_DATA;
  try {
    const parsed = JSON.parse(raw) as Partial<ProgressData>;
    if (parsed.version !== STORAGE_VERSION) return EMPTY_DATA;
    return {
      version: STORAGE_VERSION,
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return EMPTY_DATA;
  }
}

// In-tab pub/sub so writes from this tab notify React (the `storage` event
// only fires in *other* tabs).
const listeners = new Set<() => void>();
let cachedSnapshot: { raw: string | null; data: ProgressData } = {
  raw: null,
  data: EMPTY_DATA,
};

function getSnapshot(): ProgressData {
  if (typeof window === "undefined") return EMPTY_DATA;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedSnapshot.raw) return cachedSnapshot.data;
  cachedSnapshot = { raw, data: parseStorage(raw) };
  return cachedSnapshot.data;
}

function getServerSnapshot(): ProgressData {
  return EMPTY_DATA;
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) callback();
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function writeStorage(data: ProgressData) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(data);
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // ignore quota / unavailable storage
  }
  cachedSnapshot = { raw, data };
  listeners.forEach((cb) => cb());
}

function computeStreak(history: { date: string }[]): number {
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - (STREAK_WINDOW_DAYS - 1));
  const recent = new Set<string>();
  for (const entry of history) {
    if (!entry?.date) continue;
    const d = new Date(entry.date);
    if (Number.isNaN(d.getTime())) continue;
    d.setHours(0, 0, 0, 0);
    if (d.getTime() >= cutoff.getTime()) recent.add(entry.date);
  }
  return recent.size;
}

export function ProgressTracker() {
  const { state } = useGym();
  const plan = state.workoutPlan;

  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const completedSet = useMemo(
    () => new Set(data.completed),
    [data.completed],
  );

  const totalExercises = useMemo(
    () => plan.reduce((sum, day) => sum + (day.exercises?.length ?? 0), 0),
    [plan],
  );

  const completedCount = useMemo(() => {
    let count = 0;
    plan.forEach((day, dayIndex) => {
      day.exercises?.forEach((_, exerciseIndex) => {
        if (completedSet.has(`${dayIndex}-${exerciseIndex}`)) count += 1;
      });
    });
    return count;
  }, [plan, completedSet]);

  const streak = useMemo(() => computeStreak(data.history), [data.history]);

  const toggle = useCallback(
    (key: string) => {
      const wasMarking = !completedSet.has(key);
      const nextCompleted = new Set(completedSet);
      if (wasMarking) nextCompleted.add(key);
      else nextCompleted.delete(key);

      let nextHistory = data.history;
      if (wasMarking) {
        const today = todayKey();
        if (!data.history.some((h) => h.date === today)) {
          nextHistory = [...data.history, { date: today }];
        }
      }

      writeStorage({
        version: STORAGE_VERSION,
        completed: Array.from(nextCompleted),
        history: nextHistory,
      });
    },
    [completedSet, data.history],
  );

  const resetWeek = useCallback(() => {
    writeStorage({
      version: STORAGE_VERSION,
      completed: [],
      history: data.history,
    });
  }, [data.history]);

  if (plan.length === 0) return null;

  const percent =
    totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">Progress this week</h3>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
          {streak} day streak
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {completedCount} / {totalExercises} exercises completed this week
        </p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div
            className="h-2 rounded-full bg-emerald-500 transition-[width]"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <ul className="divide-y divide-zinc-100 rounded-md border border-zinc-100 dark:divide-zinc-800 dark:border-zinc-800">
        {plan.map((day, dayIndex) =>
          (day.exercises ?? []).map((exercise, exerciseIndex) => {
            const key = `${dayIndex}-${exerciseIndex}`;
            const checked = completedSet.has(key);
            return (
              <li
                key={key}
                className="flex items-center gap-3 px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-emerald-500"
                  checked={checked}
                  onChange={() => toggle(key)}
                  aria-label={`Mark ${exerciseLabel(exercise)} complete`}
                />
                <span className="w-20 shrink-0 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {day.day}
                </span>
                <span
                  className={
                    checked
                      ? "flex-1 text-zinc-400 line-through dark:text-zinc-500"
                      : "flex-1"
                  }
                >
                  {exerciseLabel(exercise)}
                </span>
              </li>
            );
          }),
        )}
      </ul>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={resetWeek}
          className="rounded-md border border-zinc-200 px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Reset week
        </button>
      </div>
    </div>
  );
}
