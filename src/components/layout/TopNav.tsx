"use client";

import { Bell, Search, Plus, Moon, Sun, ChevronDown, LogOut, User, CreditCard } from "lucide-react";
import { useTheme } from "next-themes";
import { useUIStore } from "@/store/uiStore";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

const NOTIFICATIONS = [
  { id: "n1", title: "John Smith signed the document", time: "5 min ago", unread: true },
  { id: "n2", title: "Vendor Agreement is expiring soon", time: "2 hr ago", unread: true },
  { id: "n3", title: "NDA completed successfully", time: "Yesterday", unread: false },
];

export function TopNav() {
  const { setCommandPaletteOpen } = useUIStore();
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40 shrink-0">
      {/* Search trigger */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex items-center gap-2 h-8 px-3 rounded-lg border bg-muted/40 hover:bg-muted transition-all text-sm text-muted-foreground min-w-[220px] group"
        id="global-search-trigger"
      >
        <Search className="w-3.5 h-3.5 group-hover:text-foreground transition-colors" />
        <span className="flex-1 text-left text-xs">Search everything...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground bg-background/80 font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Right Actions */}
      <div className="flex items-center gap-1">
        {/* New Envelope */}
        <Link
          href="/envelopes/create"
          className={buttonVariants({ variant: "default", size: "sm", className: "hidden sm:flex gap-1.5" })}
          id="topnav-new-envelope-btn"
        >
          <Plus className="w-3.5 h-3.5" />
          New Envelope
        </Link>

        <Separator orientation="vertical" className="h-5 mx-1" />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          id="theme-toggle-btn"
          aria-label="Toggle theme"
          className="size-8"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="relative size-8"
                id="notifications-btn"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background animate-pulse" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-80 p-0" id="notifications-dropdown">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="text-sm font-semibold">Notifications</span>
              <Button variant="ghost" size="xs" className="text-xs text-primary">Mark all read</Button>
            </div>
            <div className="divide-y">
              {NOTIFICATIONS.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "flex gap-3 px-4 py-3 hover:bg-muted cursor-pointer transition-colors",
                    n.unread && "bg-primary/5"
                  )}
                >
                  <div className={cn("mt-1.5 w-2 h-2 rounded-full shrink-0", n.unread ? "bg-primary" : "bg-transparent")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-snug">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 border-t text-center">
              <Button variant="ghost" size="xs" className="text-xs w-full">View all notifications</Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 px-2"
                id="user-menu-btn"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px] font-bold gradient-brand text-white">SJ</AvatarFallback>
                </Avatar>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-52" id="user-dropdown">
            <DropdownMenuLabel>
              <p className="font-medium text-sm">Sarah Johnson</p>
              <p className="text-xs font-normal text-muted-foreground">sarah@acme.com</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem id="menu-profile">
              <User className="w-4 h-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem id="menu-billing">
              <CreditCard className="w-4 h-4" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" id="menu-signout">
              <LogOut className="w-4 h-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
