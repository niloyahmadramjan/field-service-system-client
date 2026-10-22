// {{baseUrl}}/api/v1/dashboard/admin

import apiClient from "@/lib/apiClient";

export function getAdminDashboard() {
  return apiClient("/dashboard/admin", {
    method: "GET",
  });
}
