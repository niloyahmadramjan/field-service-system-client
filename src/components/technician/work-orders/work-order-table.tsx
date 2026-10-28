"use client";

import Link from "next/link";
import { Eye, LoaderCircle, SearchX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMyWorkOrders } from "@/hooks/technician-work-order.hook";
import type { WorkOrder, WorkOrderStatus } from "@/types/work-order.types";
import RequestPagination from "@/components/admin/requests/request-pagination";
import WorkOrderStatusAction from "@/components/technician/work-orders/work-order-status-action";

type WorkOrderFilter = "ALL" | WorkOrderStatus;

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

function statusBadge(status: WorkOrderStatus) {
  const classes: Record<WorkOrderStatus, string> = {
    CREATED: "border-sky-200 bg-sky-50 text-sky-700",
    ASSIGNED: "border-violet-200 bg-violet-50 text-violet-700",
    IN_PROGRESS: "border-amber-200 bg-amber-50 text-amber-700",
    COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    CANCELLED: "border-rose-200 bg-rose-50 text-rose-700",
  };
  return <Badge variant="outline" className={classes[status]}>{status.replaceAll("_", " ")}</Badge>;
}

export default function TechnicianWorkOrderTable({ status, page, limit, searchTerm, onPageChange, onLimitChange }: { status: WorkOrderFilter; page: number; limit: number; searchTerm: string; onPageChange: (page: number) => void; onLimitChange: (limit: number) => void }) {
  const query = useMyWorkOrders({ page, limit, searchTerm: searchTerm || undefined });
  const allOrders = query.data?.data ?? [];
  const orders = status === "ALL" ? allOrders : allOrders.filter((order: WorkOrder) => order.status === status);

  return <div className="space-y-4">
    <p className="text-sm text-muted-foreground">{query.isPending ? "Loading your work…" : <>Showing <span className="font-medium text-foreground">{orders.length}</span> {status === "ALL" ? "work orders on this page" : status.replaceAll("_", " ").toLowerCase() + " work orders on this page"}</>}</p>
    <div className="overflow-x-auto rounded-xl border bg-card"><Table><TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead>Work order</TableHead><TableHead>Service</TableHead><TableHead>Customer</TableHead><TableHead>Preferred visit</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
      {query.isPending && <TableRow><TableCell colSpan={6} className="h-40 text-center text-muted-foreground"><LoaderCircle className="mr-2 inline size-4 animate-spin" />Loading assigned work orders…</TableCell></TableRow>}
      {query.isError && <TableRow><TableCell colSpan={6} className="h-40 text-center text-destructive">{query.error.message || "Unable to load your work orders."}</TableCell></TableRow>}
      {!query.isPending && !query.isError && orders.length === 0 && <TableRow><TableCell colSpan={6} className="h-48 text-center"><div className="flex flex-col items-center gap-2"><SearchX className="size-8 text-muted-foreground/60" /><p className="font-medium">No work orders here</p><p className="text-sm text-muted-foreground">Assigned work will appear here when it is available.</p></div></TableCell></TableRow>}
      {orders.map((order) => <TableRow key={order.id}><TableCell><div className="space-y-1"><Link href={`/technician/work-orders/${order.id}`} className="font-semibold hover:text-primary">{order.workOrderNumber}</Link><p className="max-w-64 truncate text-sm text-muted-foreground">{order.title}</p></div></TableCell><TableCell>{order.request?.service?.name ?? "—"}</TableCell><TableCell><div className="space-y-1"><p className="font-medium">{order.customer?.user?.name ?? "Customer"}</p><p className="text-xs text-muted-foreground">{order.customer?.user?.phone ?? "No phone"}</p></div></TableCell><TableCell>{formatDate(order.request?.preferredDate)}</TableCell><TableCell>{statusBadge(order.status)}</TableCell><TableCell><div className="flex flex-wrap justify-end gap-1"><Button nativeButton={false} variant="ghost" size="sm" render={<Link href={`/technician/work-orders/${order.id}`} />}><Eye className="size-4" /><span className="sr-only sm:not-sr-only">Details</span></Button><WorkOrderStatusAction workOrder={order} /></div></TableCell></TableRow>)}
    </TableBody></Table></div>
    {query.data?.meta && <RequestPagination page={page} pageSize={limit} total={query.data.meta.total} totalPages={query.data.meta.totalPages} onPageChange={onPageChange} onPageSizeChange={onLimitChange} />}
  </div>;
}
