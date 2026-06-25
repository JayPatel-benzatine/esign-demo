// ─── Annotation Types ─────────────────────────────────────────────────────────

export type AnnotationType =
  | "text"
  | "email"
  | "number"
  | "phone"
  | "password"
  | "textarea"
  | "date"
  | "datetime"
  | "currency"
  | "checkbox"
  | "radio"
  | "select"
  | "file"
  | "signature"
  | "initials";

export interface AnnotationPosition {
  x: number;
  y: number;
}

export interface AnnotationSize {
  width: number;
  height: number;
}

export interface AnnotationValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  characterLimit?: number;
  dateFormat?: string;
  selectOptions?: string[];
  radioGroup?: string;
  radioValue?: string;
  signatureType?: "draw" | "type" | "upload" | "any";
}

export interface Annotation {
  id: string;
  type: AnnotationType;
  roleId: string;
  pageNumber: number;
  position: AnnotationPosition;
  size: AnnotationSize;
  required: boolean;
  readOnly: boolean;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  validation?: AnnotationValidation;
  prefillVariable?: string;
  tabIndex?: number;
  createdAt: string;
  updatedAt: string;
}

export const ANNOTATION_TYPE_LABELS: Record<AnnotationType, string> = {
  text: "Text",
  email: "Email",
  number: "Number",
  phone: "Phone",
  password: "Password",
  textarea: "Text Area",
  date: "Date",
  datetime: "Date & Time",
  currency: "Currency",
  checkbox: "Checkbox",
  radio: "Radio",
  select: "Dropdown",
  file: "File Upload",
  signature: "Signature",
  initials: "Initials",
};

export const ANNOTATION_DEFAULT_SIZES: Record<AnnotationType, AnnotationSize> = {
  text: { width: 180, height: 36 },
  email: { width: 220, height: 36 },
  number: { width: 120, height: 36 },
  phone: { width: 160, height: 36 },
  password: { width: 180, height: 36 },
  textarea: { width: 220, height: 80 },
  date: { width: 160, height: 36 },
  datetime: { width: 200, height: 36 },
  currency: { width: 140, height: 36 },
  checkbox: { width: 24, height: 24 },
  radio: { width: 24, height: 24 },
  select: { width: 180, height: 36 },
  file: { width: 180, height: 48 },
  signature: { width: 220, height: 80 },
  initials: { width: 100, height: 60 },
};
