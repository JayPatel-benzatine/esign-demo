import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Annotation } from "@/types/annotation";

interface HistoryEntry {
  annotations: Annotation[];
  timestamp: number;
}

interface AnnotationState {
  // Annotations per envelope
  annotations: Annotation[];
  selectedIds: string[];
  clipboard: Annotation[];
  
  // History for undo/redo
  history: HistoryEntry[];
  historyIndex: number;

  // Interaction state
  isDragging: boolean;
  isResizing: boolean;
  isSelecting: boolean;
  selectionBox: { x: number; y: number; width: number; height: number } | null;

  // Actions
  setAnnotations: (annotations: Annotation[]) => void;
  addAnnotation: (annotation: Annotation) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  deleteAnnotation: (id: string) => void;
  deleteAnnotations: (ids: string[]) => void;
  duplicateAnnotation: (id: string) => void;

  // Selection
  selectAnnotation: (id: string, multi?: boolean) => void;
  selectAnnotations: (ids: string[]) => void;
  clearSelection: () => void;
  selectAll: () => void;

  // Clipboard
  copySelected: () => void;
  paste: (offsetX?: number, offsetY?: number) => void;

  // History
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Interaction
  setDragging: (value: boolean) => void;
  setResizing: (value: boolean) => void;
  setSelecting: (value: boolean) => void;
  setSelectionBox: (box: { x: number; y: number; width: number; height: number } | null) => void;

  // Alignment
  alignLeft: () => void;
  alignRight: () => void;
  alignTop: () => void;
  alignBottom: () => void;
  centerHorizontally: () => void;
  centerVertically: () => void;
}

const MAX_HISTORY = 50;

