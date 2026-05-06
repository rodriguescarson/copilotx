"use client";

import { useState } from "react";

interface PromptPaneProps {
  onGenerate: (description: string) => void;
  generating: boolean;
  /** Recent generations, most recent first — for the history list. */
  history: { id: string; description: string; actionName: string }[];
  onPickHistory: (id: string) => void;
  activeId: string | null;
}

const EXAMPLES = [
  "an action that books a flight given origin, destination and date",
  "an action that summarizes a list of meeting notes",
  "an action that creates a Linear ticket from a bug report",
  "an action that converts a temperature between celsius and fahrenheit",
];

export function PromptPane({
  onGenerate,
  generating,
  history,
  onPickHistory,
  activeId,
}: PromptPaneProps) {
  const [value, setValue] = useState("");

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || generating) return;
    onGenerate(trimmed);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          01 · Director
        </p>
        <h2 className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Describe an action
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Plain English. The AI writes the{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[12px] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            useCopilotAction
          </code>{" "}
          for you.
        </p>
      </header>

      <div className="flex-1 overflow-auto p-5">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            Prompt
          </span>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
            }}
            placeholder="an action that..."
            rows={5}
            className="mt-2 w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2.5 font-mono text-[13px] leading-6 text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-200 dark:focus:ring-zinc-200/10"
          />
        </label>

        <button
          type="button"
          onClick={submit}
          disabled={generating || !value.trim()}
          className="mt-3 w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-50 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          {generating ? "Generating…" : "Generate action"}
        </button>
        <p className="mt-2 text-[11px] text-zinc-500">
          Tip: ⌘/Ctrl + Enter to submit.
        </p>

        <div className="mt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            Examples
          </p>
          <ul className="mt-2 space-y-1.5">
            {EXAMPLES.map((ex) => (
              <li key={ex}>
                <button
                  type="button"
                  onClick={() => setValue(ex)}
                  className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-[12.5px] text-zinc-700 transition hover:border-zinc-400 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                >
                  {ex}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {history.length > 0 && (
          <div className="mt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              History
            </p>
            <ul className="mt-2 space-y-1">
              {history.map((h) => {
                const active = h.id === activeId;
                return (
                  <li key={h.id}>
                    <button
                      type="button"
                      onClick={() => onPickHistory(h.id)}
                      className={`w-full rounded-md border px-3 py-2 text-left text-[12.5px] transition ${
                        active
                          ? "border-zinc-900 bg-zinc-900 text-zinc-50 dark:border-zinc-200 dark:bg-zinc-50 dark:text-zinc-900"
                          : "border-transparent text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                      }`}
                    >
                      <span className="block font-mono text-[11px] opacity-70">
                        {h.actionName}
                      </span>
                      <span className="block truncate">{h.description}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
