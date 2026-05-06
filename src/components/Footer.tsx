export function Footer() {
  return (
    <footer className="border-t border-zinc-200/60 bg-zinc-50/40 px-6 py-4 text-xs text-zinc-500 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/40 dark:text-zinc-500">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 sm:flex-row">
        <span>
          built by{" "}
          <a
            href="https://www.carsonrodrigues.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
          >
            carsonrodrigues.com
          </a>
        </span>
        <span className="font-mono">
          <a
            href="https://github.com/rodriguescarson/copilotx"
            target="_blank"
            rel="noreferrer"
            className="hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            github.com/rodriguescarson/copilotx
          </a>
        </span>
      </div>
    </footer>
  );
}
