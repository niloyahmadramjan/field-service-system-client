import apiClient from "@/lib/apiClient";
import type { AssignmentDetailResponse, AssignmentListParams, AssignmentListResponse } from "@/types/assignment.types";

export function getAssignments(params: AssignmentListParams) {
  return apiClient<AssignmentListResponse>("/assignments", { query: params });
}

export function getAssignment(assignmentId: string) {
  return apiClient<AssignmentDetailResponse>(`/assignments/${encodeURIComponent(assignmentId)}`);
}

export function acceptAssignment(assignmentId: string) {
  return apiClient(`/assignments/${encodeURIComponent(assignmentId)}/accept`, { method: "PATCH" });
}

export function rejectAssignment(assignmentId: string) {
  return apiClient(`/assignments/${encodeURIComponent(assignmentId)}/reject`, { method: "PATCH" });
}
