"use client";

import { useState, useCallback, useRef } from "react";
import { useEnvelopeStore } from "@/store/envelopeStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowLeft, Upload, X, FileText, GripVertical, CheckCircle2 } from "lucide-react";
import type { EnvelopeDocument } from "@/types/envelope";

type DocWithFile = EnvelopeDocument & { file?: File; progress: number; error?: string };

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileRow({ doc, onRemove }: { doc: DocWithFile; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] group hover:border-[var(--text-subtle)] transition-all">
      <GripVertical className="w-4 h-4 text-[var(--text-subtle)] cursor-grab flex-shrink-0" />
      <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
        <FileText className="w-4 h-4 text-red-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text)] truncate">{doc.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-[var(--text-muted)]">{formatBytes(doc.size)}</span>
          {doc.pageCount > 0 && (
            <>
              <span className="text-[var(--border)]">·</span>
              <span className="text-xs text-[var(--text-muted)]">{doc.pageCount} pages</span>
            </>
          )}
        </div>
        {/* Upload progress */}
        {doc.progress < 100 && (
          <div className="mt-1.5 h-1 bg-[var(--bg-muted)] rounded-full overflow-hidden">
            <div
              className="h-full gradient-brand rounded-full transition-all duration-300"
              style={{ width: `${doc.progress}%` }}
            />
          </div>
        )}
      </div>
      {doc.progress === 100 ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
      ) : (
        <span className="text-xs text-brand-400 flex-shrink-0">{doc.progress}%</span>
      )}
      <button
        onClick={onRemove}
        className="w-6 h-6 flex items-center justify-center rounded-md text-[var(--text-subtle)] hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
        aria-label="Remove file"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function Step2Documents() {
  const { wizardData, updateWizardData, nextStep, prevStep } = useEnvelopeStore();
  const [docs, setDocs] = useState<DocWithFile[]>(
    wizardData.documents.map((d) => ({ ...d, progress: 100 }))
  );
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = (doc: DocWithFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setDocs((prev) => prev.map((d) => d.id === doc.id ? { ...d, progress: Math.round(progress) } : d));
    }, 200);
  };

  const addFiles = useCallback((files: File[]) => {
    const newDocs: DocWithFile[] = files
      .filter((f) => f.type === "application/pdf")
      .map((file) => ({
        id: `doc_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        name: file.name,
        size: file.size,
        pageCount: 0,
        url: URL.createObjectURL(file),
        order: docs.length,
        uploadedAt: new Date().toISOString(),
        file,
        progress: 0,
      }));

    if (newDocs.length === 0) return;
    setDocs((prev) => [...prev, ...newDocs]);
    newDocs.forEach((doc) => simulateUpload(doc));
  }, [docs.length]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  }, [addFiles]);

  const handleContinue = () => {
    const completed = docs.filter((d) => d.progress === 100);
    updateWizardData({ documents: completed });
    nextStep();
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center mb-4">
          <Upload className="w-6 h-6 text-purple-400" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text)]">Upload Documents</h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">Upload PDF files for signing. You can add multiple documents.</p>
      </div>

      {/* Drop Zone */}
      <div
        className={cn("drop-zone p-10 flex flex-col items-center gap-4 cursor-pointer mb-4 transition-all", isDragging && "active")}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        aria-label="Drop PDF files or click to browse"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          className="hidden"
          onChange={(e) => addFiles(Array.from(e.target.files ?? []))}
          id="document-file-input"
        />
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
          isDragging ? "gradient-brand" : "bg-[var(--bg-muted)]"
        )}>
          <Upload className={cn("w-8 h-8", isDragging ? "text-white" : "text-[var(--text-muted)]")} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-[var(--text)]">
            {isDragging ? "Drop your PDFs here" : "Drop PDFs here or click to browse"}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Supports PDF files up to 100 MB each</p>
        </div>
        <Button variant="secondary" size="sm" onClick={(e) => e.stopPropagation()}>
          Browse Files
        </Button>
      </div>

      {/* File List */}
      {docs.length > 0 && (
        <div className="space-y-2 mb-6">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            {docs.length} file{docs.length !== 1 ? "s" : ""} added
          </p>
          {docs.map((doc, i) => (
            <FileRow
              key={doc.id}
              doc={doc}
              onRemove={() => setDocs((prev) => prev.filter((d) => d.id !== doc.id))}
            />
          ))}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="secondary" size="sm" onClick={prevStep} id="step2-back-btn">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          size="sm"
          onClick={handleContinue}
          disabled={docs.filter((d) => d.progress === 100).length === 0}
          id="step2-next-btn"
        >
          Continue to Signers
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
