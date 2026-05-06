"use client";

import type { KPIWidget } from "@/types/dashboard";

const ACCENT_CLASSES: Record<string, { ring: string; glow: string; text: string }> = {
  violet: {
    ring: "ring-violet-500/40",
    glow: "from-violet-500/30",
    text: "text-violet-300",
  },
  emerald: {
    ring: "ring-emerald-500/40",
    glow: "from-emerald-500/30",
    text: "text-emerald-300",
  },
  amber: {
    ring: "ring-amber-500/40",
    glow: "from-amber-500/30",
    text: "text-amber-300",
  },
  sky: {
    ring: "ring-sky-500/40",
    glow: "from-sky-500/30",
    text: "text-sky-300",
  },
  rose: {
    ring: "ring-rose-500/40",
    glow: "from-rose-500/30",
    text: "text-rose-300",
  },
};

export function KPICard({ widget, compact = false }: { widget: KPIWidget; compact?: boolean }) {
  const { label, value, delta, trend, accent = "violet" } = widget.config;
  const palette = ACCENT_CLASSES[accent] ?? ACCENT_CLASSES.violet;
  const trendSymbol = trend === "up" ? "▲" : trend === "down" ? "▼" : "•";
  const trendColor =
    trend === "up"
      ? "text-emerald-300"
      : trend === "down"
        ? "text-rose-300"
        : "text-zinc-400";

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-zinc-900/70 p-5 ring-1 ${palette.ring} backdrop-blur-sm transition-all duration-500 hover:-translate-y-0.5 hover:bg-zinc-900/90 ${
        compact ? "" : "min-h-[140px]"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${palette.glow} via-transparent to-transparent opacity-60`}
        aria-hidden
      />
      <div className="relative flex h-full flex-col justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-semibold tabular-nums text-zinc-50 ${compact ? "text-2xl" : "md:text-4xl"}`}>
            {value}
          </span>
          {typeof delta === "number" && (
            <span className={`text-sm font-medium ${trendColor}`}>
              {trendSymbol} {Math.abs(delta)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
