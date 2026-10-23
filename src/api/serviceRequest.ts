import apiClient from "@/lib/apiClient";
import { AdminRequestListParams, AdminRequestListResponse } from "@/types/serviceRequest.types";

export function getAdminRequests(params: AdminRequestListParams) {
  return apiClient<AdminRequestListResponse>("/request/admin", {
    query: {
      page: params.page,
      limit: params.limit,
      ...(params.status ? { status: params.status } : {}),
      ...(params.searchTerm ? { searchTerm: params.searchTerm } : {}),
    },
  });
}

export function approveServiceRequest(requestId: string) {
  return apiClient(`/request/admin/approve/${encodeURIComponent(requestId)}`, {
    method: "PATCH",
  });
}

export function rejectServiceRequest(requestId: string) {
  return apiClient(`/request/admin/reject/${encodeURIComponent(requestId)}`, {
    method: "PATCH",
  });
}
