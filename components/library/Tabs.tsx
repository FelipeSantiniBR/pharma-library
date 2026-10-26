"use client";

import type { LibraryTab } from "@/types/asset";
import { cn } from "@/lib/cn";

// Same four tabs as the wireframe. Data viz assets show up in Featured/Trending and search.
const TAB_ITEMS: { value: LibraryTab; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "kpi", label: "KPI" },
  { value: "layout", label: "Layouts" },
  { value: "storyboard", label: "Storyboards" },
];

export function Tabs({ value, onChange }: { value: LibraryTab; onChange: (t: LibraryTab) => void }) {
  return (
    <div role="tablist" aria-label="Asset types" className="grid grid-cols-4 gap-1 rounded-md bg-slate-100 p-1">
      {TAB_ITEMS.map((tab) => {
        const selected = tab.value === value;
        return (
          <button
            key={tab.value}
            role="tab"
            type="button"
            aria-selected={selected}
            onClick={() => onChange(tab.value)}
            className={cn(
              "truncate rounded px-2 py-1.5 text-xs transition-colors",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-slate-900",
              selected ? "bg-white font-medium text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
