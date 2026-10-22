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
  Settings,
  Users,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = {
  admin: [
    { label: "Overview", path: "dashboard", icon: LayoutDashboard },
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

export function RoleDashboardShell({
  kind,
  children,
}: {
  kind: DashboardKind;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const base = kind === "admin" ? "/admin" : "/technician";
  const title = kind === "admin" ? "Operations console" : "Technician portal";

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-64 shrink-0 flex-col border-r bg-background px-4 py-6 md:flex">
          <Link href={`${base}/dashboard`} className="mb-8 flex items-center gap-3 px-2">
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
          <nav aria-label={`${title} navigation`} className="space-y-1">
            {navigation[kind].map(({ label, path, icon: Icon }) => {
              const href = `${base}/${path}`;
              const active = pathname === href;
              return (
                <Link
                  key={path}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto rounded-xl border bg-muted/50 p-4">
            <p className="text-sm font-semibold">Workspace ready</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Dashboard sections are ready for their data and workflows.
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b bg-background px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3 md:hidden">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Activity className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">Field Service</p>
                <p className="text-xs text-muted-foreground">{title}</p>
              </div>
            </div>
            <div className="hidden items-center justify-between md:flex">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Workspace
                </p>
                <h1 className="mt-1 text-lg font-semibold">{title}</h1>
              </div>
              <span className="rounded-full border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                {kind === "admin" ? "Admin workspace" : "Technician workspace"}
              </span>
            </div>
          </header>

          <nav
            aria-label={`${title} navigation`}
            className="flex gap-1 overflow-x-auto border-b bg-background px-3 py-2 md:hidden"
          >
            {navigation[kind].map(({ label, path }) => {
              const href = `${base}/${path}`;
              const active = pathname === href;
              return (
                <Link
                  key={path}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "shrink-0 rounded-md px-3 py-2 text-xs font-medium",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
