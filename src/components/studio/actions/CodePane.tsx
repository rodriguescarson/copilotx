"use client";

import { useEffect, useState } from "react";

// Shiki is heavy (~80kB+ of WASM/JSON for a single language). We dynamic-import
// it lazily on first highlight so the studio page stays light on initial load.
type CodeToHtml = (typeof import("shiki"))["codeToHtml"];
let codeToHtmlPromise: Promise<CodeToHtml> | null = null;
function loadHighlighter(): Promise<CodeToHtml> {
  if (!codeToHtmlPromise) {
    codeToHtmlPromise = import("shiki").then((m) => m.codeToHtml);
  }
  return codeToHtmlPromise;
}

interface CodePaneProps {
  code: string;
  onCopy: () => void;
  onTryIt: () => void;
  /** True while the Director is streaming a fresh snippet. */
  generating?: boolean;
}

const PLACEHOLDER = `// Your generated useCopilotAction will appear here.
//
// Try the prompt on the left, e.g.:
//   "an action that books a flight given origin, destination and date"
//
// The AI will produce a full TypeScript snippet — params, handler,
// and an inline render — that you can paste into any CopilotKit app.`;

export function CodePane({ code, onCopy, onTryIt, generating }: CodePaneProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const display = code || PLACEHOLDER;
  const hasCode = code.length > 0;

  useEffect(() => {
    let cancelled = false;
    loadHighlighter()
      .then((codeToHtml) =>
        codeToHtml(display, {
          lang: "tsx",
          theme: "github-dark-default",
        }),
      )
      .then((out) => {
        if (!cancelled) setHtml(out);
      })
      .catch(() => {
        if (!cancelled) setHtml(null);
      });
    return () => {
      cancelled = true;
    };
  }, [display]);

  function handleCopy() {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-[#0d1117]">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-[#161b22] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            02 · Generated
          </span>
          <span className="font-mono text-xs text-zinc-400">
            actions/generated.tsx
          </span>
          {generating && (
            <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              generating
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!hasCode}
            className="rounded-md border border-zinc-700 bg-zinc-800/60 px-3 py-1.5 font-mono text-xs text-zinc-200 transition hover:border-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copied ? "copied" : "copy"}
          </button>
          <button
            type="button"
            onClick={onTryIt}
            disabled={!hasCode}
            className="rounded-md bg-emerald-500 px-3 py-1.5 font-mono text-xs font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            try it →
          </button>
        </div>
      </div>
      <div className="relative flex-1 overflow-auto">
        {html ? (
          <div
            // shiki output is trusted (it's just our own code string highlighted)
            dangerouslySetInnerHTML={{ __html: html }}
            className="shiki-pane font-mono text-[13px] leading-6 [&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:px-5 [&_pre]:py-4"
          />
        ) : (
          <pre className="m-0 px-5 py-4 font-mono text-[13px] leading-6 text-zinc-300">
            {display}
          </pre>
        )}
      </div>
    </div>
  );
}
