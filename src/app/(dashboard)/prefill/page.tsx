import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PREFILL_VARIABLES } from "@/types/template";
import { Variable, GripVertical, Plus } from "lucide-react";

export const metadata: Metadata = { title: "Prefill Variables" };

const employeeVars = PREFILL_VARIABLES.filter((v) => v.group === "employee");
const employerVars = PREFILL_VARIABLES.filter((v) => v.group === "employer");

export default function PrefillPage() {
  return (
    <div className="p-6 max-w-[900px] mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text)]">Prefill Variables</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Auto-populate document fields with dynamic data</p>
        </div>
        <Button size="sm" id="add-variable-btn">
          <Plus className="w-3.5 h-3.5" />
          Add Variable
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { title: "Employee Details", vars: employeeVars },
          { title: "Employer Details", vars: employerVars },
        ].map((group) => (
          <Card key={group.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Variable className="w-4 h-4 text-brand-500" />
                {group.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--border)]">
                {group.vars.map((v) => (
                  <div key={v.id} className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--bg-muted)] transition-colors group">
                    <GripVertical className="w-4 h-4 text-[var(--text-subtle)] cursor-grab opacity-0 group-hover:opacity-100 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text)]">{v.label}</p>
                      <code className="text-[10px] text-[var(--text-muted)] font-mono">{`{{${v.key}}}`}</code>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {v.group}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How to Use Prefill Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[
              { step: "1", title: "Create Variable", desc: "Add variables with keys like employee.firstName" },
              { step: "2", title: "Link to Field", desc: "In the annotator, drag a variable onto a text field" },
              { step: "3", title: "Prefill on Send", desc: "Provide values when sending — fields auto-populate" },
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <div className="w-6 h-6 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text)]">{item.title}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
