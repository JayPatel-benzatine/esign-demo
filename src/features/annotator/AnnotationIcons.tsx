import {
  Type, Mail, Hash, Phone, Lock, AlignLeft, Calendar, CalendarClock,
  DollarSign, CheckSquare, CircleDot, ChevronDown, Paperclip, PenLine, Fingerprint,
} from "lucide-react";
import type { AnnotationType } from "@/types/annotation";
import type { LucideIcon } from "lucide-react";

export const ANNOTATION_ICONS: Record<AnnotationType, LucideIcon> = {
  text: Type,
  email: Mail,
  number: Hash,
  phone: Phone,
  password: Lock,
  textarea: AlignLeft,
  date: Calendar,
  datetime: CalendarClock,
  currency: DollarSign,
  checkbox: CheckSquare,
  radio: CircleDot,
  select: ChevronDown,
  file: Paperclip,
  signature: PenLine,
  initials: Fingerprint,
};

export function getAnnotationIcon(type: AnnotationType): LucideIcon {
  return ANNOTATION_ICONS[type] ?? Type;
}
