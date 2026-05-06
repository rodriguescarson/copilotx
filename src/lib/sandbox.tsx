"use client";

import type { GeneratedActionSpec, SandboxInvocation } from "@/types/studio";

/**
 * Build a friendly mock response for an action invocation in the sandbox.
 *
 * Why mock instead of eval'ing the AI-generated handler?
 * - The AI emits TypeScript source as a string. Running it would require a
 *   full TS transpile + dynamic Function() — both of which are real attack
 *   surfaces in a public-facing studio. The mock keeps the demo honest about
 *   what's actually happening: "this is what your action would receive and
 *   return when wired up in your CopilotKit project."
 */
export function mockInvoke(
  spec: GeneratedActionSpec,
  args: Record<string, unknown>,
  prompt: string
): SandboxInvocation {
  const argLines = spec.parameters
    .map((p) => {
      const value = args[p.name];
      if (value === undefined || value === "")
        return `  ${p.name}: <missing>`;
      const formatted =
        typeof value === "object" ? JSON.stringify(value) : String(value);
      return `  ${p.name}: ${formatted}`;
    })
    .join("\n");

  const response = [
    `Action "${spec.name}" invoked.`,
    "",
    "Arguments received:",
    argLines || "  (no parameters)",
    "",
    `Handler summary: ${spec.handlerSummary}`,
    "",
    "In your real CopilotKit app, the handler you wrote runs here and the",
    "render() function paints the result inline in the chat.",
  ].join("\n");

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    prompt,
    args,
    response,
    timestamp: Date.now(),
  };
}

/**
 * Coerce a string field from a form input into the type the param expects.
 * Falls back to the raw string when JSON parsing fails so the user always
 * sees something — the mock handler reports "missing" for empty strings.
 */
export function coerceArg(
  raw: string,
  type: GeneratedActionSpec["parameters"][number]["type"]
): unknown {
  if (raw === "") return "";
  switch (type) {
    case "number":
      return Number.isNaN(Number(raw)) ? raw : Number(raw);
    case "boolean":
      return raw.toLowerCase() === "true" || raw === "1";
    case "object":
    case "object[]":
    case "string[]":
    case "number[]":
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    default:
      return raw;
  }
}
