export type WorkOrderStatus =
  | "CREATED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface WorkOrderPageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface WorkOrderService {
  id: string;
  name: string;
  description?: string | null;
  price?: string | number;
}

export interface WorkOrderRequest {
  id: string;
  requestNumber: string;
  title: string;
  description?: string | null;
  status: string;
  preferredDate?: string | null;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  service?: WorkOrderService | null;
}

export interface WorkOrderUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

export interface WorkOrderCustomer {
  id: string;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  user?: WorkOrderUser | null;
}

export interface WorkOrderTechnician {
  id: string;
  employeeId: string;
  status: string;
  applicationStatus: string;
  skills?: string | null;
  bio?: string | null;
  user: WorkOrderUser;
}

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  requestId: string;
  customerId: string;
  technicianId: string | null;
  title: string;
  description: string;
  status: WorkOrderStatus;
  estimatedCost: string | number | null;
  actualCost: string | number | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  request?: WorkOrderRequest | null;
  customer?: WorkOrderCustomer | null;
  technician?: WorkOrderTechnician | null;
  assignments?: Array<Record<string, unknown>>;
  visits?: Array<Record<string, unknown>>;
  serviceReport?: Record<string, unknown> | null;
  invoice?: Record<string, unknown> | null;
  feedback?: Record<string, unknown> | null;
}

export interface WorkOrderListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: WorkOrder[];
  meta: WorkOrderPageMeta;
}

export interface WorkOrderDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: WorkOrder;
}

export interface TechnicianListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: WorkOrderTechnician[];
  meta: WorkOrderPageMeta;
}

export interface WorkOrderListParams {
  page: number;
  limit: number;
  status?: WorkOrderStatus;
  searchTerm?: string;
}

export interface TechnicianListParams {
  page: number;
  limit: number;
  applicationStatus: "APPROVED";
}

export interface AssignTechnicianPayload {
  workOrderId: string;
  technicianId: string;
}

export interface UpdateWorkOrderStatusPayload {
  status: WorkOrderStatus;
}
