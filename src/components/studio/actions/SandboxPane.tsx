"use client";

import { useState } from "react";
import type { GeneratedActionSpec, SandboxInvocation } from "@/types/studio";
import { coerceArg, mockInvoke } from "@/lib/sandbox";

interface SandboxPaneProps {
  spec: GeneratedActionSpec | null;
  invocations: SandboxInvocation[];
  onInvoke: (inv: SandboxInvocation) => void;
}

/**
 * Wrap the form in this component and key by spec name so React resets the
 * local form state automatically when the active spec changes — no effects,
 * no setState-during-render anti-patterns.
 */
export function SandboxPane(props: SandboxPaneProps) {
  return <SandboxPaneInner key={props.spec?.name ?? "_empty"} {...props} />;
}

const EMPTY_HINT = [
  "Generate an action on the left, hit “try it”, and a parameter form will",
  "appear here. Fill it in, send it, and you'll see exactly what your",
  "useCopilotAction handler would receive — and what it would render — in",
  "your real CopilotKit app.",
].join(" ");

function SandboxPaneInner({ spec, invocations, onInvoke }: SandboxPaneProps) {
  const [args, setArgs] = useState<Record<string, string>>({});
  const [prompt, setPrompt] = useState("");

  function send() {
    if (!spec) return;
    const coerced: Record<string, unknown> = {};
    for (const p of spec.parameters) {
      coerced[p.name] = coerceArg(args[p.name] ?? "", p.type);
    }
    const inv = mockInvoke(spec, coerced, prompt);
    onInvoke(inv);
    setPrompt("");
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          03 · Sandbox
        </p>
        <h2 className="mt-1 flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Live preview
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            mock handler
          </span>
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Invoke the generated action with your own arguments. The handler is
          mocked so the demo stays safe — your real handler runs the same way.
        </p>
      </header>

      <div className="flex-1 overflow-auto p-5">
        {!spec && (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-5 text-sm leading-relaxed text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            {EMPTY_HINT}
          </div>
        )}

        {spec && (
          <>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] text-zinc-700 dark:text-zinc-300">
                  {spec.name}()
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  {spec.parameters.length} param
                  {spec.parameters.length === 1 ? "" : "s"}
                </span>
              </div>
              <p className="mt-1 text-[12.5px] text-zinc-600 dark:text-zinc-400">
                {spec.description}
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {spec.parameters.map((p) => (
                <label key={p.name} className="block">
                  <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                    {p.name}
                    <span className="rounded bg-zinc-200/60 px-1 py-0.5 font-mono text-[10px] normal-case tracking-normal text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {p.type}
                    </span>
                    {p.required && (
                      <span className="text-rose-500">required</span>
                    )}
                  </span>
                  <input
                    type="text"
                    value={args[p.name] ?? ""}
                    onChange={(e) =>
                      setArgs((a) => ({ ...a, [p.name]: e.target.value }))
                    }
                    placeholder={p.description}
                    className="mt-1.5 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 font-mono text-[13px] text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-200 dark:focus:ring-zinc-200/10"
                  />
                </label>
              ))}

              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                  User prompt (optional)
                </span>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder='e.g. "book me a flight to Tokyo"'
                  className="mt-1.5 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-[13px] text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-200 dark:focus:ring-zinc-200/10"
                />
              </label>

              <button
                type="button"
                onClick={send}
                className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
              >
                Send to action
              </button>
            </div>

            {invocations.length > 0 && (
              <div className="mt-6 space-y-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                  Chat
                </p>
                {invocations.map((inv) => (
                  <article
                    key={inv.id}
                    className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    {inv.prompt && (
                      <p className="mb-2 rounded-md bg-zinc-100 px-3 py-2 text-[13px] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
                        {inv.prompt}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                        action
                      </span>
                      <span className="font-mono text-[11px] text-zinc-500">
                        {spec.name}
                      </span>
                    </div>
                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-md bg-zinc-50 p-3 font-mono text-[12px] leading-5 text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                      {inv.response}
                    </pre>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
