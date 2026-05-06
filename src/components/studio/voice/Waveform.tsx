"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Function returning current 0-1 audio level. Called on every animation frame. */
  getLevel: () => number;
  /** Whether to actively sample. When false, bars decay toward an idle baseline. */
  active: boolean;
  /** Number of bars. */
  bars?: number;
};

/**
 * Renders a row of vertical bars whose heights track recent audio levels.
 * Uses a single rAF loop and a sliding window so animation is smooth and CPU-cheap.
 */
export function Waveform({ getLevel, active, bars = 28 }: Props) {
  const [heights, setHeights] = useState<number[]>(() =>
    Array.from({ length: bars }, () => 0.08),
  );
  const windowRef = useRef<number[]>(Array.from({ length: bars }, () => 0.08));
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);

  useEffect(() => {
    const tick = (t: number) => {
      // Throttle DOM updates to ~30fps to keep React state updates cheap.
      if (t - lastFrameRef.current > 33) {
        lastFrameRef.current = t;
        const raw = active ? Math.max(0.05, getLevel()) : 0.05;
        // Subtle per-bar jitter so identical levels don't render as a flat block.
        const jitter = active ? (Math.random() - 0.5) * 0.15 : (Math.random() - 0.5) * 0.04;
        const newest = Math.max(0.04, Math.min(1, raw + jitter));
        const next = [...windowRef.current.slice(1), newest];
        windowRef.current = next;
        setHeights(next);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [active, getLevel]);

  return (
    <div
      className="flex h-16 items-center justify-center gap-1.5"
      aria-hidden
      role="presentation"
    >
      {heights.map((h, i) => (
        <span
          key={i}
          className={[
            "w-1.5 rounded-full transition-[height,background-color] duration-100 ease-out",
            active
              ? "bg-gradient-to-t from-cyan-400 to-purple-400"
              : "bg-zinc-700",
          ].join(" ")}
          style={{ height: `${Math.max(8, h * 100)}%` }}
        />
      ))}
    </div>
  );
}
