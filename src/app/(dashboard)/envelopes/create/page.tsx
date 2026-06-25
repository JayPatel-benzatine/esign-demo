import { EnvelopeWizard } from "@/features/envelope-creator/EnvelopeWizard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create Envelope" };

export default function CreateEnvelopePage() {
  return (
    <div className="h-full animate-fade-in">
      <EnvelopeWizard />
    </div>
  );
}
