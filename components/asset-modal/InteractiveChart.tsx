"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type Point = { label: string; value: number };

type InteractiveChartProps = {
  series: Point[];
  unit: string;
  defaultType: "bar" | "line";
  title: string;
};

export function InteractiveChart({ series, unit, defaultType, title }: InteractiveChartProps) {
  const [type, setType] = useState(defaultType);
  const [active, setActive] = useState<number | null>(null);

  const W = 480;
  const H = 180;
  const PAD = { top: 12, right: 8, bottom: 24, left: 8 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const max = Math.max(...series.map((p) => p.value)) * 1.1;
  const step = innerW / series.length;
  const x = (i: number) => PAD.left + step * i + step / 2;
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;

  const linePath = series.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.value)}`).join(" ");

  const focused = active !== null ? series[active] : null;
  const last = series[series.length - 1];
  const first = series[0];
  const change = ((last.value - first.value) / first.value) * 100;

  return (
    <div>
      <div className="mb-3 flex items-start justify-between gap-4">
        <p aria-live="polite" className="text-xs text-slate-500">
          {focused ? (
            <>
              <span className="font-medium text-slate-900">{focused.label}:</span> {focused.value}
              {unit === "%" ? "%" : ` ${unit}`}
            </>
          ) : (
            <>
              {change >= 0 ? "Up" : "Down"} {Math.abs(change).toFixed(1)}% from {first.label} to {last.label}.
              Hover or tab through the chart for values.
            </>
          )}
        </p>

        <div className="flex shrink-0 rounded-md bg-white p-0.5 ring-1 ring-slate-200" role="group" aria-label="Chart type">
          {(["bar", "line"] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={type === t}
              onClick={() => setType(t)}
              className={cn(
                "rounded px-2 py-0.5 text-[11px] capitalize",
                type === t ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`${title}, ${type} chart`}
        onMouseLeave={() => setActive(null)}
      >
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={PAD.left} x2={W - PAD.right} y1={PAD.top + innerH * f} y2={PAD.top + innerH * f} className="stroke-slate-200" strokeDasharray="2 4" />
        ))}
        <line x1={PAD.left} x2={W - PAD.right} y1={PAD.top + innerH} y2={PAD.top + innerH} className="stroke-slate-300" />

        {type === "line" && <path d={linePath} fill="none" className="stroke-slate-700" strokeWidth={2} />}

        {series.map((p, i) => {
          const isActive = active === i;
          const barW = step * 0.56;
          return (
            <g
              key={p.label}
              tabIndex={0}
              role="img"
              aria-label={`${p.label}: ${p.value}${unit === "%" ? "%" : ` ${unit}`}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="cursor-pointer outline-none [&:focus-visible_.hit]:stroke-slate-900"
            >
              <rect className="hit" x={x(i) - step / 2} y={PAD.top} width={step} height={innerH} fill="transparent" strokeWidth={1.5} rx={4} />
              {type === "bar" ? (
                <rect
                  x={x(i) - barW / 2}
                  y={y(p.value)}
                  width={barW}
                  height={PAD.top + innerH - y(p.value)}
                  rx={3}
                  className={cn("transition-colors", isActive ? "fill-slate-900" : "fill-slate-400")}
                />
              ) : (
                <circle cx={x(i)} cy={y(p.value)} r={isActive ? 5 : 3.5} className="fill-white stroke-slate-900" strokeWidth={2} />
              )}
              <text x={x(i)} y={H - 6} textAnchor="middle" className={cn("text-[10px]", isActive ? "fill-slate-900" : "fill-slate-400")}>
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>

      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr><th scope="col">Period</th><th scope="col">Value ({unit})</th></tr>
        </thead>
        <tbody>
          {series.map((p) => (
            <tr key={p.label}><td>{p.label}</td><td>{p.value}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
