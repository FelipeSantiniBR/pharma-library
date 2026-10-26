"use client";

import { useEffect, useRef } from "react";
import { useToastStore } from "@/store/toast-store";
import { CheckIcon } from "./Icons";

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current as (HTMLDivElement & {
      showPopover?: () => void;
      hidePopover?: () => void;
    }) | null;
    if (!el || !el.showPopover) return;
    el.setAttribute("popover", "manual");
    try {
      el.hidePopover?.();
      if (toasts.length > 0) el.showPopover();
    } catch {
    }
  }, [toasts]);

  return (
    <div
      ref={ref}
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 top-auto z-[100] m-0 flex w-full flex-col items-center gap-2 overflow-visible border-0 bg-transparent p-0 px-4"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="flex animate-toast-in items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-white shadow-lg motion-reduce:animate-none"
        >
          <CheckIcon className="h-4 w-4" />
          {t.message}
        </div>
      ))}
    </div>
  );
}
