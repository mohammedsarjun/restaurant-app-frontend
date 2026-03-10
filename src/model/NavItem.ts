import type { ReactNode } from "react";

export type ViewType = "user" | "admin" | "details";

export interface NavItem {
  key: ViewType;
  label: string;
  icon: ReactNode;
}
