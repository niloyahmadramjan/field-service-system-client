"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks/auth.hook";
import { UserRole } from "@/types/auth.types";
import Logo from "../logo/Logo";
import { Loader, LucideClockFading } from "lucide-react";

const routes = [
  { name: "Home", url: "/" },
  { name: "Services", url: "/services" },
  { name: "My Requests", url: "/my-requests" },
];

const dashboardRoute: Record<UserRole, string> = {
  [UserRole.ADMIN]: "/admin",
  [UserRole.MANAGER]: "/manager",
  [UserRole.TECHNICIAN]: "/technician",
  [UserRole.CUSTOMER]: "/dashboard",
};

export default function HeaderSection() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetMe();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  // Assumes useGetMe returns { data: user }
  const user = data?.data;
  const role = user?.role as UserRole | undefined;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ["user"] });

        toast.add({
          title: "Logout successful",
          description: "You have been logged out successfully.",
          type: "success",
        });

        router.push("/");
        router.refresh();
      },
      onError: () => {
        toast.add({
          title: "Logout failed",
          description: "Something went wrong. Please try again.",
          type: "error",
        });
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3">
        {/* Logo */}
        <Logo />

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {routes.map((route) => (
            <Link
              key={route.url}
              href={route.url}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {route.name}
            </Link>
          ))}

          {role && (
            <Link
              href={dashboardRoute[role]}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Authentication */}
        {isLoading ? (
         <Loader  className="animate-spin"/>
        ) : (
          <div className="flex shrink-0 items-center gap-3">
            {!isLoading && !user && (
              <>
                <Button
                  variant="ghost"
                  render={<Link href="/login" />}
                  nativeButton={false}
                >
                  Login
                </Button>

                <Button render={<Link href="/register" />} nativeButton={false}>
                  Get Started
                </Button>
              </>
            )}

            {!isLoading && user && (
              <>
                <span className="hidden text-sm font-medium sm:inline">
                  {user.name}
                </span>

                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
