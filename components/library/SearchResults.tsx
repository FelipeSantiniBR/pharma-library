"use client";

import type { Asset } from "@/types/asset";
import { AssetCard } from "./AssetCard";
import { Button } from "@/components/ui/Button";
import { SearchIcon } from "@/components/ui/Icons";

type SearchResultsProps = {
  query: string;
  results: Asset[];
  scopeLabel: string;
  onOpen: (id: string) => void;
  onClear: () => void;
  onSearchAll?: () => void;
  onRequest: () => void;
};

export function SearchResults({ query, results, scopeLabel, onOpen, onClear, onSearchAll, onRequest }: SearchResultsProps) {
  return (
    <section aria-labelledby="results-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="results-heading" className="text-xl font-semibold tracking-tight text-slate-900">
          Results for “{query}”
        </h2>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear search
        </Button>
      </div>
      <p aria-live="polite" className="mt-0.5 text-xs text-slate-500">
        {results.length} {results.length === 1 ? "asset" : "assets"} in {scopeLabel}
      </p>

      {results.length > 0 ? (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {results.map((asset) => (
            <li key={asset.id}>
              <AssetCard asset={asset} onOpen={onOpen} query={query} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 flex flex-col items-center rounded-lg border border-dashed border-slate-300 px-6 py-12 text-center">
          <SearchIcon className="h-6 w-6 text-slate-400" />
          <p className="mt-3 text-sm font-medium text-slate-900">No assets match “{query}”</p>
          <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
            Check the spelling or try a broader term like “launch”, “share” or “patients”.
            If it doesn’t exist yet, ask for it.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {onSearchAll && (
              <Button variant="ghost" size="sm" className="ring-1 ring-slate-200" onClick={onSearchAll}>
                Search all assets
              </Button>
            )}
            <Button size="sm" onClick={onRequest}>
              Request a new asset
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
