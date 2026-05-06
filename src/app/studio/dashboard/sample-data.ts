import type { Dataset, DatasetMeta } from "@/types/dashboard";

// Two canned datasets for the demo so the AI has something concrete to chart.

export const SALES_Q4: Dataset = [
  { month: "Jan", revenue: 184000, orders: 1240, region: "NA" },
  { month: "Feb", revenue: 196500, orders: 1310, region: "NA" },
  { month: "Mar", revenue: 212800, orders: 1402, region: "EU" },
  { month: "Apr", revenue: 225300, orders: 1488, region: "EU" },
  { month: "May", revenue: 241000, orders: 1560, region: "NA" },
  { month: "Jun", revenue: 258400, orders: 1622, region: "APAC" },
  { month: "Jul", revenue: 273900, orders: 1705, region: "APAC" },
  { month: "Aug", revenue: 289100, orders: 1788, region: "NA" },
  { month: "Sep", revenue: 305600, orders: 1854, region: "EU" },
  { month: "Oct", revenue: 332200, orders: 1973, region: "NA" },
  { month: "Nov", revenue: 358700, orders: 2110, region: "APAC" },
  { month: "Dec", revenue: 401450, orders: 2342, region: "NA" },
];

export const SIGNUPS_2026: Dataset = (() => {
  const sources = ["organic", "ads", "referral", "partner"] as const;
  const rows: Dataset = [];
  for (let i = 0; i < 30; i++) {
    const day = (i + 1).toString().padStart(2, "0");
    const wave = Math.sin(i / 4) * 80 + 220;
    const noise = ((i * 7) % 13) - 6;
    rows.push({
      date: `2026-04-${day}`,
      signups: Math.round(wave + noise + i * 4),
      source: sources[i % sources.length],
    });
  }
  return rows;
})();

export const DATASETS: Record<string, Dataset> = {
  sales_q4: SALES_Q4,
  signups_2026: SIGNUPS_2026,
};

export const DATASET_META: DatasetMeta[] = [
  {
    id: "sales_q4",
    name: "Sales Q4",
    description: "Monthly revenue, order volume, and region for the year.",
    fields: ["month", "revenue", "orders", "region"],
    rowCount: SALES_Q4.length,
  },
  {
    id: "signups_2026",
    name: "Signups 2026",
    description: "Daily signups by acquisition source for April 2026.",
    fields: ["date", "signups", "source"],
    rowCount: SIGNUPS_2026.length,
  },
];

export function getDataset(id: string): Dataset {
  return DATASETS[id] ?? [];
}
