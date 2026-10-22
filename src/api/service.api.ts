import apiClient from "@/lib/apiClient";
import type {
  ServiceListResponse,
  ServiceRequestPayload,
  ServiceRequestResponse,
  ServiceResponse,
} from "@/types/service.types";

export function getServices(page = 1, limit = 9) {
  return apiClient<ServiceListResponse>("/service/get-all", {
    query: { page, limit },
  });
}

export function getService(serviceId: string) {
  return apiClient<ServiceResponse>(
    `/service/get/${encodeURIComponent(serviceId)}`,
  );
}

export function requestService(
  serviceId: string,
  payload: ServiceRequestPayload,
) {
  return apiClient<ServiceRequestResponse>(
    `/request/service/${encodeURIComponent(serviceId)}`,
    { method: "POST", body: payload },
  );
}
