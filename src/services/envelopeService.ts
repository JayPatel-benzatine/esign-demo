import type { EnvelopeListItem, EnvelopeFilters, EnvelopeListResponse, Envelope, EnvelopeStatus } from "@/types/envelope";
import type { RoleColor } from "@/types/role";
import { subDays, addDays, format } from "date-fns";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ENVELOPES: EnvelopeListItem[] = [
  {
    id: "env_001",
    title: "Employment Agreement - John Smith",
    status: "pending",
    roles: [
      { id: "r1", name: "John Smith", email: "john@acme.com", color: "blue", status: "pending" },
      { id: "r2", name: "HR Manager", email: "hr@acme.com", color: "green", status: "completed" },
    ],
    documentCount: 2,
    expiryDate: addDays(new Date(), 7).toISOString(),
    createdAt: subDays(new Date(), 2).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
  },
  {
    id: "env_002",
    title: "NDA - Acme Corp & Widget Inc",
    status: "signed",
    roles: [
      { id: "r3", name: "Alice Johnson", email: "alice@acme.com", color: "purple", status: "completed" },
      { id: "r4", name: "Bob Wilson", email: "bob@widget.com", color: "orange", status: "completed" },
    ],
    documentCount: 1,
    expiryDate: addDays(new Date(), 30).toISOString(),
    createdAt: subDays(new Date(), 10).toISOString(),
    updatedAt: subDays(new Date(), 5).toISOString(),
    completedAt: subDays(new Date(), 5).toISOString(),
  },
  {
    id: "env_003",
    title: "Sales Contract Q2 2026",
    status: "draft",
    roles: [
      { id: "r5", name: "Sales Rep", email: "sales@acme.com", color: "red", status: "pending" },
    ],
    documentCount: 3,
    expiryDate: addDays(new Date(), 14).toISOString(),
    createdAt: subDays(new Date(), 1).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
  },
  {
    id: "env_004",
    title: "Vendor Agreement - TechSupply Co",
    status: "partially_signed",
    roles: [
      { id: "r6", name: "Procurement", email: "proc@acme.com", color: "blue", status: "completed" },
      { id: "r7", name: "Vendor Rep", email: "rep@techsupply.com", color: "green", status: "pending" },
      { id: "r8", name: "Legal Counsel", email: "legal@acme.com", color: "purple", status: "pending" },
    ],
    documentCount: 2,
    expiryDate: addDays(new Date(), 3).toISOString(),
    createdAt: subDays(new Date(), 5).toISOString(),
    updatedAt: subDays(new Date(), 2).toISOString(),
  },
  {
    id: "env_005",
    title: "Software License Agreement",
    status: "expired",
    roles: [
      { id: "r9", name: "IT Director", email: "it@acme.com", color: "orange", status: "pending" },
    ],
    documentCount: 1,
    expiryDate: subDays(new Date(), 2).toISOString(),
    createdAt: subDays(new Date(), 20).toISOString(),
    updatedAt: subDays(new Date(), 15).toISOString(),
  },
  {
    id: "env_006",
    title: "Office Lease Renewal 2026",
    status: "signed",
    roles: [
      { id: "r10", name: "CEO", email: "ceo@acme.com", color: "blue", status: "completed" },
      { id: "r11", name: "Landlord", email: "prop@realty.com", color: "red", status: "completed" },
    ],
    documentCount: 4,
    completedAt: subDays(new Date(), 3).toISOString(),
    createdAt: subDays(new Date(), 15).toISOString(),
    updatedAt: subDays(new Date(), 3).toISOString(),
  },
  {
    id: "env_007",
    title: "Consulting Services Agreement",
    status: "pending",
    roles: [
      { id: "r12", name: "Consultant", email: "c@consulting.com", color: "green", status: "pending" },
      { id: "r13", name: "Client", email: "client@corp.com", color: "purple", status: "pending" },
    ],
    documentCount: 1,
    expiryDate: addDays(new Date(), 5).toISOString(),
    createdAt: subDays(new Date(), 1).toISOString(),
    updatedAt: subDays(new Date(), 1).toISOString(),
  },
  {
    id: "env_008",
    title: "Partnership MOU - Strategic Alliance",
    status: "draft",
    roles: [
      { id: "r14", name: "Partner A", email: "a@partner.com", color: "blue", status: "pending" },
      { id: "r15", name: "Partner B", email: "b@partner.com", color: "orange", status: "pending" },
    ],
    documentCount: 2,
    expiryDate: addDays(new Date(), 21).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ─── Service Functions ────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const envelopeService = {
  async list(filters: EnvelopeFilters = {}): Promise<EnvelopeListResponse> {
    await delay(400);

    let items = [...MOCK_ENVELOPES];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter((e) => e.title.toLowerCase().includes(q));
    }

    if (filters.status && filters.status !== "all") {
      items = items.filter((e) => e.status === filters.status);
    }

    const total = items.length;
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 10;
    const start = (page - 1) * pageSize;
    items = items.slice(start, start + pageSize);

    return {
      items,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  },

  async get(id: string): Promise<Envelope> {
    await delay(300);
    const item = MOCK_ENVELOPES.find((e) => e.id === id);
    if (!item) throw new Error("Envelope not found");

    return {
      ...item,
      roles: item.roles.map((r, index) => ({ ...r, order: index + 1 })),
      description: "This is a sample envelope description.",
      annotations: [],
      signingOrderEnabled: false,
      reminderFrequency: "weekly",
      createdBy: "user_001",
      documents: [
        {
          id: "doc_001",
          name: "agreement.pdf",
          size: 524288,
          pageCount: 5,
          url: "/sample.pdf",
          order: 0,
          uploadedAt: item.createdAt,
        },
      ],
    };
  },

  async create(data: Partial<Envelope>): Promise<Envelope> {
    await delay(600);
    const id = `env_${Date.now()}`;
    const newItem: EnvelopeListItem = {
      id,
      title: data.title ?? "Untitled",
      status: (data.status as EnvelopeStatus) ?? "draft",
      roles: (data.roles ?? []).map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        color: r.color,
        status: r.status ?? "pending",
      })),
      documentCount: data.documents?.length ?? 1,
      expiryDate: data.expiryDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_ENVELOPES.push(newItem);

    return {
      id,
      title: data.title ?? "Untitled",
      description: data.description,
      status: (data.status as EnvelopeStatus) ?? "draft",
      roles: data.roles ?? [],
      documents: data.documents ?? [],
      annotations: [],
      signingOrderEnabled: data.signingOrderEnabled ?? false,
      expiryDate: data.expiryDate,
      reminderFrequency: data.reminderFrequency ?? "none",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "user_001",
    };
  },

  async update(id: string, data: Partial<Envelope>): Promise<Envelope> {
    await delay(400);
    const idx = MOCK_ENVELOPES.findIndex((e) => e.id === id);
    if (idx !== -1) {
      if (data.status) MOCK_ENVELOPES[idx].status = data.status as EnvelopeStatus;
      if (data.title) MOCK_ENVELOPES[idx].title = data.title;
      MOCK_ENVELOPES[idx].updatedAt = new Date().toISOString();
    }
    const existing = await envelopeService.get(id);
    return { ...existing, ...data, updatedAt: new Date().toISOString() };
  },

  async delete(id: string): Promise<void> {
    await delay(300);
    const idx = MOCK_ENVELOPES.findIndex((e) => e.id === id);
    if (idx !== -1) {
      MOCK_ENVELOPES.splice(idx, 1);
    }
  },

  async send(id: string): Promise<void> {
    await delay(500);
  },

  async duplicate(id: string): Promise<Envelope> {
    await delay(400);
    const existing = await envelopeService.get(id);
    return {
      ...existing,
      id: `env_${Date.now()}`,
      title: `Copy of ${existing.title}`,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async getStats() {
    await delay(300);
    return {
      totalEnvelopes: 142,
      pendingSignatures: 23,
      completedDocuments: 98,
      draftDocuments: 17,
      activeSigners: 31,
      trendsVsLastMonth: {
        totalEnvelopes: 12,
        pendingSignatures: -5,
        completedDocuments: 18,
        draftDocuments: 3,
      },
    };
  },

  async getActivity() {
    await delay(350);
    return [
      { id: "a1", envelopeId: "env_001", envelopeTitle: "Employment Agreement - John Smith", action: "envelope_viewed", actorName: "John Smith", timestamp: new Date(Date.now() - 300000).toISOString() },
      { id: "a2", envelopeId: "env_002", envelopeTitle: "NDA - Acme Corp & Widget Inc", action: "envelope_signed", actorName: "Bob Wilson", timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: "a3", envelopeId: "env_004", envelopeTitle: "Vendor Agreement - TechSupply Co", action: "role_signed", actorName: "Procurement Team", timestamp: new Date(Date.now() - 7200000).toISOString() },
      { id: "a4", envelopeId: "env_007", envelopeTitle: "Consulting Services Agreement", action: "envelope_sent", actorName: "You", timestamp: new Date(Date.now() - 86400000).toISOString() },
      { id: "a5", envelopeId: "env_006", envelopeTitle: "Office Lease Renewal 2026", action: "envelope_completed", actorName: "System", timestamp: new Date(Date.now() - 259200000).toISOString() },
    ];
  },
};
