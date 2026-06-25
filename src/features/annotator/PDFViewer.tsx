"use client";

import { useEffect, useRef, useState } from "react";
import { useUIStore } from "@/store/uiStore";

interface PDFViewerProps {
  url: string;
  page: number;
  width?: number;
}

export function PDFViewer({ url, page, width = 794 }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setTotalPages } = useUIStore();
  const pdfRef = useRef<unknown>(null);
  const renderTaskRef = useRef<{ cancel: () => void; promise: Promise<unknown> } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPDF() {
      try {
        setIsLoading(true);
        setError(null);

        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        let pdfData: string | Uint8Array = url;
        if (url.startsWith("blob:") || url.startsWith("data:")) {
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          pdfData = new Uint8Array(arrayBuffer);
        }

        const loadingTask = typeof pdfData === "string"
          ? pdfjsLib.getDocument({ url: pdfData, withCredentials: false })
          : pdfjsLib.getDocument({ data: pdfData });
        const pdf = await loadingTask.promise;

        if (cancelled) return;
        pdfRef.current = pdf;
        setTotalPages(pdf.numPages);

        const pdfPage = await pdf.getPage(page);
        if (cancelled) return;

        const viewport = pdfPage.getViewport({ scale: width / pdfPage.getViewport({ scale: 1 }).width });

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Cancel any existing render task
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        renderTaskRef.current = pdfPage.render({
          canvasContext: ctx,
          viewport,
          canvas,
        });

        await renderTaskRef.current.promise;
        if (!cancelled) setIsLoading(false);
      } catch (err: unknown) {
        const errorObject = err as { name?: string };
        if (cancelled || errorObject?.name === "RenderingCancelledException") return;
        console.error("PDF load error:", err);
        setError("Failed to load PDF. Please check the file.");
        setIsLoading(false);
      }
    }

    loadPDF();

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
    };
  }, [url, page, width, setTotalPages]);

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl bg-[var(--bg)] border border-[var(--border)] text-center p-8"
        style={{ width, height: width * 1.414 }}
      >
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-3">
          <span className="text-2xl">📄</span>
        </div>
        <p className="text-sm font-medium text-[var(--text)]">Unable to load PDF</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">{error}</p>
        <p className="text-xs text-[var(--text-subtle)] mt-3">
          A real document will be displayed here when connected to the backend.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] z-10"
          style={{ width, height: width * 1.414 }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
            <p className="text-xs text-[var(--text-muted)]">Loading document...</p>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="rounded-xl shadow-elevated block"
        style={{ display: isLoading ? "none" : "block" }}
        id={`pdf-canvas-page-${page}`}
      />
    </div>
  );
}
