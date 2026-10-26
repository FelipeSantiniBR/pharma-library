"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { Asset } from "@/types/asset";
import { searchAssets } from "@/lib/search";
import { TYPE_LABEL_PLURAL } from "@/lib/format";
import { useLibraryUrlState } from "@/hooks/useLibraryUrlState";
import { useLibraryStore } from "@/store/library-store";
import { Button } from "@/components/ui/Button";
import { RequestIcon } from "@/components/ui/Icons";
import { AssetModal } from "@/components/asset-modal/AssetModal";
import { RequestAccessDialog } from "@/components/request-access/RequestAccessDialog";
import { SearchBar } from "./SearchBar";
import { Tabs } from "./Tabs";
import { AssetSection } from "./AssetSection";
import { SearchResults } from "./SearchResults";

export function Library({ assets }: { assets: Asset[] }) {
  const { tab, query, assetId, setQuery, setTab, openAsset, closeAsset, getAssetLink } = useLibraryUrlState();
  const addRecentSearch = useLibraryStore((s) => s.addRecentSearch);
  const searchRef = useRef<HTMLInputElement>(null);

  const [request, setRequest] = useState<{ open: boolean; assetId: string | null }>({ open: false, assetId: null });

  const byId = useMemo(() => Object.fromEntries(assets.map((a) => [a.id, a])), [assets]);
  const openedAsset = assetId ? byId[assetId] ?? null : null;

  const scoped = useMemo(() => (tab === "featured" ? assets : assets.filter((a) => a.type === tab)), [assets, tab]);
  const results = useMemo(() => (query ? searchAssets(scoped, query) : []), [scoped, query]);

  const featured = useMemo(() => assets.filter((a) => a.featured), [assets]);
  const trending = useMemo(
    () => assets.filter((a) => !a.featured).sort((a, b) => b.usageCount - a.usageCount),
    [assets],
  );
  const byTypeSorted = useMemo(() => [...scoped].sort((a, b) => b.usageCount - a.usageCount), [scoped]);

  const openFromResults = useCallback(
    (id: string) => {
      if (query) addRecentSearch(query);
      openAsset(id);
    },
    [query, addRecentSearch, openAsset],
  );

  const focusSearch = useCallback(() => {
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    searchRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="min-h-dvh bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-6 sm:px-6">
        <div className="flex justify-end">
          <Button variant="secondary" size="sm" onClick={() => setRequest({ open: true, assetId: null })}>
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

        <main id="library-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-10">
          {query ? (
            <SearchResults
              query={query}
              results={results}
              scopeLabel={tab === "featured" ? "the library" : TYPE_LABEL_PLURAL[tab]}
              onOpen={openFromResults}
              onClear={() => {
                setQuery("");
                searchRef.current?.focus();
              }}
              onSearchAll={tab === "featured" ? undefined : () => setTab("featured")}
              onRequest={() => setRequest({ open: true, assetId: null })}
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
              assets={byTypeSorted}
              onOpen={openAsset}
              onTrySearch={focusSearch}
              initialCount={6}
            />
          )}
        </main>
      </div>

      <AssetModal
        asset={openedAsset}
        byId={byId}
        onClose={closeAsset}
        onOpen={openAsset}
        onRequestAccess={(id) => setRequest({ open: true, assetId: id })}
        getAssetLink={getAssetLink}
      />

      <RequestAccessDialog
        open={request.open}
        initialAssetId={request.assetId}
        assets={assets}
        onClose={() => setRequest({ open: false, assetId: null })}
      />
    </div>
  );
}
