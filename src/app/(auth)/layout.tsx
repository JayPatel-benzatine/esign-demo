import type { Metadata } from "next";

export const metadata: Metadata = { title: "SignFlow — Enterprise E-Signature" };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
