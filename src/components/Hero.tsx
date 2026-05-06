"use client";

const PILLARS = [
  {
    key: "plan",
    eyebrow: "01 / Train",
    title: "Plan",
    body: "An adaptive split that respects your time, recovery, and goal — not a generic 5-day bro split.",
    accent: "var(--color-ember)",
    glyph: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden className="h-12 w-12">
        <rect x="6" y="22" width="6" height="20" rx="1.5" fill="currentColor" />
        <rect x="52" y="22" width="6" height="20" rx="1.5" fill="currentColor" />
        <rect x="14" y="28" width="36" height="8" rx="1" fill="currentColor" opacity="0.55" />
        <circle cx="32" cy="32" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "eat",
    eyebrow: "02 / Fuel",
    title: "Eat",
    body: "Calorie targets, macros, and dishes you'll actually cook — vegetarian, vegan, or omni.",
    accent: "var(--color-citrus)",
    glyph: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden className="h-12 w-12">
        <path
          d="M14 26c0-7 8-12 18-12s18 5 18 12v4H14v-4z"
          fill="currentColor"
          opacity="0.6"
        />
        <path
          d="M10 32h44a4 4 0 0 1 4 4v2H6v-2a4 4 0 0 1 4-4z"
          fill="currentColor"
        />
        <path
          d="M14 42h36v4a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6v-4z"
          fill="currentColor"
          opacity="0.4"
        />
      </svg>
    ),
  },
  {
    key: "sleep",
    eyebrow: "03 / Recover",
    title: "Sleep",
    body: "Evidence-led recovery — circadian timing, screen hygiene, and protocols cited from real research.",
    accent: "var(--color-deep)",
    glyph: (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden className="h-12 w-12">
        <path
          d="M44 12a20 20 0 1 0 8 26 16 16 0 0 1-8-26z"
          fill="currentColor"
        />
        <circle cx="20" cy="18" r="1.5" fill="currentColor" opacity="0.6" />
        <circle cx="14" cy="28" r="1" fill="currentColor" opacity="0.5" />
        <circle cx="50" cy="22" r="1.2" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
] as const;

function openSidebar() {
  // The CopilotKit sidebar listens for clicks on its own toggle button —
  // we synthesize a click on it. If that fails we just scroll the user
  // toward where the floating button lives.
  if (typeof document === "undefined") return;
  const btn =
    document.querySelector<HTMLButtonElement>(".copilotKitButton") ??
    document.querySelector<HTMLButtonElement>('[aria-label*="open" i][aria-label*="copilot" i]') ??
    document.querySelector<HTMLButtonElement>(".copilotKitWindowButton");
  if (btn) {
    btn.click();
  } else {
    window.dispatchEvent(new CustomEvent("copilotx:open-sidebar"));
  }
}

export function Hero() {
  return (
    <section
      aria-labelledby="hero-headline"
      className="relative isolate overflow-hidden"
      style={{ paddingTop: "56px", paddingBottom: "72px" }}
    >
      {/* atmospheric gradient halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[520px] w-[760px] -translate-x-1/2 opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(217,255,61,0.18), rgba(217,255,61,0) 70%)",
        }}
      />

      <div className="cx-stagger relative">
        {/* eyebrow */}
        <div className="flex items-center gap-3">
          <span
            className="inline-block h-px w-10"
            style={{ background: "var(--color-volt-300)" }}
          />
          <span className="eyebrow">A copilot for your body</span>
        </div>

        {/* headline */}
        <h1
          id="hero-headline"
          className="display-headline mt-5 text-[clamp(48px,7.5vw,104px)]"
          style={{ color: "var(--color-ink-50)" }}
        >
          Train smart.{" "}
          <span style={{ color: "var(--color-volt-300)" }} className="italic">
            Eat sharp.
          </span>{" "}
          <br className="hidden sm:block" />
          Sleep like
          <span className="italic"> it&rsquo;s your job.</span>
        </h1>

        {/* sub */}
        <p
          className="mt-6 max-w-[640px] text-[17px] leading-relaxed"
          style={{ color: "var(--color-ink-300)" }}
        >
          A conversational coach that turns one chat into a real weekly plan — workouts on
          your schedule, meals you&apos;ll actually cook, and recovery protocols
          that compound. Powered by CopilotKit.
        </p>

        {/* CTAs */}
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={openSidebar}
            className="cx-btn-primary"
            aria-label="Open the AI coach sidebar"
          >
            <span>Talk to your coach</span>
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
              <path
                d="M3 8h10m0 0L9 4m4 4L9 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <a href="#plan" className="cx-btn-ghost" aria-label="Jump to your weekly plan">
            View this week&rsquo;s plan
          </a>
          <span
            className="ml-1 hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] sm:flex"
            style={{ color: "var(--color-ink-400)" }}
          >
            <span
              className="cx-pulse-dot inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--color-volt-300)" }}
            />
            Live · Realtime
          </span>
        </div>
      </div>

      {/* three pillars — staggered, asymmetric */}
      <div className="mt-20 grid grid-cols-1 gap-5 md:grid-cols-3 cx-stagger">
        {PILLARS.map((p, i) => (
          <article
            key={p.key}
            className="cx-card group relative overflow-hidden p-7 transition-transform duration-300"
            style={{
              transform: i === 1 ? "translateY(28px)" : i === 2 ? "translateY(56px)" : undefined,
            }}
          >
            {/* corner index */}
            <span
              className="font-mono text-[11px] uppercase tracking-[0.18em]"
              style={{ color: "var(--color-ink-400)" }}
            >
              {p.eyebrow}
            </span>

            {/* glyph + accent rule */}
            <div className="mt-6 flex items-end justify-between">
              <div style={{ color: p.accent }} className="opacity-90">
                {p.glyph}
              </div>
              <span
                aria-hidden
                className="block h-px w-16 self-end"
                style={{ background: p.accent, opacity: 0.6 }}
              />
            </div>

            {/* title */}
            <h3
              className="display-headline mt-7 text-5xl"
              style={{ color: "var(--color-ink-50)" }}
            >
              {p.title}
            </h3>

            {/* body */}
            <p
              className="mt-3 text-[14.5px] leading-relaxed"
              style={{ color: "var(--color-ink-300)" }}
            >
              {p.body}
            </p>

            {/* hover sheen */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: `radial-gradient(600px circle at var(--mx, 50%) var(--my, 0%), color-mix(in oklab, ${p.accent} 12%, transparent), transparent 50%)`,
              }}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
