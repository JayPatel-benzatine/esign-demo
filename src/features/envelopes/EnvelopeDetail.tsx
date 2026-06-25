"use client";

import { useQuery } from "@tanstack/react-query";
import { envelopeService } from "@/services/envelopeService";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EnvelopeStatusBadge } from "@/features/envelopes/EnvelopeStatusBadge";
import { AnnotatorWorkspace } from "@/features/annotator/AnnotatorWorkspace";
import { cn } from "@/lib/utils";
import { ROLE_COLORS, type RoleColor } from "@/types/role";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";
import {
  ArrowLeft, Send, Download, Copy, Trash2, MoreHorizontal,
  FileText, Users, Clock, CheckCircle2, Activity, History
} from "lucide-react";
import { toast } from "sonner";

interface EnvelopeDetailProps {
  envelopeId: string;
}

const MOCK_AUDIT = [
  { id: "a1", action: "Envelope Created",     actor: "Sarah Johnson", time: "3 days ago" },
  { id: "a2", action: "Sent for Signing",     actor: "Sarah Johnson", time: "3 days ago" },
  { id: "a3", action: "Viewed by Signer 1",  actor: "John Smith",    time: "2 days ago" },
  { id: "a4", action: "Signed by Signer 1",  actor: "John Smith",    time: "2 days ago" },
  { id: "a5", action: "Viewed by Signer 2",  actor: "Alice Brown",   time: "1 day ago" },
];

export function EnvelopeDetail({ envelopeId }: EnvelopeDetailProps) {
  const { data: envelope, isLoading } = useQuery({
    queryKey: ["envelope", envelopeId],
    queryFn: () => envelopeService.get(envelopeId),
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!envelope) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-8">
        <FileText className="w-12 h-12 text-muted-foreground mb-3" />
        <p className="text-sm font-medium">Envelope not found</p>
        <Link
          href="/envelopes"
          className={buttonVariants({ variant: "ghost", size: "sm", className: "mt-2 gap-1" })}
        >
          <ArrowLeft className="w-4 h-4" />Back to Envelopes
        </Link>
      </div>
    );
  }

  const completedRoles = envelope.roles.filter((r) => r.status === "completed").length;
  const progress = Math.round((completedRoles / envelope.roles.length) * 100);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Link
              href="/envelopes"
              className={buttonVariants({ variant: "ghost", size: "icon-sm", className: "-ml-1 mt-0.5" })}
              id="envelope-detail-back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold">{envelope.title}</h1>
                <EnvelopeStatusBadge status={envelope.status} />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Created {formatDistanceToNow(new Date(envelope.createdAt), { addSuffix: true })}
                {envelope.expiryDate && (
                  <> · Expires {format(new Date(envelope.expiryDate), "MMM d, yyyy")}</>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => toast.info("Downloading…")} id="envelope-download-btn">
              <Download className="w-3.5 h-3.5" />
              Download
            </Button>
            <Button size="sm" onClick={() => toast.info("Sending reminder…")} id="envelope-send-btn">
              <Send className="w-3.5 h-3.5" />
              Send Reminder
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="icon-sm" id="envelope-more-btn" aria-label="More actions">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => toast.info("Duplicating…")} id="envelope-duplicate-btn">
                  <Copy className="w-4 h-4" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive" id="envelope-void-btn">
                  <Trash2 className="w-4 h-4" /> Void Envelope
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-brand rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {completedRoles}/{envelope.roles.length} signed
          </span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="annotate" className="flex-1 overflow-hidden flex flex-col">
        <div className="border-b px-6">
          <TabsList className="bg-transparent p-0 h-10 gap-0">
            {[
              { value: "annotate", label: "Annotate",   icon: FileText },
              { value: "signers",  label: "Signers",    icon: Users },
              { value: "activity", label: "Activity",   icon: Activity },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1.5 px-4 h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent text-muted-foreground text-sm font-medium transition-all"
                id={`detail-tab-${tab.value}`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Annotate Tab — Full editor */}
        <TabsContent value="annotate" className="flex-1 overflow-hidden m-0 data-[state=inactive]:hidden">
          <AnnotatorWorkspace
            roles={envelope.roles}
            documentUrl={envelope.documents[0]?.url ?? "/sample.pdf"}
          />
        </TabsContent>

        {/* Signers Tab */}
        <TabsContent value="signers" className="m-0 p-6 overflow-auto">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-sm font-semibold">Signers</h2>
            {envelope.roles.map((role, i) => {
              const roleColor = ROLE_COLORS[role.color as RoleColor];
              const isComplete = role.status === "completed";
              return (
                <div
                  key={role.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border transition-all",
                    isComplete ? "border-emerald-500/20 bg-emerald-500/5" : "bg-card"
                  )}
                >
                  {/* Order badge */}
                  {envelope.signingOrderEnabled && (
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                      {i + 1}
                    </div>
                  )}
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="text-white text-sm font-bold" style={{ backgroundColor: roleColor }}>
                      {role.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{role.name}</p>
                    <p className="text-xs text-muted-foreground">{role.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isComplete ? (
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-xs">
                        <CheckCircle2 className="w-3 h-3" />Signed
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10 text-xs">
                        <Clock className="w-3 h-3" />Pending
                      </Badge>
                    )}
                    <Button variant="ghost" size="xs" onClick={() => toast.info("Sending reminder…")} id={`remind-${role.id}`}>
                      Remind
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="m-0 p-6 overflow-auto">
          <div className="max-w-2xl space-y-0">
            <h2 className="text-sm font-semibold mb-4">Audit Trail</h2>
            {MOCK_AUDIT.map((event, i) => (
              <div key={event.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  {i < MOCK_AUDIT.length - 1 && <div className="w-px flex-1 bg-border mt-1 mb-1" />}
                </div>
                <div className="pb-4 flex-1">
                  <p className="text-sm font-medium">{event.action}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {event.actor} · {event.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
