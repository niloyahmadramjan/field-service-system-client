import { UserRole } from "@/types/auth.types";

export function getDashboardRoute(role: UserRole | string | undefined) {
  switch (role?.toUpperCase()) {
    case UserRole.ADMIN:
    case UserRole.MANAGER:
      return "/admin/dashboard";
    case UserRole.TECHNICIAN:
      return "/technician/dashboard";
    case UserRole.CUSTOMER:
    default:
      return "/dashboard";
  }
}

export function getRoleFromResponse(value: unknown): UserRole | undefined {
  if (!value || typeof value !== "object") return undefined;

  const record = value as Record<string, unknown>;
  const role = record.role;
  if (typeof role === "string" && Object.values(UserRole).includes(role as UserRole)) {
    return role as UserRole;
  }

  return getRoleFromResponse(record.user) ?? getRoleFromResponse(record.data);
}
