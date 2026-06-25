"use client";

import { useAnnotationStore } from "@/store/annotationStore";
import { useUIStore } from "@/store/uiStore";
import type { Role } from "@/types/role";
import { ANNOTATION_TYPE_LABELS } from "@/types/annotation";
import { ROLE_COLORS, type RoleColor } from "@/types/role";
import { getAnnotationIcon } from "./AnnotationIcons";
import { cn } from "@/lib/utils";
import { Search, Filter } from "lucide-react";
import { useState } from "react";

interface AnnotationListSidebarProps {
  roles: Role[];
}

export function AnnotationListSidebar({ roles }: AnnotationListSidebarProps) {
  const { annotations, selectedIds, selectAnnotation } = useAnnotationStore();
  const { currentPage, setCurrentPage } = useUIStore();
  const [search, setSearch] = useState("");

  const filtered = annotations.filter((a) => {
    if (!search) return true;
    return (
      a.label.toLowerCase().includes(search.toLowerCase()) ||
      ANNOTATION_TYPE_LABELS[a.type].toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col h-full border-l border-[var(--border)] bg-[var(--bg-subtle)]">
      <div className="px-3 py-3 border-b border-[var(--border)]">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Fields ({annotations.length})</p>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fields..."
            className="w-full h-7 pl-7 pr-2 rounded-md border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:ring-1 focus:ring-brand-500/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {filtered.length === 0 ? (
          <p className="text-xs text-[var(--text-subtle)] text-center py-6">No fields yet</p>
        ) : (
          filtered.map((annotation) => {
            const role = roles.find((r) => r.id === annotation.roleId);
            const roleColor = role ? ROLE_COLORS[role.color as RoleColor] : "#6366f1";
            const Icon = getAnnotationIcon(annotation.type);
            const selected = selectedIds.includes(annotation.id);

            return (
              <button
                key={annotation.id}
                onClick={() => {
                  setCurrentPage(annotation.pageNumber);
                  selectAnnotation(annotation.id);
                }}
                className={cn(
                  "flex items-center gap-2.5 w-full p-2 rounded-lg text-left transition-all",
                  selected ? "bg-brand-500/10 border border-brand-500/20" : "hover:bg-[var(--bg-muted)] border border-transparent"
                )}
              >
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${roleColor}20` }}
                >
                  <Icon className="w-3 h-3" style={{ color: roleColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--text)] truncate">{annotation.label}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Page {annotation.pageNumber}
                    {annotation.required && <span className="text-red-400 ml-1">*</span>}
                  </p>
                </div>
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: roleColor }}
                  title={role?.name}
                />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
