import type { Asset } from "@/types/asset";

// Simple client-side search: every word typed has to appear somewhere in the
// asset's name, subtitle, description or tags. Name matches are ranked first.
// With a real API this would move to the server.
export function searchAssets(items: Asset[], query: string): Asset[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  return items
    .filter((asset) => {
      const text = [asset.name, asset.subtitle, asset.description, ...asset.tags].join(" ").toLowerCase();
      return words.every((w) => text.includes(w));
    })
    .sort((a, b) => {
      const aName = words.some((w) => a.name.toLowerCase().includes(w)) ? 1 : 0;
      const bName = words.some((w) => b.name.toLowerCase().includes(w)) ? 1 : 0;
      return bName - aName || b.usageCount - a.usageCount;
    });
}
