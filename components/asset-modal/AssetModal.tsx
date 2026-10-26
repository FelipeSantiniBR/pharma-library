"use client";

import type { Asset } from "@/types/asset";
import { formatDate, formatNumber, TYPE_LABEL } from "@/lib/format";
import { useHasRequested, useLibraryStore } from "@/store/library-store";
import { toast } from "@/store/toast-store";
import { Dialog } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import { Button, IconButton } from "@/components/ui/Button";
import { AssetTypeIcon } from "@/components/ui/AssetTypeIcon";
import { BookmarkIcon, ClockIcon, CloseIcon, LinkIcon, LockIcon } from "@/components/ui/Icons";
import { BusinessQuestions, StatsRow, type Stat } from "./parts";
import { KpiDetails } from "./details/KpiDetails";
import { DataVizDetails } from "./details/DataVizDetails";
import { LayoutDetails } from "./details/LayoutDetails";
import { StoryboardDetails } from "./details/StoryboardDetails";

type AssetModalProps = {
  asset: Asset | null;
  byId: Record<string, Asset>;
  onClose: () => void;
  onOpen: (id: string) => void;
  onRequestAccess: (assetId: string) => void;
  getAssetLink: (id: string) => string;
};

export function AssetModal({ asset, byId, onClose, onOpen, onRequestAccess, getAssetLink }: AssetModalProps) {
  return (
    <Dialog open={asset !== null} onClose={onClose} labelledBy="asset-modal-title" className="max-w-2xl">
      {asset && (
        <ModalContent
          key={asset.id}
          asset={asset}
          byId={byId}
          onClose={onClose}
          onOpen={onOpen}
          onRequestAccess={onRequestAccess}
          getAssetLink={getAssetLink}
        />
      )}
    </Dialog>
  );
}

function ModalContent({
  asset,
  byId,
  onClose,
  onOpen,
  onRequestAccess,
  getAssetLink,
}: Omit<AssetModalProps, "asset"> & { asset: Asset }) {
  const isFavorite = useLibraryStore((s) => s.favorites.includes(asset.id));
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);
  const requested = useHasRequested(asset.id);

  const copyLink = async () => {
    const url = getAssetLink(asset.id);
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied");
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  const onFavorite = () => {
    toggleFavorite(asset.id);
    toast(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <div className="relative px-5 pb-5 pt-10 sm:px-8">
      <div className="absolute right-3 top-3 flex gap-1">
        <IconButton label="Copy link" onClick={copyLink}>
          <LinkIcon className="h-4 w-4" />
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
        <ul className="mt-3 flex flex-wrap justify-center gap-1.5" aria-label="Tags">
          {asset.tags.map((tag) => (
            <li key={tag}>
              <Badge tone="outline">#{tag.replace(/\s+/g, "")}</Badge>
            </li>
          ))}
        </ul>
      </header>

      <StatsRow stats={getStats(asset)} />

      {asset.hasAccess ? (
        <AssetDetails asset={asset} byId={byId} onOpen={onOpen} />
      ) : (
        <>
          <div className="mt-6 flex flex-col items-center rounded-md bg-slate-50 px-6 py-8 text-center ring-1 ring-inset ring-slate-100">
            <LockIcon className="h-6 w-6 text-slate-400" />
            <p className="mt-2 text-sm font-medium text-slate-900">You don’t have access to this {TYPE_LABEL[asset.type].toLowerCase()}</p>
            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
              {requested
                ? "Your request is with the asset owner. You’ll be able to open it once it’s approved."
                : "Request access and tell the owner why you need it. You can still read the business questions below."}
            </p>
          </div>
          <BusinessQuestions questions={asset.businessQuestions} />
        </>
      )}

      <footer className="sticky bottom-0 -mx-5 mt-6 flex gap-2 bg-white px-5 pt-3 sm:-mx-8 sm:px-8">
        {asset.hasAccess ? (
          <Button className="flex-1" onClick={onFavorite} aria-pressed={isFavorite}>
            <BookmarkIcon filled={isFavorite} className="h-4 w-4" />
            {isFavorite ? "Remove from favorites" : "Favorite item"}
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={onFavorite} aria-pressed={isFavorite} className="ring-1 ring-slate-200">
              <BookmarkIcon filled={isFavorite} className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">{isFavorite ? "Saved" : "Favorite"}</span>
            </Button>
            <Button className="flex-1" disabled={requested} onClick={() => onRequestAccess(asset.id)}>
              {requested ? <ClockIcon className="h-4 w-4" /> : <LockIcon className="h-4 w-4" />}
              {requested ? "Access requested" : "Request access"}
            </Button>
          </>
        )}
      </footer>
    </div>
  );
}

function AssetDetails({ asset, byId, onOpen }: { asset: Asset; byId: Record<string, Asset>; onOpen: (id: string) => void }) {
  const resolve = (ids: string[]) => ids.map((id) => byId[id]).filter(Boolean);

  switch (asset.type) {
    case "kpi":
      return <KpiDetails asset={asset} />;
    case "dataviz":
      return <DataVizDetails asset={asset} related={resolve(asset.applicableKpiIds)} onOpen={onOpen} />;
    case "layout":
      return <LayoutDetails asset={asset} related={resolve(asset.kpiIds)} onOpen={onOpen} />;
    case "storyboard":
      return <StoryboardDetails asset={asset} byId={byId} onOpen={onOpen} />;
    default: {
      const never: never = asset;
      return never;
    }
  }
}

function getStats(asset: Asset): Stat[] {
  const used: Stat = { label: "Used", value: formatNumber(asset.usageCount), hint: "Times this asset was added to a layout or report" };
  const updated: Stat = { label: "Last updated", value: formatDate(asset.updatedAt) };

  switch (asset.type) {
    case "kpi":
      return [used, { label: "Metric IDs", value: String(asset.metricIds.length) }, { label: "Affiliates", value: String(asset.affiliates.length) }, updated];
    case "dataviz":
      return [used, { label: "Chart", value: asset.chartType === "bar" ? "Bar" : "Line" }, { label: "KPIs", value: String(asset.applicableKpiIds.length) }, updated];
    case "layout":
      return [used, { label: "Type", value: asset.layoutType, hint: "Universal layouts work for every affiliate" }, { label: "Pages", value: String(asset.pages) }, updated];
    case "storyboard":
      return [used, { label: "Slides", value: String(asset.slides) }, { label: "Affiliates", value: String(asset.affiliates.length) }, updated];
  }
}
