import type { ReactNode } from "react";
import { RoleDashboardShell } from "@/components/dashboard/role-dashboard-shell";
import { RoleRouteGuard } from "@/components/auth/role-route-guard";

export const instant = false;

export default function TechnicianLayout({ children }: { children: ReactNode }) {
  return <RoleRouteGuard role="technician"><RoleDashboardShell kind="technician">{children}</RoleDashboardShell></RoleRouteGuard>;
}
