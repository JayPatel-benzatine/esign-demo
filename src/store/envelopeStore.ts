import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Envelope, EnvelopeDocument } from "@/types/envelope";
import type { Role } from "@/types/role";

type WizardStep = 1 | 2 | 3 | 4 | 5;

interface WizardData {
  title: string;
  description: string;
  expiryDate: string;
  reminderFrequency: string;
  documents: (EnvelopeDocument & { file?: File; progress?: number })[];
  roles: Role[];
  signingOrderEnabled: boolean;
}

interface EnvelopeState {
  // Current wizard
  wizardStep: WizardStep;
  wizardData: WizardData;
  currentEnvelopeId: string | null;

  // Actions
  setWizardStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateWizardData: (data: Partial<WizardData>) => void;
  resetWizard: () => void;
  setCurrentEnvelopeId: (id: string | null) => void;
}

const DEFAULT_WIZARD_DATA: WizardData = {
  title: "",
  description: "",
  expiryDate: "",
  reminderFrequency: "none",
  documents: [],
  roles: [],
  signingOrderEnabled: false,
};

export const useEnvelopeStore = create<EnvelopeState>()(
  devtools(
    (set, get) => ({
      wizardStep: 1,
      wizardData: DEFAULT_WIZARD_DATA,
      currentEnvelopeId: null,

      setWizardStep: (step) => set({ wizardStep: step }),
      nextStep: () => set((state) => ({ wizardStep: Math.min(5, state.wizardStep + 1) as WizardStep })),
      prevStep: () => set((state) => ({ wizardStep: Math.max(1, state.wizardStep - 1) as WizardStep })),
      updateWizardData: (data) => set((state) => ({ wizardData: { ...state.wizardData, ...data } })),
      resetWizard: () => set({ wizardStep: 1, wizardData: DEFAULT_WIZARD_DATA, currentEnvelopeId: null }),
      setCurrentEnvelopeId: (id) => set({ currentEnvelopeId: id }),
    }),
    { name: "envelope-store" }
  )
);
