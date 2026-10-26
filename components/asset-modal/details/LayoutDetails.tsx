"use client";

import { useState } from "react";
import type { Asset, LayoutAsset } from "@/types/asset";
import { cn } from "@/lib/cn";
import { BusinessQuestions, ModalSection, PreviewCanvas, RelatedAssetRow } from "../parts";

export function LayoutDetails({
  asset,
  related,
  onOpen,
}: {
  asset: LayoutAsset;
  related: Asset[];
  onOpen: (id: string) => void;
}) {
  return (
    <>
      <PreviewCanvas label={`${asset.name} preview`}>
        <LayoutPreview pages={asset.pages} kpiCount={asset.kpiIds.length} />
      </PreviewCanvas>

      <BusinessQuestions questions={asset.businessQuestions} />

      <ModalSection title="KPIs used">
        <ul className="grid gap-2 sm:grid-cols-2">
          {related.map((kpi) => (
            <RelatedAssetRow key={kpi.id} asset={kpi} onOpen={onOpen} meta={kpi.subtitle} />
          ))}
        </ul>
      </ModalSection>
    </>
  );
}

function LayoutPreview({ pages, kpiCount }: { pages: number; kpiCount: number }) {
  const [page, setPage] = useState(0);
  const pattern = page % 3;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Page {page + 1} of {pages}
        </p>
        <div className="flex gap-1" role="group" aria-label="Preview page">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={`Show page ${i + 1}`}
              aria-pressed={page === i}
              className={cn(
                "h-6 w-6 rounded text-[11px]",
                page === i ? "bg-slate-900 text-white" : "bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-900",
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div aria-hidden="true" className="grid aspect-[16/9] grid-cols-4 grid-rows-3 gap-2 rounded bg-white p-2 ring-1 ring-slate-200">
        {Array.from({ length: Math.min(kpiCount, 4) }, (_, i) => (
          <div key={i} className="flex flex-col justify-center gap-1 rounded bg-slate-100 px-2">
            <div className="h-1.5 w-2/3 rounded bg-slate-300" />
            <div className="h-3 w-1/2 rounded bg-slate-400" />
          </div>
        ))}
        {Array.from({ length: 4 - Math.min(kpiCount, 4) }, (_, i) => (
          <div key={`e${i}`} className="rounded bg-slate-50" />
        ))}
        {pattern === 0 && (
          <>
            <ChartBlock className="col-span-3 row-span-2" bars />
            <ChartBlock className="row-span-2" />
          </>
        )}
        {pattern === 1 && (
          <>
            <ChartBlock className="col-span-2 row-span-2" />
            <ChartBlock className="col-span-2 row-span-2" bars />
          </>
        )}
        {pattern === 2 && (
          <>
            <ChartBlock className="col-span-4 row-span-2" bars />
          </>
        )}
      </div>
    </div>
  );
}

function ChartBlock({ className, bars = false }: { className?: string; bars?: boolean }) {
  return (
    <div className={cn("flex items-end gap-1 rounded bg-slate-100 p-2", className)}>
      {bars ? (
        [40, 65, 50, 80, 70, 90].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm bg-slate-300" style={{ height: `${h}%` }} />
        ))
      ) : (
        <div className="m-auto h-3/5 aspect-square rounded-full border-[6px] border-slate-300 border-t-slate-400" />
      )}
    </div>
  );
}
