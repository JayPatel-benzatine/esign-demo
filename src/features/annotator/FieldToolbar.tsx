"use client";

import { useUIStore } from "@/store/uiStore";
import type { Role } from "@/types/role";
import type { AnnotationType } from "@/types/annotation";
import { ANNOTATION_TYPE_LABELS } from "@/types/annotation";
import { ROLE_COLORS, ROLE_COLOR_CLASSES, type RoleColor } from "@/types/role";
import { cn } from "@/lib/utils";
import { ANNOTATION_ICONS } from "./AnnotationIcons";
import { MousePointer2, Hand, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

const TOOL_GROUPS: { label: string; types: AnnotationType[] }[] = [
  {
    label: "Text Fields",
    types: ["text", "email", "number", "phone", "password", "textarea"],
  },
  {
    label: "Date & Time",
    types: ["date", "datetime", "currency"],
  },
  {
    label: "Choices",
    types: ["checkbox", "radio", "select"],
  },
  {
    label: "Attachments",
    types: ["file"],
  },
  {
    label: "Signature",
    types: ["signature", "initials"],
  },
];

function ToolButton({
  type,
  active,
  onClick,
}: {
  type: AnnotationType;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = ANNOTATION_ICONS[type];
  const label = ANNOTATION_TYPE_LABELS[type];

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150",
        active
          ? "bg-brand-500/15 text-brand-400 border border-brand-500/30"
          : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-muted)] border border-transparent"
      )}
      title={label}
      id={`tool-${type}`}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
}

interface FieldToolbarProps {
  roles: Role[];
}

export function FieldToolbar({ roles }: FieldToolbarProps) {
  const { activeTool, setActiveTool, activeRoleId, setActiveRoleId } = useUIStore();
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleGroup = (label: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-3 border-b border-[var(--border)]">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Field Tools</p>
      </div>

      {/* Pointer tools */}
      <div className="p-2 border-b border-[var(--border)] space-y-0.5">
        <button
          onClick={() => setActiveTool("select")}
          className={cn(
            "flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-xs font-medium transition-all",
            activeTool === "select"
              ? "bg-brand-500/15 text-brand-400 border border-brand-500/30"
              : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-muted)] border border-transparent"
          )}
          id="tool-select"
        >
          <MousePointer2 className="w-3.5 h-3.5" />
          Select
        </button>
        <button
          onClick={() => setActiveTool("pan")}
          className={cn(
            "flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-xs font-medium transition-all",
            activeTool === "pan"
              ? "bg-brand-500/15 text-brand-400 border border-brand-500/30"
              : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-muted)] border border-transparent"
          )}
          id="tool-pan"
        >
          <Hand className="w-3.5 h-3.5" />
          Pan
        </button>
      </div>

      {/* Role Selector */}
      {roles.length > 0 && (
        <div className="p-2 border-b border-[var(--border)]">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 px-0.5">Active Role</p>
          <div className="space-y-0.5">
            {roles.map((role) => {
              const classes = ROLE_COLOR_CLASSES[role.color as RoleColor];
              const isActive = activeRoleId === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRoleId(role.id)}
                  className={cn(
                    "flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-xs font-medium transition-all",
                    isActive ? cn(classes.light, classes.text, "border", `border-[${ROLE_COLORS[role.color as RoleColor]}]/30`) : "text-[var(--text-muted)] hover:bg-[var(--bg-muted)]"
                  )}
                  id={`role-selector-${role.id}`}
                >
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: ROLE_COLORS[role.color as RoleColor] }}
                  />
                  <span className="truncate">{role.name || `Role ${roles.indexOf(role) + 1}`}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-current" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tool Groups */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {TOOL_GROUPS.map((group) => {
          const isCollapsed = collapsed.has(group.label);
          return (
            <div key={group.label}>
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex items-center justify-between w-full px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-subtle)] hover:text-[var(--text-muted)] transition-colors"
              >
                {group.label}
                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {!isCollapsed && (
                <div className="space-y-0.5">
                  {group.types.map((type) => (
                    <ToolButton
                      key={type}
                      type={type}
                      active={activeTool === type}
                      onClick={() => setActiveTool(type)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
