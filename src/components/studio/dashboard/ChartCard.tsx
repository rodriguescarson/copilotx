"use client";

import { useId, useMemo } from "react";
import type { ChartWidget, DataPoint } from "@/types/dashboard";
import { getDataset } from "@/app/studio/dashboard/sample-data";

const ACCENT_HEX: Record<string, string> = {
  violet: "#a78bfa",
  emerald: "#34d399",
  amber: "#fbbf24",
  sky: "#38bdf8",
  rose: "#fb7185",
  cyan: "#22d3ee",
};

const SERIES_PALETTE = ["#a78bfa", "#34d399", "#fbbf24", "#38bdf8", "#fb7185", "#22d3ee"];

function resolveColor(accent: string | undefined): string {
  return ACCENT_HEX[accent ?? "violet"] ?? ACCENT_HEX.violet;
}

interface ChartProps {
  widget: ChartWidget;
  compact?: boolean;
}

export function ChartCard({ widget, compact = false }: ChartProps) {
  const { title, type, datasetId, xKey, yKeys, accent } = widget.config;
  const data = useMemo(() => getDataset(datasetId), [datasetId]);
  const color = resolveColor(accent);

  const height = compact ? 140 : 220;
  const width = compact ? 320 : 560;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-zinc-800 backdrop-blur-sm transition-all duration-500 hover:bg-zinc-900/90">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-zinc-800/40 via-transparent to-transparent" aria-hidden />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
            <p className="mt-0.5 text-xs text-zinc-500">
              {type} · {datasetId.replace(/_/g, " ")}
            </p>
          </div>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
            style={{ backgroundColor: `${color}22`, color }}
          >
            {yKeys.join(" / ")}
          </span>
        </div>
        <div className="overflow-hidden">
          <ChartSVG
            type={type}
            data={data}
            xKey={xKey}
            yKeys={yKeys}
            color={color}
            width={width}
            height={height}
          />
        </div>
      </div>
    </div>
  );
}

interface ChartSVGProps {
  type: ChartWidget["config"]["type"];
  data: DataPoint[];
  xKey: string;
  yKeys: string[];
  color: string;
  width: number;
  height: number;
}

function ChartSVG({ type, data, xKey, yKeys, color, width, height }: ChartSVGProps) {
  if (!data.length || !yKeys.length) {
    return <EmptyChart width={width} height={height} />;
  }
  if (type === "pie") return <PieChart data={data} xKey={xKey} yKey={yKeys[0]} width={width} height={height} />;
  return <CartesianChart type={type} data={data} xKey={xKey} yKeys={yKeys} color={color} width={width} height={height} />;
}

function EmptyChart({ width, height }: { width: number; height: number }) {
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full text-zinc-700">
      <text x={width / 2} y={height / 2} textAnchor="middle" className="fill-current text-xs">
        No data
      </text>
    </svg>
  );
}

interface CartesianProps {
  type: "line" | "bar" | "area";
  data: DataPoint[];
  xKey: string;
  yKeys: string[];
  color: string;
  width: number;
  height: number;
}

