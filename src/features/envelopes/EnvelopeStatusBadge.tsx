"use client";

import { cn } from "@/lib/utils";
import { ENVELOPE_STATUS_COLORS, ENVELOPE_STATUS_LABELS, type EnvelopeStatus } from "@/types/envelope";

interface EnvelopeStatusBadgeProps {
  status: EnvelopeStatus;
  className?: string;
  showDot?: boolean;
}

const DOT_COLORS: Record<EnvelopeStatus, string> = {
  draft: "bg-slate-400",
  pending: "bg-amber-400 animate-pulse",
  partially_signed: "bg-blue-400",
  signed: "bg-emerald-400",
  expired: "bg-red-400",
  voided: "bg-zinc-400",
};

export function EnvelopeStatusBadge({ status, className, showDot = true }: EnvelopeStatusBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
      ENVELOPE_STATUS_COLORS[status],
      className
    )}>
      {showDot && <span className={cn("w-1.5 h-1.5 rounded-full", DOT_COLORS[status])} />}
      {ENVELOPE_STATUS_LABELS[status]}
    </span>
  );
}
