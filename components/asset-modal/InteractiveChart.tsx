"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type Point = { label: string; value: number };

type InteractiveChartProps = {
  series: Point[];
  unit: string;
  type: "bar" | "line";
  title: string;
};

// Hand-made SVG chart (the brief says no UI libraries). Hovering or tabbing to a
// point shows its value above the chart.
export function InteractiveChart({ series, unit, type, title }: InteractiveChartProps) {
  const [active, setActive] = useState<number | null>(null);

  // Fixed drawing area, the SVG scales to the container width via viewBox
  const W = 480;
  const H = 180;
  const PAD = { top: 12, bottom: 24 };
  const innerH = H - PAD.top - PAD.bottom;

  const max = Math.max(...series.map((p) => p.value)) * 1.1; // 10% headroom above the tallest point
  const step = W / series.length;
  const x = (i: number) => step * i + step / 2;
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;

  const linePath = series.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.value)}`).join(" ");
  const format = (v: number) => (unit === "%" ? `${v}%` : `${v} ${unit}`);
  const focused = active !== null ? series[active] : null;

  return (
    <div>
      <p className="mb-3 text-xs text-slate-500">
        {focused ? (
          <>
            <span className="font-medium text-slate-900">{focused.label}:</span> {format(focused.value)}
          </>
        ) : (
          "Hover a point to see its value"
        )}
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={title} onMouseLeave={() => setActive(null)}>
        <line x1={0} x2={W} y1={PAD.top + innerH} y2={PAD.top + innerH} className="stroke-slate-300" />

        {type === "line" && <path d={linePath} fill="none" className="stroke-slate-700" strokeWidth={2} />}

        {series.map((p, i) => {
          const isActive = active === i;
          return (
            <g
              key={p.label}
              tabIndex={0}
              aria-label={`${p.label}: ${format(p.value)}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="cursor-pointer outline-none"
            >
              {/* Invisible full-height column so the hover target isn't just the bar */}
              <rect x={x(i) - step / 2} y={PAD.top} width={step} height={innerH} fill="transparent" />
              {type === "bar" ? (
                <rect
                  x={x(i) - step * 0.28}
                  y={y(p.value)}
                  width={step * 0.56}
                  height={PAD.top + innerH - y(p.value)}
                  rx={3}
                  className={isActive ? "fill-slate-900" : "fill-slate-400"}
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
    </div>
  );
}
