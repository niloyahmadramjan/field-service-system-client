import { CustomerShell } from "@/components/dashboard/customer-shell";
import { RoleRouteGuard } from "@/components/auth/role-route-guard";
import type { ReactNode } from "react";

export const instant = false;

export default function CustomerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <RoleRouteGuard role="customer"><CustomerShell>{children}</CustomerShell></RoleRouteGuard>;
}
