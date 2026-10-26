"use client";

import { useRef, useState } from "react";
import type { Asset, LibraryTab } from "@/types/asset";
import { searchAssets } from "@/lib/search";
import { TYPE_LABEL_PLURAL } from "@/lib/format";
import { useAssetParam } from "@/hooks/useAssetParam";
import { useLibraryStore } from "@/store/library-store";
import { Button } from "@/components/ui/Button";
import { RequestIcon } from "@/components/ui/Icons";
import { AssetModal } from "@/components/asset-modal/AssetModal";
import { RequestAccessDialog } from "@/components/request-access/RequestAccessDialog";
import { SearchBar } from "./SearchBar";
import { Tabs } from "./Tabs";
import { AssetSection } from "./AssetSection";
import { SearchResults } from "./SearchResults";

// Main page. Holds the tab, the search text and which dialog is open.
// The open asset lives in the URL instead, so "Copy link" can point straight to it.
export function Library({ assets }: { assets: Asset[] }) {
  const { assetId, openAsset, closeAsset, getAssetLink } = useAssetParam();
  const addRecentSearch = useLibraryStore((s) => s.addRecentSearch);
  const searchRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<LibraryTab>("featured");
  const [query, setQuery] = useState("");
  // null = closed, "" = opened from the header (nothing preselected), id = opened from an asset
  const [requestFor, setRequestFor] = useState<string | null>(null);

  const openedAsset = assets.find((a) => a.id === assetId) ?? null;

  // Featured searches everything, the other tabs only search their own type
  const scoped = tab === "featured" ? assets : assets.filter((a) => a.type === tab);
  const results = searchAssets(scoped, query);

  const featured = assets.filter((a) => a.featured);
  // Trending skips featured items so the two sections don't show the same cards
  const trending = assets.filter((a) => !a.featured).sort((a, b) => b.usageCount - a.usageCount);

  // Only save a search as "recent" when the user actually opens something from it
  const openFromResults = (id: string) => {
    addRecentSearch(query);
    openAsset(id);
  };

  const focusSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    searchRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="min-h-dvh bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-6 sm:px-6">
        <div className="flex justify-end">
          <Button variant="secondary" size="sm" onClick={() => setRequestFor("")}>
            <RequestIcon className="h-3.5 w-3.5" />
            Request
          </Button>
        </div>

        <header className="mt-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Library</h1>
          <p className="mt-3 text-sm text-slate-600">Browse for assets needed to report and present analysis.</p>
        </header>

        <div className="mx-auto mt-8 max-w-xl space-y-3">
          <SearchBar query={query} onQueryChange={setQuery} inputRef={searchRef} />
          <Tabs value={tab} onChange={setTab} />
        </div>

        <main className="mt-10">
          {query.trim() ? (
            <SearchResults
              query={query}
              results={results}
              scopeLabel={tab === "featured" ? "the library" : TYPE_LABEL_PLURAL[tab]}
              onOpen={openFromResults}
              onClear={() => setQuery("")}
            />
          ) : tab === "featured" ? (
            <>
              <AssetSection
                title="Featured"
                subtitle="Curated top picks from this week"
                assets={featured}
                onOpen={openAsset}
                onTrySearch={focusSearch}
              />
              <AssetSection
                title="Trending"
                subtitle="Most popular by community"
                assets={trending}
                onOpen={openAsset}
                onTrySearch={focusSearch}
                variant="plain"
              />
            </>
          ) : (
            <AssetSection
              key={tab}
              title={TYPE_LABEL_PLURAL[tab]}
              subtitle="Sorted by most used"
              assets={[...scoped].sort((a, b) => b.usageCount - a.usageCount)}
              onOpen={openAsset}
              onTrySearch={focusSearch}
            />
          )}
        </main>
      </div>

      <AssetModal
        asset={openedAsset}
        assets={assets}
        onClose={closeAsset}
        onRequestAccess={(id) => setRequestFor(id)}
        getAssetLink={getAssetLink}
      />

      <RequestAccessDialog
        open={requestFor !== null}
        initialAssetId={requestFor || null}
        assets={assets}
        onClose={() => setRequestFor(null)}
      />
    </div>
  );
}
