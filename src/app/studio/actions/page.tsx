"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useCopilotAction, useCopilotChat } from "@copilotkit/react-core";
import { TextMessage, MessageRole } from "@copilotkit/runtime-client-gql";
import { CodePane } from "@/components/studio/actions/CodePane";
import { PromptPane } from "@/components/studio/actions/PromptPane";
import { SandboxPane } from "@/components/studio/actions/SandboxPane";
import { Toast } from "@/components/studio/actions/Toast";
import type {
  GeneratedActionParam,
  GeneratedActionSpec,
  SandboxInvocation,
} from "@/types/studio";

/**
 * Studio · Actions
 *
 * "CopilotKit by CopilotKit": describe an action in plain English on the left;
 * the AI writes a real `useCopilotAction` snippet for you in the middle;
 * try the parameter shape live in the sandbox on the right. The Director's
 * code-generation tool is itself a useCopilotAction — i.e. CopilotKit using
 * CopilotKit to teach you CopilotKit.
 */

const DIRECTOR_INSTRUCTIONS = `You are the CopilotKit Studio code generator.

When the user describes an action they want, you MUST call the
\`generateAction\` tool with a complete spec. Do NOT answer in prose unless
the user is just chatting — every concrete description must produce an
action via \`generateAction\`.

Rules for filling \`generateAction\`:
- \`name\` is camelCase, descriptive, no spaces (e.g. bookFlight, summarizeNotes).
- \`description\` is one sentence describing what the action does.
- \`parameters\` covers every input the handler needs. Each has { name, type,
  description, required }. Types: "string" | "number" | "boolean" | "object"
  | "object[]" | "string[]" | "number[]". Prefer narrow types.
- \`handlerSummary\` is one sentence telling the developer what their handler
  body should accomplish.
- \`code\` is a complete TypeScript snippet — a single \`useCopilotAction({
  ... })\` call — that the developer can paste into a React client component.
  Match the canonical shape below.

Canonical shape (mirror this exactly):

\`\`\`tsx
useCopilotAction({
  name: "<name>",
  description: "<description>",
  parameters: [
    { name: "<param>", type: "<type>", description: "<desc>", required: true },
  ],
  handler: async ({ /* destructured params */ }) => {
    // <handlerSummary, expanded into 1–4 lines of pseudo-code>
    return JSON.stringify({ ok: true });
  },
  render: ({ result }) => (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-900">
      <p className="text-sm text-zinc-700 dark:text-zinc-300">{/* result summary */}</p>
    </div>
  ),
});
\`\`\`

Always include all four (name, description, parameters, handlerSummary, code).
Keep snippets under ~40 lines.`;

const STARTER_IMPORT_HEADER = `// Paste into any React client component inside <CopilotKit>.
import { useCopilotAction } from "@copilotkit/react-core";

`;

interface HistoryEntry {
  id: string;
  description: string;
  spec: GeneratedActionSpec;
  invocations: SandboxInvocation[];
}

