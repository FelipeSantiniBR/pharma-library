import type { AssetType } from "@/types/asset";

export const TYPE_LABEL: Record<AssetType, string> = {
  kpi: "KPI",
  dataviz: "Data viz",
  layout: "Layout",
  storyboard: "Storyboard",
};

export const TYPE_LABEL_PLURAL: Record<AssetType, string> = {
  kpi: "KPIs",
  dataviz: "Data viz",
  layout: "Layouts",
  storyboard: "Storyboards",
};

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
}

export function formatNumber(n: number) {
  return n.toLocaleString("en-US");
}
