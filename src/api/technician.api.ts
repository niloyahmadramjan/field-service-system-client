import apiClient from "@/lib/apiClient";
import type {
  TechnicianActionResponse,
  TechnicianDetailResponse,
  TechnicianListParams,
  TechnicianListResponse,
} from "@/types/technician.types";

export function getTechnicians(params: TechnicianListParams) {
  return apiClient<TechnicianListResponse>("/technician", {
    query: {
      page: params.page,
      limit: params.limit,
      ...(params.applicationStatus ? { applicationStatus: params.applicationStatus } : {}),
      ...(params.searchTerm ? { searchTerm: params.searchTerm } : {}),
    },
  });
}

export function getTechnician(technicianId: string) {
  return apiClient<TechnicianDetailResponse>(`/technician/${encodeURIComponent(technicianId)}`);
}

export function approveTechnician(technicianId: string) {
  return apiClient<TechnicianActionResponse>(`/technician/approve/${encodeURIComponent(technicianId)}`, {
    method: "PATCH",
  });
}

export function rejectTechnician(technicianId: string) {
  return apiClient<TechnicianActionResponse>(`/technician/reject/${encodeURIComponent(technicianId)}`, {
    method: "PATCH",
  });
}

export function deleteTechnician(technicianId: string) {
  return apiClient<TechnicianActionResponse>(`/technician/${encodeURIComponent(technicianId)}`, {
    method: "DELETE",
  });
}
