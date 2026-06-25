"use client";

import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from "lucide-react";

export function ZoomControls() {
  const { zoom, zoomIn, zoomOut, resetZoom } = useUIStore();

  return (
    <div className="flex items-center gap-1 glass rounded-full px-2 py-1.5 shadow-elevated">
      <button
        onClick={zoomOut}
        className="w-6 h-6 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-muted)] transition-all"
        title="Zoom out (Ctrl+-)"
        id="zoom-out-btn"
        aria-label="Zoom out"
      >
        <ZoomOut className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={resetZoom}
        className="px-2 text-[10px] font-mono font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors min-w-[40px] text-center"
        title="Reset zoom (Ctrl+0)"
        id="zoom-reset-btn"
        aria-label="Reset zoom"
      >
        {Math.round(zoom * 100)}%
      </button>

      <button
        onClick={zoomIn}
        className="w-6 h-6 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-muted)] transition-all"
        title="Zoom in (Ctrl++)"
        id="zoom-in-btn"
        aria-label="Zoom in"
      >
        <ZoomIn className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
