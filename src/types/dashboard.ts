// Type definitions for the generative dashboard demo (Unit 9).

export type ChartType = "line" | "bar" | "pie" | "area";
export type Trend = "up" | "down" | null;

export type DataPoint = Record<string, string | number>;
export type Dataset = DataPoint[];

export interface DatasetMeta {
  id: string;
  name: string;
  description: string;
  /** Suggested keys for chart axes — keeps the AI grounded. */
  fields: string[];
  /** Sample row count, just for the preview UI. */
  rowCount: number;
}

export interface KPIWidget {
  id: string;
  kind: "kpi";
  config: {
    label: string;
    value: string;
    delta?: number;
    trend?: Trend;
    accent?: string;
  };
}

export interface ChartWidget {
  id: string;
  kind: "chart";
  config: {
    type: ChartType;
    title: string;
    datasetId: string;
    xKey: string;
    yKeys: string[];
    accent?: string;
  };
}

export interface FilterWidget {
  id: string;
  kind: "filter";
  config: {
    field: string;
    options: string[];
    selected?: string;
  };
}

export type Widget = KPIWidget | ChartWidget | FilterWidget;
