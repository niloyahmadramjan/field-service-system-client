import type { ReactNode } from "react";
import { RoleDashboardShell } from "@/components/dashboard/role-dashboard-shell";

export const instant = false;

export default function TechnicianLayout({ children }: { children: ReactNode }) {
  return <RoleDashboardShell kind="technician">{children}</RoleDashboardShell>;
}
