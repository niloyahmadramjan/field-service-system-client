import type { WorkOrderStatus } from "@/types/work-order.types";

export type AssignmentStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface AssignedWorkOrder {
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
}

export interface AssignedTechnician {
  id: string;
  employeeId: string;
  status: string;
  applicationStatus: string;
  skills: string | null;
  bio: string | null;
  user?: { id: string; name: string; email: string; phone: string | null };
}

export interface Assignment {
  id: string;
  workOrderId: string;
  technicianId: string;
  assignedById: string;
  status: AssignmentStatus;
  assignedAt: string;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  workOrder: AssignedWorkOrder;
  technician?: AssignedTechnician;
  assignedBy?: { id: string; name: string; email: string; phone: string | null };
}

export interface AssignmentListParams { page: number; limit: number; }
export interface AssignmentListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Assignment[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
export interface AssignmentDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Assignment | Assignment[];
}
