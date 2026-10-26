"use client";

import type { Asset } from "@/types/asset";
import { cn } from "@/lib/cn";
import { formatDate, TYPE_LABEL } from "@/lib/format";
import { useLibraryStore } from "@/store/library-store";
import { AssetTypeIcon } from "@/components/ui/AssetTypeIcon";
import { BookmarkIcon, LockIcon } from "@/components/ui/Icons";
import { Highlight } from "./Highlight";

type AssetCardProps = {
  asset: Asset;
  onOpen: (id: string) => void;
  query?: string;
  variant?: "bordered" | "plain";
};

export function AssetCard({ asset, onOpen, query = "", variant = "bordered" }: AssetCardProps) {
  const isFavorite = useLibraryStore((s) => s.favorites.includes(asset.id));

  return (
    <button
      type="button"
      onClick={() => onOpen(asset.id)}
      className={cn(
        "group flex w-full items-start gap-4 rounded-lg p-3 text-left transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
        variant === "bordered"
          ? "border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
          : "hover:bg-white",
      )}
    >
      <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400 group-hover:text-slate-500">
        <AssetTypeIcon type={asset.type} className="h-6 w-6" />
        {!asset.hasAccess && (
          <span
            className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200"
            title="Access required"
          >
            <LockIcon className="h-3 w-3" />
          </span>
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold leading-5 text-slate-900">
            <Highlight text={asset.name} query={query} />
          </span>
          {isFavorite && (
            <BookmarkIcon filled className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-700" aria-label="Favorite" />
          )}
        </span>
        <span className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-600">
          <Highlight text={asset.description} query={query} />
        </span>
        <span className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
          <span>{TYPE_LABEL[asset.type]}</span>
          <span aria-hidden="true">/</span>
          <time dateTime={asset.updatedAt}>{formatDate(asset.updatedAt)}</time>
          {!asset.hasAccess && <span className="sr-only">, access required</span>}
        </span>
      </span>
    </button>
  );
}
