import apiClient from "@/lib/apiClient";
import type {
  TechnicianWorkOrderDetailResponse,
  TechnicianWorkOrderListParams,
  TechnicianWorkOrdersResponse,
} from "@/types/technician-work-order.types";
import type { UpdateWorkOrderStatusPayload, WorkOrderDetailResponse } from "@/types/work-order.types";

export function getMyWorkOrders(params: TechnicianWorkOrderListParams) {
  return apiClient<TechnicianWorkOrdersResponse>("/work-orders", {
    query: {
      page: params.page,
      limit: params.limit,
      ...(params.searchTerm ? { searchTerm: params.searchTerm } : {}),
    },
  });
}

export function getMyWorkOrder(workOrderId: string) {
  return apiClient<TechnicianWorkOrderDetailResponse>(
    `/work-orders/${encodeURIComponent(workOrderId)}`,
  );
}

export function updateMyWorkOrderStatus(workOrderId: string, payload: UpdateWorkOrderStatusPayload) {
  return apiClient<WorkOrderDetailResponse>(
    `/work-orders/${encodeURIComponent(workOrderId)}/status`,
    { method: "PATCH", body: payload },
  );
}
