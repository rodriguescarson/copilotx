"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/studio/dashboard", label: "dashboard" },
  { href: "/studio/actions", label: "actions" },
  { href: "/studio/voice", label: "voice" },
] as const;

export function StudioNav() {
  const pathname = usePathname();
  return (
    <nav
      className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-black/50 px-1 py-1 text-xs font-medium text-zinc-300 backdrop-blur"
      aria-label="Studio sections"
    >
      {ITEMS.map((it) => {
        const active = pathname === it.href || pathname?.startsWith(it.href + "/");
        return (
          <Link
            key={it.href}
            href={it.href}
            prefetch
            aria-current={active ? "page" : undefined}
            className={[
              "rounded-full px-3 py-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60",
              active
                ? "bg-white/15 text-white"
                : "text-zinc-300 hover:bg-white/10 hover:text-white",
            ].join(" ")}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
