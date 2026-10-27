import apiClient from "@/lib/apiClient";
import type { TechnicianDashboardResponse } from "@/types/technician-dashboard.types";

export function getTechnicianDashboard() {
  return apiClient<TechnicianDashboardResponse>("/dashboard/technician");
}
