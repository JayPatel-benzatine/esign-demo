import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { AnnotationType } from "@/types/annotation";

type SidebarSection = "dashboard" | "envelopes" | "templates" | "signatures" | "prefill" | "audit-logs" | "settings";

interface UIState {
  // Layout
  sidebarCollapsed: boolean;
  rightPanelOpen: boolean;
  leftPanelOpen: boolean;
  activeSection: SidebarSection;

  // Annotator
  activeTool: AnnotationType | "select" | "pan" | null;
  activeRoleId: string | null;
  zoom: number;
  snapToGrid: boolean;
  gridSize: number;
  snapToFields: boolean;
  showGuides: boolean;
  showAnnotationList: boolean;
  showPrefillPanel: boolean;
  currentPage: number;
  totalPages: number;

  // Command palette
  commandPaletteOpen: boolean;

  // Modals
  signatureModalOpen: boolean;
  fieldDetectionModalOpen: boolean;

  // Preferences
  theme: "light" | "dark" | "system";

  // Actions
  setSidebarCollapsed: (value: boolean) => void;
  toggleSidebar: () => void;
  setRightPanelOpen: (value: boolean) => void;
  setLeftPanelOpen: (value: boolean) => void;
  setActiveSection: (section: SidebarSection) => void;
  setActiveTool: (tool: AnnotationType | "select" | "pan" | null) => void;
  setActiveRoleId: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setSnapToGrid: (value: boolean) => void;
  setGridSize: (size: number) => void;
  setSnapToFields: (value: boolean) => void;
  setShowGuides: (value: boolean) => void;
  setShowAnnotationList: (value: boolean) => void;
  setShowPrefillPanel: (value: boolean) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (total: number) => void;
  setCommandPaletteOpen: (value: boolean) => void;
  setSignatureModalOpen: (value: boolean) => void;
  setFieldDetectionModalOpen: (value: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 3;

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        sidebarCollapsed: false,
        rightPanelOpen: true,
        leftPanelOpen: true,
        activeSection: "dashboard",
        activeTool: "select",
        activeRoleId: null,
        zoom: 1,
        snapToGrid: true,
        gridSize: 8,
        snapToFields: true,
        showGuides: true,
        showAnnotationList: true,
        showPrefillPanel: false,
        currentPage: 1,
        totalPages: 1,
        commandPaletteOpen: false,
        signatureModalOpen: false,
        fieldDetectionModalOpen: false,
        theme: "dark",

        setSidebarCollapsed: (value) => set({ sidebarCollapsed: value }),
        toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
        setRightPanelOpen: (value) => set({ rightPanelOpen: value }),
        setLeftPanelOpen: (value) => set({ leftPanelOpen: value }),
        setActiveSection: (section) => set({ activeSection: section }),
        setActiveTool: (tool) => set({ activeTool: tool }),
        setActiveRoleId: (id) => set({ activeRoleId: id }),
        setZoom: (zoom) => set({ zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom)) }),
        zoomIn: () => set((state) => ({ zoom: Math.min(MAX_ZOOM, Math.round((state.zoom + ZOOM_STEP) * 10) / 10) })),
        zoomOut: () => set((state) => ({ zoom: Math.max(MIN_ZOOM, Math.round((state.zoom - ZOOM_STEP) * 10) / 10) })),
        resetZoom: () => set({ zoom: 1 }),
        setSnapToGrid: (value) => set({ snapToGrid: value }),
        setGridSize: (size) => set({ gridSize: size }),
        setSnapToFields: (value) => set({ snapToFields: value }),
        setShowGuides: (value) => set({ showGuides: value }),
        setShowAnnotationList: (value) => set({ showAnnotationList: value }),
        setShowPrefillPanel: (value) => set({ showPrefillPanel: value }),
        setCurrentPage: (page) => set({ currentPage: page }),
        setTotalPages: (total) => set({ totalPages: total }),
        setCommandPaletteOpen: (value) => set({ commandPaletteOpen: value }),
        setSignatureModalOpen: (value) => set({ signatureModalOpen: value }),
        setFieldDetectionModalOpen: (value) => set({ fieldDetectionModalOpen: value }),
        setTheme: (theme) => set({ theme }),
      }),
      {
        name: "ui-store",
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          snapToGrid: state.snapToGrid,
          gridSize: state.gridSize,
          snapToFields: state.snapToFields,
          showGuides: state.showGuides,
          theme: state.theme,
        }),
      }
    ),
    { name: "ui-store" }
  )
);
