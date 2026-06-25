import { SigningWorkspace } from "@/features/signing/SigningWorkspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Document",
  description: "Review and sign your document securely.",
};

export default async function SignPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  // token will be used for backend auth in production
  return <SigningWorkspace />;
}
