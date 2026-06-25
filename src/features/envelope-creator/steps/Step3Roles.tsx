"use client";

import { useState } from "react";
import { useEnvelopeStore } from "@/store/envelopeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ROLE_COLORS, ROLE_COLOR_CLASSES, type RoleColor } from "@/types/role";
import type { Role } from "@/types/role";
import { ArrowRight, ArrowLeft, Plus, Trash2, Users, GripVertical } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const COLORS: RoleColor[] = ["blue", "orange", "green", "purple", "red"];
const MAX_ROLES = 5;

type RoleForm = { name: string; email: string };

function RoleCard({
  role,
  index,
  onRemove,
  onUpdate,
}: {
  role: Role;
  index: number;
  onRemove: () => void;
  onUpdate: (updates: Partial<Role>) => void;
}) {
  const classes = ROLE_COLOR_CLASSES[role.color];

  return (
    <div className={cn(
      "flex items-start gap-3 p-4 rounded-xl border transition-all",
      classes.light,
      `border-[${ROLE_COLORS[role.color]}]/20`
    )}>
      <GripVertical className="w-4 h-4 text-[var(--text-subtle)] mt-2 cursor-grab flex-shrink-0" />

      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
        style={{ backgroundColor: ROLE_COLORS[role.color] }}
      >
        {role.name ? role.name.charAt(0).toUpperCase() : (index + 1)}
      </div>

      <div className="flex-1 grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor={`role-name-${role.id}`}>Full Name <span className="text-red-400">*</span></Label>
          <Input
            id={`role-name-${role.id}`}
            value={role.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Signer name"
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`role-email-${role.id}`}>Email <span className="text-red-400">*</span></Label>
          <Input
            id={`role-email-${role.id}`}
            type="email"
            value={role.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            placeholder="signer@example.com"
            className="h-8 text-xs"
          />
        </div>
      </div>

      {/* Color picker */}
      <div className="flex flex-col gap-2 items-end">
        <Label className="text-[10px]">Color</Label>
        <div className="flex gap-1">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onUpdate({ color })}
              className={cn(
                "w-5 h-5 rounded-full transition-all",
                role.color === color ? "scale-110" : "opacity-60 hover:opacity-100"
              )}
              style={{
                backgroundColor: ROLE_COLORS[color],
                boxShadow: role.color === color ? `0 0 0 2px var(--bg), 0 0 0 4px ${ROLE_COLORS[color]}` : undefined
              }}
              title={color}
              aria-label={`Set role color to ${color}`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={onRemove}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-subtle)] hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0 mt-1"
        aria-label="Remove role"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function Step3Roles() {
  const { wizardData, updateWizardData, nextStep, prevStep } = useEnvelopeStore();
  const [roles, setRoles] = useState<Role[]>(
    wizardData.roles.length > 0
      ? wizardData.roles
      : [{
          id: "role_1",
          name: "",
          email: "",
          color: "blue",
          order: 0,
          status: "pending",
        }]
  );
  const [signingOrderEnabled, setSigningOrderEnabled] = useState(wizardData.signingOrderEnabled);

  const addRole = () => {
    if (roles.length >= MAX_ROLES) {
      toast.error(`Maximum ${MAX_ROLES} signers allowed`);
      return;
    }
    const usedColors = roles.map((r) => r.color) as RoleColor[];
    const availableColor = COLORS.find((c) => !usedColors.includes(c)) ?? "blue";
    setRoles((prev) => [
      ...prev,
      {
        id: `role_${Date.now()}`,
        name: "",
        email: "",
        color: availableColor,
        order: prev.length,
        status: "pending",
      },
    ]);
  };

  const updateRole = (id: string, updates: Partial<Role>) => {
    setRoles((prev) => prev.map((r) => r.id === id ? { ...r, ...updates } : r));
  };

  const removeRole = (id: string) => {
    if (roles.length <= 1) {
      toast.error("At least one signer is required");
      return;
    }
    setRoles((prev) => prev.filter((r) => r.id !== id));
  };

  const handleContinue = () => {
    const invalid = roles.find((r) => !r.name.trim() || !r.email.trim());
    if (invalid) {
      toast.error("Please fill in name and email for all signers");
      return;
    }
    updateWizardData({ roles, signingOrderEnabled });
    nextStep();
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <div className="w-12 h-12 rounded-2xl bg-green-500/15 border border-green-500/20 flex items-center justify-center mb-4">
          <Users className="w-6 h-6 text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text)]">Add Signers</h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">Add up to {MAX_ROLES} signers with unique colors</p>
      </div>

      {/* Signing order toggle */}
      <div className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)]/50 mb-5">
        <div>
          <p className="text-sm font-medium text-[var(--text)]">Enable Signing Order</p>
          <p className="text-xs text-[var(--text-muted)]">Signers must sign in the order listed below</p>
        </div>
        <button
          onClick={() => setSigningOrderEnabled(!signingOrderEnabled)}
          className={cn(
            "w-10 h-6 rounded-full transition-all duration-200 relative flex-shrink-0",
            signingOrderEnabled ? "bg-brand-500" : "bg-[var(--bg-muted)] border border-[var(--border)]"
          )}
          id="signing-order-toggle"
          role="switch"
          aria-checked={signingOrderEnabled}
        >
          <span className={cn(
            "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200",
            signingOrderEnabled ? "left-[18px]" : "left-0.5"
          )} />
        </button>
      </div>

      {/* Role Cards */}
      <div className="space-y-3 mb-4">
        {roles.map((role, i) => (
          <div key={role.id} className="animate-fade-in">
            {signingOrderEnabled && (
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-[var(--bg-muted)] border border-[var(--border)] flex items-center justify-center text-[10px] font-bold text-[var(--text-muted)]">
                  {i + 1}
                </div>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>
            )}
            <RoleCard
              role={role}
              index={i}
              onRemove={() => removeRole(role.id)}
              onUpdate={(updates) => updateRole(role.id, updates)}
            />
          </div>
        ))}
      </div>

      {roles.length < MAX_ROLES && (
        <button
          onClick={addRole}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[var(--border)] text-sm text-[var(--text-muted)] hover:text-brand-400 hover:border-brand-500/40 hover:bg-brand-500/5 transition-all"
          id="add-signer-btn"
        >
          <Plus className="w-4 h-4" />
          Add Signer ({roles.length}/{MAX_ROLES})
        </button>
      )}

      <div className="flex justify-between pt-6">
        <Button variant="secondary" size="sm" onClick={prevStep} id="step3-back-btn">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button size="sm" onClick={handleContinue} id="step3-next-btn">
          Continue to Field Detection
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
