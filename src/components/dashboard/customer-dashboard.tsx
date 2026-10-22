"use client";

import Link from "next/link";
import { useGetMe } from "@/hooks/auth.hook";
import { UserRole } from "@/types/auth.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileEditor } from "@/components/dashboard/profile-editor";
import {
  ArrowRight,
  CalendarDays,
  CircleUserRound,
  Clock3,
  FileText,
  LoaderCircle,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Wrench,
  CheckCircle2,
  ReceiptText,
} from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { useCustomerDashboard } from "@/hooks/customer.hook";

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "CU"
  );
}

export function CustomerDashboard() {
  const { data, isPending, isError, refetch, isFetching } = useGetMe();
  const dashboard = useCustomerDashboard();

  if (isPending)
    return (
      <main className="flex flex-1 items-center justify-center gap-3 text-muted-foreground">
        <LoaderCircle className="size-5 animate-spin" /> Loading your dashboard…
      </main>
    );
  if (isError || !data?.data)
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-14">
        <Card className="flex max-w-md flex-col items-center gap-4 p-9 text-center">
          <CircleUserRound className="size-10 text-muted-foreground" />
          <h1 className="text-xl font-semibold">
            We couldn’t load your profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to view your customer dashboard, or try loading your profile
            again.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              <RefreshCw className="size-4" /> Retry
            </Button>
            <Button render={<Link href="/login" />} nativeButton={false}>
              Sign in
            </Button>
          </div>
        </Card>
      </main>
    );

  const profile = data.data;
  if (profile.role !== UserRole.CUSTOMER)
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-14">
        <Card className="flex max-w-md flex-col items-center gap-4 p-9 text-center">
          <ShieldCheck className="size-10 text-muted-foreground" />
          <h1 className="text-xl font-semibold">Customer dashboard</h1>
          <p className="text-sm text-muted-foreground">
            This dashboard is for customer accounts. Your account role is{" "}
            {profile.role.toLowerCase()}.
          </p>
          <Button render={<Link href="/" />} nativeButton={false}>
            Back to home
          </Button>
        </Card>
      </main>
    );

  const joined = parseISO(profile.createdAt);
  const customer = profile.customer;
  return (
    <main className="flex-1 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                 Customer portal
              </Badge>
              <Badge
                variant={
                  profile.status === "ACTIVE" ? "default" : "destructive"
                }
              >
                {profile.status}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {profile.name.split(" ")[0]}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage your account and find the right help for your home.
            </p>
          </div>
          <Button render={<Link href="/services" />} nativeButton={false}>
            Browse services <ArrowRight data-icon="inline-end" />
          </Button>
        </div>

        <section
          aria-label="Service summary"
          className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          <MetricCard
            label="My service requests"
            value={dashboard.data?.data.myServiceRequests}
            href="/dashboard/requests"
            icon={<FileText />}
            loading={dashboard.isPending}
          />
          <MetricCard
            label="Pending requests"
            value={dashboard.data?.data.pendingRequests}
            href="/dashboard/requests"
            icon={<Clock3 />}
            loading={dashboard.isPending}
            accent="amber"
          />
          <MetricCard
            label="Active work orders"
            value={dashboard.data?.data.activeWorkOrders}
            href="/dashboard/work-orders"
            icon={<Wrench />}
            loading={dashboard.isPending}
          />
          <MetricCard
            label="Completed services"
            value={dashboard.data?.data.completedServices}
            href="/dashboard/work-orders"
            icon={<CheckCircle2 />}
            loading={dashboard.isPending}
            accent="green"
          />
          <MetricCard
            label="Total invoices"
            value={dashboard.data?.data.totalInvoices}
            href="/dashboard/invoices"
            icon={<ReceiptText />}
            loading={dashboard.isPending}
          />
          <MetricCard
            label="Paid invoices"
            value={dashboard.data?.data.paidInvoices}
            href="/dashboard/invoices"
            icon={<CheckCircle2 />}
            loading={dashboard.isPending}
            accent="green"
          />
        </section>
        {dashboard.isError && (
          <div
            role="alert"
            className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            <span>Dashboard counts are temporarily unavailable.</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void dashboard.refetch()}
            >
              Retry
            </Button>
          </div>
        )}

        {/* <section className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <Card className="overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary via-primary/70 to-sky-400" />
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle>My profile</CardTitle>
                <CardDescription>
                  Your personal and contact information
                </CardDescription>
              </div>
              <ProfileEditor profile={profile} />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <Avatar size="lg" className="size-20 ring-4 ring-primary/10">
                  <AvatarImage
                    src={profile.avatarUrl ?? undefined}
                    alt={profile.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
                    {initials(profile.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{profile.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {profile.email}
                  </p>
                  <Badge variant="outline" className="mt-3">
                    Customer account
                  </Badge>
                </div>
              </div>
              <div className="mt-7 grid gap-5 border-t pt-6 sm:grid-cols-2">
                <InfoItem
                  icon={<CircleUserRound />}
                  label="Phone"
                  value={profile.phone || "Not provided"}
                />
                <InfoItem
                  icon={<MapPin />}
                  label="Service address"
                  value={customer?.address || "Not provided"}
                />
                <InfoItem
                  icon={<MapPin />}
                  label="City / district"
                  value={
                    customer
                      ? [customer.city, customer.district]
                          .filter(Boolean)
                          .join(", ") || "Not provided"
                      : "Not provided"
                  }
                />
                <InfoItem
                  icon={<CalendarDays />}
                  label="Member since"
                  value={isValid(joined) ? format(joined, "MMMM d, yyyy") : "—"}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <Card className="relative overflow-hidden bg-primary text-primary-foreground">
              <div className="absolute -right-8 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
              <CardHeader className="relative">
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-white/15">
                  <Sparkles className="size-5" />
                </div>
                <CardTitle className="text-xl">Need a hand at home?</CardTitle>
                <CardDescription className="text-primary-foreground/75">
                  Explore trusted services and book a convenient visit.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Button
                  variant="secondary"
                  render={<Link href="/services" />}
                  nativeButton={false}
                >
                  Explore services <ArrowRight data-icon="inline-end" />
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Clock3 className="size-5" />
                </div>
                <CardTitle className="text-base">Account details</CardTitle>
                <CardDescription>
                  Your profile is ready to use for service requests.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Account status</span>
                  <span className="font-medium">{profile.status}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Last sign in</span>
                  <span className="font-medium">
                    {profile.lastLoginAt &&
                    isValid(parseISO(profile.lastLoginAt))
                      ? format(parseISO(profile.lastLoginAt), "MMM d, yyyy")
                      : "—"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section> */}
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  href,
  icon,
  loading,
  accent = "blue",
}: {
  label: string;
  value?: number;
  href: string;
  icon: React.ReactNode;
  loading: boolean;
  accent?: "blue" | "amber" | "green";
}) {
  const colors = {
    blue: "bg-primary/10 text-primary",
    amber: "bg-amber-100 text-amber-700",
    green: "bg-emerald-100 text-emerald-700",
  };
  return (
    <Link href={href} className="group">
      <Card className="h-full transition-colors group-hover:border-primary/40">
        <CardContent className="flex items-center justify-between gap-3 p-5">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">
              {loading ? (
                <span className="inline-block h-8 w-12 animate-pulse rounded bg-muted" />
              ) : (
                (value ?? 0)
              )}
            </p>
          </div>
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl [&_svg]:size-5 ${colors[accent]}`}
          >
            {icon}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground [&_svg]:size-4">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
