"use client";

import { useEffect, useRef, type ReactNode } from "react";

export type MicState = "idle" | "listening" | "processing";

type Props = {
  state: MicState;
  /** Callback returning current 0-1 audio level. Polled via rAF for the glow. */
  getLevel?: () => number;
  disabled?: boolean;
  onClick: () => void;
  ariaLabel?: string;
};

export function MicButton({
  state,
  getLevel,
  disabled = false,
  onClick,
  ariaLabel = "Toggle voice input",
}: Props) {
  const listening = state === "listening";
  const processing = state === "processing";
  const glowRef = useRef<HTMLSpanElement | null>(null);

  // Live-update glow scale from mic level without re-rendering.
  useEffect(() => {
    if (!listening || !getLevel) {
      if (glowRef.current) glowRef.current.style.transform = "scale(1)";
      return;
    }
    let raf = 0;
    const tick = () => {
      const lvl = Math.max(0, Math.min(1, getLevel()));
      if (glowRef.current) {
        glowRef.current.style.transform = `scale(${1 + lvl * 0.35})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [listening, getLevel]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={listening}
      aria-label={ariaLabel}
      className={[
        "relative grid place-items-center",
        "h-40 w-40 rounded-full select-none",
        "transition-all duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/40",
        disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
      ].join(" ")}
    >
      {/* Ambient glow halo */}
      <span
        aria-hidden
        ref={glowRef}
        className={[
          "absolute inset-0 rounded-full blur-2xl pointer-events-none",
          "bg-[radial-gradient(circle,_rgba(34,211,238,0.55)_0%,_rgba(168,85,247,0.25)_55%,_transparent_75%)]",
          "transition-transform duration-100 ease-out",
          listening ? "voice-pulse-slow opacity-90" : "opacity-30",
        ].join(" ")}
      />

      {/* Outer ring (fast pulse during listening) */}
      <span
        aria-hidden
        className={[
          "absolute inset-[-12px] rounded-full",
          "border border-cyan-400/40",
          listening ? "voice-ring-pulse" : "opacity-40",
        ].join(" ")}
      />
      <span
        aria-hidden
        className={[
          "absolute inset-[-24px] rounded-full",
          "border border-purple-400/30",
          listening ? "voice-ring-pulse-delayed" : "opacity-20",
        ].join(" ")}
      />

      {/* Core button */}
      <span
        className={[
          "relative grid place-items-center h-28 w-28 rounded-full",
          "bg-gradient-to-b from-zinc-800 to-zinc-950",
          "ring-1 ring-white/10 shadow-[0_10px_40px_-10px_rgba(34,211,238,0.7)]",
          listening ? "ring-cyan-400/60" : "",
          processing ? "ring-purple-400/60" : "",
        ].join(" ")}
      >
        <MicIcon active={listening} />
        {processing && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-300 animate-spin"
          />
        )}
      </span>
    </button>
  );
}

function MicIcon({ active }: { active: boolean }): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      width="44"
      height="44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={active ? "text-cyan-300" : "text-zinc-200"}
      aria-hidden
    >
      <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
      <path d="M8 21h8" />
    </svg>
  );
}
