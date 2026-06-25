// ─── Role Types ──────────────────────────────────────────────────────────────

export type RoleColor = "blue" | "orange" | "green" | "purple" | "red";
export type RoleStatus = "pending" | "active" | "completed" | "locked";

export interface Role {
  id: string;
  name: string;
  email: string;
  color: RoleColor;
  order: number;
  status: RoleStatus;
  signedAt?: string;
}

export const ROLE_COLORS: Record<RoleColor, string> = {
  blue: "#3B82F6",
  orange: "#F97316",
  green: "#22C55E",
  purple: "#A855F7",
  red: "#EF4444",
};

export const ROLE_COLOR_CLASSES: Record<RoleColor, { bg: string; border: string; text: string; light: string }> = {
  blue: { bg: "bg-blue-500", border: "border-blue-500", text: "text-blue-500", light: "bg-blue-500/10" },
  orange: { bg: "bg-orange-500", border: "border-orange-500", text: "text-orange-500", light: "bg-orange-500/10" },
  green: { bg: "bg-green-500", border: "border-green-500", text: "text-green-500", light: "bg-green-500/10" },
  purple: { bg: "bg-purple-500", border: "border-purple-500", text: "text-purple-500", light: "bg-purple-500/10" },
  red: { bg: "bg-red-500", border: "border-red-500", text: "text-red-500", light: "bg-red-500/10" },
};
