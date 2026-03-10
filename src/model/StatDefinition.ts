import type { ReactNode } from "react";

export interface StatDefinition {
  icon: ReactNode;
  label: string;
  value: string | number;
  color: string;
  trend?: string;
}
