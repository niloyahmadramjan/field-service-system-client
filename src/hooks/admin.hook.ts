// getAdminDashboard

import { getAdminDashboard } from "@/api/admin.api";
import { getMe } from "@/api/auth.api";
import { useQuery } from "@tanstack/react-query";

export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
  });
}

export function useGetAdminDashboard() {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
  });
}
