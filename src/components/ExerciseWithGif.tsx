"use client";

import { useEffect, useState } from "react";
import type { WorkoutExercise } from "@/types/gym";

const CACHE_PREFIX = "exercise-gif:";
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

type CachedEntry = { url: string; ts: number };

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

function normalizeQuery(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\d+\s*x\s*\d+/g, "")
    .replace(/\b(sets?|reps?)\b/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s+/g, "-");
}

function readCache(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CachedEntry;
    if (!entry?.url || typeof entry.ts !== "number") return null;
    if (Date.now() - entry.ts > CACHE_TTL_MS) return null;
    return entry.url;
  } catch {
    return null;
  }
}

function writeCache(key: string, url: string): void {
  if (typeof window === "undefined") return;
  try {
    const entry: CachedEntry = { url, ts: Date.now() };
    window.localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // localStorage may be full or unavailable; safe to ignore.
  }
}

function DumbbellSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Exercise illustration"
      className={className}
    >
      <defs>
        <linearGradient id="dumbbell-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect x="22" y="28" width="20" height="8" rx="1.5" fill="url(#dumbbell-grad)" />
      <rect x="14" y="22" width="6" height="20" rx="1.5" fill="url(#dumbbell-grad)" />
      <rect x="44" y="22" width="6" height="20" rx="1.5" fill="url(#dumbbell-grad)" />
      <rect x="8" y="26" width="4" height="12" rx="1" fill="url(#dumbbell-grad)" />
      <rect x="52" y="26" width="4" height="12" rx="1" fill="url(#dumbbell-grad)" />
    </svg>
  );
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
    const cacheKey = normalizeQuery(searchTerm);

    const cached = readCache(cacheKey);
    if (cached) {
      // SSR returns null from readCache, so client must hydrate via setState.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGifUrl(cached);
      setLoading(false);
      return;
    }

    const q = encodeURIComponent(searchTerm);
    fetch(`/api/giphy?q=${q}`)
      .then((r) => r.json())
      .then((data: { url?: string | null; fallback?: boolean }) => {
        if (cancelled) return;
        if (data.fallback || !data.url) {
          setGifUrl(null);
          return;
        }
        setGifUrl(data.url);
        writeCache(cacheKey, data.url);
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

  const renderMedia = (imgClass: string, fallbackClass: string) => {
    if (gifUrl) {
      return (
        <img
          src={gifUrl}
          alt={`${searchTerm} exercise demonstration`}
          className={imgClass}
          loading="lazy"
          onError={() => setGifUrl(null)}
        />
      );
    }
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-50 dark:bg-zinc-700">
        <DumbbellSvg className={fallbackClass} />
      </div>
    );
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-700">
          {loading ? (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-4 w-4 animate-pulse rounded-full bg-zinc-400" />
            </div>
          ) : (
            renderMedia("h-full w-full object-cover", "h-8 w-8")
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
          ) : (
            renderMedia("h-full w-full object-cover", "h-12 w-12")
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
