"use client";

import { useState } from "react";
import { useEnvelopeStore } from "@/store/envelopeStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowLeft, Wand2, Trash2, Link2, EyeOff, Info } from "lucide-react";

// Mock detected fields from a PDF
const MOCK_DETECTED_FIELDS = [
  { id: "f1", type: "text", name: "employee_name", label: "Employee Name", page: 1 },
  { id: "f2", type: "text", name: "employee_id", label: "Employee ID", page: 1 },
  { id: "f3", type: "email", name: "email", label: "Email Address", page: 1 },
  { id: "f4", type: "date", name: "start_date", label: "Start Date", page: 2 },
  { id: "f5", type: "signature", name: "signature", label: "Employee Signature", page: 3 },
  { id: "f6", type: "date", name: "sign_date", label: "Date Signed", page: 3 },
];

type FieldAction = "convert" | "ignore" | "remove";

export function Step4FieldDetection() {
  const { wizardData, nextStep, prevStep } = useEnvelopeStore();
  const [fieldActions, setFieldActions] = useState<Record<string, FieldAction>>(
    Object.fromEntries(MOCK_DETECTED_FIELDS.map((f) => [f.id, "convert"]))
  );
  const [showModal, setShowModal] = useState(true);

  const setAction = (fieldId: string, action: FieldAction) => {
    setFieldActions((prev) => ({ ...prev, [fieldId]: action }));
  };

  const convertCount = Object.values(fieldActions).filter((a) => a === "convert").length;
  const ignoreCount = Object.values(fieldActions).filter((a) => a === "ignore").length;
  const removeCount = Object.values(fieldActions).filter((a) => a === "remove").length;

  const ACTION_BUTTONS: { value: FieldAction; label: string; icon: React.ElementType; color: string }[] = [
    { value: "convert", label: "Convert", icon: Wand2, color: "text-brand-400 bg-brand-500/10 border-brand-500/20" },
    { value: "ignore", label: "Ignore", icon: EyeOff, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { value: "remove", label: "Remove", icon: Trash2, color: "text-red-400 bg-red-500/10 border-red-500/20" },
  ];

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center mb-4">
          <Wand2 className="w-6 h-6 text-amber-400" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text)]">Field Detection</h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          We found <strong className="text-[var(--text)]">{MOCK_DETECTED_FIELDS.length} form fields</strong> in your PDF. Choose what to do with each.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Convert", value: convertCount, color: "text-brand-400 bg-brand-500/10 border-brand-500/20" },
          { label: "Ignore", value: ignoreCount, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
          { label: "Remove", value: removeCount, color: "text-red-400 bg-red-500/10 border-red-500/20" },
        ].map((stat) => (
          <div key={stat.label} className={cn("rounded-xl border p-3 text-center", stat.color)}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs font-medium mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 mb-5">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-300">
          <strong>Convert</strong> replaces PDF form fields with annotation fields assignable to signers.{" "}
          <strong>Ignore</strong> keeps them as-is. <strong>Remove</strong> deletes them from the document.
        </p>
      </div>

      {/* Field List */}
      <div className="space-y-2 mb-6">
        {MOCK_DETECTED_FIELDS.map((field) => {
          const currentAction = fieldActions[field.id];
          return (
            <div key={field.id} className={cn(
              "flex items-center gap-3 p-3.5 rounded-xl border transition-all",
              currentAction === "convert" ? "border-brand-500/20 bg-brand-500/5" :
              currentAction === "remove" ? "border-red-500/20 bg-red-500/5" :
              "border-[var(--border)] bg-[var(--bg)]"
            )}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-[var(--bg-muted)] px-1.5 py-0.5 rounded text-[var(--text-muted)]">
                    {field.type}
                  </span>
                  <p className="text-sm font-medium text-[var(--text)] truncate">{field.label}</p>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Page {field.page} · <code className="text-[10px]">{field.name}</code>
                </p>
              </div>

              <div className="flex items-center gap-1">
                {ACTION_BUTTONS.map((btn) => (
                  <button
                    key={btn.value}
                    onClick={() => setAction(field.id, btn.value)}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border font-medium transition-all",
                      currentAction === btn.value
                        ? cn(btn.color, "shadow-sm")
                        : "text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--text-subtle)] bg-transparent"
                    )}
                    aria-pressed={currentAction === btn.value}
                    id={`field-${field.id}-${btn.value}`}
                  >
                    <btn.icon className="w-3 h-3" />
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="secondary" size="sm" onClick={prevStep} id="step4-back-btn">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={nextStep} id="step4-skip-btn">
            Skip Detection
          </Button>
          <Button size="sm" onClick={nextStep} id="step4-next-btn">
            Apply & Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
