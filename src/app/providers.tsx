"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import { queryClient } from "@/lib/queryClient";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange={false}
      >
        <NextTopLoader
          color="oklch(0.58 0.24 264)"
          showSpinner={false}
          height={2}
          shadow={false}
        />
        <TooltipProvider delay={300}>
          {children}
        </TooltipProvider>
        <Toaster
          position="bottom-right"
          expand={false}
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
            },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
