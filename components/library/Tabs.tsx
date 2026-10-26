"use client";

import { useRef, type KeyboardEvent } from "react";
import type { LibraryTab } from "@/types/asset";
import { cn } from "@/lib/cn";

export const TAB_ITEMS: { value: LibraryTab; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "kpi", label: "KPI" },
  { value: "dataviz", label: "Data viz" },
  { value: "layout", label: "Layouts" },
  { value: "storyboard", label: "Storyboards" },
];

export function Tabs({ value, onChange }: { value: LibraryTab; onChange: (t: LibraryTab) => void }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const last = TAB_ITEMS.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = index === last ? 0 : index + 1;
    if (e.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    refs.current[next]?.focus();
    onChange(TAB_ITEMS[next].value);
  };

  return (
    <div
      role="tablist"
      aria-label="Asset types"
      className="grid grid-cols-5 gap-1 rounded-md bg-slate-100 p-1"
    >
      {TAB_ITEMS.map((tab, i) => {
        const selected = tab.value === value;
        return (
          <button
            key={tab.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`tab-${tab.value}`}
            aria-selected={selected}
            aria-controls="library-panel"
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "truncate rounded px-2 py-1.5 text-xs transition-colors",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-slate-900",
              selected
                ? "bg-white font-medium text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