export const useAnnotationStore = create<AnnotationState>()(
  devtools(
    (set, get) => ({
      annotations: [],
      selectedIds: [],
      clipboard: [],
      history: [],
      historyIndex: -1,
      isDragging: false,
      isResizing: false,
      isSelecting: false,
      selectionBox: null,

      setAnnotations: (annotations) => {
        set({ annotations });
        get().pushHistory();
      },

      addAnnotation: (annotation) => {
        set((state) => ({ annotations: [...state.annotations, annotation] }));
        get().pushHistory();
      },

      updateAnnotation: (id, updates) => {
        set((state) => ({
          annotations: state.annotations.map((a) =>
            a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
          ),
        }));
      },

      deleteAnnotation: (id) => {
        set((state) => ({
          annotations: state.annotations.filter((a) => a.id !== id),
          selectedIds: state.selectedIds.filter((sid) => sid !== id),
        }));
        get().pushHistory();
      },

      deleteAnnotations: (ids) => {
        const idSet = new Set(ids);
        set((state) => ({
          annotations: state.annotations.filter((a) => !idSet.has(a.id)),
          selectedIds: state.selectedIds.filter((sid) => !idSet.has(sid)),
        }));
        get().pushHistory();
      },

      duplicateAnnotation: (id) => {
        const annotation = get().annotations.find((a) => a.id === id);
        if (!annotation) return;
        const duplicate: Annotation = {
          ...annotation,
          id: `anno_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          position: {
            x: annotation.position.x + 20,
            y: annotation.position.y + 20,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          annotations: [...state.annotations, duplicate],
          selectedIds: [duplicate.id],
        }));
        get().pushHistory();
      },

      selectAnnotation: (id, multi = false) => {
        if (multi) {
          set((state) => ({
            selectedIds: state.selectedIds.includes(id)
              ? state.selectedIds.filter((sid) => sid !== id)
              : [...state.selectedIds, id],
          }));
        } else {
          set({ selectedIds: [id] });
        }
      },

      selectAnnotations: (ids) => set({ selectedIds: ids }),
      clearSelection: () => set({ selectedIds: [] }),
      selectAll: () => set((state) => ({ selectedIds: state.annotations.map((a) => a.id) })),

      copySelected: () => {
        const { annotations, selectedIds } = get();
        const copied = annotations.filter((a) => selectedIds.includes(a.id));
        set({ clipboard: copied });
      },

      paste: (offsetX = 20, offsetY = 20) => {
        const { clipboard } = get();
        if (!clipboard.length) return;
        const now = new Date().toISOString();
        const pasted = clipboard.map((a) => ({
          ...a,
          id: `anno_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          position: { x: a.position.x + offsetX, y: a.position.y + offsetY },
          createdAt: now,
          updatedAt: now,
        }));
        set((state) => ({
          annotations: [...state.annotations, ...pasted],
          selectedIds: pasted.map((a) => a.id),
        }));
        get().pushHistory();
      },

      pushHistory: () => {
        const { annotations, history, historyIndex } = get();
        const newEntry: HistoryEntry = {
          annotations: JSON.parse(JSON.stringify(annotations)),
          timestamp: Date.now(),
        };
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newEntry);
        if (newHistory.length > MAX_HISTORY) newHistory.shift();
        set({ history: newHistory, historyIndex: newHistory.length - 1 });
      },

      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex <= 0) return;
        const prev = history[historyIndex - 1];
        set({
          annotations: JSON.parse(JSON.stringify(prev.annotations)),
          historyIndex: historyIndex - 1,
          selectedIds: [],
        });
      },

      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex >= history.length - 1) return;
        const next = history[historyIndex + 1];
        set({
          annotations: JSON.parse(JSON.stringify(next.annotations)),
          historyIndex: historyIndex + 1,
          selectedIds: [],
        });
      },

      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,

      setDragging: (value) => set({ isDragging: value }),
      setResizing: (value) => set({ isResizing: value }),
      setSelecting: (value) => set({ isSelecting: value }),
      setSelectionBox: (box) => set({ selectionBox: box }),

      alignLeft: () => {
        const { annotations, selectedIds } = get();
        const selected = annotations.filter((a) => selectedIds.includes(a.id));
        if (selected.length < 2) return;
        const minX = Math.min(...selected.map((a) => a.position.x));
        set((state) => ({
          annotations: state.annotations.map((a) =>
            selectedIds.includes(a.id) ? { ...a, position: { ...a.position, x: minX } } : a
          ),
        }));
        get().pushHistory();
      },

      alignRight: () => {
        const { annotations, selectedIds } = get();
        const selected = annotations.filter((a) => selectedIds.includes(a.id));
        if (selected.length < 2) return;
        const maxRight = Math.max(...selected.map((a) => a.position.x + a.size.width));
        set((state) => ({
          annotations: state.annotations.map((a) =>
            selectedIds.includes(a.id)
              ? { ...a, position: { ...a.position, x: maxRight - a.size.width } }
              : a
          ),
        }));
        get().pushHistory();
      },

      alignTop: () => {
        const { annotations, selectedIds } = get();
        const selected = annotations.filter((a) => selectedIds.includes(a.id));
        if (selected.length < 2) return;
        const minY = Math.min(...selected.map((a) => a.position.y));
        set((state) => ({
          annotations: state.annotations.map((a) =>
            selectedIds.includes(a.id) ? { ...a, position: { ...a.position, y: minY } } : a
          ),
        }));
        get().pushHistory();
      },

      alignBottom: () => {
        const { annotations, selectedIds } = get();
        const selected = annotations.filter((a) => selectedIds.includes(a.id));
        if (selected.length < 2) return;
        const maxBottom = Math.max(...selected.map((a) => a.position.y + a.size.height));
        set((state) => ({
          annotations: state.annotations.map((a) =>
            selectedIds.includes(a.id)
              ? { ...a, position: { ...a.position, y: maxBottom - a.size.height } }
              : a
          ),
        }));
        get().pushHistory();
      },

      centerHorizontally: () => {
        const { annotations, selectedIds } = get();
        const selected = annotations.filter((a) => selectedIds.includes(a.id));
        if (selected.length < 2) return;
        const minX = Math.min(...selected.map((a) => a.position.x));
        const maxRight = Math.max(...selected.map((a) => a.position.x + a.size.width));
        const centerX = (minX + maxRight) / 2;
        set((state) => ({
          annotations: state.annotations.map((a) =>
            selectedIds.includes(a.id)
              ? { ...a, position: { ...a.position, x: centerX - a.size.width / 2 } }
              : a
          ),
        }));
        get().pushHistory();
      },

      centerVertically: () => {
        const { annotations, selectedIds } = get();
        const selected = annotations.filter((a) => selectedIds.includes(a.id));
        if (selected.length < 2) return;
        const minY = Math.min(...selected.map((a) => a.position.y));
        const maxBottom = Math.max(...selected.map((a) => a.position.y + a.size.height));
        const centerY = (minY + maxBottom) / 2;
        set((state) => ({
          annotations: state.annotations.map((a) =>
            selectedIds.includes(a.id)
              ? { ...a, position: { ...a.position, y: centerY - a.size.height / 2 } }
              : a
          ),
        }));
        get().pushHistory();
      },
    }),
    { name: "annotation-store" }
  )
);
