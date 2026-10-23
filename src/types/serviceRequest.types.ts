
export type ServiceRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface AdminServiceRequest {
  id: string;
  requestNumber: string;
  title: string;
  description: string;
  status: ServiceRequestStatus;
  preferredDate: string | null;
  address: string;
  city: string | null;
  district: string | null;
  createdAt: string;
  customer?: {
    id: string;
    user?: { name?: string; email?: string; phone?: string | null };
  } | null;
  service?: { id: string; name: string; price?: string | number } | null;
  workOrder?: { id: string; workOrderNumber: string; status: string } | null;
}

export interface RequestPageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminRequestListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data:AdminServiceRequest[] & {
    meta: RequestPageMeta;
  };
}

export interface AdminRequestListParams {
  page: number;
  limit: number;
  status?: ServiceRequestStatus;
  searchTerm?: string;
}
