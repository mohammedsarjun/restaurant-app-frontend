import type { ReactNode } from "react";

export type ViewType = "user" | "admin" | "details" | "admin_cuisines";

export interface NavItem {
  key: ViewType;
  label: string;
  icon: ReactNode;
}
