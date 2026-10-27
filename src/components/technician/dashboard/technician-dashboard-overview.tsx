"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import { useTechnicianDashboard } from "@/hooks/technician-dashboard.hook";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const metrics = [
  {
    key: "assignedWorkOrders",
    label: "Assigned work orders",
    description: "Jobs currently assigned to you",
    href: "/technician/work-orders",
    icon: BriefcaseBusiness,
    color: "text-sky-600 bg-sky-500/10",
  },
  {
    key: "pendingAssignments",
    label: "Pending assignments",
    description: "Jobs waiting for your response",
    href: "/technician/jobs",
    icon: Clock3,
    color: "text-amber-600 bg-amber-500/10",
  },
  {
    key: "completedWorkOrders",
    label: "Completed work orders",
    description: "Work orders marked complete",
    href: "/technician/work-orders",
    icon: CheckCircle2,
    color: "text-emerald-600 bg-emerald-500/10",
  },
] as const;

export default function TechnicianDashboardOverview() {
  const dashboard = useTechnicianDashboard();

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2">
            <Badge variant="secondary">Technician workspace</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="mt-1 text-muted-foreground">
            A summary of your assigned work and today’s schedule.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/technician/jobs" />}>
          <BriefcaseBusiness className="size-4" />
          Review assigned jobs
          <ArrowRight className="size-4" />
        </Button>
      </header>

      {dashboard.isError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="font-semibold">
              We couldn’t load your dashboard summary.
            </p>
            <p className="text-sm text-muted-foreground">
              {dashboard.error.message || "Please try again."}
            </p>
            <Button
              variant="outline"
              onClick={() => void dashboard.refetch()}
              disabled={dashboard.isFetching}
            >
              <RefreshCw className="size-4" />
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <section
          aria-label="Technician summary"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {metrics.map(
            ({ key, label, description, href, icon: Icon, color }) => (
              <Card key={key} className="overflow-hidden">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <div className="space-y-1">
                    <CardDescription>{label}</CardDescription>
                    <CardTitle className="text-3xl tabular-nums">
                      {dashboard.isPending ? (
                        <LoaderCircle className="size-7 animate-spin text-muted-foreground" />
                      ) : (
                        (dashboard.data?.data[key] ?? 0)
                      )}
                    </CardTitle>
                  </div>
                  <span
                    className={`flex size-10 items-center justify-center rounded-xl ${color}`}
                  >
                    <Icon className="size-5" />
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-xs text-muted-foreground">
                    {description}
                  </p>
                  <Button
                    nativeButton={false}
                    variant="link"
                    className="h-auto p-0"
                    render={<Link href={href} />}
                  >
                    View details
                    <ArrowRight className="size-3.5" />
                  </Button>
                </CardContent>
              </Card>
            ),
          )}
        </section>
      )}
    </main>
  );
}
