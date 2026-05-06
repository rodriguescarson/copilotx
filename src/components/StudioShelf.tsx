"use client";

import Link from "next/link";

/**
 * "Studio" discovery strip on the home page. Three crisp cards linking out to
 * the demos that this repo also ships — turning the hiring artifact into an
 * on-ramp instead of three independent toy demos hidden in the nav.
 */
const ITEMS = [
  {
    href: "/studio/dashboard",
    eyebrow: "Studio · 01",
    title: "Generative dashboard",
    body: "Pick a sample dataset. Watch the AI stream KPIs, charts, and filters onto the canvas, one tool call at a time.",
    glyph: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden className="h-9 w-9">
        <rect x="6" y="34" width="10" height="22" rx="1.5" fill="currentColor" />
        <rect x="20" y="22" width="10" height="34" rx="1.5" fill="currentColor" opacity="0.7" />
        <rect x="34" y="14" width="10" height="42" rx="1.5" fill="currentColor" opacity="0.55" />
        <rect x="48" y="28" width="10" height="28" rx="1.5" fill="currentColor" opacity="0.4" />
      </svg>
    ),
    accent: "var(--color-deep)",
  },
  {
    href: "/studio/actions",
    eyebrow: "Studio · 02",
    title: "Author an action",
    body: "Describe a tool in plain English; the Director writes a real useCopilotAction snippet you can paste straight in.",
    glyph: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden className="h-9 w-9">
        <path
          d="M14 18h36M14 32h28M14 46h20"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="50" cy="46" r="6" fill="currentColor" opacity="0.7" />
      </svg>
    ),
    accent: "var(--color-volt-300)",
  },
  {
    href: "/studio/voice",
    eyebrow: "Studio · 03",
    title: "Voice onboarding",
    body: "Speak for ten seconds. The model extracts goal, schedule, diet, and sleep — then offers to apply them to your plan.",
    glyph: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden className="h-9 w-9">
        <rect x="26" y="10" width="12" height="28" rx="6" fill="currentColor" />
        <path
          d="M14 32a18 18 0 0 0 36 0"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path d="M32 50v6M22 56h20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
    accent: "var(--color-ember)",
  },
] as const;

export function StudioShelf() {
  return (
    <section
      aria-labelledby="studio-shelf-heading"
      className="mt-20"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="eyebrow">Built on the same kit</span>
          <h2
            id="studio-shelf-heading"
            className="display-headline mt-2 text-3xl sm:text-4xl"
            style={{ color: "var(--color-ink-50)" }}
          >
            Three more demos in the{" "}
            <span style={{ color: "var(--color-volt-300)" }} className="italic">
              studio
            </span>
            .
          </h2>
        </div>
        <p
          className="max-w-md text-[14px] leading-relaxed"
          style={{ color: "var(--color-ink-400)" }}
        >
          Each one is a different surface for the same primitives — readables,
          actions, and the streaming sidebar.
        </p>
      </div>

      <ul role="list" className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {ITEMS.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              prefetch
              className="cx-card group relative flex h-full flex-col overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                outlineColor: "var(--color-volt-300)",
              }}
              aria-label={`${it.title} — open ${it.href}`}
            >
              <span
                className="font-mono text-[10.5px] uppercase tracking-[0.18em]"
                style={{ color: "var(--color-ink-400)" }}
              >
                {it.eyebrow}
              </span>

              <div
                className="mt-5 flex items-center justify-between"
                style={{ color: it.accent }}
              >
                {it.glyph}
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ borderColor: "var(--color-ink-700)" }}
                  aria-hidden
                >
                  <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                    <path
                      d="M5 11l6-6m0 0H6m5 0v5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>

              <h3
                className="display-headline mt-5 text-3xl"
                style={{ color: "var(--color-ink-50)" }}
              >
                {it.title}
              </h3>
              <p
                className="mt-2 text-[14px] leading-relaxed"
                style={{ color: "var(--color-ink-300)" }}
              >
                {it.body}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
