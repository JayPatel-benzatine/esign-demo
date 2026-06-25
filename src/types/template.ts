import type { Annotation } from "./annotation";

// ─── Template Types ───────────────────────────────────────────────────────────

export type TemplateCategory =
  | "hr"
  | "legal"
  | "sales"
  | "finance"
  | "real_estate"
  | "general";

export interface Template {
  id: string;
  name: string;
  description?: string;
  category: TemplateCategory;
  annotations: Annotation[];
  roleCount: number;
  documentCount: number;
  usageCount: number;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  hr: "Human Resources",
  legal: "Legal",
  sales: "Sales",
  finance: "Finance",
  real_estate: "Real Estate",
  general: "General",
};

// ─── Audit Log Types ──────────────────────────────────────────────────────────

export type AuditAction =
  | "envelope_created"
  | "envelope_sent"
  | "envelope_viewed"
  | "envelope_signed"
  | "envelope_completed"
  | "envelope_expired"
  | "envelope_voided"
  | "document_downloaded"
  | "role_signed"
  | "annotation_added"
  | "annotation_removed";

export interface AuditLog {
  id: string;
  envelopeId: string;
  action: AuditAction;
  actorName: string;
  actorEmail: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

// ─── Prefill Variable Types ───────────────────────────────────────────────────

export type PrefillGroup = "employee" | "employer";

export interface PrefillVariable {
  id: string;
  key: string;
  label: string;
  group: PrefillGroup;
  value?: string;
}

export const PREFILL_VARIABLES: PrefillVariable[] = [
  { id: "emp_first_name", key: "employee.firstName", label: "First Name", group: "employee" },
  { id: "emp_last_name", key: "employee.lastName", label: "Last Name", group: "employee" },
  { id: "emp_email", key: "employee.email", label: "Email", group: "employee" },
  { id: "emp_phone", key: "employee.phone", label: "Phone", group: "employee" },
  { id: "emp_address", key: "employee.address", label: "Address", group: "employee" },
  { id: "emp_id", key: "employee.id", label: "Employee ID", group: "employee" },
  { id: "er_company", key: "employer.companyName", label: "Company Name", group: "employer" },
  { id: "er_website", key: "employer.website", label: "Website", group: "employer" },
  { id: "er_email", key: "employer.email", label: "Email", group: "employer" },
  { id: "er_address", key: "employer.address", label: "Address", group: "employer" },
  { id: "er_tax", key: "employer.taxNumber", label: "Tax Number", group: "employer" },
];

// ─── Dashboard Types ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalEnvelopes: number;
  pendingSignatures: number;
  completedDocuments: number;
  draftDocuments: number;
  activeSigners: number;
  trendsVsLastMonth: {
    totalEnvelopes: number;
    pendingSignatures: number;
    completedDocuments: number;
    draftDocuments: number;
  };
}

export interface ActivityItem {
  id: string;
  envelopeId: string;
  envelopeTitle: string;
  action: AuditAction;
  actorName: string;
  timestamp: string;
}
