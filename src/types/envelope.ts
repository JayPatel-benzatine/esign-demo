import type { Role } from "./role";
import type { Annotation } from "./annotation";

// ─── Envelope Types ───────────────────────────────────────────────────────────

export type EnvelopeStatus =
  | "draft"
  | "pending"
  | "partially_signed"
  | "signed"
  | "expired"
  | "voided";

export type ReminderFrequency = "none" | "daily" | "every2days" | "weekly";

export interface EnvelopeDocument {
  id: string;
  name: string;
  size: number;
  pageCount: number;
  url: string;
  order: number;
  uploadedAt: string;
}

export interface Envelope {
  id: string;
  title: string;
  description?: string;
  status: EnvelopeStatus;
  roles: Role[];
  documents: EnvelopeDocument[];
  annotations: Annotation[];
  signingOrderEnabled: boolean;
  expiryDate?: string;
  reminderFrequency: ReminderFrequency;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  createdBy: string;
  templateId?: string;
}

export interface EnvelopeListItem {
  id: string;
  title: string;
  status: EnvelopeStatus;
  roles: Pick<Role, "id" | "name" | "email" | "color" | "status">[];
  documentCount: number;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface EnvelopeFilters {
  search?: string;
  status?: EnvelopeStatus | "all";
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "createdAt" | "updatedAt" | "title" | "status";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface EnvelopePagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface EnvelopeListResponse {
  items: EnvelopeListItem[];
  pagination: EnvelopePagination;
}

export const ENVELOPE_STATUS_LABELS: Record<EnvelopeStatus, string> = {
  draft: "Draft",
  pending: "Pending",
  partially_signed: "Partially Signed",
  signed: "Completed",
  expired: "Expired",
  voided: "Voided",
};

export const ENVELOPE_STATUS_COLORS: Record<EnvelopeStatus, string> = {
  draft: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  partially_signed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  signed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  expired: "bg-red-500/15 text-red-400 border-red-500/30",
  voided: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};
