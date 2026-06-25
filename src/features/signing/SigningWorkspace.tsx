"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SignatureModal } from "@/features/signing/SignatureModal";
import type { SignatureData } from "@/types/signing";
import { cn } from "@/lib/utils";
import {
  CheckCircle2, ChevronLeft, ChevronRight, Zap,
  PenLine, Fingerprint, Type, Calendar, Lock, Info
} from "lucide-react";
import { toast } from "sonner";

// Mock signing session data
const MOCK_SESSION = {
  envelopeTitle: "Employment Agreement - John Smith",
  recipientName: "John Smith",
  recipientEmail: "john.smith@acme.com",
  totalFields: 6,
  documentUrl: "/sample.pdf",
  fields: [
    { id: "sf1", type: "signature", label: "Employee Signature",    page: 3, required: true,  completed: false },
    { id: "sf2", type: "initials",  label: "Page 2 Initials",      page: 2, required: true,  completed: false },
    { id: "sf3", type: "text",      label: "Full Legal Name",       page: 1, required: true,  completed: true  },
    { id: "sf4", type: "text",      label: "Job Title",             page: 1, required: false, completed: true  },
    { id: "sf5", type: "date",      label: "Date Signed",           page: 3, required: true,  completed: false },
    { id: "sf6", type: "text",      label: "Employee ID",           page: 1, required: false, completed: true  },
  ],
};

const FIELD_ICONS: Record<string, React.ElementType> = {
  signature: PenLine,
  initials: Fingerprint,
  text: Type,
  date: Calendar,
  password: Lock,
};

