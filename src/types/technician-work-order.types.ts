import type {
  WorkOrder,
  WorkOrderDetailResponse,
} from "@/types/work-order.types";

export type TechnicianWorkOrder = WorkOrder;

export interface TechnicianWorkOrdersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: TechnicianWorkOrder[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TechnicianWorkOrderListParams {
  page: number;
  limit: number;
  searchTerm?: string;
}

export type TechnicianWorkOrderDetailResponse = WorkOrderDetailResponse;
