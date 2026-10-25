"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, ShieldAlert } from "lucide-react";
import { useGetMe } from "@/hooks/auth.hook";
import { UserRole } from "@/types/auth.types";
import { getDashboardRoute } from "@/lib/dashboard-route";

type DashboardRole = "customer" | "operations" | "technician";

const allowedRoles: Record<DashboardRole, readonly UserRole[]> = {
  customer: [UserRole.CUSTOMER],
  operations: [UserRole.ADMIN, UserRole.MANAGER],
  technician: [UserRole.TECHNICIAN],
};

export function RoleRouteGuard({ role, children }: { role: DashboardRole; children: ReactNode }) {
  const router = useRouter();
  const query = useGetMe();
  const profile = query.data?.data;
  const isAllowed = Boolean(profile && profile.status === "ACTIVE" && allowedRoles[role].includes(profile.role));

  useEffect(() => {
    if (query.isError || (query.isSuccess && !query.isFetching && !profile)) {
      router.replace("/login");
      return;
    }

    if (query.isSuccess && !query.isFetching && profile && !isAllowed) {
      if (profile.status !== "ACTIVE") router.replace("/login");
      else router.replace(getDashboardRoute(profile.role));
    }
  }, [isAllowed, profile, query.isError, query.isFetching, query.isSuccess, router]);

  if (isAllowed && !query.isFetching && !query.isError) return children;

  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center gap-3 px-4 text-center">
      {query.isError ? <ShieldAlert className="size-8 text-muted-foreground" /> : <LoaderCircle className="size-7 animate-spin text-muted-foreground" />}
      <p className="text-sm text-muted-foreground">
        {query.isError ? "Checking access and returning to sign in…" : "Checking your account access…"}
      </p>
    </div>
  );
}
