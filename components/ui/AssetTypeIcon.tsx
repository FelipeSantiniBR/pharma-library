import type { AssetType } from "@/types/asset";
import { DataVizIcon, KpiIcon, LayoutIcon, StoryboardIcon } from "./Icons";

const MAP = {
  kpi: KpiIcon,
  dataviz: DataVizIcon,
  layout: LayoutIcon,
  storyboard: StoryboardIcon,
} as const;

export function AssetTypeIcon({ type, className }: { type: AssetType; className?: string }) {
  const Icon = MAP[type];
  return <Icon className={className} />;
}
