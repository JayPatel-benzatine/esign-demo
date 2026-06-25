"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useAnnotationStore } from "@/store/annotationStore";
import { useUIStore } from "@/store/uiStore";
import type { Role } from "@/types/role";
import type { AnnotationType } from "@/types/annotation";
import { PDFViewer } from "./PDFViewer";
import { AnnotationLayer } from "./AnnotationLayer";
import { FieldToolbar } from "./FieldToolbar";
import { PropertiesPanel } from "./PropertiesPanel";
import { AnnotationListSidebar } from "./AnnotationList";
import { ZoomControls } from "./ZoomControls";
import { cn } from "@/lib/utils";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Send, Save, ChevronLeft, ChevronRight } from "lucide-react";
import { useEnvelopeStore } from "@/store/envelopeStore";
import { useRouter } from "next/navigation";
import { envelopeService } from "@/services/envelopeService";

interface AnnotatorWorkspaceProps {
  roles: Role[];
  documentUrl: string;
  readOnly?: boolean;
}

export function AnnotatorWorkspace({ roles, documentUrl, readOnly = false }: AnnotatorWorkspaceProps) {
  const {
    undo, redo, canUndo, canRedo,
    copySelected, paste,
    deleteAnnotations, selectedIds,
    duplicateAnnotation,
  } = useAnnotationStore();

  const {
    activeTool, setActiveTool,
    zoom, zoomIn, zoomOut, resetZoom,
    currentPage, setCurrentPage, totalPages,
    showAnnotationList, setShowAnnotationList,
    rightPanelOpen, setRightPanelOpen,
  } = useUIStore();

  const router = useRouter();
  const { wizardData, resetWizard } = useEnvelopeStore();

  const handleSend = async () => {
    try {
      const isCreateFlow = typeof window !== "undefined" && window.location.pathname.includes("/create");
      
      if (isCreateFlow) {
        await envelopeService.create({
          ...wizardData,
          reminderFrequency: wizardData.reminderFrequency as "none" | "daily" | "every2days" | "weekly",
          status: "pending",
        });
        resetWizard();
        toast.success("Envelope sent for signing successfully!");
        router.push("/envelopes");
      } else {
        const pathParts = window.location.pathname.split("/");
        const id = pathParts[pathParts.length - 1];
        if (id) {
          await envelopeService.update(id, { status: "pending" });
          toast.success("Envelope sent for signing successfully!");
          router.push("/envelopes");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send envelope");
    }
  };

  const handleSave = async () => {
    try {
      const isCreateFlow = typeof window !== "undefined" && window.location.pathname.includes("/create");
      
      if (isCreateFlow) {
        await envelopeService.create({
          ...wizardData,
          reminderFrequency: wizardData.reminderFrequency as "none" | "daily" | "every2days" | "weekly",
          status: "draft",
        });
        resetWizard();
        toast.success("Draft saved successfully!");
        router.push("/envelopes");
      } else {
        const pathParts = window.location.pathname.split("/");
        const id = pathParts[pathParts.length - 1];
        if (id) {
          await envelopeService.update(id, { status: "draft" });
          toast.success("Changes saved successfully!");
          router.push("/envelopes");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save draft");
    }
  };

  // Keyboard shortcuts
  useHotkeys("ctrl+z,meta+z", () => { undo(); toast.info("Undone"); }, { preventDefault: true });
  useHotkeys("ctrl+shift+z,meta+shift+z", () => { redo(); toast.info("Redone"); }, { preventDefault: true });
  useHotkeys("ctrl+c,meta+c", () => copySelected(), { preventDefault: true });
  useHotkeys("ctrl+v,meta+v", () => paste(), { preventDefault: true });
  useHotkeys("ctrl+d,meta+d", () => {
    if (selectedIds.length === 1) duplicateAnnotation(selectedIds[0]);
  }, { preventDefault: true });
  useHotkeys("delete,backspace", () => {
    if (selectedIds.length > 0) {
      deleteAnnotations(selectedIds);
      toast.success(`Deleted ${selectedIds.length} field${selectedIds.length > 1 ? "s" : ""}`);
    }
  });
  useHotkeys("escape", () => setActiveTool("select"));
  useHotkeys("ctrl+plus,meta+plus", () => zoomIn(), { preventDefault: true });
  useHotkeys("ctrl+minus,meta+minus", () => zoomOut(), { preventDefault: true });
  useHotkeys("ctrl+0,meta+0", () => resetZoom(), { preventDefault: true });

  return (
    <div className="flex flex-col h-full bg-[var(--bg)]">
      {/* Toolbar Bar */}
      {!readOnly && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-subtle)] shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { canUndo() && undo(); }}
              disabled={!canUndo()}
              className="h-7 px-2 text-xs flex items-center gap-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-muted)] disabled:opacity-30 transition-all"
              title="Undo (Ctrl+Z)"
            >
              ↩ Undo
            </button>
            <button
              onClick={() => { canRedo() && redo(); }}
              disabled={!canRedo()}
              className="h-7 px-2 text-xs flex items-center gap-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-muted)] disabled:opacity-30 transition-all"
              title="Redo (Ctrl+Shift+Z)"
            >
              ↪ Redo
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleSave} id="annotator-save-btn">
              <Save className="w-3.5 h-3.5" />
              Save Draft
            </Button>
            <Button size="sm" onClick={handleSend} id="annotator-send-btn">
              <Send className="w-3.5 h-3.5" />
              Send for Signing
            </Button>
          </div>
        </div>
      )}

      {/* Main 3-panel layout */}
      <div className="flex-1 flex overflow-hidden h-full">
        {/* Left Panel — Tools */}
        {!readOnly && (
          <div className="w-60 shrink-0 h-full flex flex-col border-r border-[var(--border)] bg-[var(--bg-subtle)] overflow-y-auto">
            <FieldToolbar roles={roles} />
          </div>
        )}

        {/* Center Panel — PDF Canvas */}
        <div className="flex-1 min-w-0 h-full flex flex-col bg-[oklch(0.12_0.01_264)] overflow-hidden relative">
          {/* Page navigation */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 glass rounded-full px-3 py-1.5 shadow-elevated">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="w-6 h-6 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-muted)] disabled:opacity-30 transition-all"
              id="pdf-prev-page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-medium text-[var(--text)] min-w-[60px] text-center">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="w-6 h-6 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-muted)] disabled:opacity-30 transition-all"
              id="pdf-next-page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 z-20">
            <ZoomControls />
          </div>

          {/* PDF + Annotation Layer */}
          <div className="flex-1 overflow-auto flex items-start justify-center p-8">
            <div className="relative" style={{ zoom }}>
              <PDFViewer
                url={documentUrl}
                page={currentPage}
              />
              <AnnotationLayer
                roles={roles}
                page={currentPage}
                readOnly={readOnly}
              />
            </div>
          </div>
        </div>

        {/* Right Panel — Properties */}
        {!readOnly && (
          <div className="w-72 shrink-0 h-full flex flex-col border-l border-[var(--border)] bg-[var(--bg-subtle)] overflow-y-auto">
            <PropertiesPanel roles={roles} />
          </div>
        )}
      </div>
    </div>
  );
}
