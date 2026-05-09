"use client";

/**
 * Inviting empty state for the home plan tabs (workout / diet / sleep).
 * Suggests starter prompts and opens the CopilotKit sidebar with the prompt
 * pre-filled — turning a dead-end into a one-click on-ramp to the demo.
 */
export function EmptyTab({
  eyebrow,
  title,
  body,
  prompts,
}: {
  eyebrow: string;
  title: string;
  body: string;
  prompts: string[];
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-8"
      style={{
        borderColor: "var(--color-ink-700)",
        background:
          "linear-gradient(180deg, color-mix(in oklab, var(--color-volt-300) 4%, var(--color-ink-900)) 0%, var(--color-ink-900) 60%)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--color-volt-300)" }}
      />
      <p
        className="font-mono text-[10.5px] uppercase tracking-[0.18em]"
        style={{ color: "var(--color-volt-300)" }}
      >
        {eyebrow}
      </p>
      <h3
        className="display-headline mt-2 text-3xl sm:text-4xl"
        style={{ color: "var(--color-ink-50)" }}
      >
        {title}
      </h3>
      <p
        className="mt-3 max-w-xl text-[14.5px] leading-relaxed"
        style={{ color: "var(--color-ink-300)" }}
      >
        {body}
      </p>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {prompts.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => openSidebarWithPrompt(p)}
            className="group inline-flex items-start gap-2 rounded-full border px-4 py-2 text-left text-[13px] transition-colors"
            style={{
              borderColor: "var(--color-ink-600)",
              color: "var(--color-ink-200)",
              background: "var(--color-ink-850)",
            }}
            aria-label={`Send prompt to coach: ${p}`}
          >
            <span aria-hidden className="mt-0.5" style={{ color: "var(--color-volt-300)" }}>
              →
            </span>
            <span className="leading-snug">{p}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function openSidebarWithPrompt(prompt: string) {
  if (typeof document === "undefined") return;
  const btn =
    document.querySelector<HTMLButtonElement>(".copilotKitButton") ??
    document.querySelector<HTMLButtonElement>(".copilotKitWindowButton");
  btn?.click();
  // Defer so the sidebar mounts its input before we paste the prompt.
  setTimeout(() => {
    const input =
      document.querySelector<HTMLTextAreaElement>(".copilotKitInput textarea") ??
      document.querySelector<HTMLTextAreaElement>("textarea[placeholder*='Type' i]");
    if (input) {
      input.focus();
      // Use the native setter so React's onChange fires.
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value",
      )?.set;
      setter?.call(input, prompt);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }, 120);
}
