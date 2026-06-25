import { EnvelopeDetail } from "@/features/envelopes/EnvelopeDetail";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Envelope" };

export default async function EnvelopeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="h-full">
      <EnvelopeDetail envelopeId={id} />
    </div>
  );
}
