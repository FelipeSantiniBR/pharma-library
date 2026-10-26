"use client";

import type { ReactNode } from "react";
import type { Asset, BusinessQuestion } from "@/types/asset";
import { AFFILIATES } from "@/data/assets";
import { cn } from "@/lib/cn";
import { TYPE_LABEL } from "@/lib/format";
import { useLibraryStore } from "@/store/library-store";
import { AssetTypeIcon } from "@/components/ui/AssetTypeIcon";
import { BookmarkIcon, CheckIcon, InfoIcon } from "@/components/ui/Icons";

export function ModalSection({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("mt-6", className)}>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export type Stat = { label: string; value: string; hint?: string };

export function StatsRow({ stats }: { stats: Stat[] }) {
  return (
    <dl className="mt-6 grid grid-cols-2 gap-y-4 border-y border-slate-100 py-4 sm:grid-cols-4 sm:divide-x sm:divide-slate-100">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col-reverse items-center text-center">
          <dt className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
            {s.label}
            {s.hint && (
              <span title={s.hint} className="cursor-help">
                <InfoIcon className="h-3 w-3" />
                <span className="sr-only">{s.hint}</span>
              </span>
            )}
          </dt>
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
          <li key={q.title} className="rounded-md p-2.5 transition-colors hover:bg-slate-50">
            <p className="text-xs font-medium text-slate-900">{q.title}</p>
            <p className="mt-0.5 text-xs leading-5 text-slate-500">{q.description}</p>
          </li>
        ))}
      </ul>
    </ModalSection>
  );
}

export function AffiliateList({ applicable }: { applicable: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {AFFILIATES.map((name) => {
        const ok = applicable.includes(name);
        return (
          <li
            key={name}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
              ok ? "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200" : "bg-slate-50 text-slate-400 line-through",
            )}
          >
            {ok && <CheckIcon className="h-3 w-3" />}
            {name}
            <span className="sr-only">{ok ? "(applicable)" : "(not applicable)"}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function RelatedAssetRow({
  asset,
  onOpen,
  meta,
  showFavorite = false,
}: {
  asset: Asset;
  onOpen: (id: string) => void;
  meta?: ReactNode;
  showFavorite?: boolean;
}) {
  const isFavorite = useLibraryStore((s) => s.favorites.includes(asset.id));
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);

  return (
    <li className="flex items-center gap-2 rounded-md border border-slate-200 pr-1">
      <button
        type="button"
        onClick={() => onOpen(asset.id)}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-md p-2 text-left hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-500">
          <AssetTypeIcon type={asset.type} className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-xs font-medium text-slate-900">{asset.name}</span>
          <span className="block truncate text-[11px] text-slate-500">{meta ?? TYPE_LABEL[asset.type]}</span>
        </span>
      </button>
      {showFavorite && (
        <button
          type="button"
          onClick={() => toggleFavorite(asset.id)}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remove ${asset.name} from favorites` : `Add ${asset.name} to favorites`}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900"
        >
          <BookmarkIcon filled={isFavorite} className={cn("h-4 w-4", isFavorite && "text-slate-900")} />
        </button>
      )}
    </li>
  );
}

export function PreviewCanvas({ children, label }: { children: ReactNode; label: string }) {
  return (
    <figure className="mt-6 rounded-md bg-slate-50 p-4 ring-1 ring-inset ring-slate-100">
      {children}
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}
