"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, FilePlus2, LoaderCircle, MoreHorizontal, RefreshCw, SearchX, UserRoundPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import RequestPagination from "@/components/admin/requests/request-pagination";
import { useUpdateWorkOrderStatus, useWorkOrders } from "@/hooks/work-order.hook";
import type { WorkOrder, WorkOrderStatus } from "@/types/work-order.types";
import CreateInvoiceDialog from "@/components/admin/reports/create-invoice-dialog";

const PAGE_SIZE = 10;

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function statusClass(status: WorkOrderStatus) {
  switch (status) {
    case "CREATED": return "border-sky-200 bg-sky-50 text-sky-700";
    case "ASSIGNED": return "border-violet-200 bg-violet-50 text-violet-700";
    case "IN_PROGRESS": return "border-amber-200 bg-amber-50 text-amber-700";
    case "COMPLETED": return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "CANCELLED": return "border-rose-200 bg-rose-50 text-rose-700";
  }
}

function WorkOrderActions({ order }: { order: WorkOrder }) {
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState<WorkOrderStatus>(order.status);
  const [createInvoiceOpen, setCreateInvoiceOpen] = useState(false);
  const updateStatus = useUpdateWorkOrderStatus();

  const saveStatus = () => updateStatus.mutate({ workOrderId: order.id, status: nextStatus }, {
    onSuccess: () => {
      toast.add({ title: "Work order status updated", description: `${order.workOrderNumber} is now ${nextStatus.replaceAll("_", " ").toLowerCase()}.`, type: "success" });
      setStatusDialogOpen(false);
    },
    onError: (error) => toast.add({ title: "Could not update work order", description: error.message, type: "error" }),
  });

  return <div className="flex items-center justify-end gap-1">
    {!order.invoice && <Button size="sm" onClick={() => setCreateInvoiceOpen(true)}><FilePlus2 className="size-4" />Create invoice</Button>}
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label={`Actions for ${order.workOrderNumber}`}><MoreHorizontal className="size-4" /></Button>} />
      <DropdownMenuContent align="end">
        <DropdownMenuItem render={<Link href={`/admin/work-orders/${order.id}`} />}><UserRoundPlus className="size-4" />Assign technician</DropdownMenuItem>
        <DropdownMenuItem onClick={() => { setNextStatus(order.status); setStatusDialogOpen(true); }}><RefreshCw className="size-4" />Update status</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update work order status</DialogTitle>
          <DialogDescription>Choose a status for {order.workOrderNumber}. The server checks whether the transition is allowed.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2"><Label htmlFor={`work-order-status-${order.id}`}>Status</Label><Select value={nextStatus} onValueChange={(value) => { if (value) setNextStatus(value as WorkOrderStatus); }}><SelectTrigger id={`work-order-status-${order.id}`} className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="CREATED">Created</SelectItem><SelectItem value="ASSIGNED">Assigned</SelectItem><SelectItem value="IN_PROGRESS">In progress</SelectItem><SelectItem value="COMPLETED">Completed</SelectItem><SelectItem value="CANCELLED">Cancelled</SelectItem></SelectContent></Select></div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => setStatusDialogOpen(false)} disabled={updateStatus.isPending}>Close</Button>
          <Button variant={nextStatus === "CANCELLED" ? "destructive" : "default"} onClick={saveStatus} disabled={updateStatus.isPending || nextStatus === order.status}>{updateStatus.isPending && <LoaderCircle className="animate-spin" />}Save status</Button>
        </div>
      </DialogContent>
    </Dialog>
    <CreateInvoiceDialog open={createInvoiceOpen} onOpenChange={setCreateInvoiceOpen} workOrder={order} />
  </div>;
}

export default function WorkOrderTable({ status, search }: { status?: WorkOrderStatus; search: string }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const query = useWorkOrders({ page, limit: pageSize, status, searchTerm: search || undefined });
  const orders = query.data?.data ?? [];
  const meta = query.data?.meta;
  const total = meta?.total ?? 0;
  const totalPages = Math.max(meta?.totalPages ?? 1, 1);

  return <div className="w-full min-w-0 space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-sm text-muted-foreground">{query.isPending ? "Loading work orders…" : <>Showing <span className="font-medium text-foreground">{total ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, total)}</span> of <span className="font-medium text-foreground">{total}</span> work orders</>}</p>
      <Badge variant="outline">{status ?? "All statuses"}</Badge>
    </div>
    <div className="overflow-x-auto rounded-xl border bg-card">
      <Table>
        <TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead>Work order</TableHead><TableHead>Customer</TableHead><TableHead>Service</TableHead><TableHead>Technician</TableHead><TableHead>Created</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {query.isPending && <TableRow><TableCell colSpan={7} className="h-40 text-center text-muted-foreground"><LoaderCircle className="mr-2 inline size-4 animate-spin" />Loading work orders…</TableCell></TableRow>}
          {query.isError && <TableRow><TableCell colSpan={7} className="h-40 text-center text-destructive">{query.error.message || "Unable to load work orders."}</TableCell></TableRow>}
          {!query.isPending && !query.isError && orders.length === 0 && <TableRow><TableCell colSpan={7} className="h-48 text-center"><div className="flex flex-col items-center gap-2"><SearchX className="size-8 text-muted-foreground/60" /><p className="font-medium">No work orders found</p><p className="text-sm text-muted-foreground">Try another status or search term.</p></div></TableCell></TableRow>}
          {orders.map((order) => <TableRow key={order.id}>
            <TableCell><div className="space-y-1"><p className="font-semibold">{order.workOrderNumber}</p><p className="max-w-56 truncate text-sm text-muted-foreground">{order.title}</p></div></TableCell>
            <TableCell><div className="space-y-1"><p className="font-medium">{order.customer?.user?.name ?? "Customer"}</p><p className="text-xs text-muted-foreground">{order.customer?.user?.phone ?? "No phone"}</p></div></TableCell>
            <TableCell>{order.request?.service?.name ?? "—"}</TableCell>
            <TableCell>{order.technician?.user?.name ?? <span className="text-muted-foreground">Unassigned</span>}</TableCell>
            <TableCell>{formatDate(order.createdAt)}</TableCell>
            <TableCell><Badge variant="outline" className={statusClass(order.status)}>{order.status.replaceAll("_", " ")}</Badge></TableCell>
            <TableCell><div className="flex justify-end gap-1"><Button nativeButton={false} variant="ghost" size="sm" render={<Link href={`/admin/work-orders/${order.id}`} />}><Eye className="size-4" /><span className="sr-only sm:not-sr-only">View</span></Button><WorkOrderActions order={order} /></div></TableCell>
          </TableRow>)}
        </TableBody>
      </Table>
    </div>
    {!query.isError && <RequestPagination page={page} pageSize={pageSize} total={total} totalPages={totalPages} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1); }} />}
  </div>;
}
