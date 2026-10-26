import type { Asset } from "@/types/asset";
import { TYPE_LABEL } from "./format";

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function searchAssets(items: Asset[], query: string): Asset[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return items;

  const scored: { asset: Asset; score: number }[] = [];

  for (const asset of items) {
    const name = normalize(asset.name);
    const subtitle = normalize(asset.subtitle);
    const tags = asset.tags.map(normalize);
    const description = normalize(asset.description);
    const type = normalize(TYPE_LABEL[asset.type]);

    let score = 0;
    let allTermsMatch = true;

    for (const term of terms) {
      let termScore = 0;
      if (name.includes(term)) termScore += name.startsWith(term) ? 12 : 8;
      if (tags.some((t) => t.includes(term))) termScore += 5;
      if (type.includes(term)) termScore += 4;
      if (subtitle.includes(term)) termScore += 3;
      if (description.includes(term)) termScore += 1;

      if (termScore === 0) {
        allTermsMatch = false;
        break;
      }
      score += termScore;
    }

    if (allTermsMatch) scored.push({ asset, score });
  }

  return scored
    .sort((a, b) => b.score - a.score || b.asset.usageCount - a.asset.usageCount)
    .map((s) => s.asset);
}
