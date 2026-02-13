"use client";

import { useEffect, useState } from "react";
import type { WorkoutExercise } from "@/types/gym";

function formatExercise(e: WorkoutExercise | string): { label: string; searchTerm: string } {
  if (typeof e === "string") return { label: e, searchTerm: e };
  const ex = e as WorkoutExercise;
  const label =
    ex.reps != null
      ? `${ex.name} – ${ex.sets ?? 3}x${ex.reps}`
      : ex.duration != null
        ? `${ex.name} – ${ex.duration}s`
        : ex.name + (ex.sets ? ` – ${ex.sets} sets` : "");
  return { label, searchTerm: ex.name };
}

interface ExerciseWithGifProps {
  exercise: WorkoutExercise | string;
  compact?: boolean;
}

export function ExerciseWithGif({ exercise, compact = false }: ExerciseWithGifProps) {
  const { label, searchTerm } = formatExercise(exercise);
  const muscleGroup =
    typeof exercise === "object" && exercise !== null && "muscleGroup" in exercise
      ? (exercise as WorkoutExercise).muscleGroup
      : undefined;

  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setGifUrl(null);
    const q = encodeURIComponent(searchTerm);
    fetch(`/api/giphy?q=${q}`)
      .then((r) => r.json())
      .then((data: { url?: string | null }) => {
        if (!cancelled && data.url) setGifUrl(data.url);
      })
      .catch(() => {
        if (!cancelled) setGifUrl(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [searchTerm]);

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-700">
          {loading ? (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-4 w-4 animate-pulse rounded-full bg-zinc-400" />
            </div>
          ) : gifUrl ? (
            <img
              src={gifUrl}
              alt={`${searchTerm} workout`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-400">
              <span className="text-xs">💪</span>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
          {muscleGroup && (
            <span className="ml-2 text-xs text-zinc-500">({muscleGroup})</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-600 dark:bg-zinc-800">
      <div className="flex gap-3">
        <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-700">
          {loading ? (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-400" />
            </div>
          ) : gifUrl ? (
            <img
              src={gifUrl}
              alt={`${searchTerm} exercise demonstration`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl text-zinc-400">
              💪
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-zinc-800 dark:text-zinc-200">{label}</p>
          {muscleGroup && (
            <p className="mt-0.5 text-xs text-zinc-500">Muscle group: {muscleGroup}</p>
          )}
        </div>
      </div>
    </div>
  );
}
