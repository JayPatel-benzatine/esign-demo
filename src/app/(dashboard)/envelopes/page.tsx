import { EnvelopeTable } from "@/features/envelopes/EnvelopeTable";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Envelopes" };

export default function EnvelopesPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text)]">Envelopes</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Manage all your signature requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" id="export-envelopes-btn">
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
          <Link href="/envelopes/create">
            <Button size="sm" id="envelopes-create-btn">
              <Plus className="w-3.5 h-3.5" />
              New Envelope
            </Button>
          </Link>
        </div>
      </div>

      <EnvelopeTable />
    </div>
  );
}
