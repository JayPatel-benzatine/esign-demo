"use client";

import { useQuery } from "@tanstack/react-query";
import { envelopeService } from "@/services/envelopeService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  FileText, Clock, CheckCircle2, FilePen, Users, TrendingUp, TrendingDown,
  Plus, Send, LayoutTemplate, ArrowRight, AlertTriangle, Activity, Zap
} from "lucide-react";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  title, value, trend, icon: Icon, colorClass, description
}: {
  title: string; value: number | string; trend?: number;
  icon: React.ElementType; colorClass: string; description?: string;
}) {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;
  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{title}</p>
            <p className="text-2xl font-bold tabular-nums">{value}</p>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", colorClass)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t">
            {isPositive ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> :
             isNegative ? <TrendingDown className="w-3.5 h-3.5 text-destructive" /> : null}
            <span className={cn("text-xs font-medium",
              isPositive ? "text-emerald-500" : isNegative ? "text-destructive" : "text-muted-foreground"
            )}>
              {isPositive ? "+" : ""}{trend}%
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Activity Timeline ────────────────────────────────────────────────────────
const ACTION_COLORS: Record<string, string> = {
  envelope_created: "bg-blue-500",
  envelope_sent: "bg-purple-500",
  envelope_viewed: "bg-amber-500",
  envelope_signed: "bg-emerald-500",
  envelope_completed: "bg-emerald-500",
  role_signed: "bg-emerald-500",
  document_downloaded: "bg-slate-400",
};

const ACTION_LABELS: Record<string, string> = {
  envelope_created: "Created",
  envelope_sent: "Sent",
  envelope_viewed: "Viewed",
  envelope_signed: "Signed",
  envelope_completed: "Completed",
  role_signed: "Role Signed",
  document_downloaded: "Downloaded",
};

function ActivityTimeline({ items }: {
  items: Array<{ id: string; envelopeTitle: string; action: string; actorName: string; timestamp: string }>
}) {
  return (
    <div className="space-y-0">
      {items.map((item, i) => {
        const dotColor = ACTION_COLORS[item.action] ?? "bg-muted-foreground";
        const label = ACTION_LABELS[item.action] ?? item.action;
        return (
          <div key={item.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", dotColor)} />
              {i < items.length - 1 && <div className="w-px flex-1 bg-border mt-1 mb-1" />}
            </div>
            <div className="pb-4 flex-1 min-w-0">
              <div className="flex items-start gap-2 flex-wrap">
                <Badge variant="secondary" className="text-[10px] shrink-0">{label}</Badge>
                <p className="text-xs text-foreground truncate flex-1">{item.envelopeTitle}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.actorName} · {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Quick Actions ────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { id: "qa-new",      label: "New Envelope",     icon: Plus,          href: "/envelopes/create", desc: "Start from scratch",   color: "text-primary bg-primary/10" },
  { id: "qa-template", label: "Use Template",     icon: LayoutTemplate, href: "/templates",       desc: "Browse templates",    color: "text-purple-600 dark:text-purple-400 bg-purple-500/10" },
  { id: "qa-send",     label: "Manage Envelopes", icon: Send,          href: "/envelopes",        desc: "View all envelopes",  color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" },
];

const EXPIRING = [
  { id: "e1", title: "Vendor Agreement - TechSupply Co",    expiresIn: 3 },
  { id: "e2", title: "Consulting Services Agreement",        expiresIn: 5 },
  { id: "e3", title: "Employment Agreement - John Smith",    expiresIn: 7 },
];

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const statsQuery = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => envelopeService.getStats(),
  });
  const activityQuery = useQuery({
    queryKey: ["dashboard-activity"],
    queryFn: () => envelopeService.getActivity(),
  });
  const envelopesQuery = useQuery({
    queryKey: ["envelopes", { pageSize: 5 }],
    queryFn: () => envelopeService.list({ pageSize: 5 }),
  });

  const stats = statsQuery.data;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Good morning, Sarah 👋</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Here&apos;s your document activity overview.</p>
        </div>
        <Link
          href="/envelopes/create"
          className={buttonVariants({ variant: "default", size: "sm", className: "gap-1" })}
          id="dashboard-new-envelope-btn"
        >
          <Plus className="w-4 h-4" />New Envelope
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statsQuery.isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}><CardContent className="p-5 space-y-3">
              <Skeleton className="h-3 w-24" /><Skeleton className="h-7 w-16" /><Skeleton className="h-3 w-32" />
            </CardContent></Card>
          ))
        ) : (
          <>
            <StatCard title="Total Envelopes"     value={stats?.totalEnvelopes ?? 0}      trend={stats?.trendsVsLastMonth.totalEnvelopes}     icon={FileText}      colorClass="bg-blue-500/10 text-blue-600 dark:text-blue-400" />
            <StatCard title="Pending Signatures"  value={stats?.pendingSignatures ?? 0}    trend={stats?.trendsVsLastMonth.pendingSignatures}   icon={Clock}         colorClass="bg-amber-500/10 text-amber-600 dark:text-amber-400" />
            <StatCard title="Completed"           value={stats?.completedDocuments ?? 0}   trend={stats?.trendsVsLastMonth.completedDocuments}  icon={CheckCircle2}  colorClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" />
            <StatCard title="Drafts"              value={stats?.draftDocuments ?? 0}       trend={stats?.trendsVsLastMonth.draftDocuments}      icon={FilePen}       colorClass="bg-purple-500/10 text-purple-600 dark:text-purple-400" />
            <StatCard title="Active Signers"      value={stats?.activeSigners ?? 0}        icon={Users}  colorClass="bg-rose-500/10 text-rose-600 dark:text-rose-400" />
          </>
        )}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left - 2 cols */}
        <div className="xl:col-span-2 space-y-4">
          {/* Recent Envelopes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Activity className="w-4 h-4 text-primary" />
                  Recent Envelopes
                </CardTitle>
                <Link
                  href="/envelopes"
                  className={buttonVariants({ variant: "ghost", size: "sm", className: "text-xs gap-1" })}
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {envelopesQuery.isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-lg" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3 w-48" /><Skeleton className="h-2.5 w-32" />
                      </div>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y">
                  {envelopesQuery.data?.items.map((env) => (
                    <Link
                      key={env.id}
                      href={`/envelopes/${env.id}`}
                      className="flex items-center gap-3 py-3 group hover:bg-muted/50 -mx-4 px-4 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                        <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{env.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(env.updatedAt), { addSuffix: true })} · {env.documentCount} doc{env.documentCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <Badge variant={
                        env.status === "signed" ? "outline" :
                        env.status === "pending" ? "secondary" : "outline"
                      } className={cn(
                        "text-[10px] shrink-0",
                        env.status === "signed" && "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
                        env.status === "pending" && "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10",
                        env.status === "expired" && "border-destructive/30 text-destructive bg-destructive/10",
                      )}>
                        {env.status === "partially_signed" ? "Partial" :
                         env.status === "signed" ? "Completed" :
                         env.status.charAt(0).toUpperCase() + env.status.slice(1)}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.id} href={action.href}>
                <Card className="group cursor-pointer hover:shadow-md hover:border-muted-foreground/30 transition-all duration-200 hover:scale-[1.02]">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all", action.color)}>
                      <action.icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activityQuery.isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-1">
                      <Skeleton className="h-3 w-full" /><Skeleton className="h-2.5 w-32" />
                    </div>
                  ))}
                </div>
              ) : (
                <ActivityTimeline items={activityQuery.data ?? []} />
              )}
            </CardContent>
          </Card>

          {/* Expiring Soon */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Expiring Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {EXPIRING.map((item) => (
                  <Link key={item.id} href={`/envelopes/${item.id}`}>
                    <div className={cn(
                      "flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted cursor-pointer transition-colors",
                      item.expiresIn <= 3 && "bg-destructive/5 border border-destructive/10"
                    )}>
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold",
                        item.expiresIn <= 3 ? "bg-destructive/15 text-destructive" :
                        item.expiresIn <= 5 ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {item.expiresIn}d
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground">Expires in {item.expiresIn} day{item.expiresIn !== 1 ? "s" : ""}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
