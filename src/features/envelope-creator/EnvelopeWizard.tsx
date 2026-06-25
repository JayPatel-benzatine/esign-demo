"use client";

import { useState } from "react";
import { useEnvelopeStore } from "@/store/envelopeStore";
import { Step1Details } from "./steps/Step1Details";
import { Step2Documents } from "./steps/Step2Documents";
import { Step3Roles } from "./steps/Step3Roles";
import { Step4FieldDetection } from "./steps/Step4FieldDetection";
import { Step5Annotator } from "./steps/Step5Annotator";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";

const STEPS = [
  { id: 1, label: "Details", description: "Basic info" },
  { id: 2, label: "Documents", description: "Upload files" },
  { id: 3, label: "Signers", description: "Add roles" },
  { id: 4, label: "Fields", description: "Detect form fields" },
  { id: 5, label: "Annotate", description: "Place fields" },
] as const;

function WizardProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-0 px-8 py-5 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
      {STEPS.map((step, i) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        const isPending = currentStep < step.id;

        return (
          <div key={step.id} className="flex items-center gap-0 flex-1">
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Step circle */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                isCompleted && "bg-emerald-500 text-white shadow-sm",
                isCurrent && "bg-brand-500 text-white shadow-glow-sm",
                isPending && "bg-[var(--bg-muted)] text-[var(--text-subtle)] border border-[var(--border)]"
              )}>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              {/* Labels */}
              <div className="hidden sm:block">
                <p className={cn(
                  "text-xs font-semibold transition-colors",
                  isCurrent ? "text-[var(--text)]" : isCompleted ? "text-emerald-400" : "text-[var(--text-subtle)]"
                )}>{step.label}</p>
                <p className="text-[10px] text-[var(--text-subtle)]">{step.description}</p>
              </div>
            </div>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div className={cn(
                "flex-1 h-px mx-3 transition-all duration-300",
                isCompleted ? "bg-emerald-500" : "bg-[var(--border)]"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function EnvelopeWizard() {
  const { wizardStep } = useEnvelopeStore();

  return (
    <div className="flex flex-col h-full">
      <WizardProgress currentStep={wizardStep} />

      <div className="flex-1 overflow-y-auto">
        <div className="animate-fade-in" key={wizardStep}>
          {wizardStep === 1 && <Step1Details />}
          {wizardStep === 2 && <Step2Documents />}
          {wizardStep === 3 && <Step3Roles />}
          {wizardStep === 4 && <Step4FieldDetection />}
          {wizardStep === 5 && <Step5Annotator />}
        </div>
      </div>
    </div>
  );
}
