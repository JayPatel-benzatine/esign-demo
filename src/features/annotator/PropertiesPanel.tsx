"use client";

import { useAnnotationStore } from "@/store/annotationStore";
import { useUIStore } from "@/store/uiStore";
import type { Role } from "@/types/role";
import { ANNOTATION_TYPE_LABELS } from "@/types/annotation";
import { ROLE_COLORS, type RoleColor } from "@/types/role";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ANNOTATION_ICONS } from "./AnnotationIcons";
import { Settings2, Trash2, Copy } from "lucide-react";

interface PropertiesPanelProps {
  roles: Role[];
}

export function PropertiesPanel({ roles }: PropertiesPanelProps) {
  const { annotations, selectedIds, updateAnnotation, deleteAnnotation, duplicateAnnotation } = useAnnotationStore();

  const selectedAnnotation = selectedIds.length === 1
    ? annotations.find((a) => a.id === selectedIds[0])
    : null;

  if (selectedIds.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-3 py-3 border-b border-[var(--border)]">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Properties</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-10 h-10 rounded-2xl bg-[var(--bg-muted)] flex items-center justify-center mb-3">
            <Settings2 className="w-5 h-5 text-[var(--text-subtle)]" />
          </div>
          <p className="text-xs font-medium text-[var(--text-muted)]">No field selected</p>
          <p className="text-[10px] text-[var(--text-subtle)] mt-1">Click a field or add one from the toolbar</p>
        </div>
      </div>
    );
  }

  if (selectedIds.length > 1) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-3 py-3 border-b border-[var(--border)]">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Properties</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-xs font-medium text-[var(--text-muted)]">{selectedIds.length} fields selected</p>
          <p className="text-[10px] text-[var(--text-subtle)] mt-1">Multi-selection editing coming soon</p>
        </div>
      </div>
    );
  }

  if (!selectedAnnotation) return null;

  const Icon = ANNOTATION_ICONS[selectedAnnotation.type];
  const role = roles.find((r) => r.id === selectedAnnotation.roleId);
  const roleColor = role ? ROLE_COLORS[role.color as RoleColor] : "#6366f1";

  const update = (key: string, value: unknown) => {
    updateAnnotation(selectedAnnotation.id, { [key]: value });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ backgroundColor: `${roleColor}20` }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: roleColor }} />
          </div>
          <p className="text-xs font-semibold text-[var(--text)]">
            {ANNOTATION_TYPE_LABELS[selectedAnnotation.type]}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* General Section */}
        <Section title="General">
          <FieldRow label="Label">
            <Input
              value={selectedAnnotation.label}
              onChange={(e) => update("label", e.target.value)}
              className="h-7 text-xs"
              id="prop-label"
            />
          </FieldRow>
          <FieldRow label="Placeholder">
            <Input
              value={selectedAnnotation.placeholder ?? ""}
              onChange={(e) => update("placeholder", e.target.value)}
              placeholder="Hint text..."
              className="h-7 text-xs"
              id="prop-placeholder"
            />
          </FieldRow>
          <FieldRow label="Default Value">
            <Input
              value={selectedAnnotation.defaultValue ?? ""}
              onChange={(e) => update("defaultValue", e.target.value)}
              placeholder="Default..."
              className="h-7 text-xs"
              id="prop-default-value"
            />
          </FieldRow>
          <div className="flex items-center justify-between py-1">
            <Label className="text-xs">Required</Label>
            <Toggle
              checked={selectedAnnotation.required}
              onChange={(v) => update("required", v)}
              id="prop-required"
            />
          </div>
          <div className="flex items-center justify-between py-1">
            <Label className="text-xs">Read Only</Label>
            <Toggle
              checked={selectedAnnotation.readOnly}
              onChange={(v) => update("readOnly", v)}
              id="prop-readonly"
            />
          </div>
        </Section>

        {/* Role Assignment */}
        <Section title="Role Assignment">
          <select
            value={selectedAnnotation.roleId}
            onChange={(e) => update("roleId", e.target.value)}
            className="w-full h-7 rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 text-xs text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-brand-500/50"
            id="prop-role"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>{r.name || `Role ${roles.indexOf(r) + 1}`}</option>
            ))}
          </select>
        </Section>

        {/* Validation */}
        {["text", "email", "number", "phone", "password", "textarea"].includes(selectedAnnotation.type) && (
          <Section title="Validation">
            <FieldRow label="Min Length">
              <Input
                type="number"
                value={selectedAnnotation.validation?.minLength ?? ""}
                onChange={(e) => update("validation", { ...selectedAnnotation.validation, minLength: Number(e.target.value) })}
                className="h-7 text-xs"
                min={0}
                id="prop-min-length"
              />
            </FieldRow>
            <FieldRow label="Max Length">
              <Input
                type="number"
                value={selectedAnnotation.validation?.maxLength ?? ""}
                onChange={(e) => update("validation", { ...selectedAnnotation.validation, maxLength: Number(e.target.value) })}
                className="h-7 text-xs"
                min={0}
                id="prop-max-length"
              />
            </FieldRow>
            <FieldRow label="Pattern">
              <Input
                value={selectedAnnotation.validation?.pattern ?? ""}
                onChange={(e) => update("validation", { ...selectedAnnotation.validation, pattern: e.target.value })}
                placeholder="RegEx pattern..."
                className="h-7 text-xs font-mono"
                id="prop-pattern"
              />
            </FieldRow>
          </Section>
        )}

        {/* Position & Size */}
        <Section title="Position & Size">
          <div className="grid grid-cols-2 gap-2">
            <FieldRow label="X">
              <Input
                type="number"
                value={Math.round(selectedAnnotation.position.x)}
                onChange={(e) => update("position", { ...selectedAnnotation.position, x: Number(e.target.value) })}
                className="h-7 text-xs"
                id="prop-x"
              />
            </FieldRow>
            <FieldRow label="Y">
              <Input
                type="number"
                value={Math.round(selectedAnnotation.position.y)}
                onChange={(e) => update("position", { ...selectedAnnotation.position, y: Number(e.target.value) })}
                className="h-7 text-xs"
                id="prop-y"
              />
            </FieldRow>
            <FieldRow label="W">
              <Input
                type="number"
                value={Math.round(selectedAnnotation.size.width)}
                onChange={(e) => update("size", { ...selectedAnnotation.size, width: Number(e.target.value) })}
                className="h-7 text-xs"
                id="prop-width"
              />
            </FieldRow>
            <FieldRow label="H">
              <Input
                type="number"
                value={Math.round(selectedAnnotation.size.height)}
                onChange={(e) => update("size", { ...selectedAnnotation.size, height: Number(e.target.value) })}
                className="h-7 text-xs"
                id="prop-height"
              />
            </FieldRow>
          </div>
        </Section>
      </div>

      {/* Actions */}
      <div className="p-3 border-t border-[var(--border)] flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={() => duplicateAnnotation(selectedAnnotation.id)}
          id="prop-duplicate-btn"
        >
          <Copy className="w-3.5 h-3.5" />
          Duplicate
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={() => deleteAnnotation(selectedAnnotation.id)}
          id="prop-delete-btn"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-subtle)] mb-2">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <Label className="w-16 flex-shrink-0 text-[10px]">{label}</Label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, id }: { checked: boolean; onChange: (v: boolean) => void; id?: string }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "w-8 h-4.5 rounded-full transition-all duration-200 relative flex-shrink-0",
        checked ? "bg-brand-500" : "bg-[var(--bg-muted)] border border-[var(--border)]"
      )}
    >
      <span className={cn(
        "absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all duration-200",
        checked ? "left-[18px]" : "left-0.5"
      )} />
    </button>
  );
}
