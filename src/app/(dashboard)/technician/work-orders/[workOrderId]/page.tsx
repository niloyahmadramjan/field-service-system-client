"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, CalendarDays, LoaderCircle, MapPin, UserRound, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyWorkOrder } from "@/hooks/technician-work-order.hook";
import type { WorkOrderStatus } from "@/types/work-order.types";

function dateLabel(value?: string | null) {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not set" : new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function StatusBadge({ status }: { status: WorkOrderStatus }) {
  const variants: Record<WorkOrderStatus, string> = {
    CREATED: "border-sky-200 bg-sky-50 text-sky-700",
    ASSIGNED: "border-violet-200 bg-violet-50 text-violet-700",
    IN_PROGRESS: "border-amber-200 bg-amber-50 text-amber-700",
    COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    CANCELLED: "border-rose-200 bg-rose-50 text-rose-700",
  };
  return <Badge variant="outline" className={variants[status]}>{status.replaceAll("_", " ")}</Badge>;
}

function Detail({ label, value }: { label: string; value?: ReactNode }) {
  return <div className="min-w-0 space-y-1"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="wrap-break-word text-sm">{value || "—"}</p></div>;
}

function RelatedRows({ title, records }: { title: string; records: Array<Record<string, unknown>> }) {
  if (!records.length) return null;
  return <Card><CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader><CardContent className="space-y-3 border-t pt-5">{records.map((record, index) => {
    const fields = Object.entries(record).filter(([, value]) => value == null || ["string", "number", "boolean"].includes(typeof value));
    return <div key={String(record.id ?? index)} className="grid gap-3 rounded-lg border bg-muted/20 p-3 sm:grid-cols-2">{fields.map(([key, value]) => <Detail key={key} label={key.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)} value={value == null ? "—" : String(value)} />)}</div>;
  })}</CardContent></Card>;
}

export default function TechnicianWorkOrderDetailPage() {
  const { workOrderId } = useParams<{ workOrderId: string }>();
  const query = useMyWorkOrder(workOrderId);
  const order = query.data?.data;

  if (query.isPending) return <div className="flex min-h-64 items-center justify-center text-muted-foreground"><LoaderCircle className="mr-2 size-5 animate-spin" />Loading work order…</div>;
  if (query.isError || !order) return <section className="space-y-4"><Button nativeButton={false} variant="ghost" render={<Link href="/technician/work-orders" />}><ArrowLeft className="size-4" />Back to my work</Button><Card><CardContent className="py-12 text-center text-destructive">{query.error?.message || "Work order could not be found."}</CardContent></Card></section>;

  const location = [order.request?.address ?? order.customer?.address, order.request?.city ?? order.customer?.city, order.request?.district ?? order.customer?.district].filter(Boolean).join(", ");

  return <section className="mx-auto w-full min-w-0 space-y-6">
    <Button nativeButton={false} variant="ghost" className="-ml-3" render={<Link href="/technician/work-orders" />}><ArrowLeft className="size-4" />Back to my work</Button>
    <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{order.workOrderNumber}</h1><StatusBadge status={order.status} /></div><p className="mt-1 text-sm text-muted-foreground">Work order details and assignment information.</p></div></header>

    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.7fr)]"><div className="space-y-6">
      <Card><CardHeader><div className="flex items-start gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><BriefcaseBusiness className="size-5" /></span><div className="min-w-0"><CardTitle>{order.title}</CardTitle><CardDescription className="mt-1">{order.description || "No job description provided."}</CardDescription></div></div></CardHeader><CardContent className="grid gap-5 border-t pt-5 sm:grid-cols-2"><Detail label="Work order" value={order.workOrderNumber} /><Detail label="Status" value={order.status.replaceAll("_", " ")} /><Detail label="Created" value={dateLabel(order.createdAt)} /><Detail label="Started" value={dateLabel(order.startedAt)} /><Detail label="Completed" value={dateLabel(order.completedAt)} /><Detail label="Estimated cost" value={order.estimatedCost == null ? "Not estimated" : String(order.estimatedCost)} /><Detail label="Actual cost" value={order.actualCost == null ? "Not recorded" : String(order.actualCost)} /></CardContent></Card>

      <Card><CardHeader><div className="flex items-center gap-2"><UserRound className="size-4 text-muted-foreground" /><CardTitle className="text-base">Customer and service</CardTitle></div></CardHeader><CardContent className="grid gap-5 border-t pt-5 sm:grid-cols-2"><Detail label="Customer" value={order.customer?.user?.name} /><Detail label="Phone" value={order.customer?.user?.phone} /><Detail label="Email" value={order.customer?.user?.email} /><Detail label="Service" value={order.request?.service?.name} /><Detail label="Request" value={order.request?.requestNumber} /><Detail label="Request status" value={order.request?.status} /><Detail label="Preferred visit" value={dateLabel(order.request?.preferredDate)} /><div className="sm:col-span-2"><Detail label="Service address" value={location ? <span className="inline-flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" />{location}</span> : "Not provided"} /></div></CardContent></Card>

      <RelatedRows title="Assignment history" records={order.assignments ?? []} />
      <RelatedRows title="Service visits" records={order.visits ?? []} />
      {order.serviceReport && <RelatedRows title="Service report" records={[order.serviceReport]} />}
    </div>

    <Card className="h-fit"><CardHeader><div className="flex items-center gap-2"><CalendarDays className="size-4 text-muted-foreground" /><CardTitle className="text-base">Job information</CardTitle></div></CardHeader><CardContent className="space-y-4 border-t pt-5"><Detail label="Customer address" value={order.customer?.address} /><Detail label="Service" value={<span className="inline-flex items-center gap-2"><Wrench className="size-4" />{order.request?.service?.name ?? "—"}</span>} /><Detail label="Request number" value={order.request?.requestNumber} /><Detail label="Assigned technician" value={order.technician?.user?.name} /><Detail label="Technician employee ID" value={order.technician?.employeeId} /><Detail label="Updated" value={dateLabel(order.updatedAt)} /></CardContent></Card></div>
  </section>;
}
