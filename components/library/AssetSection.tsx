"use client";

import { useId, useState } from "react";
import type { Asset } from "@/types/asset";
import { AssetCard } from "./AssetCard";
import { Button } from "@/components/ui/Button";
import { ChevronIcon, SearchIcon } from "@/components/ui/Icons";

type AssetSectionProps = {
  title: string;
  subtitle?: string;
  assets: Asset[];
  onOpen: (id: string) => void;
  onTrySearch: () => void;
  variant?: "bordered" | "plain";
  initialCount?: number;
};

// A titled grid that shows the first few assets and expands on "Show more".
// Once everything is visible we point the user to search instead.
export function AssetSection({
  title,
  subtitle,
  assets,
  onOpen,
  onTrySearch,
  variant = "bordered",
  initialCount = 4,
}: AssetSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const headingId = useId();
  const listId = useId();

  const visible = expanded ? assets : assets.slice(0, initialCount);
  const hiddenCount = assets.length - initialCount;

  return (
    <section aria-labelledby={headingId} className="mt-10 first:mt-0">
      <h2 id={headingId} className="text-xl font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}

      <ul id={listId} className="mt-5 grid gap-3 sm:grid-cols-2">
        {visible.map((asset) => (
          <li key={asset.id}>
            <AssetCard asset={asset} onOpen={onOpen} variant={variant} />
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        {hiddenCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={expanded}
            aria-controls={listId}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show less" : `Show ${hiddenCount} more`}
            <ChevronIcon className={expanded ? "h-3.5 w-3.5 rotate-180" : "h-3.5 w-3.5"} />
          </Button>
        )}

        {(expanded || hiddenCount <= 0) && (
          <p className="text-xs text-slate-500">
            Not seeing what you need?{" "}
            <button
              type="button"
              onClick={onTrySearch}
              className="inline-flex items-center gap-1 font-medium text-slate-900 underline underline-offset-2 hover:no-underline"
            >
              <SearchIcon className="h-3 w-3" />
              Try search
            </button>
          </p>
        )}
      </div>
    </section>
  );
}
