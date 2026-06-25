import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PenLine, Plus, Download } from "lucide-react";

export const metadata: Metadata = { title: "Signatures" };

const SAVED_SIGNATURES = [
  { id: "sig1", name: "Primary Signature", type: "draw", createdAt: "2026-01-10", usages: 34 },
  { id: "sig2", name: "Initials", type: "type", createdAt: "2026-01-10", usages: 21 },
  { id: "sig3", name: "Full Signature (Typed)", type: "type", createdAt: "2026-02-15", usages: 8 },
];

export default function SignaturesPage() {
  return (
    <div className="p-6 max-w-[800px] mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text)]">My Signatures</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Manage your saved signatures and initials</p>
        </div>
        <Button size="sm" id="add-signature-btn">
          <Plus className="w-3.5 h-3.5" />
          New Signature
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {SAVED_SIGNATURES.map((sig) => (
          <Card key={sig.id} className="hover:border-[var(--text-subtle)] transition-all">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-40 h-20 rounded-xl border border-[var(--border)] bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-3xl text-[#1a1a2e]" style={{ fontFamily: "'Dancing Script', cursive" }}>
                  Sarah J.
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--text)]">{sig.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-[10px]">{sig.type}</Badge>
                  <span className="text-xs text-[var(--text-muted)]">Used {sig.usages} times</span>
                  <span className="text-xs text-[var(--text-muted)]">Created {sig.createdAt}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" id={`sig-download-${sig.id}`}>
                  <Download className="w-3.5 h-3.5" />
                </Button>
                <Button variant="destructive" size="sm" id={`sig-delete-${sig.id}`}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--bg-muted)] flex items-center justify-center mx-auto mb-3">
            <PenLine className="w-6 h-6 text-[var(--text-muted)]" />
          </div>
          <p className="text-sm font-medium text-[var(--text)]">Create a New Signature</p>
          <p className="text-xs text-[var(--text-muted)] mt-1 mb-4">Draw, type, or upload your signature</p>
          <Button size="sm" id="create-signature-btn">
            <Plus className="w-3.5 h-3.5" />
            Add Signature
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
