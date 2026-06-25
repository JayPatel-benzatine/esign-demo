"use client";

import { useEnvelopeStore } from "@/store/envelopeStore";
import { AnnotatorWorkspace } from "@/features/annotator/AnnotatorWorkspace";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function Step5Annotator() {
  const { wizardData, prevStep } = useEnvelopeStore();

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center gap-3 px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
        <Button variant="ghost" size="sm" onClick={prevStep} id="step5-back-btn">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <span className="text-sm text-[var(--text-muted)]">Annotating: <strong className="text-[var(--text)]">{wizardData.title || "Untitled"}</strong></span>
      </div>
      <div className="flex-1 overflow-hidden">
        <AnnotatorWorkspace
          roles={wizardData.roles}
          documentUrl={wizardData.documents[0]?.url ?? "/sample.pdf"}
        />
      </div>
    </div>
  );
}
