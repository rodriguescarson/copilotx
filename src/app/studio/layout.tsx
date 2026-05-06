import Link from "next/link";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-40 flex justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-medium text-zinc-200 backdrop-blur transition hover:bg-black/60 hover:text-white"
          aria-label="Back to home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3.5 w-3.5"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M12.78 4.22a.75.75 0 0 1 0 1.06L8.06 10l4.72 4.72a.75.75 0 1 1-1.06 1.06l-5.25-5.25a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
          back to copilotx
        </Link>
        <nav className="pointer-events-auto hidden items-center gap-1 rounded-full border border-white/10 bg-black/40 px-1 py-1 text-xs font-medium text-zinc-300 backdrop-blur sm:flex">
          <StudioNavLink href="/studio/dashboard">dashboard</StudioNavLink>
          <StudioNavLink href="/studio/actions">actions</StudioNavLink>
          <StudioNavLink href="/studio/voice">voice</StudioNavLink>
        </nav>
      </div>
      {children}
    </>
  );
}

function StudioNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-full px-3 py-1 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </Link>
  );
}