export default function StudioActionsPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { appendMessage, isLoading } = useCopilotChat();

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const copyToClipboard = useCallback(
    async (text: string, success: string, failure: string) => {
      try {
        await navigator.clipboard.writeText(text);
        showToast(success);
      } catch {
        showToast(failure);
      }
    },
    [showToast]
  );

  useCopilotAction({
    name: "generateAction",
    description:
      "Emit a complete useCopilotAction TypeScript snippet for the user's described action. Call this whenever the user describes an action they want to add to their CopilotKit app.",
    parameters: [
      {
        name: "name",
        type: "string",
        description: "camelCase action name, e.g. bookFlight",
        required: true,
      },
      {
        name: "description",
        type: "string",
        description: "One-sentence description of what the action does.",
        required: true,
      },
      {
        name: "parameters",
        type: "object[]",
        description:
          "Array of params. Each: { name: string, type: 'string'|'number'|'boolean'|'object'|'object[]'|'string[]'|'number[]', description: string, required?: boolean }.",
        required: true,
      },
      {
        name: "handlerSummary",
        type: "string",
        description:
          "One-sentence summary of what the handler should accomplish.",
        required: true,
      },
      {
        name: "code",
        type: "string",
        description:
          "Complete TypeScript snippet — a single useCopilotAction({...}) call with parameters, async handler, and render. Mirror the canonical shape from the system instructions.",
        required: true,
      },
    ],
    handler: async ({
      name,
      description,
      parameters,
      handlerSummary,
      code,
    }) => {
      try {
        const params = (Array.isArray(parameters) ? parameters : []).map(
          (p: unknown) => {
            const o = (p ?? {}) as Record<string, unknown>;
            return {
              name: String(o.name ?? ""),
              type: (o.type as GeneratedActionParam["type"]) ?? "string",
              description: String(o.description ?? ""),
              required: Boolean(o.required),
            };
          }
        );
        const spec: GeneratedActionSpec = {
          name: String(name ?? "newAction"),
          description: String(description ?? ""),
          parameters: params,
          handlerSummary: String(handlerSummary ?? ""),
          code: String(code ?? ""),
          createdAt: Date.now(),
        };
        const id = `${spec.createdAt}-${Math.random()
          .toString(36)
          .slice(2, 8)}`;
        setHistory((h) => [
          { id, description: spec.description, spec, invocations: [] },
          ...h,
        ]);
        setActiveId(id);
        return `Generated action "${spec.name}" with ${params.length} parameter${
          params.length === 1 ? "" : "s"
        }.`;
      } catch (err) {
        console.error("generateAction failed:", err);
        return "Failed to register the generated action.";
      }
    },
    render: ({ status, args }) => {
      const a = (args ?? {}) as Partial<{
        name: string;
        description: string;
      }>;
      const label = a.name ? `${a.name}()` : "Generated action";
      return (
        <div className="rounded-lg border border-emerald-300/60 bg-emerald-50/80 p-3 dark:border-emerald-700/60 dark:bg-emerald-950/30">
          <p className="font-mono text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            {status === "complete" ? "generated →" : "generating…"}
          </p>
          <p className="mt-0.5 text-sm font-semibold text-emerald-900 dark:text-emerald-100">
            {label}
          </p>
          {a.description && (
            <p className="mt-0.5 text-[12.5px] text-emerald-800/80 dark:text-emerald-200/80">
              {a.description}
            </p>
          )}
          <p className="mt-1 text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
            Check the center pane.
          </p>
        </div>
      );
    },
  });

  const active = useMemo(
    () => history.find((h) => h.id === activeId) ?? null,
    [history, activeId]
  );

  const generate = useCallback(
    (description: string) => {
      if (isLoading) return;
      void appendMessage(
        new TextMessage({
          role: MessageRole.User,
          content: `${DIRECTOR_INSTRUCTIONS}\n\nGenerate an action for: ${description}`,
        })
      );
    },
    [appendMessage, isLoading]
  );

  const copyCode = useCallback(() => {
    if (!active) return;
    void copyToClipboard(
      active.spec.code,
      "Code copied to clipboard.",
      "Could not copy — your browser blocked clipboard access."
    );
  }, [active, copyToClipboard]);

  const tryIt = useCallback(() => {
    if (!active) return;
    void copyToClipboard(
      `${STARTER_IMPORT_HEADER}${active.spec.code}\n`,
      "Code copied. Paste into your CopilotKit project and import to use.",
      "Sandbox ready below — clipboard access blocked, but the form works."
    );
  }, [active, copyToClipboard]);

  const onInvoke = useCallback(
    (inv: SandboxInvocation) => {
      if (!activeId) return;
      setHistory((h) =>
        h.map((entry) =>
          entry.id === activeId
            ? { ...entry, invocations: [...entry.invocations, inv] }
            : entry
        )
      );
    },
    [activeId]
  );

  const historySummaries = useMemo(
    () =>
      history.map((h) => ({
        id: h.id,
        description: h.description,
        actionName: h.spec.name,
      })),
    [history]
  );

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-6 pb-5 pt-16 dark:border-zinc-800 dark:bg-zinc-950 sm:pt-20">
        <div className="mx-auto max-w-[1400px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Studio · /actions
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Author a CopilotKit action.
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Describe what you want in plain English. The Director writes a real{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[12px] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              useCopilotAction
            </code>{" "}
            for you. Try it live in the sandbox on the right, then copy the
            snippet straight into your project.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] p-4 md:p-6">
        <div className="grid gap-4 md:gap-5 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)_minmax(0,420px)] lg:[&>*]:min-h-[560px]">
          <div>
            <PromptPane
              onGenerate={generate}
              generating={isLoading}
              history={historySummaries}
              onPickHistory={setActiveId}
              activeId={activeId}
            />
          </div>

          <div>
            <CodePane
              code={active?.spec.code ?? ""}
              onCopy={copyCode}
              onTryIt={tryIt}
              generating={isLoading && !active}
            />
          </div>

          <div>
            <SandboxPane
              spec={active?.spec ?? null}
              invocations={active?.invocations ?? []}
              onInvoke={onInvoke}
            />
          </div>
        </div>

        <p className="mt-6 text-center text-[12px] text-zinc-500">
          Director uses{" "}
          <code className="font-mono">useCopilotAction(generateAction)</code>{" "}
          · Sandbox is a mocked invocation surface — your real handler runs in
          your app.
        </p>
      </main>

      <Toast message={toast} />
    </div>
  );
}
