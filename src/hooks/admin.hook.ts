import { getOperationsDashboard } from "@/api/admin.api";
import { useGetMe } from "@/hooks/auth.hook";
import { useQuery } from "@tanstack/react-query";
import { UserRole } from "@/types/auth.types";

export function useGetAdminDashboard() {
  const userQuery = useGetMe();
  const role = userQuery.data?.data?.role;
  const dashboardQuery = useQuery({
    queryKey: ["operations-dashboard", role],
    queryFn: () => getOperationsDashboard(role as UserRole.ADMIN | UserRole.MANAGER),
    enabled: role === UserRole.ADMIN || role === UserRole.MANAGER,
  });

  return {
    ...dashboardQuery,
    isLoading: userQuery.isLoading || dashboardQuery.isLoading,
    isError: userQuery.isError || dashboardQuery.isError,
    error: dashboardQuery.error ?? userQuery.error,
    role,
  };
}
