import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "outline" | "warning" | "success";
  className?: string;
}) {
  const tones = {
    neutral: "bg-slate-100 text-slate-600",
    outline: "border border-slate-200 bg-white text-slate-600",
    warning: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200",
    success: "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium leading-4",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
