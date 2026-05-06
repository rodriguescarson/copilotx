"use client";

import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import type {
  ChartType,
  ChartWidget,
  FilterWidget,
  KPIWidget,
  Widget,
  Trend,
} from "@/types/dashboard";
import { KPICard } from "./KPICard";
import { ChartCard } from "./ChartCard";
import { FilterChip } from "./FilterChip";
import { DATASET_META, getDataset } from "@/app/studio/dashboard/sample-data";

const ACCENTS = ["violet", "emerald", "amber", "sky", "rose", "cyan"] as const;
type Accent = (typeof ACCENTS)[number];

function nextAccent(seed: number): Accent {
  return ACCENTS[seed % ACCENTS.length];
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

interface DashboardActionsProps {
  widgets: Widget[];
  activeDatasetId: string;
  addWidget: (w: Widget) => void;
  clearWidgets: () => void;
}

export function DashboardActions({
  widgets,
  activeDatasetId,
  addWidget,
  clearWidgets,
}: DashboardActionsProps) {
  // Keep the AI grounded with what's currently on the canvas + the sample data shape.
  useCopilotReadable({
    description:
      "The active dashboard state — current widgets on the canvas, the active dataset id, and a small data sample so the AI can pick reasonable axes.",
    value: {
      activeDatasetId,
      widgetCount: widgets.length,
      widgetSummaries: widgets.map((w) => ({
        id: w.id,
        kind: w.kind,
        title: w.kind === "chart" ? w.config.title : w.kind === "kpi" ? w.config.label : w.config.field,
      })),
      datasets: DATASET_META.map((d) => ({
        id: d.id,
        name: d.name,
        fields: d.fields,
        sampleRow: getDataset(d.id)[0] ?? null,
      })),
    },
  });

  useCopilotAction({
    name: "addKPICard",
    description:
      "Add a KPI card to the dashboard canvas. Use big-picture numbers like total revenue, total signups, average order value, conversion rate, etc.",
    parameters: [
      { name: "label", type: "string", description: "Short uppercase label, e.g. 'Total Revenue'.", required: true },
      { name: "value", type: "string", description: "Formatted value, e.g. '$3.27M' or '12,480'.", required: true },
      { name: "delta", type: "number", description: "Optional percent change, e.g. 12 for +12%." },
      { name: "trend", type: "string", description: "'up' if delta is positive, 'down' if negative, omit otherwise." },
      { name: "accent", type: "string", description: "Optional color accent: violet, emerald, amber, sky, rose, cyan." },
    ],
    handler: async ({ label, value, delta, trend, accent }) => {
      const widget: KPIWidget = {
        id: makeId("kpi"),
        kind: "kpi",
        config: {
          label: String(label ?? "KPI"),
          value: String(value ?? "—"),
          delta: typeof delta === "number" ? delta : undefined,
          trend: (trend === "up" || trend === "down" ? trend : null) as Trend,
          accent: typeof accent === "string" && (ACCENTS as readonly string[]).includes(accent)
            ? accent
            : nextAccent(widgets.length),
        },
      };
      addWidget(widget);
      return JSON.stringify(widget);
    },
    render: ({ result, status }) => {
      if (status === "executing" || !result) {
        return <SkeletonCard label="Adding KPI…" />;
      }
      try {
        const widget = JSON.parse(result) as KPIWidget;
        return (
          <div className="my-2">
            <KPICard widget={widget} compact />
          </div>
        );
      } catch {
        return <span className="text-zinc-500">KPI added.</span>;
      }
    },
  });

  useCopilotAction({
    name: "addChart",
    description:
      "Add a chart to the dashboard canvas. Pick the chart type that best fits the data: 'line' or 'area' for time series, 'bar' for categorical comparisons, 'pie' for share-of-total. yKeys may have multiple values for multi-series charts.",
    parameters: [
      { name: "type", type: "string", description: "One of: line, bar, pie, area.", required: true },
      { name: "title", type: "string", description: "Concise chart title.", required: true },
      { name: "datasetId", type: "string", description: "Which dataset to read from. Must be one of the available dataset ids.", required: true },
      { name: "xKey", type: "string", description: "Field used for the x-axis or categorical grouping.", required: true },
      { name: "yKeys", type: "string[]", description: "One or more numeric fields to plot. Pie charts only use the first.", required: true },
      { name: "accent", type: "string", description: "Optional color accent: violet, emerald, amber, sky, rose, cyan." },
    ],
    handler: async ({ type, title, datasetId, xKey, yKeys, accent }) => {
      const validTypes: ChartType[] = ["line", "bar", "pie", "area"];
      const safeType: ChartType = validTypes.includes(type as ChartType) ? (type as ChartType) : "line";
      const yArr = Array.isArray(yKeys) ? yKeys.filter((k): k is string => typeof k === "string") : [];
      const widget: ChartWidget = {
        id: makeId("chart"),
        kind: "chart",
        config: {
          type: safeType,
          title: String(title ?? "Chart"),
          datasetId: typeof datasetId === "string" ? datasetId : activeDatasetId,
          xKey: String(xKey ?? ""),
          yKeys: yArr.length > 0 ? yArr : ["value"],
          accent: typeof accent === "string" && (ACCENTS as readonly string[]).includes(accent)
            ? accent
            : nextAccent(widgets.length + 1),
        },
      };
      addWidget(widget);
      return JSON.stringify(widget);
    },
    render: ({ result, status }) => {
      if (status === "executing" || !result) {
        return <SkeletonCard label="Drawing chart…" />;
      }
      try {
        const widget = JSON.parse(result) as ChartWidget;
        return (
          <div className="my-2">
            <ChartCard widget={widget} compact />
          </div>
        );
      } catch {
        return <span className="text-zinc-500">Chart added.</span>;
      }
    },
  });

  useCopilotAction({
    name: "addFilter",
    description:
      "Add a filter chip the user can interact with. Pick a categorical field with a small set of distinct values (e.g. 'region' or 'source').",
    parameters: [
      { name: "field", type: "string", description: "The dataset field to filter on.", required: true },
      { name: "options", type: "string[]", description: "Distinct values for the filter.", required: true },
    ],
    handler: async ({ field, options }) => {
      const opts = Array.isArray(options) ? options.filter((o): o is string => typeof o === "string") : [];
      const widget: FilterWidget = {
        id: makeId("filter"),
        kind: "filter",
        config: {
          field: String(field ?? "field"),
          options: opts,
        },
      };
      addWidget(widget);
      return JSON.stringify(widget);
    },
    render: ({ result, status }) => {
      if (status === "executing" || !result) {
        return <SkeletonCard label="Adding filter…" />;
      }
      try {
        const widget = JSON.parse(result) as FilterWidget;
        return (
          <div className="my-2">
            <FilterChip widget={widget} />
          </div>
        );
      } catch {
        return <span className="text-zinc-500">Filter added.</span>;
      }
    },
  });

  useCopilotAction({
    name: "clearDashboard",
    description: "Remove every widget from the dashboard canvas. Use only if the user explicitly asks to start over.",
    parameters: [],
    handler: async () => {
      clearWidgets();
      return "cleared";
    },
    render: ({ status }) => (
      <div className="my-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-300">
        {status === "executing" ? "Clearing canvas…" : "Canvas cleared."}
      </div>
    ),
  });

  return null;
}

function SkeletonCard({ label }: { label: string }) {
  return (
    <div className="my-2 flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-300">
      <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" aria-hidden />
      {label}
    </div>
  );
}
