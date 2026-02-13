"use client";

import { useGym } from "@/context/GymContext";
import type { SleepTip } from "@/types/gym";

export function SleepTipsTab() {
  const { state } = useGym();
  const hours = state.sleepHours ?? 7;
  const tips = state.lastSleepTips ?? [];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Sleep & Recovery</h3>
      <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
        <p>
          <span className="text-zinc-600 dark:text-zinc-400">Sleep target:</span>{" "}
          {hours} hours/night
        </p>
      </div>

      {tips.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Evidence-based tips</h4>
          <div className="space-y-2">
            {tips.map((t, i) => (
              <div
                key={i}
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-600 dark:bg-zinc-800"
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
                  <p className="mt-1 text-xs text-zinc-500">Source: {t.source}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Try: &quot;Give me science-backed sleep tips for 6 hours sleep&quot; or
        &quot;Sleep hygiene tips with research&quot;
      </p>
    </div>
  );
}
