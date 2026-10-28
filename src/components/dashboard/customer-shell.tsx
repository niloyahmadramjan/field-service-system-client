"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { useDashboardLogout } from "@/hooks/auth.hook";
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
import { cn } from "@/lib/utils";
import {
  BriefcaseBusiness,
  Home,
  CreditCard,
  FileText,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  ReceiptText,
  UserRound,
  Wrench,
  LoaderCircle,
  LogOut,
} from "lucide-react";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Service requests", href: "/dashboard/requests", icon: FileText },
  { label: "Work orders", href: "/dashboard/work-orders", icon: Wrench },
  // { label: "Service visits", href: "/dashboard/visits", icon: CalendarDays },
  { label: "Invoices", href: "/dashboard/invoices", icon: ReceiptText },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { label: "Feedback", href: "/dashboard/feedback", icon: MessageSquareText },
  { label: "Apply as technician", href: "/dashboard/technician-application", icon: BriefcaseBusiness },
  { label: "My profile", href: "/dashboard/profile", icon: UserRound },
];

function NavLinks({ closeOnClick = false }: { closeOnClick?: boolean }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {navigation.map(({ label, href, icon: Icon }) => {
        const active =
          href === "/dashboard" ? pathname === href : pathname.startsWith(href);
        const className = cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          active
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        );
        return closeOnClick ? (
          <SheetClose
            key={href}
            render={<Link href={href} />}
            className={className}
          >
            <Icon className="size-4" />
            {label}
          </SheetClose>
        ) : (
          <Link key={href} href={href} className={className}>
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function CustomerShell({ children }: { children: ReactNode }) {
  const { logout, isLoggingOut } = useDashboardLogout();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex-1 bg-muted/30">
      <div className="flex items-center justify-between border-b bg-background px-4 py-3 lg:hidden">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Field service</p>
          <p className="font-semibold">Customer dashboard</p>
        </div>
        <Sheet>
          <SheetTrigger render={<Button variant="outline" size="icon" aria-label="Open customer dashboard menu" />}>
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>Customer portal</SheetTitle>
              <SheetDescription>Manage your services and account.</SheetDescription>
            </SheetHeader>
            <div className="space-y-4 px-4">
              <Suspense fallback={<div className="h-64" />}><NavLinks closeOnClick /></Suspense>
              <div className="border-t pt-4">
                <Button type="button" variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" onClick={logout} disabled={isLoggingOut}>
                  {isLoggingOut ? <LoaderCircle className="size-4 animate-spin" /> : <LogOut className="size-4" />}
                  {isLoggingOut ? "Logging out…" : "Log out"}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      {/* <header className="sticky top-[4.25rem] z-30 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Open dashboard menu"
                  />
                }
              >
                <Menu />
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>Customer portal</SheetTitle>
                  <SheetDescription>
                    Manage your services and account
                  </SheetDescription>
                </SheetHeader>
                <div className="px-4">
                  <Suspense fallback={<div className="h-64" />}>
                    <NavLinks closeOnClick />
                  </Suspense>
                </div>
              </SheetContent>
            </Sheet>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Field service
              </p>
              <p className="font-semibold">Customer dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/services"
              className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block"
            >
              Browse services
            </Link>
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                <AvatarImage
                  src={profile?.avatarUrl ?? undefined}
                  alt={profile?.name ?? "Customer"}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden max-w-36 truncate text-sm font-medium sm:block">
                {profile?.name ?? "Customer"}
              </span>
            </div>
          </div>
        </div>
      </header> */}
      <div className="mx-auto grid max-w-[1600px] flex-1 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="sticky top-32 hidden h-[calc(100vh-8rem)] flex-col border-r bg-background/70 px-4 py-7 lg:flex">
          <div className="mb-6 px-3">
            <Link
              href="/"
              className=" text-muted-foreground flex justify-between mb-3 px-3 text-md font-semibold uppercase tracking-wider"
            >
              <Home/> 
              <span>Back to home</span>
            </Link>
          </div>
          <Suspense fallback={<div className="h-64" />}>
            <NavLinks />
          </Suspense>
          <div className="mt-8 rounded-xl border bg-linear-to-br from-primary/10 to-background p-4">
            <p className="text-sm font-semibold">Need a service?</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Browse available services and request a visit.
            </p>
            <Button
              size="sm"
              className="mt-3 w-full"
              render={<Link href="/services" />}
              nativeButton={false}
            >
              Explore services
            </Button>
          </div>
          <div className="mt-auto border-t pt-5">
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={logout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <LogOut className="size-4" />
              )}
              {isLoggingOut ? "Logging out…" : "Log out"}
            </Button>
          </div>
        </aside>
        <div className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </div>
      {/* <DashboardFooter /> */}
    </div>
  );
}
