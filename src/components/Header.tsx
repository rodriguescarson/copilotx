"use client";

import Link from "next/link";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/studio/dashboard", label: "Dashboard" },
  { href: "/studio/actions", label: "Studio" },
  { href: "/studio/voice", label: "Voice" },
] as const;

export function Header() {
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-xl"
      style={{
        background: "color-mix(in oklab, var(--color-ink-950) 78%, transparent)",
        borderBottom: "1px solid var(--color-ink-700)",
      }}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 lg:px-10">
        <Link
          href="/"
          aria-label="copilotx — home"
          className="group flex items-center gap-2.5"
        >
          <span
            aria-hidden
            className="relative flex h-8 w-8 items-center justify-center rounded-[10px] border"
            style={{
              borderColor: "var(--color-ink-700)",
              background:
                "radial-gradient(circle at 30% 30%, var(--color-volt-300) 0%, var(--color-volt-500) 60%, var(--color-volt-600) 100%)",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.2) inset, 0 6px 18px -8px rgba(217,255,61,0.5)",
            }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path
                d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
                fill="var(--color-ink-950)"
                stroke="var(--color-ink-950)"
                strokeWidth="0.5"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="flex items-baseline gap-0.5 leading-none">
            <span
              className="font-display italic"
              style={{
                fontSize: "22px",
                color: "var(--color-ink-50)",
                letterSpacing: "-0.02em",
              }}
            >
              copilot
            </span>
            <span
              className="font-display italic"
              style={{
                fontSize: "22px",
                color: "var(--color-volt-300)",
                letterSpacing: "-0.02em",
              }}
            >
              x
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-label={`Go to ${item.label}`}
              className="cx-nav-link rounded-full px-3.5 py-2 text-[13px] font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/rodriguescarson/copilotx"
            target="_blank"
            rel="noreferrer"
            aria-label="View source on GitHub"
            className="cx-github-link hidden items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium sm:inline-flex"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.18-1.49 3.14-1.18 3.14-1.18.63 1.58.23 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
            </svg>
            <span className="font-mono uppercase tracking-wider">github</span>
          </a>
          <span
            className="hidden h-2 w-2 rounded-full sm:block cx-pulse-dot"
            style={{ background: "var(--color-volt-300)", boxShadow: "0 0 12px var(--color-volt-300)" }}
            aria-hidden
          />
        </div>
      </div>
    </header>
  );
}
