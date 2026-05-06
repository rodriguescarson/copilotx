"use client";

import { useMemo, useState } from "react";
import type { Dataset, DatasetMeta } from "@/types/dashboard";

interface DatasetPanelProps {
  datasets: DatasetMeta[];
  activeDatasetId: string;
  data: Dataset;
  onSelect: (id: string) => void;
  onPasteCsv: (parsed: { name: string; data: Dataset }) => void;
}

export function DatasetPanel({
  datasets,
  activeDatasetId,
  data,
  onSelect,
  onPasteCsv,
}: DatasetPanelProps) {
  const [showCsv, setShowCsv] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [csvError, setCsvError] = useState<string | null>(null);

  const previewRows = useMemo(() => data.slice(0, 5), [data]);
  const fields = useMemo(() => (data[0] ? Object.keys(data[0]) : []), [data]);

  const parseCsv = () => {
    setCsvError(null);
    const lines = csvText.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) {
      setCsvError("CSV needs a header row and at least one data row.");
      return;
    }
    const header = lines[0].split(",").map((s) => s.trim());
    const rows: Dataset = lines.slice(1).map((line) => {
      const cells = line.split(",").map((s) => s.trim());
      const row: Record<string, string | number> = {};
      header.forEach((h, i) => {
        const raw = cells[i] ?? "";
        const num = Number(raw);
        row[h] = raw !== "" && !Number.isNaN(num) ? num : raw;
      });
      return row;
    });
    onPasteCsv({ name: "Custom CSV", data: rows });
    setShowCsv(false);
    setCsvText("");
  };

  return (
    <aside className="flex flex-col gap-4 rounded-2xl bg-zinc-900/60 p-4 ring-1 ring-zinc-800 backdrop-blur-sm">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
          Dataset
        </p>
        <h2 className="mt-1 text-sm font-semibold text-zinc-100">Pick a sample</h2>
      </div>
      <div className="flex flex-col gap-2">
        {datasets.map((d) => {
          const active = d.id === activeDatasetId;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelect(d.id)}
              className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left transition-all ${
                active
                  ? "border-violet-400/60 bg-violet-500/10 ring-1 ring-violet-400/30"
                  : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-900/60"
              }`}
            >
              <span className="flex w-full items-center justify-between text-sm font-medium text-zinc-100">
                {d.name}
                <span className="text-[10px] font-normal text-zinc-500">
                  {d.rowCount} rows
                </span>
              </span>
              <span className="text-xs text-zinc-400">{d.description}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setShowCsv((v) => !v)}
          className="rounded-xl border border-dashed border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
        >
          {showCsv ? "Cancel" : "Paste your own CSV"}
        </button>
      </div>

      {showCsv && (
        <div className="space-y-2">
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder={"month,revenue\nJan,1200\nFeb,1500"}
            className="h-28 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950/60 p-2 font-mono text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none"
          />
          {csvError && <p className="text-xs text-rose-300">{csvError}</p>}
          <button
            type="button"
            onClick={parseCsv}
            className="w-full rounded-lg bg-violet-500/20 px-3 py-1.5 text-xs font-medium text-violet-200 ring-1 ring-violet-400/30 transition-colors hover:bg-violet-500/30"
          >
            Use this CSV
          </button>
        </div>
      )}

      <div>
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
          Preview
        </p>
        <div className="overflow-hidden rounded-lg border border-zinc-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/60 text-zinc-500">
              <tr>
                {fields.map((f) => (
                  <th key={f} className="px-2 py-1.5 font-medium">
                    {f}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {previewRows.map((row, i) => (
                <tr key={i} className="hover:bg-zinc-900/60">
                  {fields.map((f) => (
                    <td key={f} className="px-2 py-1.5 tabular-nums">
                      {String(row[f] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length > previewRows.length && (
          <p className="mt-1 text-[10px] text-zinc-500">
            … {data.length - previewRows.length} more rows
          </p>
        )}
      </div>
    </aside>
  );
}
