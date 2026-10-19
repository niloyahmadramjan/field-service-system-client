"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks/auth.hook";
import { UserRole } from "@/types/auth.types";
import Logo from "../logo/Logo";
import { Loader, Menu } from "lucide-react";

const routes = [
  { name: "Home", url: "/" },
  { name: "Services", url: "/services" },
  { name: "How it works", url: "/#how-it-works" },
  { name: "For every role", url: "/#roles" },
  { name: "FAQ", url: "/#faq" },
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
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Logo />

        {/* Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {routes.map((route) => (
            <Link
              key={route.name}
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

        {/* Auth + mobile menu */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {isLoading ? (
            <Loader className="animate-spin" />
          ) : (
            <>
              {!user && (
                <>
                  <Button
                    variant="ghost"
                    render={<Link href="/login" />}
                    nativeButton={false}
                    className="hidden sm:inline-flex"
                  >
                    Login
                  </Button>

                  <Button
                    render={<Link href="/register" />}
                    nativeButton={false}
                  >
                    Get Started
                  </Button>
                </>
              )}

              {user && (
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
            </>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu />
            </SheetTrigger>

            <SheetContent side="right" className="w-72 sm:max-w-sm">
              <SheetHeader className="border-b pb-4">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Main navigation menu
                </SheetDescription>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-4">
                {routes.map((route) => (
                  <SheetClose
                    key={route.name}
                    render={<Link href={route.url} />}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {route.name}
                  </SheetClose>
                ))}

                {role && (
                  <SheetClose
                    render={<Link href={dashboardRoute[role]} />}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    Dashboard
                  </SheetClose>
                )}
              </nav>

              <div className="mt-auto flex flex-col gap-2 border-t p-4">
                {!user ? (
                  <>
                    <SheetClose
                      render={<Link href="/login" />}
                      className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      Login
                    </SheetClose>
                    <SheetClose
                      render={<Link href="/register" />}
                      className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Get Started
                    </SheetClose>
                  </>
                ) : (
                  <SheetClose
                    render={<button type="button" />}
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-destructive/10 px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