function CartesianChart({ type, data, xKey, yKeys, color, width, height }: CartesianProps) {
  const padX = 36;
  const padY = 22;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const id = useId();

  const numericValues = data.flatMap((row) =>
    yKeys.map((k) => Number(row[k] ?? 0)),
  );
  const max = Math.max(...numericValues, 1);
  const min = Math.min(...numericValues, 0);
  const range = max - min || 1;

  const xPos = (i: number) => padX + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const yPos = (v: number) => padY + innerH - ((v - min) / range) * innerH;

  // Sample x-axis labels — show first/last + a few in between.
  const labelStride = Math.max(1, Math.floor(data.length / 6));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="chart">
      <defs>
        <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={padX}
          x2={width - padX}
          y1={padY + innerH * t}
          y2={padY + innerH * t}
          stroke="#27272a"
          strokeDasharray="2 4"
          strokeWidth={1}
        />
      ))}
      {yKeys.map((yKey, seriesIdx) => {
        const seriesColor = yKeys.length > 1 ? SERIES_PALETTE[seriesIdx % SERIES_PALETTE.length] : color;
        const points = data.map((row, i) => ({
          x: xPos(i),
          y: yPos(Number(row[yKey] ?? 0)),
        }));
        if (type === "bar") {
          const groupWidth = innerW / data.length;
          const barWidth = Math.max(2, (groupWidth * 0.7) / yKeys.length);
          return (
            <g key={yKey}>
              {points.map((p, i) => {
                const x = padX + i * groupWidth + (groupWidth - barWidth * yKeys.length) / 2 + seriesIdx * barWidth;
                const h = padY + innerH - p.y;
                return (
                  <rect
                    key={i}
                    x={x}
                    y={p.y}
                    width={barWidth}
                    height={Math.max(0, h)}
                    rx={2}
                    fill={seriesColor}
                    opacity={0}
                    style={{ animation: `dashbar 600ms ease-out ${i * 40}ms forwards` }}
                  />
                );
              })}
            </g>
          );
        }
        const path = points
          .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
          .join(" ");
        const areaPath = `${path} L ${xPos(data.length - 1).toFixed(2)} ${(padY + innerH).toFixed(2)} L ${xPos(0).toFixed(2)} ${(padY + innerH).toFixed(2)} Z`;
        return (
          <g key={yKey}>
            {type === "area" && (
              <path
                d={areaPath}
                fill={`url(#${id}-grad)`}
                opacity={0}
                style={{ animation: `dashfade 800ms ease-out forwards` }}
              />
            )}
            <path
              d={path}
              fill="none"
              stroke={seriesColor}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              style={{
                strokeDasharray: 1,
                strokeDashoffset: 1,
                animation: `dashdraw 900ms ease-out forwards`,
              }}
            />
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={2.5}
                fill="#0a0a0a"
                stroke={seriesColor}
                strokeWidth={1.5}
                opacity={0}
                style={{ animation: `dashfade 400ms ease-out ${300 + i * 30}ms forwards` }}
              />
            ))}
          </g>
        );
      })}
      {/* x labels */}
      {data.map((row, i) => {
        if (i % labelStride !== 0 && i !== data.length - 1) return null;
        return (
          <text
            key={i}
            x={xPos(i)}
            y={height - 6}
            textAnchor="middle"
            className="fill-zinc-500 text-[10px]"
          >
            {String(row[xKey] ?? "").slice(0, 8)}
          </text>
        );
      })}
      <style>{`
        @keyframes dashdraw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes dashfade {
          to { opacity: 1; }
        }
        @keyframes dashbar {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </svg>
  );
}

interface PieProps {
  data: DataPoint[];
  xKey: string;
  yKey: string;
  width: number;
  height: number;
}

function PieChart({ data, xKey, yKey, width, height }: PieProps) {
  // Aggregate by xKey if duplicates exist (e.g. region totals).
  const buckets = new Map<string, number>();
  for (const row of data) {
    const k = String(row[xKey] ?? "");
    const v = Number(row[yKey] ?? 0);
    buckets.set(k, (buckets.get(k) ?? 0) + v);
  }
  const entries = [...buckets.entries()];
  const total = entries.reduce((acc, [, v]) => acc + v, 0) || 1;
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) / 2 - 18;
  const innerR = r * 0.55;

  let cursor = -Math.PI / 2;
  const slices = entries.map(([label, value], idx) => {
    const slice = (value / total) * Math.PI * 2;
    const start = cursor;
    const end = cursor + slice;
    cursor = end;
    const large = slice > Math.PI ? 1 : 0;
    const sx = cx + Math.cos(start) * r;
    const sy = cy + Math.sin(start) * r;
    const ex = cx + Math.cos(end) * r;
    const ey = cy + Math.sin(end) * r;
    const sxIn = cx + Math.cos(end) * innerR;
    const syIn = cy + Math.sin(end) * innerR;
    const exIn = cx + Math.cos(start) * innerR;
    const eyIn = cy + Math.sin(start) * innerR;
    const path = `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey} L ${sxIn} ${syIn} A ${innerR} ${innerR} 0 ${large} 0 ${exIn} ${eyIn} Z`;
    return { label, value, path, color: SERIES_PALETTE[idx % SERIES_PALETTE.length] };
  });

  return (
    <div className="flex items-center gap-6">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[260px]" role="img" aria-label="pie chart">
        {slices.map((s, i) => (
          <path
            key={s.label}
            d={s.path}
            fill={s.color}
            opacity={0}
            style={{ animation: `dashfade 500ms ease-out ${i * 80}ms forwards` }}
          />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" className="fill-zinc-300 text-xs">
          Total
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="fill-zinc-50 text-base font-semibold">
          {formatNumber(total)}
        </text>
        <style>{`@keyframes dashfade { to { opacity: 1; } }`}</style>
      </svg>
      <ul className="flex flex-1 flex-col gap-2 text-xs">
        {slices.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-2 text-zinc-300">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
            <span className="tabular-nums text-zinc-400">
              {Math.round((s.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
