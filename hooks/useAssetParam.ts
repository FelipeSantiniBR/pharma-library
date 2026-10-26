"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Keeps the open asset in the URL (?asset=id). That way a copied link opens the
// same modal, and the browser Back button closes it.
export function useAssetParam() {
  const router = useRouter();
  const pathname = usePathname();
  const assetId = useSearchParams().get("asset");

  return {
    assetId,
    openAsset: (id: string) => router.push(`${pathname}?asset=${encodeURIComponent(id)}`, { scroll: false }),
    closeAsset: () => router.replace(pathname, { scroll: false }),
    getAssetLink: (id: string) => `${window.location.origin}${pathname}?asset=${encodeURIComponent(id)}`,
  };
}
