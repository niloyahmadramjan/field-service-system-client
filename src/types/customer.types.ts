import type { IApiResponse, ICustomerProfile } from "@/types/auth.types";

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PageData<T> {
  data: T[];
  meta?: PageMeta;
}

export interface CustomerDashboardStats {
  myServiceRequests: number;
  pendingRequests: number;
  activeWorkOrders: number;
  completedServices: number;
  totalInvoices: number;
  paidInvoices: number;
}

export type CustomerDashboardResponse = IApiResponse<CustomerDashboardStats>;
export type DeleteServiceRequestResponse = IApiResponse<{ message: string }>;

export type CustomerListResponse<T> = IApiResponse<PageData<T> | T[]>;

export interface CustomerServiceRequest {
  id: string;
  requestNumber: string;
  serviceId: string;
  title: string;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  preferredDate: string;
  address: string;
  city: string;
  district: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  service?: { id: string; name: string; price?: string | number };
}

export interface CustomerWorkOrder {
  id: string;
  workOrderNumber: string;
  status: "CREATED" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  estimatedCost?: string | number | null;
  actualCost?: string | number | null;
  createdAt: string;
  completedAt?: string | null;
  serviceRequest?: CustomerServiceRequest & { service?: { name: string } };
  technician?: { user?: { name?: string; phone?: string } } | null;
  invoice?: { status: "DRAFT" | "ISSUED" | "PAID" | "CANCELLED" } | null;
  feedback?: CustomerFeedback | null;
}

export interface CustomerVisit {
  id: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string | null;
  actualEnd?: string | null;
  workOrder?: { workOrderNumber?: string; serviceRequest?: { title?: string; service?: { name?: string } } };
  technician?: { user?: { name?: string } };
}

export interface CustomerInvoice {
  id: string;
  invoiceNumber: string;
  amount: string | number;
  status: "DRAFT" | "ISSUED" | "PAID" | "CANCELLED";
  createdAt: string;
  dueDate?: string | null;
  workOrderId?: string;
  workOrder?: { workOrderNumber?: string; serviceRequest?: { service?: { name?: string }; title?: string } };
}

export interface CustomerPayment {
  id: string;
  transactionId?: string | null;
  amount: string | number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  method: "CASH" | "CARD" | "BANK_TRANSFER" | "BKASH" | "NAGAD" | "OTHER";
  createdAt: string;
  invoice?: { invoiceNumber?: string };
}

export type CustomerProfileResponse = IApiResponse<ICustomerProfile>;

export interface CustomerProfileUpdate {
  address: string;
  city: string;
  district: string;
}

export interface PaymentStartResponse {
  paymentId: string;
  paymentUrl: string;
}

export interface CustomerFeedback {
  id: string;
  workOrderId: string;
  rating: number;
  comment: string;
  createdAt: string;
  workOrder?: { workOrderNumber?: string; serviceRequest?: { title?: string; service?: { name?: string } } };
}

export interface FeedbackPayload {
  workOrderId: string;
  rating: number;
  comment: string;
}

export interface UpdateServiceRequestPayload {
  title: string;
  description: string;
  preferredDate: string;
  address: string;
  city: string;
  district: string;
}

export interface TechnicianApplication {
  id: string;
  applicationStatus: "PENDING" | "APPROVED" | "REJECTED";
  status?: "AVAILABLE" | "BUSY" | "OFFLINE";
  employeeId?: string;
  skills?: string[];
  createdAt?: string;
  updatedAt?: string;
}
