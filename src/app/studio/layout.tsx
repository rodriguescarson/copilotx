import Link from "next/link";
import { StudioNav } from "@/components/studio/StudioNav";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-40 flex flex-wrap items-center justify-between gap-2 px-3 py-3 sm:px-6">
        <Link
          href="/"
          prefetch
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs font-medium text-zinc-200 backdrop-blur transition hover:border-white/30 hover:bg-black/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
          aria-label="Back to copilotx home"
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
          <span>back to copilotx</span>
        </Link>
        <StudioNav />
      </div>
      {children}
    </>
  );
}
