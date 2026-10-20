
import { CustomerShell } from "@/components/dashboard/customer-shell";
import type { ReactNode } from "react";

export const instant = false;

export default function CustomerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <CustomerShell>{children}</CustomerShell>;
}
