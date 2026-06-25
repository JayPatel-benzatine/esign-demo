// ─── Signing Types ────────────────────────────────────────────────────────────

export type SignatureData = {
  type: "draw" | "type" | "upload";
  dataUrl: string;
  fontFamily?: string;
  text?: string;
};

export interface SigningSession {
  token: string;
  envelopeId: string;
  roleId: string;
  roleName: string;
  signerEmail: string;
  signerName: string;
  expiresAt: string;
  completedAt?: string;
}

export interface SigningSubmission {
  annotationId: string;
  value: string;
  signatureData?: SignatureData;
}

export type ValidationError = {
  annotationId: string;
  message: string;
  fieldLabel: string;
};
