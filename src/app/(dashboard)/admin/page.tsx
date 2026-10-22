
"use client";

import Loading from "@/components/common/loading";
import { useGetAdminDashboard } from "@/hooks/admin.hook";
import {
  Users,
  Wrench,
  BriefcaseBusiness,
  ClipboardList,
  Clock3,
  CheckCircle2,
  Banknote,
  ChartNoAxesCombined,
  ArrowUpRight,
  Activity,
  CircleAlert,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AdminDashboardStats {
  totalCustomers: number;
  totalTechnicians: number;
  totalServices: number;
  totalServiceRequests: number;
  pendingRequests: number;
  totalWorkOrders: number;
  totalCompletedOrders: number;
  totalRevenue: number;
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);

export default function AdminDashboardPage() {
  const {
    data: adminDashboard,
    isLoading,
    isError,
    error,
  } = useGetAdminDashboard();

  if (isLoading) {
    return (
      <Loading
        showLogo={false}
        text="Dashboard is loading"
        description="Fetching your dashboard information..."
        className="py-20"
      />
    );
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Card className="border-destructive/30">
          <CardContent className="flex items-start gap-3 p-6">
            <CircleAlert className="mt-0.5 size-5 text-destructive" />
            <div>
              <h2 className="font-semibold">Unable to load dashboard</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong while fetching dashboard data."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = adminDashboard?.data as
    | AdminDashboardStats
    | undefined;

  if (!stats) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            No dashboard data is available.
          </CardContent>
        </Card>
      </div>
    );
  }

  const metrics = [
    {
      title: "Total Customers",
      value: formatNumber(stats.totalCustomers),
      description: "Registered customers",
      icon: Users,
      iconStyle: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Technicians",
      value: formatNumber(stats.totalTechnicians),
      description: "Available team members",
      icon: Wrench,
      iconStyle:
        "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
    {
      title: "Services",
      value: formatNumber(stats.totalServices),
      description: "Services configured",
      icon: BriefcaseBusiness,
      iconStyle:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Service Requests",
      value: formatNumber(stats.totalServiceRequests),
      description: "Total submitted requests",
      icon: ClipboardList,
      iconStyle:
        "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    },
    {
      title: "Pending Requests",
      value: formatNumber(stats.pendingRequests),
      description: "Awaiting further action",
      icon: Clock3,
      iconStyle:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Work Orders",
      value: formatNumber(stats.totalWorkOrders),
      description: "Total created work orders",
      icon: Activity,
      iconStyle:
        "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    },
    {
      title: "Completed Orders",
      value: formatNumber(stats.totalCompletedOrders),
      description: "Successfully completed",
      icon: CheckCircle2,
      iconStyle:
        "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      description: "Recorded revenue",
      icon: Banknote,
      iconStyle:
        "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    },
  ];

  const pendingPercentage =
    stats.totalServiceRequests > 0
      ? Math.min(
          100,
          (stats.pendingRequests / stats.totalServiceRequests) * 100,
        )
      : 0;

  const completedPercentage =
    stats.totalWorkOrders > 0
      ? Math.min(
          100,
          (stats.totalCompletedOrders / stats.totalWorkOrders) * 100,
        )
      : 0;

  return (
    <main className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Dashboard Overview
              </h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Admin
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground sm:text-base">
              Monitor your service operations, team, requests, and revenue.
            </p>
          </div>

          
        </div>

        {/* Summary banner */}
       

        {/* Metric cards */}
        <section aria-label="Key metrics" className="space-y-3">
        

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <Card
                  key={metric.title}
                  className="group transition-shadow duration-200 hover:shadow-md"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          {metric.title}
                        </p>

                        <p className="break-words text-2xl font-bold tracking-tight sm:text-3xl">
                          {metric.value}
                        </p>
                      </div>

                      <div
                        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${metric.iconStyle}`}
                      >
                        <Icon className="size-5" />
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-muted-foreground">
                      {metric.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Operational overview */}
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Operations Overview
            </h2>
            <p className="text-sm text-muted-foreground">
              Review outstanding requests and completed work.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Requests */}
            <Card>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="text-base">
                    Service Requests
                  </CardTitle>
                  <CardDescription>
                    Pending requests versus all requests
                  </CardDescription>
                </div>

                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <ClipboardList className="size-5" />
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-3xl font-bold">
                      {formatNumber(stats.pendingRequests)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Pending requests
                    </p>
                  </div>

                  <Badge
                    variant={
                      stats.pendingRequests > 0 ? "secondary" : "outline"
                    }
                  >
                    {stats.totalServiceRequests > 0
                      ? `${Math.round(pendingPercentage)}% pending`
                      : "No requests"}
                  </Badge>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all"
                    style={{ width: `${pendingPercentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Total requests
                  </span>
                  <span className="font-medium">
                    {formatNumber(stats.totalServiceRequests)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Work orders */}
            <Card>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="text-base">Work Orders</CardTitle>
                  <CardDescription>
                    Completed orders versus all work orders
                  </CardDescription>
                </div>

                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-5" />
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-3xl font-bold">
                      {formatNumber(stats.totalCompletedOrders)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Completed orders
                    </p>
                  </div>

                  <Badge
                    variant={
                      completedPercentage === 100 &&
                      stats.totalWorkOrders > 0
                        ? "default"
                        : "secondary"
                    }
                  >
                    {stats.totalWorkOrders > 0
                      ? `${Math.round(completedPercentage)}% completed`
                      : "No work orders"}
                  </Badge>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${completedPercentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Total work orders
                  </span>
                  <span className="font-medium">
                    {formatNumber(stats.totalWorkOrders)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Revenue overview */}
        <Card>
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Banknote className="size-6" />
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Recorded Revenue
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Based on the revenue returned by your API.
                </p>
              </div>
            </div>

            <Badge variant="outline" className="w-fit">
              Revenue Summary
            </Badge>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
