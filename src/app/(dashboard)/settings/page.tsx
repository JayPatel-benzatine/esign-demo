import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, CreditCard, Palette } from "lucide-react";

export const metadata: Metadata = { title: "Settings" };

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-brand-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
      <Label className="pt-2 text-xs">{label}</Label>
      <div>{children}</div>
    </div>
  );
}

function Toggle({ label, description, defaultChecked = false }: { label: string; description: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
      <div>
        <p className="text-sm font-medium text-[var(--text)]">{label}</p>
        <p className="text-xs text-[var(--text-muted)]">{description}</p>
      </div>
      <div className="relative w-10 h-6 flex-shrink-0">
        <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
        <div className="w-10 h-6 rounded-full bg-[var(--bg-muted)] border border-[var(--border)] peer-checked:bg-brand-500 transition-all cursor-pointer" />
        <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all peer-checked:translate-x-4" />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-[800px] mx-auto space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-[var(--text)]">Settings</h1>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Section title="Profile" icon={User}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full gradient-brand flex items-center justify-center text-white text-xl font-bold">
            SJ
          </div>
          <div>
            <Button variant="secondary" size="sm">Change Photo</Button>
            <p className="text-xs text-[var(--text-muted)] mt-1">JPG, PNG up to 2MB</p>
          </div>
        </div>
        <Field label="Full Name">
          <Input defaultValue="Sarah Johnson" className="max-w-sm" id="settings-name" />
        </Field>
        <Field label="Email">
          <Input type="email" defaultValue="sarah@acme.com" className="max-w-sm" id="settings-email" />
        </Field>
        <Field label="Company">
          <Input defaultValue="Acme Corp" className="max-w-sm" id="settings-company" />
        </Field>
        <Field label="Job Title">
          <Input defaultValue="HR Director" className="max-w-sm" id="settings-title" />
        </Field>
        <div className="flex justify-end pt-2">
          <Button size="sm" id="settings-save-profile-btn">Save Changes</Button>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={Bell}>
        <Toggle label="Email notifications" description="Get notified when documents are signed or need your attention" defaultChecked />
        <Toggle label="Document expiry alerts" description="Remind me 3 days before a document expires" defaultChecked />
        <Toggle label="New signer activity" description="Notify when a signer views or signs a document" defaultChecked />
        <Toggle label="Weekly summary" description="Receive a weekly digest of your envelope activity" />
      </Section>

      {/* Security */}
      <Section title="Security" icon={Shield}>
        <Field label="Current Password">
          <Input type="password" placeholder="••••••••" className="max-w-sm" id="settings-current-pw" />
        </Field>
        <Field label="New Password">
          <Input type="password" placeholder="••••••••" className="max-w-sm" id="settings-new-pw" />
        </Field>
        <Field label="Confirm Password">
          <Input type="password" placeholder="••••••••" className="max-w-sm" id="settings-confirm-pw" />
        </Field>
        <Toggle label="Two-factor authentication" description="Add an extra layer of security to your account" />
        <div className="flex justify-end pt-2">
          <Button size="sm" id="settings-save-security-btn">Update Password</Button>
        </div>
      </Section>

      {/* Billing */}
      <Section title="Billing" icon={CreditCard}>
        <div className="flex items-center justify-between p-4 rounded-xl bg-brand-500/5 border border-brand-500/20">
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">Business Plan</p>
            <p className="text-xs text-[var(--text-muted)]">$49/month · Renews Jan 1, 2027</p>
          </div>
          <Button variant="secondary" size="sm" id="settings-upgrade-btn">Upgrade Plan</Button>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium text-[var(--text-muted)]">Payment Method</p>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)]">
            <div className="w-8 h-5 rounded bg-blue-600 flex items-center justify-center text-white text-[8px] font-bold">VISA</div>
            <p className="text-sm text-[var(--text)]">•••• •••• •••• 4242</p>
            <p className="text-xs text-[var(--text-muted)] ml-auto">Exp 12/26</p>
          </div>
        </div>
      </Section>
    </div>
  );
}
