"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import type { Asset } from "@/types/asset";
import { TYPE_LABEL_PLURAL } from "@/lib/format";
import { useLibraryStore } from "@/store/library-store";
import { toast } from "@/store/toast-store";
import { Dialog } from "@/components/ui/Dialog";
import { Button, IconButton } from "@/components/ui/Button";
import { CheckIcon, CloseIcon } from "@/components/ui/Icons";

const OTHER = "__other__";
const MIN_REASON = 20;

type RequestAccessDialogProps = {
  open: boolean;
  initialAssetId: string | null;
  assets: Asset[];
  onClose: () => void;
};

export function RequestAccessDialog({ open, initialAssetId, assets, onClose }: RequestAccessDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} labelledBy="request-title" className="max-w-md">
      {open && <RequestForm initialAssetId={initialAssetId} assets={assets} onClose={onClose} />}
    </Dialog>
  );
}

function RequestForm({ initialAssetId, assets, onClose }: Omit<RequestAccessDialogProps, "open">) {
  const accessRequests = useLibraryStore((s) => s.accessRequests);
  const addAccessRequest = useLibraryStore((s) => s.addAccessRequest);

  const [target, setTarget] = useState(initialAssetId ?? "");
  const [subject, setSubject] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [submitted, setSubmitted] = useState(false);

  const restricted = assets.filter((a) => !a.hasAccess);
  const alreadyRequested = new Set(accessRequests.map((r) => r.assetId));

  const errors = {
    target: !target ? "Choose what you need access to." : null,
    subject: target === OTHER && subject.trim().length < 3 ? "Describe what you’re looking for." : null,
    reason:
      reason.trim().length < MIN_REASON
        ? `Add a bit more detail (at least ${MIN_REASON} characters) so the owner can decide.`
        : null,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasErrors) return;

    setStatus("submitting");
    await new Promise((r) => setTimeout(r, 700));

    addAccessRequest({
      assetId: target === OTHER ? null : target,
      subject: target === OTHER ? subject.trim() : undefined,
      reason: reason.trim(),
      requestedAt: new Date().toISOString(),
    });
    setStatus("done");
    toast("Access requested");
  };

  if (status === "done") {
    const name = target === OTHER ? subject : assets.find((a) => a.id === target)?.name;
    return (
      <div className="flex flex-col items-center px-6 py-8 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <CheckIcon className="h-5 w-5" />
        </span>
        <h2 id="request-title" className="mt-3 text-lg font-semibold text-slate-900">
          Access requested
        </h2>
        <p className="mt-1 max-w-xs text-sm text-slate-600">
          We sent your request for <span className="font-medium text-slate-900">{name}</span> to its owner. Most requests are
          reviewed within 2 business days.
        </p>
        <Button className="mt-6 w-full" onClick={onClose}>
          Done
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative p-6">
      <IconButton label="Close" onClick={onClose} className="absolute right-3 top-3">
        <CloseIcon className="h-4 w-4" />
      </IconButton>

      <h2 id="request-title" className="text-lg font-semibold text-slate-900">
        Request access
      </h2>
      <p className="mt-1 text-sm text-slate-600">Tell the owner what you need and how you’ll use it.</p>

      <Field label="What do you need?" htmlFor="req-target" error={submitted ? errors.target : null}>
        <select
          id="req-target"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          aria-invalid={submitted && !!errors.target}
          aria-describedby={submitted && errors.target ? "req-target-error" : undefined}
          className={inputClass}
        >
          <option value="" disabled>
            Select an asset
          </option>
          {(["kpi", "dataviz", "layout", "storyboard"] as const).map((type) => {
            const group = restricted.filter((a) => a.type === type);
            if (group.length === 0) return null;
            return (
              <optgroup key={type} label={TYPE_LABEL_PLURAL[type]}>
                {group.map((a) => (
                  <option key={a.id} value={a.id} disabled={alreadyRequested.has(a.id)}>
                    {a.name}
                    {alreadyRequested.has(a.id) ? " (requested)" : ""}
                  </option>
                ))}
              </optgroup>
            );
          })}
          <option value={OTHER}>Something that isn’t in the library</option>
        </select>
      </Field>

      {target === OTHER && (
        <Field label="What are you looking for?" htmlFor="req-subject" error={submitted ? errors.subject : null}>
          <input
            id="req-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. NBRx split by payer type"
            aria-invalid={submitted && !!errors.subject}
            aria-describedby={submitted && errors.subject ? "req-subject-error" : undefined}
            className={inputClass}
          />
        </Field>
      )}

      <Field label="Why do you need it?" htmlFor="req-reason" error={submitted ? errors.reason : null}>
        <textarea
          id="req-reason"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. I’m building the Q4 brand review for the Brazil affiliate and need this KPI on the overview page."
          aria-invalid={submitted && !!errors.reason}
          aria-describedby={["req-reason-count", submitted && errors.reason ? "req-reason-error" : ""].filter(Boolean).join(" ")}
          className={`${inputClass} h-auto resize-y py-2 leading-5`}
        />
        <p id="req-reason-count" className="mt-1 text-right text-[11px] text-slate-400">
          {reason.trim().length}/{MIN_REASON} minimum
        </p>
      </Field>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send request"}
        </Button>
      </div>
    </form>
  );
}

const inputClass =
  "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 aria-[invalid=true]:border-red-400";

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error: string | null;
  children: ReactNode;
}) {
  return (
    <div className="mt-4">
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
