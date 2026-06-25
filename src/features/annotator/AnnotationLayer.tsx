"use client";

import { useRef, useCallback, useState } from "react";
import { Rnd } from "react-rnd";
import { useAnnotationStore } from "@/store/annotationStore";
import { useUIStore } from "@/store/uiStore";
import type { Role } from "@/types/role";
import type { Annotation, AnnotationType } from "@/types/annotation";
import { ROLE_COLORS, type RoleColor } from "@/types/role";
import { ANNOTATION_DEFAULT_SIZES, ANNOTATION_TYPE_LABELS } from "@/types/annotation";
import { cn } from "@/lib/utils";
import { ANNOTATION_ICONS } from "./AnnotationIcons";
import { X, GripHorizontal } from "lucide-react";

interface AnnotationLayerProps {
  roles: Role[];
  page: number;
  readOnly?: boolean;
}

function AnnotationField({
  annotation,
  role,
  selected,
  readOnly,
  onSelect,
  onUpdate,
  onDelete,
}: {
  annotation: Annotation;
  role?: Role;
  selected: boolean;
  readOnly: boolean;
  onSelect: (multi?: boolean) => void;
  onUpdate: (updates: Partial<Annotation>) => void;
  onDelete: () => void;
}) {
  const roleColor = role ? ROLE_COLORS[role.color as RoleColor] : "#6366f1";
  const Icon = ANNOTATION_ICONS[annotation.type];

  return (
    <Rnd
      position={annotation.position}
      size={annotation.size}
      onDragStop={(_, d) => {
        onUpdate({ position: { x: d.x, y: d.y } });
      }}
      onResizeStop={(_, __, ref, ___, pos) => {
        onUpdate({
          position: { x: pos.x, y: pos.y },
          size: {
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height),
          },
        });
      }}
      minWidth={60}
      minHeight={24}
      bounds="parent"
      disableDragging={readOnly}
      enableResizing={!readOnly && selected}
      resizeHandleStyles={{
        topLeft: { cursor: "nw-resize" },
        top: { cursor: "n-resize" },
        topRight: { cursor: "ne-resize" },
        right: { cursor: "e-resize" },
        bottomRight: { cursor: "se-resize" },
        bottom: { cursor: "s-resize" },
        bottomLeft: { cursor: "sw-resize" },
        left: { cursor: "w-resize" },
      }}
      style={{ zIndex: selected ? 20 : 10 }}
    >
      <div
        className={cn(
          "relative w-full h-full rounded select-none group",
          "transition-all duration-100",
          selected && "ring-1",
          readOnly ? "cursor-default" : "cursor-move"
        )}
        style={{
          backgroundColor: `${roleColor}18`,
          border: `1.5px ${selected ? "solid" : "dashed"} ${roleColor}`,
          ...(selected ? { boxShadow: `0 0 0 2px ${roleColor}30` } : {}),
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(e.shiftKey);
        }}
      >
        {/* Field content */}
        <div className="flex items-center gap-1 px-1.5 h-full min-h-0 overflow-hidden">
          <Icon className="w-3 h-3 flex-shrink-0 opacity-70" style={{ color: roleColor }} />
          <span
            className="text-[10px] font-medium truncate leading-none"
            style={{ color: roleColor }}
          >
            {annotation.label || ANNOTATION_TYPE_LABELS[annotation.type]}
          </span>
          {annotation.required && (
            <span className="text-red-400 text-[10px] font-bold leading-none flex-shrink-0">*</span>
          )}
        </div>

        {/* Role badge */}
        <div
          className="absolute -top-3 left-0 px-1 py-0.5 rounded text-[8px] font-bold text-white whitespace-nowrap leading-none"
          style={{ backgroundColor: roleColor }}
        >
          {role?.name ?? "Unassigned"}
        </div>

        {/* Delete button */}
        {!readOnly && selected && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm z-30"
            aria-label="Delete field"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        )}
      </div>
    </Rnd>
  );
}

export function AnnotationLayer({ roles, page, readOnly = false }: AnnotationLayerProps) {
  const {
    annotations,
    selectedIds,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    selectAnnotation,
    clearSelection,
  } = useAnnotationStore();

  const { activeTool, activeRoleId } = useUIStore();

  const layerRef = useRef<HTMLDivElement>(null);

  const pageAnnotations = annotations.filter((a) => a.pageNumber === page);

  const [drawingStart, setDrawingStart] = useState<{ x: number; y: number } | null>(null);
  const [drawingBox, setDrawingBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== layerRef.current) return;
    if (!activeTool || activeTool === "select" || activeTool === "pan") {
      clearSelection();
      return;
    }

    e.preventDefault();

    const rect = layerRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDrawingStart({ x, y });
    setDrawingBox({ x, y, w: 0, h: 0 });
  }, [activeTool, clearSelection]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!drawingStart || !drawingBox) return;

    const rect = layerRef.current!.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const x = Math.min(drawingStart.x, currentX);
    const y = Math.min(drawingStart.y, currentY);
    const w = Math.abs(currentX - drawingStart.x);
    const h = Math.abs(currentY - drawingStart.y);

    setDrawingBox({ x, y, w, h });
  }, [drawingStart, drawingBox]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!drawingStart || !drawingBox) return;

    const { x, y, w, h } = drawingBox;

    let finalPosition = { x, y };
    let finalSize = { width: w, height: h };

    const type = activeTool as AnnotationType;
    const defaultSize = ANNOTATION_DEFAULT_SIZES[type];
    const role = roles.find((r) => r.id === activeRoleId) ?? roles[0];

    // If size is too small, treat as click-to-place
    if (w < 10 || h < 10) {
      finalPosition = {
        x: drawingStart.x - defaultSize.width / 2,
        y: drawingStart.y - defaultSize.height / 2,
      };
      finalSize = defaultSize;
    }

    const newAnnotation: Annotation = {
      id: `anno_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      type,
      roleId: role?.id ?? "",
      pageNumber: page,
      position: finalPosition,
      size: finalSize,
      required: true,
      readOnly: false,
      label: ANNOTATION_TYPE_LABELS[type],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addAnnotation(newAnnotation);
    clearSelection();
    selectAnnotation(newAnnotation.id);

    setDrawingStart(null);
    setDrawingBox(null);
  }, [activeTool, activeRoleId, roles, page, addAnnotation, clearSelection, selectAnnotation, drawingStart, drawingBox]);

  return (
    <div
      ref={layerRef}
      className={cn(
        "absolute inset-0 overflow-hidden",
        activeTool && activeTool !== "select" && activeTool !== "pan"
          ? "cursor-crosshair"
          : "cursor-default"
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      id="annotation-layer"
    >
      {drawingBox && (
        <div
          className="absolute border border-dashed border-brand-500 bg-brand-500/10 pointer-events-none rounded z-50 animate-pulse-subtle"
          style={{
            left: drawingBox.x,
            top: drawingBox.y,
            width: drawingBox.w,
            height: drawingBox.h,
          }}
        />
      )}

      {pageAnnotations.map((annotation) => {
        const role = roles.find((r) => r.id === annotation.roleId);
        const selected = selectedIds.includes(annotation.id);

        return (
          <AnnotationField
            key={annotation.id}
            annotation={annotation}
            role={role}
            selected={selected}
            readOnly={readOnly}
            onSelect={(multi) => selectAnnotation(annotation.id, multi)}
            onUpdate={(updates) => updateAnnotation(annotation.id, updates)}
            onDelete={() => deleteAnnotation(annotation.id)}
          />
        );
      })}
    </div>
  );
}
