"use client";

import type { Widget } from "@/types/dashboard";
import { KPICard } from "./KPICard";
import { ChartCard } from "./ChartCard";
import { FilterChip } from "./FilterChip";

interface DashboardCanvasProps {
  widgets: Widget[];
  onRemove?: (id: string) => void;
  onFilterChange?: (id: string, value: string) => void;
  onClear?: () => void;
}

export function DashboardCanvas({ widgets, onRemove, onFilterChange, onClear }: DashboardCanvasProps) {
  if (widgets.length === 0) {
    return <EmptyState />;
  }

  const kpis = widgets.filter((w) => w.kind === "kpi");
  const filters = widgets.filter((w) => w.kind === "filter");
  const charts = widgets.filter((w) => w.kind === "chart");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          {widgets.length} widget{widgets.length === 1 ? "" : "s"} on canvas
        </p>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-zinc-800 px-3 py-1 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
          >
            Clear canvas
          </button>
        )}
      </div>

      {kpis.length > 0 && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((w) => (
            <WidgetShell key={w.id} id={w.id} onRemove={onRemove}>
              <KPICard widget={w} />
            </WidgetShell>
          ))}
        </section>
      )}

      {filters.length > 0 && (
        <section className="flex flex-wrap gap-3">
          {filters.map((w) => (
            <div key={w.id} className="relative">
              <FilterChip widget={w} onChange={onFilterChange} />
              {onRemove && (
                <RemoveButton onClick={() => onRemove(w.id)} />
              )}
            </div>
          ))}
        </section>
      )}

      {charts.length > 0 && (
        <section className="grid gap-5 lg:grid-cols-2">
          {charts.map((w) => (
            <WidgetShell key={w.id} id={w.id} onRemove={onRemove}>
              <ChartCard widget={w} />
            </WidgetShell>
          ))}
        </section>
      )}
    </div>
  );
}

function WidgetShell({
  id,
  onRemove,
  children,
}: {
  id: string;
  onRemove?: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative animate-[dashpop_500ms_ease-out_both]">
      {children}
      {onRemove && <RemoveButton onClick={() => onRemove(id)} />}
      <style>{`@keyframes dashpop {
        from { opacity: 0; transform: translateY(8px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }`}</style>
    </div>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Remove widget"
      className="absolute right-3 top-3 hidden h-7 w-7 items-center justify-center rounded-full bg-zinc-800/80 text-zinc-400 ring-1 ring-zinc-700 transition-colors hover:bg-zinc-700 hover:text-zinc-100 group-hover:flex"
    >
      <span className="text-xs leading-none">×</span>
    </button>
  );
}

function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/40 p-16 text-center">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(167,139,250,0.18),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(56,189,248,0.14),transparent_55%)]" aria-hidden />
      <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
        Empty canvas
      </p>
      <h2 className="mx-auto mb-3 max-w-md text-2xl font-semibold text-zinc-100 md:text-3xl">
        Ask the copilot to build you a dashboard.
      </h2>
      <p className="mx-auto max-w-lg text-sm text-zinc-400">
        Try{" "}
        <span className="rounded-md bg-zinc-800/80 px-1.5 py-0.5 font-mono text-xs text-zinc-200">
          build me a dashboard for Q4 sales
        </span>{" "}
        — KPIs, charts, and filters will stream onto the canvas as the AI calls
        each tool.
      </p>
    </div>
  );
}