export function SigningWorkspace() {
  const [currentPage, setCurrentPage] = useState(1);
  const [signatureOpen, setSignatureOpen] = useState(false);
  const [signatureMode, setSignatureMode] = useState<"signature" | "initials">("signature");
  const [fields, setFields] = useState(MOCK_SESSION.fields);
  const [submitted, setSubmitted] = useState(false);

  const completedCount = fields.filter((f) => f.completed).length;
  const requiredPending = fields.filter((f) => f.required && !f.completed).length;
  const progress = Math.round((completedCount / fields.length) * 100);

  const handleFieldClick = (field: typeof fields[0]) => {
    if (field.type === "signature") {
      setSignatureMode("signature");
      setSignatureOpen(true);
    } else if (field.type === "initials") {
      setSignatureMode("initials");
      setSignatureOpen(true);
    } else {
      // Mark text/date fields as complete directly
      setFields((prev) => prev.map((f) => f.id === field.id ? { ...f, completed: true } : f));
      toast.success(`${field.label} filled`);
    }
  };

  const handleSignatureApply = (data: SignatureData) => {
    // Mark current signature/initials field as complete
    setFields((prev) => prev.map((f) =>
      (signatureMode === "signature" && f.type === "signature") ||
      (signatureMode === "initials" && f.type === "initials")
        ? { ...f, completed: true }
        : f
    ));
    toast.success(`${signatureMode === "initials" ? "Initials" : "Signature"} applied!`);
  };

  const handleSubmit = () => {
    if (requiredPending > 0) {
      toast.error(`Please complete all required fields (${requiredPending} remaining)`);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-4 border-emerald-500/30 flex items-center justify-center mb-6 animate-scale-in">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Document Signed!</h1>
        <p className="text-muted-foreground text-sm max-w-md">
          You have successfully signed <strong>{MOCK_SESSION.envelopeTitle}</strong>.
          A copy will be emailed to {MOCK_SESSION.recipientEmail}.
        </p>
        <Button className="mt-6" size="lg" onClick={() => window.close()} id="signing-done-btn">
          Done
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-sm text-foreground">SignFlow</span>
          </div>
          <Separator orientation="vertical" className="h-5" />
          <div>
            <p className="text-sm font-medium truncate max-w-[300px]">{MOCK_SESSION.envelopeTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-32 hidden sm:block">
              <Progress value={progress} className="h-1.5" />
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{completedCount}/{fields.length} fields</span>
          </div>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={requiredPending > 0}
            className={cn(requiredPending === 0 && "animate-pulse-glow")}
            id="signing-submit-btn"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Finish & Sign
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left — Field List */}
        <div className="w-72 border-r bg-sidebar shrink-0 flex flex-col">
          <div className="px-4 py-3 border-b">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-[10px] font-bold gradient-brand text-white">
                  {MOCK_SESSION.recipientName.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-semibold">{MOCK_SESSION.recipientName}</p>
                <p className="text-[10px] text-muted-foreground">{MOCK_SESSION.recipientEmail}</p>
              </div>
            </div>
            <Progress value={progress} className="h-1" />
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                Fields to Complete
              </p>
              {fields.map((field) => {
                const Icon = FIELD_ICONS[field.type] ?? Type;
                return (
                  <button
                    key={field.id}
                    onClick={() => handleFieldClick(field)}
                    className={cn(
                      "w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left text-xs transition-all",
                      field.completed
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                        : "bg-card border border-border hover:border-muted-foreground text-foreground"
                    )}
                    id={`signing-field-${field.id}`}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-md flex items-center justify-center shrink-0",
                      field.completed ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                    )}>
                      {field.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{field.label}</p>
                      <p className="text-[10px] text-muted-foreground">Page {field.page}</p>
                    </div>
                    {field.required && !field.completed && (
                      <span className="text-destructive text-[10px] font-bold shrink-0">*</span>
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          {/* Info Banner */}
          <div className="p-3 border-t">
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-blue-600 dark:text-blue-400">
                All fields marked with <span className="text-destructive font-bold">*</span> are required before submitting.
              </p>
            </div>
          </div>
        </div>

        {/* Center — Document */}
        <div className="flex-1 bg-[oklch(0.12_0.01_264)] overflow-auto relative">
          <div className="flex items-start justify-center p-8 min-h-full">
            {/* Mock PDF placeholder */}
            <div className="relative w-[794px] shadow-elevated rounded-xl overflow-hidden">
              <div className="bg-white" style={{ minHeight: "1123px" }}>
                <div className="p-16 space-y-6">
                  <div className="text-center border-b pb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Employment Agreement</h1>
                    <p className="text-gray-600 mt-2">This Agreement is entered into as of January 1, 2026</p>
                  </div>
                  <div className="space-y-4 text-gray-800 text-sm leading-relaxed">
                    <p><strong>Employee:</strong> John Smith</p>
                    <p><strong>Employer:</strong> Acme Corporation</p>
                    <p><strong>Position:</strong> Senior Software Engineer</p>
                    <p><strong>Start Date:</strong> February 1, 2026</p>
                    <p className="mt-6">
                      This Employment Agreement sets forth the terms and conditions of employment between the Employee and the Employer. Both parties agree to the terms and conditions set forth herein.
                    </p>
                    <p>
                      The Employee agrees to perform all duties as required by the Employer to the best of their ability and in accordance with the highest professional standards.
                    </p>
                    <p>
                      This agreement is subject to the applicable laws of the jurisdiction in which the work is performed. Both parties hereby acknowledge they have read, understood, and agree to all terms herein.
                    </p>
                  </div>

                  {/* Signature fields */}
                  <div className="mt-12 grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Employee Signature</p>
                      <button
                        onClick={() => { setSignatureMode("signature"); setSignatureOpen(true); }}
                        className={cn(
                          "w-full h-16 border-2 rounded-lg flex items-center justify-center text-xs transition-all",
                          fields.find(f => f.type === "signature")?.completed
                            ? "border-emerald-500/50 bg-emerald-500/5 text-emerald-600"
                            : "border-dashed border-primary/40 bg-primary/5 text-primary hover:bg-primary/10"
                        )}
                        id="doc-signature-field"
                      >
                        {fields.find(f => f.type === "signature")?.completed
                          ? <><CheckCircle2 className="w-4 h-4 mr-1" /> Signed</>
                          : <><PenLine className="w-4 h-4 mr-1" /> Click to Sign</>
                        }
                      </button>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date Signed</p>
                      <button
                        onClick={() => {
                          setFields(prev => prev.map(f => f.type === "date" ? {...f, completed: true} : f));
                          toast.success("Date applied");
                        }}
                        className={cn(
                          "w-full h-16 border-2 rounded-lg flex items-center justify-center text-xs transition-all",
                          fields.find(f => f.type === "date")?.completed
                            ? "border-emerald-500/50 bg-emerald-500/5 text-emerald-600"
                            : "border-dashed border-amber-500/40 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10"
                        )}
                        id="doc-date-field"
                      >
                        {fields.find(f => f.type === "date")?.completed
                          ? <><CheckCircle2 className="w-4 h-4 mr-1" /> {new Date().toLocaleDateString()}</>
                          : <><Calendar className="w-4 h-4 mr-1" /> Click to add date</>
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass rounded-full px-3 py-1.5 flex items-center gap-2 shadow-elevated">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="w-6 h-6 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 transition-all"
              id="sign-prev-page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-medium min-w-[40px] text-center">{currentPage} / 3</span>
            <button
              onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
              disabled={currentPage >= 3}
              className="w-6 h-6 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 transition-all"
              id="sign-next-page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <SignatureModal
        open={signatureOpen}
        onClose={() => setSignatureOpen(false)}
        onApply={handleSignatureApply}
        mode={signatureMode}
      />
    </div>
  );
}
