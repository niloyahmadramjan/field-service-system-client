"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  Activity,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  FileChartColumn,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
  Wrench,
} from "lucide-react";
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

const navigation = {
  admin: [
    { label: "Overview", path: "", icon: LayoutDashboard },
    { label: "Users", path: "users", icon: Users },
    { label: "Services", path: "services", icon: Wrench },
    { label: "Service requests", path: "requests", icon: ClipboardList },
    { label: "Work orders", path: "work-orders", icon: BriefcaseBusiness },
    { label: "Reports", path: "reports", icon: FileChartColumn },
    { label: "Settings", path: "settings", icon: Settings },
  ],
  technician: [
    { label: "Overview", path: "dashboard", icon: LayoutDashboard },
    { label: "Assigned jobs", path: "jobs", icon: BriefcaseBusiness },
    { label: "Schedule", path: "schedule", icon: CalendarDays },
    { label: "Work orders", path: "work-orders", icon: ClipboardList },
    { label: "Profile", path: "profile", icon: Users },
  ],
} as const;

type DashboardKind = keyof typeof navigation;

function DashboardNavigation({
  kind,
  closeOnClick = false,
}: {
  kind: DashboardKind;
  closeOnClick?: boolean;
}) {
  const pathname = usePathname();
  const base = kind === "admin" ? "/admin" : "/technician";
  const title = kind === "admin" ? "Operations dashboard" : "Technician dashboard";

  return (
    <nav aria-label={`${title} navigation`} className="space-y-1">
      {navigation[kind].map(({ label, path, icon: Icon }) => {
        const href = path ? `${base}/${path}` : base;
        const active = pathname === href || (path !== "" && pathname.startsWith(`${href}/`));
        const className = cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          active
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        );

        if (closeOnClick) {
          return (
            <SheetClose key={path || "overview"} render={<Link href={href} />} className={className}>
              <Icon className="size-4" />
              {label}
            </SheetClose>
          );
        }

        return (
          <Link key={path || "overview"} href={href} aria-current={active ? "page" : undefined} className={className}>
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function RoleDashboardShell({
  kind,
  children,
}: {
  kind: DashboardKind;
  children: ReactNode;
}) {
  const isAdmin = kind === "admin";
  const base = isAdmin ? "/admin" : "/technician";
  const title = isAdmin ? "Operations dashboard" : "Technician dashboard";

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="sticky top-0 hidden h-screen flex-col border-r bg-background/70 px-4 py-7 lg:flex">
          <Link href={base} className="mb-8 flex items-center gap-3 px-2">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Activity className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-bold">Field Service</span>
              <span className="block text-xs text-muted-foreground">{title}</span>
            </span>
          </Link>

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
          <DashboardNavigation kind={kind} />

          <div className="mt-auto rounded-xl border bg-gradient-to-br from-primary/10 to-background p-4">
            <p className="text-sm font-semibold">Workspace ready</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Open a section to manage your field service work.
            </p>
          </div>
        </aside>

        <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-4 lg:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="outline" size="icon" aria-label="Open dashboard menu" />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>{title}</SheetTitle>
                  <SheetDescription>Manage your field service workspace</SheetDescription>
                </SheetHeader>
                <div className="px-4">
                  <DashboardNavigation kind={kind} closeOnClick />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
