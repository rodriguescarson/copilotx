// Tiny observable profile store. Mirrors the four fields the web
// /studio/voice route captures (goal, schedule, dietPref, sleepHours).
// No external state library — useSyncExternalStore is enough.

import { useSyncExternalStore } from "react";

export type FitnessProfile = {
  goal: string | null;
  schedule: string | null;
  dietPref: string | null;
  sleepHours: number | null;
  startedAt: number | null;
  completedAt: number | null;
};

const EMPTY: FitnessProfile = {
  goal: null,
  schedule: null,
  dietPref: null,
  sleepHours: null,
  startedAt: null,
  completedAt: null,
};

let state: FitnessProfile = EMPTY;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function isComplete(p: FitnessProfile): boolean {
  return (
    p.goal != null &&
    p.schedule != null &&
    p.dietPref != null &&
    p.sleepHours != null
  );
}

function update(patch: Partial<FitnessProfile>) {
  const wasComplete = isComplete(state);
  const next: FitnessProfile = {
    ...state,
    ...patch,
    startedAt: state.startedAt ?? Date.now(),
  };
  // Latch completedAt the first time the profile becomes full.
  if (!wasComplete && isComplete(next) && next.completedAt == null) {
    next.completedAt = Date.now();
  }
  state = next;
  emit();
}

export const profileStore = {
  getSnapshot: () => state,
  subscribe: (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  setGoal: (goal: string) => update({ goal: goal.trim() }),
  setSchedule: (schedule: string) => update({ schedule: schedule.trim() }),
  setDietPref: (dietPref: string) => update({ dietPref: dietPref.trim() }),
  setSleepHours: (hours: number) => {
    const clamped = Math.max(3, Math.min(12, Math.round(hours)));
    update({ sleepHours: clamped });
  },
  reset: () => {
    state = EMPTY;
    emit();
  },
};

export function useProfile(): FitnessProfile {
  return useSyncExternalStore(
    profileStore.subscribe,
    profileStore.getSnapshot,
    profileStore.getSnapshot,
  );
}

export function profileStats(p: FitnessProfile): {
  filled: number;
  total: number;
  complete: boolean;
  elapsedMs: number | null;
} {
  const filled =
    Number(p.goal != null) +
    Number(p.schedule != null) +
    Number(p.dietPref != null) +
    Number(p.sleepHours != null);
  const complete = filled === 4;
  const elapsedMs =
    complete && p.completedAt != null && p.startedAt != null
      ? p.completedAt - p.startedAt
      : null;
  return { filled, total: 4, complete, elapsedMs };
}
