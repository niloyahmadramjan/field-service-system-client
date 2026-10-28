// Admin and manager dashboard summaries.

import apiClient from "@/lib/apiClient";
import { UserRole, type IApiResponse } from "@/types/auth.types";
import type { OperationsDashboardStats } from "@/types/operations-dashboard.types";

export function getOperationsDashboard(role: UserRole.ADMIN | UserRole.MANAGER) {
  const endpoint = role === UserRole.MANAGER ? "/dashboard/manager" : "/dashboard/admin";
  return apiClient<IApiResponse<OperationsDashboardStats>>(endpoint);
}
