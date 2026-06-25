"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { FileText, LayoutTemplate, Settings, Zap, Plus, ArrowRight } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

const COMMANDS = [
  {
    group: "Navigation",
    items: [
      { id: "nav-dashboard",  label: "Dashboard",    icon: Zap,            href: "/",                  shortcut: "G H" },
      { id: "nav-envelopes",  label: "Envelopes",    icon: FileText,       href: "/envelopes",         shortcut: "G E" },
      { id: "nav-templates",  label: "Templates",    icon: LayoutTemplate, href: "/templates",         shortcut: "G T" },
      { id: "nav-settings",   label: "Settings",     icon: Settings,       href: "/settings",          shortcut: "G S" },
    ],
  },
  {
    group: "Actions",
    items: [
      { id: "action-new-envelope",  label: "Create New Envelope",  icon: Plus, href: "/envelopes/create" },
      { id: "action-new-template",  label: "Create New Template",  icon: Plus, href: "/templates" },
    ],
  },
  {
    group: "Recent Envelopes",
    items: [
      { id: "env-001", label: "Employment Agreement - John Smith",    icon: FileText, href: "/envelopes/env_001" },
      { id: "env-002", label: "NDA - Acme Corp & Widget Inc",         icon: FileText, href: "/envelopes/env_002" },
      { id: "env-004", label: "Vendor Agreement - TechSupply Co",     icon: FileText, href: "/envelopes/env_004" },
      { id: "env-007", label: "Consulting Services Agreement",        icon: FileText, href: "/envelopes/env_007" },
    ],
  },
];

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setCommandPaletteOpen]);

  const handleSelect = (href: string) => {
    setCommandPaletteOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog
      open={commandPaletteOpen}
      onOpenChange={setCommandPaletteOpen}
      aria-label="Command palette"
    >
      <CommandInput placeholder="Search envelopes, templates, settings..." />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-6">
            <span className="text-2xl">🔍</span>
            <p className="text-sm text-muted-foreground">No results found.</p>
          </div>
        </CommandEmpty>

        {COMMANDS.map((section, i) => (
          <div key={section.group}>
            {i > 0 && <CommandSeparator />}
            <CommandGroup heading={section.group}>
              {section.items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.label}
                  onSelect={() => handleSelect(item.href)}
                  className="gap-2.5 cursor-pointer"
                  id={item.id}
                >
                  <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center shrink-0">
                    <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <span className="flex-1">{item.label}</span>
                  {"shortcut" in item && item.shortcut && (
                    <CommandShortcut>{item.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
