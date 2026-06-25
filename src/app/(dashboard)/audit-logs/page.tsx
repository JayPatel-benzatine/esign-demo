import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { FileText, Send, Eye, CheckCircle2, Download, AlertTriangle, Edit3 } from "lucide-react";

export const metadata: Metadata = { title: "Audit Logs" };

const ACTION_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  envelope_created: { label: "Envelope Created", icon: Edit3, color: "text-blue-400 bg-blue-500/10" },
  envelope_sent: { label: "Envelope Sent", icon: Send, color: "text-purple-400 bg-purple-500/10" },
  envelope_viewed: { label: "Document Viewed", icon: Eye, color: "text-amber-400 bg-amber-500/10" },
  envelope_signed: { label: "Envelope Signed", icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10" },
  envelope_completed: { label: "Envelope Completed", icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10" },
  role_signed: { label: "Role Signed", icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10" },
  document_downloaded: { label: "Document Downloaded", icon: Download, color: "text-slate-400 bg-slate-500/10" },
  envelope_expired: { label: "Envelope Expired", icon: AlertTriangle, color: "text-red-400 bg-red-500/10" },
};

const LOGS = [
  { id: "l1", envelopeTitle: "Employment Agreement - John Smith", action: "envelope_viewed", actorName: "John Smith", actorEmail: "john@acme.com", ipAddress: "192.168.1.1", timestamp: new Date(Date.now() - 300000).toISOString() },
  { id: "l2", envelopeTitle: "NDA - Acme Corp & Widget Inc", action: "envelope_signed", actorName: "Bob Wilson", actorEmail: "bob@widget.com", ipAddress: "10.0.0.5", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: "l3", envelopeTitle: "NDA - Acme Corp & Widget Inc", action: "role_signed", actorName: "Alice Johnson", actorEmail: "alice@acme.com", ipAddress: "10.0.0.3", timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: "l4", envelopeTitle: "Vendor Agreement - TechSupply Co", action: "envelope_sent", actorName: "You", actorEmail: "sarah@acme.com", ipAddress: "10.0.0.1", timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: "l5", envelopeTitle: "Vendor Agreement - TechSupply Co", action: "envelope_created", actorName: "You", actorEmail: "sarah@acme.com", ipAddress: "10.0.0.1", timestamp: new Date(Date.now() - 90000000).toISOString() },
  { id: "l6", envelopeTitle: "Office Lease Renewal 2026", action: "envelope_completed", actorName: "System", actorEmail: "system@signflow.app", ipAddress: "—", timestamp: new Date(Date.now() - 259200000).toISOString() },
  { id: "l7", envelopeTitle: "Software License Agreement", action: "envelope_expired", actorName: "System", actorEmail: "system@signflow.app", ipAddress: "—", timestamp: new Date(Date.now() - 172800000).toISOString() },
];

export default function AuditLogsPage() {
  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-[var(--text)]">Audit Logs</h1>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">Complete activity history for all envelopes</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {LOGS.map((log, i) => {
              const meta = ACTION_META[log.action] ?? { label: log.action, icon: FileText, color: "text-slate-400 bg-slate-500/10" };
              const Icon = meta.icon;
              return (
                <div key={log.id} className="flex items-start gap-4 p-4 hover:bg-[var(--bg-muted)] transition-colors group">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", meta.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", meta.color)}>
                        {meta.label}
                      </span>
                      <p className="text-sm font-medium text-[var(--text)] truncate">{log.envelopeTitle}</p>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {log.actorName} · {log.actorEmail} · IP: {log.ipAddress}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-[var(--text-muted)]">
                      {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                    </p>
                    <p className="text-[10px] text-[var(--text-subtle)] mt-0.5">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
