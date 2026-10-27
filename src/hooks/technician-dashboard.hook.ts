import { useQuery } from "@tanstack/react-query";
import { getTechnicianDashboard } from "@/api/technician-dashboard.api";

export const technicianDashboardKey = ["technician", "dashboard"] as const;

export function useTechnicianDashboard() {
  return useQuery({
    queryKey: technicianDashboardKey,
    queryFn: getTechnicianDashboard,
  });
}
