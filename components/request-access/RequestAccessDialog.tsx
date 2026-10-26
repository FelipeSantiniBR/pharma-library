"use client";

import { useState, type FormEvent } from "react";
import type { Asset } from "@/types/asset";
import { TYPE_LABEL } from "@/lib/format";
import { useLibraryStore } from "@/store/library-store";
import { Dialog } from "@/components/ui/Dialog";
import { Button, IconButton } from "@/components/ui/Button";
import { CloseIcon } from "@/components/ui/Icons";

const OTHER = "other";

type RequestAccessDialogProps = {
  open: boolean;
  initialAssetId: string | null;
  assets: Asset[];
  onClose: () => void;
};

// "Request…" from the flow. Opened from the header (nothing selected) or from a
// locked asset (preselected). There's no backend, so the request is just saved locally.
export function RequestAccessDialog({ open, initialAssetId, assets, onClose }: RequestAccessDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} labelledBy="request-title" className="max-w-md">
      {/* Mounting the form only while open resets its fields every time */}
      {open && <RequestForm initialAssetId={initialAssetId} assets={assets} onClose={onClose} />}
    </Dialog>
  );
}

function RequestForm({ initialAssetId, assets, onClose }: Omit<RequestAccessDialogProps, "open">) {
  const addAccessRequest = useLibraryStore((s) => s.addAccessRequest);
  const [target, setTarget] = useState(initialAssetId ?? "");
  const [reason, setReason] = useState("");
  const [sent, setSent] = useState(false);

  const lockedAssets = assets.filter((a) => !a.hasAccess);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    addAccessRequest({
      assetId: target === OTHER ? null : target,
      reason: reason.trim(),
      requestedAt: new Date().toISOString(),
    });
    setSent(true);
  };

  if (sent) {
    return (
      <div className="p-6 text-center">
        <h2 id="request-title" className="text-lg font-semibold text-slate-900">
          Request sent
        </h2>
        <p className="mt-1 text-sm text-slate-600">The owner will review it and get back to you.</p>
        <Button className="mt-6 w-full" onClick={onClose}>
          Done
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative p-6">
      <IconButton label="Close" onClick={onClose} className="absolute right-3 top-3">
        <CloseIcon className="h-4 w-4" />
      </IconButton>

      <h2 id="request-title" className="text-lg font-semibold text-slate-900">
        Request access
      </h2>
      <p className="mt-1 text-sm text-slate-600">Tell the owner what you need and why.</p>

      <label htmlFor="req-target" className="mb-1.5 mt-4 block text-xs font-medium text-slate-700">
        What do you need?
      </label>
      <select id="req-target" required value={target} onChange={(e) => setTarget(e.target.value)} className={inputClass}>
        <option value="" disabled>
          Select an asset
        </option>
        {lockedAssets.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name} ({TYPE_LABEL[a.type]})
          </option>
        ))}
        <option value={OTHER}>Something that isn’t in the library</option>
      </select>

      <label htmlFor="req-reason" className="mb-1.5 mt-4 block text-xs font-medium text-slate-700">
        Why do you need it?
      </label>
      <textarea
        id="req-reason"
        required
        minLength={10}
        rows={4}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="e.g. I’m building the Q4 brand review for Brazil and need this KPI."
        className={`${inputClass} h-auto py-2`}
      />

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Send request</Button>
      </div>
    </form>
  );
}

const inputClass =
  "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200";
