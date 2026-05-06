"use client";

import { useMemo, useState } from "react";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotChat } from "@copilotkit/react-core";
import type { Dataset, Widget } from "@/types/dashboard";
import { DATASET_META, getDataset } from "./sample-data";
import { DashboardCanvas } from "@/components/studio/dashboard/DashboardCanvas";
import { DatasetPanel } from "@/components/studio/dashboard/DatasetPanel";
import { DashboardActions } from "@/components/studio/dashboard/DashboardActions";

const DASHBOARD_INSTRUCTIONS = `You are a dashboard architect. Your job on this page is to BUILD a dashboard for the user by CALLING TOOLS — never describe what a dashboard might look like, just build it.

Available tools (always call, never describe):
- addKPICard(label, value, delta?, trend?, accent?) — single big-number tile.
- addChart(type, title, datasetId, xKey, yKeys, accent?) — line/bar/pie/area chart.
- addFilter(field, options) — categorical filter chip.
- clearDashboard() — only when the user explicitly asks to reset.

Rules of thumb:
- For a "build me a dashboard" prompt, plan to add ~3 KPIs, 2 charts, and 1 filter — call them in sequence, one tool call per widget.
- Pick chart types that fit the data: line/area for trends over time, bar for category comparison, pie for share-of-total.
- Use the active datasetId from the readable state unless the user names a different dataset.
- yKeys is an array — use multiple keys for multi-series charts when it adds insight.
- KPI values should be pre-formatted strings (e.g. "$3.27M", "12,480"). Compute them from the dataset's values.
- Use varied accent colors across widgets so the canvas feels visually rich.

Other tools that may exist on the page (saveFullPlan, sleepTips, etc.) belong to a different feature — DO NOT call them here.`;

const QUICK_SUGGESTIONS = [
  {
    title: "Build me a Q4 sales dashboard",
    message:
      "Build me a dashboard from the Sales Q4 dataset — include 3 KPI cards (total revenue, total orders, average order value with trends), a line chart of revenue by month, a bar chart of orders by region, and a region filter.",
  },
  {
    title: "Visualize signups",
    message:
      "Build a dashboard from the Signups 2026 dataset — a KPI for total signups, a KPI for daily average, an area chart of signups over the month, a pie chart of share by source, and a source filter.",
  },
  {
    title: "Add a top-line KPI",
    message: "Add a KPI for the total revenue from the active dataset, with a green up-trend.",
  },
  {
    title: "Clear the canvas",
    message: "Clear the dashboard so I can start over.",
  },
];

export default function StudioDashboardPage() {
  const [activeDatasetId, setActiveDatasetId] = useState<string>(DATASET_META[0].id);
  const [customDatasets, setCustomDatasets] = useState<Record<string, Dataset>>({});
  const [customMeta, setCustomMeta] = useState<typeof DATASET_META>([]);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const { isLoading: copilotThinking } = useCopilotChat();

  const datasets = useMemo(() => [...DATASET_META, ...customMeta], [customMeta]);
  const activeData = useMemo<Dataset>(() => {
    if (customDatasets[activeDatasetId]) return customDatasets[activeDatasetId];
    return getDataset(activeDatasetId);
  }, [activeDatasetId, customDatasets]);

  const addWidget = (w: Widget) => setWidgets((prev) => [...prev, w]);
  const clearWidgets = () => setWidgets([]);
  const removeWidget = (id: string) => setWidgets((prev) => prev.filter((w) => w.id !== id));
  const handleFilterChange = (id: string, value: string) =>
    setWidgets((prev) =>
      prev.map((w) =>
        w.id === id && w.kind === "filter"
          ? { ...w, config: { ...w.config, selected: value || undefined } }
          : w,
      ),
    );

  const handlePasteCsv = ({ name, data }: { name: string; data: Dataset }) => {
    const id = `custom_${Date.now().toString(36)}`;
    const fields = data[0] ? Object.keys(data[0]) : [];
    setCustomDatasets((prev) => ({ ...prev, [id]: data }));
    setCustomMeta((prev) => [
      ...prev,
      {
        id,
        name,
        description: "Pasted by user",
        fields,
        rowCount: data.length,
      },
    ]);
    setActiveDatasetId(id);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_-10%,rgba(167,139,250,0.18),transparent_50%),radial-gradient(circle_at_90%_10%,rgba(56,189,248,0.14),transparent_55%),radial-gradient(circle_at_50%_120%,rgba(52,211,153,0.10),transparent_60%)]"
        aria-hidden
      />

      <DashboardActions
        widgets={widgets}
        activeDatasetId={activeDatasetId}
        addWidget={addWidget}
        clearWidgets={clearWidgets}
      />

      <header className="border-b border-zinc-900 bg-zinc-950/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 pb-5 pt-16 sm:pt-20">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/30 to-sky-500/30 ring-1 ring-violet-400/30">
              <span className="text-sm">◐</span>
            </span>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                CopilotX · Studio
              </p>
              <h1 className="text-base font-semibold text-zinc-100">
                Generative Dashboard
              </h1>
            </div>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-xs text-zinc-400">
              Ask the copilot to build a dashboard. Each tool call streams a widget onto the canvas.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <DatasetPanel
            datasets={datasets}
            activeDatasetId={activeDatasetId}
            data={activeData}
            onSelect={setActiveDatasetId}
            onPasteCsv={handlePasteCsv}
          />
          <DashboardCanvas
            widgets={widgets}
            onRemove={removeWidget}
            onFilterChange={handleFilterChange}
            onClear={clearWidgets}
            thinking={copilotThinking}
          />
        </div>
      </main>

      <CopilotSidebar
        instructions={DASHBOARD_INSTRUCTIONS}
        suggestions={QUICK_SUGGESTIONS}
        labels={{
          title: "Dashboard Architect",
          initial:
            "Hi — pick a sample dataset on the left, then ask me to build you a dashboard. I'll add KPIs, charts, and filters one tool call at a time.",
        }}
        defaultOpen
      />
    </div>
  );
}
