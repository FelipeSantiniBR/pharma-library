"use client";

import type { ReactNode } from "react";
import type { Asset, BusinessQuestion } from "@/types/asset";
import { cn } from "@/lib/cn";
import { useLibraryStore } from "@/store/library-store";
import { Badge } from "@/components/ui/Badge";
import { AssetTypeIcon } from "@/components/ui/AssetTypeIcon";
import { BookmarkIcon } from "@/components/ui/Icons";

// Small building blocks shared by the per-type detail panels.

export function ModalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export type Stat = { label: string; value: string };

export function StatsRow({ stats }: { stats: Stat[] }) {
  return (
    <dl className="mt-6 grid grid-cols-2 gap-y-4 border-y border-slate-100 py-4 sm:grid-cols-4 sm:divide-x sm:divide-slate-100">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col-reverse items-center text-center">
          <dt className="mt-0.5 text-[11px] text-slate-500">{s.label}</dt>
          <dd className="text-sm font-semibold text-slate-900">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function BusinessQuestions({ questions }: { questions: BusinessQuestion[] }) {
  return (
    <ModalSection title="Business questions">
      <ul className="grid gap-2 sm:grid-cols-2">
        {questions.map((q) => (
          <li key={q.title} className="rounded-md p-2.5 hover:bg-slate-50">
            <p className="text-xs font-medium text-slate-900">{q.title}</p>
            <p className="mt-0.5 text-xs leading-5 text-slate-500">{q.description}</p>
          </li>
        ))}
      </ul>
    </ModalSection>
  );
}

export function AffiliateList({ affiliates }: { affiliates: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {affiliates.map((name) => (
        <li key={name}>
          <Badge tone="outline">{name}</Badge>
        </li>
      ))}
    </ul>
  );
}

// One KPI in a list. `meta` replaces the subtitle line (used for storyboard filters).
// `showFavorite` adds a bookmark toggle, for the "applicable KPI favorites" in Data viz.
export function KpiRow({ kpi, meta, showFavorite = false }: { kpi: Asset; meta?: ReactNode; showFavorite?: boolean }) {
  const isFavorite = useLibraryStore((s) => s.favorites.includes(kpi.id));
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);

  return (
    <li className="flex items-center gap-3 rounded-md border border-slate-200 p-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-500">
        <AssetTypeIcon type={kpi.type} className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-medium text-slate-900">{kpi.name}</span>
        <span className="block truncate text-[11px] text-slate-500">{meta ?? kpi.subtitle}</span>
      </span>
      {showFavorite && (
        <button
          type="button"
          onClick={() => toggleFavorite(kpi.id)}
          aria-label={isFavorite ? `Remove ${kpi.name} from favorites` : `Add ${kpi.name} to favorites`}
          className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
        >
          <BookmarkIcon filled={isFavorite} className={cn("h-4 w-4", isFavorite && "text-slate-900")} />
        </button>
      )}
    </li>
  );
}

export function PreviewCanvas({ children }: { children: ReactNode }) {
  return <div className="mt-6 rounded-md bg-slate-50 p-4">{children}</div>;
}
