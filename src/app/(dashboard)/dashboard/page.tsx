import { CustomerDashboard } from "@/components/dashboard/customer-dashboard";

export const prefetch = "partial";
export const instant = false;

export default function DashboardPage() {
  return <CustomerDashboard />;
}
