"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  FileText,
  LayoutTemplate,
  PenTool,
  Variable,
  ClipboardList,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard",        href: "/",            icon: LayoutDashboard },
  { label: "Envelopes",        href: "/envelopes",   icon: FileText },
  { label: "Templates",        href: "/templates",   icon: LayoutTemplate },
  { label: "Signatures",       href: "/signatures",  icon: PenTool },
  { label: "Prefill Variables",href: "/prefill",     icon: Variable },
  { label: "Audit Logs",       href: "/audit-logs",  icon: ClipboardList },
  { label: "Settings",         href: "/settings",    icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r bg-sidebar transition-all duration-300 ease-in-out shrink-0",
        sidebarCollapsed ? "w-[56px]" : "w-[220px]"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 h-14 border-b shrink-0",
        sidebarCollapsed && "justify-center px-0"
      )}>
        <div className="flex-shrink-0 w-7 h-7 rounded-lg gradient-brand flex items-center justify-center shadow-sm">
          <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        {!sidebarCollapsed && (
          <span className="font-bold text-sm tracking-tight text-sidebar-foreground">
            Sign<span className="text-gradient">Flow</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          const linkContent = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                isActive && "bg-sidebar-primary/10 text-sidebar-primary dark:text-sidebar-primary",
                sidebarCollapsed && "justify-center px-0 w-9 h-9 mx-auto"
              )}
              id={`nav-${item.href.replace("/", "").replace("-", "")}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="truncate flex-1">{item.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" />}
                </>
              )}
            </Link>
          );

          if (sidebarCollapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger render={linkContent} />
                <TooltipContent side="right" className="text-xs">{item.label}</TooltipContent>
              </Tooltip>
            );
          }

          return linkContent;
        })}
      </nav>

      <Separator />

      {/* Collapse Toggle */}
      <div className="p-2">
        <Button
          variant="ghost"
          size={sidebarCollapsed ? "icon" : "sm"}
          onClick={toggleSidebar}
          className={cn("w-full justify-start gap-2", sidebarCollapsed && "justify-center")}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          id="sidebar-toggle-btn"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
