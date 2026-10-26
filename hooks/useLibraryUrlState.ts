"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { LibraryTab } from "@/types/asset";

const TABS: LibraryTab[] = ["featured", "kpi", "dataviz", "layout", "storyboard"];

export function useLibraryUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const rawTab = params.get("tab") as LibraryTab | null;
  const tab: LibraryTab = rawTab && TABS.includes(rawTab) ? rawTab : "featured";
  const query = params.get("q") ?? "";
  const assetId = params.get("asset");

  const buildUrl = useCallback(
    (changes: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      }
      const qs = next.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [params, pathname],
  );

  const setQuery = useCallback(
    (q: string) => router.replace(buildUrl({ q }), { scroll: false }),
    [router, buildUrl],
  );

  const setTab = useCallback(
    (t: LibraryTab) => router.push(buildUrl({ tab: t === "featured" ? null : t }), { scroll: false }),
    [router, buildUrl],
  );

  const openAsset = useCallback(
    (id: string) => router.push(buildUrl({ asset: id }), { scroll: false }),
    [router, buildUrl],
  );

  const closeAsset = useCallback(
    () => router.replace(buildUrl({ asset: null }), { scroll: false }),
    [router, buildUrl],
  );

  const getAssetLink = useCallback(
    (id: string) => `${window.location.origin}${pathname}?asset=${encodeURIComponent(id)}`,
    [pathname],
  );

  return { tab, query, assetId, setQuery, setTab, openAsset, closeAsset, getAssetLink };
}
