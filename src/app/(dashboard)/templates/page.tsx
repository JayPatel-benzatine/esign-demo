import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, LayoutTemplate, Star, Clock, Users, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Templates" };

const TEMPLATES = [
  { id: "t1", name: "Employment Agreement", category: "HR", uses: 47, roles: 2, description: "Standard employment contract with NDA and IP clauses" },
  { id: "t2", name: "Non-Disclosure Agreement", category: "Legal", uses: 132, roles: 2, description: "Mutual NDA for business partnerships" },
  { id: "t3", name: "Sales Contract", category: "Sales", uses: 29, roles: 3, description: "Service agreement with payment terms and deliverables" },
  { id: "t4", name: "Vendor Agreement", category: "Finance", uses: 18, roles: 3, description: "Vendor onboarding and procurement agreement" },
  { id: "t5", name: "Office Lease", category: "Real Estate", uses: 8, roles: 4, description: "Commercial property lease with renewal options" },
  { id: "t6", name: "Consulting Agreement", category: "General", uses: 64, roles: 2, description: "Independent contractor services agreement" },
];

const CATEGORY_COLORS: Record<string, string> = {
  HR: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Legal: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Sales: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Finance: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Real Estate": "bg-rose-500/10 text-rose-400 border-rose-500/20",
  General: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export default function TemplatesPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text)]">Templates</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Reusable annotation layouts for your documents</p>
        </div>
        <Button size="sm" id="create-template-btn">
          <Plus className="w-3.5 h-3.5" />
          New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {TEMPLATES.map((template) => (
          <Card key={template.id} className="group hover:border-[var(--text-subtle)] hover:shadow-glass transition-all duration-200 cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-muted)] flex items-center justify-center">
                  <LayoutTemplate className="w-5 h-5 text-[var(--text-muted)]" />
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[template.category]}`}>
                  {template.category}
                </span>
              </div>
              <CardTitle className="mt-3 text-sm">{template.name}</CardTitle>
              <p className="text-xs text-[var(--text-muted)]">{template.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] mb-4">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" /> {template.uses} uses
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {template.roles} roles
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1" id={`template-use-${template.id}`}>
                  Use Template
                </Button>
                <Button variant="secondary" size="sm" id={`template-edit-${template.id}`}>
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
