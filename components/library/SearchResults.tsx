"use client";

import type { Asset } from "@/types/asset";
import { AssetCard } from "./AssetCard";
import { Button } from "@/components/ui/Button";

type SearchResultsProps = {
  query: string;
  results: Asset[];
  scopeLabel: string;
  onOpen: (id: string) => void;
  onClear: () => void;
};

export function SearchResults({ query, results, scopeLabel, onOpen, onClear }: SearchResultsProps) {
  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Results for “{query}”</h2>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear search
        </Button>
      </div>
      <p className="mt-0.5 text-xs text-slate-500">
        {results.length} {results.length === 1 ? "asset" : "assets"} in {scopeLabel}
      </p>

      {results.length > 0 ? (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {results.map((asset) => (
            <li key={asset.id}>
              <AssetCard asset={asset} onOpen={onOpen} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500">
          No assets match “{query}”. Try a broader term, or use Request at the top to ask for it.
        </p>
      )}
    </section>
  );
}
