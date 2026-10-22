import type { ReactNode } from "react";
import { RoleDashboardShell } from "@/components/dashboard/role-dashboard-shell";

export const instant = false;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <RoleDashboardShell kind="admin">{children}</RoleDashboardShell>;
}
