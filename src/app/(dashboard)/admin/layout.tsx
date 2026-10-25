import type { ReactNode } from "react";
import { RoleDashboardShell } from "@/components/dashboard/role-dashboard-shell";
import { RoleRouteGuard } from "@/components/auth/role-route-guard";

export const instant = false;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <RoleRouteGuard role="operations"><RoleDashboardShell kind="admin">{children}</RoleDashboardShell></RoleRouteGuard>;
}
