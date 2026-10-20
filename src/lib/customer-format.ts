import type { CustomerListResponse } from "@/types/customer.types";

export function listItems<T>(response: CustomerListResponse<T> | undefined): T[] {
  if (!response) return [];
  const content = response.data;
  return Array.isArray(content) ? content : content.data;
}

export function listPageMeta<T>(response: CustomerListResponse<T> | undefined) {
  if (!response || Array.isArray(response.data)) return undefined;
  return response.data.meta;
}

export function displayDate(value?: string | null, includeTime = false) {
  if (!value) return "—";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en", includeTime
    ? { dateStyle: "medium", timeStyle: "short" }
    : { dateStyle: "medium" }).format(date);
}

export function displayMoney(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return "—";
  const amount = Number(value);
  return Number.isFinite(amount) ? new Intl.NumberFormat("en", { style: "currency", currency: "BDT", maximumFractionDigits: 2 }).format(amount) : `${value} BDT`;
}
