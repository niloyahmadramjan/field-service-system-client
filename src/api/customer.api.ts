import apiClient from "@/lib/apiClient";
import type { IApiResponse } from "@/types/auth.types";
import type {
  CustomerInvoice,
  CustomerListResponse,
  CustomerPayment,
  CustomerProfileResponse,
  CustomerProfileUpdate,
  CustomerServiceRequest,
  CustomerVisit,
  CustomerWorkOrder,
  CustomerFeedback,
  FeedbackPayload,
  PaymentStartResponse,
  TechnicianApplication,
  UpdateServiceRequestPayload,
  CustomerDashboardResponse,
  DeleteServiceRequestResponse,
} from "@/types/customer.types";

const listOptions = { query: { page: 1, limit: 10 } };

export const getCustomerDashboard = () =>
  apiClient<CustomerDashboardResponse>("/dashboard/customer");
export const getMyRequests = (page = 1, limit = 10) =>
  apiClient<CustomerListResponse<CustomerServiceRequest>>("/request", {
    query: { page, limit },
  });
export const getMyRequest = (requestId: string) =>
  apiClient<IApiResponse<CustomerServiceRequest>>(
    `/request/${encodeURIComponent(requestId)}`,
  );
export const updateServiceRequest = ({
  requestId,
  payload,
}: {
  requestId: string;
  payload: UpdateServiceRequestPayload;
}) =>
  apiClient<IApiResponse<CustomerServiceRequest>>(
    `/request/${encodeURIComponent(requestId)}`,
    { method: "PATCH", body: payload },
  );
export const deleteServiceRequest = (requestId: string) =>
  apiClient<DeleteServiceRequestResponse>(
    `/request/${encodeURIComponent(requestId)}`,
    { method: "DELETE" },
  );
export const getMyWorkOrders = () =>
  apiClient<CustomerListResponse<CustomerWorkOrder>>(
    "/work-orders/",
    listOptions,
  );
export const getMyVisits = () =>
  apiClient<CustomerListResponse<CustomerVisit>>(
    "/service-visits/",
    listOptions,
  );
export const getMyInvoices = () =>
  apiClient<CustomerListResponse<CustomerInvoice>>(
    "/invoices/",
    listOptions,
  );
export const getMyPayments = () =>
  apiClient<CustomerListResponse<CustomerPayment>>(
    "/payments/my",
    listOptions,
  );
export const getCustomerProfile = () =>
  apiClient<CustomerProfileResponse>("/customer/get");
export const updateCustomerProfile = (payload: CustomerProfileUpdate) =>
  apiClient<CustomerProfileResponse>("/customer/update", {
    method: "PUT",
    body: payload,
  });
export const startInvoicePayment = (invoiceId: string) =>
  apiClient<IApiResponse<PaymentStartResponse>>(
    `/payments/${encodeURIComponent(invoiceId)}/pay`,
    { method: "POST" },
  );
export const getMyFeedback = () =>
  apiClient<CustomerListResponse<CustomerFeedback>>(
    "/feedbacks",
    listOptions,
  );
export const submitFeedback = (payload: FeedbackPayload) =>
  apiClient<IApiResponse<CustomerFeedback>>("/feedbacks", {
    method: "POST",
    body: payload,
  });
export const getTechnicianApplication = () =>
  apiClient<IApiResponse<TechnicianApplication | null>>(
    "/technician/my-application",
  );
