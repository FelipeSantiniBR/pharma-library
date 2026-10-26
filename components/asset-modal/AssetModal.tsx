"use client";

import { useState } from "react";
import type { Asset } from "@/types/asset";
import { formatDate, formatNumber, TYPE_LABEL } from "@/lib/format";
import { useLibraryStore } from "@/store/library-store";
import { Dialog } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import { Button, IconButton } from "@/components/ui/Button";
import { AssetTypeIcon } from "@/components/ui/AssetTypeIcon";
import { BookmarkIcon, CheckIcon, CloseIcon, LinkIcon, LockIcon } from "@/components/ui/Icons";
import { BusinessQuestions, StatsRow, type Stat } from "./parts";
import { KpiDetails } from "./details/KpiDetails";
import { DataVizDetails } from "./details/DataVizDetails";
import { LayoutDetails } from "./details/LayoutDetails";
import { StoryboardDetails } from "./details/StoryboardDetails";

type AssetModalProps = {
  asset: Asset | null;
  assets: Asset[];
  onClose: () => void;
  onRequestAccess: (assetId: string) => void;
  getAssetLink: (id: string) => string;
};

// Base modal from the flow: header, description, stats, favorite and copy link are
// shared by every asset type. The middle part changes per type (see AssetDetails).
export function AssetModal({ asset, ...props }: AssetModalProps) {
  return (
    <Dialog open={asset !== null} onClose={props.onClose} labelledBy="asset-modal-title" className="max-w-2xl">
      {/* key resets local state (e.g. "Copied") when another asset is opened */}
      {asset && <ModalContent key={asset.id} asset={asset} {...props} />}
    </Dialog>
  );
}

function ModalContent({ asset, assets, onClose, onRequestAccess, getAssetLink }: AssetModalProps & { asset: Asset }) {
  const isFavorite = useLibraryStore((s) => s.favorites.includes(asset.id));
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);
  const requested = useLibraryStore((s) => s.accessRequests.some((r) => r.assetId === asset.id));
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(getAssetLink(asset.id));
    setCopied(true);
  };

  return (
    <div className="relative px-5 pb-5 pt-10 sm:px-8">
      <div className="absolute right-3 top-3 flex gap-1">
        <IconButton label={copied ? "Link copied" : "Copy link"} onClick={copyLink}>
          {copied ? <CheckIcon className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
        </IconButton>
        <IconButton label="Close" onClick={onClose}>
          <CloseIcon className="h-4 w-4" />
        </IconButton>
      </div>

      <header className="text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-500">
          <AssetTypeIcon type={asset.type} className="h-5 w-5" />
        </span>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <h2 id="asset-modal-title" className="text-2xl font-semibold tracking-tight text-slate-900">
            {asset.name}
          </h2>
          <Badge>{TYPE_LABEL[asset.type]}</Badge>
        </div>
        <p className="mt-1 text-xs text-slate-500">{asset.subtitle}</p>
        <p className="mx-auto mt-4 max-w-prose text-sm leading-6 text-slate-700">{asset.description}</p>
        <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
          {asset.tags.map((tag) => (
            <li key={tag}>
              <Badge tone="outline">#{tag.replace(/\s+/g, "")}</Badge>
            </li>
          ))}
        </ul>
      </header>

      <StatsRow stats={getStats(asset)} />

      {/* Without access we still show the business questions, so the user can
          tell if the asset is worth requesting */}
      {asset.hasAccess ? (
        <AssetDetails asset={asset} assets={assets} />
      ) : (
        <>
          <div className="mt-6 flex flex-col items-center rounded-md bg-slate-50 px-6 py-8 text-center">
            <LockIcon className="h-6 w-6 text-slate-400" />
            <p className="mt-2 text-sm font-medium text-slate-900">You don’t have access to this asset</p>
            <p className="mt-1 text-xs text-slate-500">
              {requested ? "Your request was sent to the owner." : "Request access and tell the owner why you need it."}
            </p>
          </div>
          <BusinessQuestions questions={asset.businessQuestions} />
        </>
      )}

      <footer className="sticky bottom-0 -mx-5 mt-6 flex gap-2 bg-white px-5 pt-3 sm:-mx-8 sm:px-8">
        <Button className="flex-1" variant={asset.hasAccess ? "primary" : "ghost"} onClick={() => toggleFavorite(asset.id)}>
          <BookmarkIcon filled={isFavorite} className="h-4 w-4" />
          {isFavorite ? "Remove from favorites" : "Favorite item"}
        </Button>
        {!asset.hasAccess && (
          <Button className="flex-1" disabled={requested} onClick={() => onRequestAccess(asset.id)}>
            <LockIcon className="h-4 w-4" />
            {requested ? "Access requested" : "Request access"}
          </Button>
        )}
      </footer>
    </div>
  );
}

// Picks the detail panel for each asset type. The `never` check makes TypeScript
// complain here if a new asset type is added and not handled.
function AssetDetails({ asset, assets }: { asset: Asset; assets: Asset[] }) {
  const findMany = (ids: string[]) => assets.filter((a) => ids.includes(a.id));

  switch (asset.type) {
    case "kpi":
      return <KpiDetails asset={asset} />;
    case "dataviz":
      return <DataVizDetails asset={asset} kpis={findMany(asset.applicableKpiIds)} />;
    case "layout":
      return <LayoutDetails asset={asset} kpis={findMany(asset.kpiIds)} />;
    case "storyboard":
      return <StoryboardDetails asset={asset} assets={assets} />;
    default: {
      const never: never = asset;
      return never;
    }
  }
}

// The wireframe shows 4 stats. "Used" and "Last updated" are always there,
// the two in the middle depend on the asset type.
function getStats(asset: Asset): Stat[] {
  const used = { label: "Used", value: formatNumber(asset.usageCount) };
  const updated = { label: "Last updated", value: formatDate(asset.updatedAt) };

  switch (asset.type) {
    case "kpi":
      return [used, { label: "Metric IDs", value: String(asset.metricIds.length) }, { label: "Affiliates", value: String(asset.affiliates.length) }, updated];
    case "dataviz":
      return [used, { label: "Chart", value: asset.chartType === "bar" ? "Bar" : "Line" }, { label: "KPIs", value: String(asset.applicableKpiIds.length) }, updated];
    case "layout":
      return [used, { label: "Type", value: asset.layoutType }, { label: "Pages", value: String(asset.pages) }, updated];
    case "storyboard":
      return [used, { label: "Slides", value: String(asset.slides) }, { label: "Affiliates", value: String(asset.affiliates.length) }, updated];
  }
}
