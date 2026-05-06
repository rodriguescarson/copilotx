"use client";

import { useEffect, useRef } from "react";

type Props = {
  finalText: string;
  interimText: string;
  placeholder?: string;
};

export function TranscriptPanel({
  finalText,
  interimText,
  placeholder = "Tell me about your fitness goals — your time, your diet, your sleep…",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when new text arrives.
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [finalText, interimText]);

  const empty = !finalText && !interimText;

  return (
    <div
      ref={ref}
      className={[
        "min-h-[120px] max-h-[220px] overflow-y-auto rounded-2xl",
        "border border-white/10 bg-zinc-950/60 backdrop-blur",
        "px-5 py-4 text-base leading-relaxed",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
      ].join(" ")}
      aria-live="polite"
      aria-label="Live transcript"
    >
      {empty ? (
        <p className="text-zinc-500 italic">{placeholder}</p>
      ) : (
        <p className="text-zinc-100 whitespace-pre-wrap">
          {finalText && <span>{finalText} </span>}
          {interimText && (
            <span className="text-zinc-400 italic">{interimText}</span>
          )}
        </p>
      )}
    </div>
  );
}
