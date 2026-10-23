import apiClient from "@/lib/apiClient";
import type {
  AssignTechnicianPayload,
  TechnicianListParams,
  TechnicianListResponse,
  UpdateWorkOrderStatusPayload,
  WorkOrderDetailResponse,
  WorkOrderListParams,
  WorkOrderListResponse,
} from "@/types/work-order.types";

export function getWorkOrders(params: WorkOrderListParams) {
  return apiClient<WorkOrderListResponse>("/work-orders", {
    query: {
      page: params.page,
      limit: params.limit,
      ...(params.status ? { status: params.status } : {}),
      ...(params.searchTerm ? { searchTerm: params.searchTerm } : {}),
    },
  });
}

export function getWorkOrder(workOrderId: string) {
  return apiClient<WorkOrderDetailResponse>(
    `/work-orders/${encodeURIComponent(workOrderId)}`,
  );
}

export function getApprovedTechnicians(params: TechnicianListParams) {
  return apiClient<TechnicianListResponse>("/technician", {
    query: {
      applicationStatus: params.applicationStatus,
      page: params.page,
      limit: params.limit,
    },
  });
}

export function assignTechnician(payload: AssignTechnicianPayload) {
  return apiClient("/assignments", {
    method: "POST",
    body: payload,
  });
}

export function updateWorkOrderStatus(
  workOrderId: string,
  payload: UpdateWorkOrderStatusPayload,
) {
  return apiClient(`/work-orders/${encodeURIComponent(workOrderId)}/status`, {
    method: "PATCH",
    body: payload,
  });
}
