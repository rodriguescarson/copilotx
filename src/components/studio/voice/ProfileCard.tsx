"use client";

import type { ReactNode } from "react";

export type VoiceProfile = {
  goal: string | null;
  schedule: string | null;
  dietPref: string | null;
  sleepHours: number | null;
};

type Props = {
  profile: VoiceProfile;
  elapsedMs: number | null;
};

const FIELD_DEFS: Array<{
  key: keyof VoiceProfile;
  label: string;
  icon: ReactNode;
  format: (v: VoiceProfile[keyof VoiceProfile]) => string;
}> = [
  {
    key: "goal",
    label: "Goal",
    icon: <DotIcon className="text-cyan-300" />,
    format: (v) => (typeof v === "string" ? v : ""),
  },
  {
    key: "schedule",
    label: "Weekly schedule",
    icon: <DotIcon className="text-purple-300" />,
    format: (v) => (typeof v === "string" ? v : ""),
  },
  {
    key: "dietPref",
    label: "Diet preference",
    icon: <DotIcon className="text-emerald-300" />,
    format: (v) => (typeof v === "string" ? v : ""),
  },
  {
    key: "sleepHours",
    label: "Sleep hours",
    icon: <DotIcon className="text-amber-300" />,
    format: (v) => (typeof v === "number" ? `${v} hours / night` : ""),
  },
];

export function ProfileCard({ profile, elapsedMs }: Props) {
  const filled = FIELD_DEFS.filter((f) => profile[f.key] != null).length;
  const total = FIELD_DEFS.length;
  const complete = filled === total;
  const seconds = elapsedMs != null ? (elapsedMs / 1000).toFixed(1) : null;

  return (
    <aside
      className={[
        "rounded-3xl border border-white/10 bg-zinc-950/70 backdrop-blur-md",
        "p-6 shadow-[0_30px_80px_-30px_rgba(34,211,238,0.35)]",
      ].join(" ")}
      aria-label="Fitness profile"
    >
      <header className="mb-5 flex items-baseline justify-between">
        <h2 className="text-sm font-medium tracking-wide uppercase text-zinc-400">
          Profile
        </h2>
        <span className="text-xs text-zinc-500 tabular-nums">
          {filled} / {total}
        </span>
      </header>

      <ul className="space-y-3">
        {FIELD_DEFS.map((f) => {
          const value = profile[f.key];
          const filledIn = value != null && value !== "";
          const display = f.format(value);
          return (
            <li
              key={f.key}
              className={[
                "rounded-2xl border px-4 py-3 transition-all duration-300",
                filledIn
                  ? "border-white/10 bg-white/[0.03]"
                  : "border-dashed border-white/10 bg-transparent",
              ].join(" ")}
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500">
                {f.icon}
                {f.label}
              </div>
              <div className="mt-1 min-h-[24px] text-base">
                {filledIn ? (
                  <span className="voice-field-pop block text-zinc-50">
                    {display}
                  </span>
                ) : (
                  <span className="text-zinc-600 italic">listening…</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {complete && (
        <div className="voice-field-pop mt-5 rounded-2xl border border-cyan-400/30 bg-cyan-400/[0.06] px-4 py-3 text-sm text-cyan-100">
          {seconds
            ? `Profile built in ${seconds} seconds.`
            : "Profile built."}
        </div>
      )}
    </aside>
  );
}

function DotIcon({ className }: { className?: string }) {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      className={className}
      aria-hidden
    >
      <circle cx="4" cy="4" r="3" fill="currentColor" />
    </svg>
  );
}
