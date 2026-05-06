"use client";

import type { FilterWidget } from "@/types/dashboard";

interface FilterChipProps {
  widget: FilterWidget;
  onChange?: (id: string, value: string) => void;
}

export function FilterChip({ widget, onChange }: FilterChipProps) {
  const { field, options, selected } = widget.config;
  const handle = (value: string) => onChange?.(widget.id, value);

  return (
    <div className="group rounded-2xl bg-zinc-900/70 p-4 ring-1 ring-zinc-800 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-900/90">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
        Filter · {field}
      </p>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => handle("")}
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
            !selected
              ? "bg-violet-500/20 text-violet-200 ring-1 ring-violet-400/30"
              : "bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          All
        </button>
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => handle(opt)}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              selected === opt
                ? "bg-violet-500/20 text-violet-200 ring-1 ring-violet-400/30"
                : "bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
