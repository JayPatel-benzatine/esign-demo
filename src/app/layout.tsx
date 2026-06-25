import type { Metadata, Viewport } from "next";
import { Inter, Geist } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SignFlow — Enterprise E-Signature Platform",
    template: "%s | SignFlow",
  },
  description:
    "SignFlow is an enterprise-grade e-signature platform for seamless document signing, template management, and workflow automation.",
  keywords: ["e-signature", "document signing", "electronic signature", "workflow", "contracts"],
  authors: [{ name: "SignFlow" }],
  creator: "SignFlow",
  metadataBase: new URL("https://signflow.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://signflow.app",
    title: "SignFlow — Enterprise E-Signature Platform",
    description: "Enterprise document signing made simple.",
    siteName: "SignFlow",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f8fc" },
    { media: "(prefers-color-scheme: dark)", color: "#090910" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={inter.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
