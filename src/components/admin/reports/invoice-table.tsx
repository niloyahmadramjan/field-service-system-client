"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, LoaderCircle, MoreHorizontal, SearchX, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import RequestPagination from "@/components/admin/requests/request-pagination";
import { useDeleteInvoice, useInvoices } from "@/hooks/report.hook";
import type { Invoice, InvoiceStatus } from "@/types/report.types";

const PAGE_SIZE = 10;

function dateLabel(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function money(value: string | number) {
  const amount = Number(value);
  return Number.isFinite(amount) ? new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 2 }).format(amount) : String(value);
}

function InvoiceActions({ invoice }: { invoice: Invoice }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const remove = useDeleteInvoice();

  const deleteInvoice = () => remove.mutate(invoice.id, {
    onSuccess: () => {
      toast.add({ title: "Invoice deleted", description: `${invoice.invoiceNumber} has been deleted.`, type: "success" });
      setConfirmDelete(false);
    },
    onError: (error) => toast.add({ title: "Could not delete invoice", description: error.message, type: "error" }),
  });

  return <>
    <DropdownMenu><DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label={`Actions for ${invoice.invoiceNumber}`}><MoreHorizontal className="size-4" /></Button>} /><DropdownMenuContent align="end"><DropdownMenuItem render={<Link href={`/admin/reports/${invoice.id}`} />}><Eye className="size-4" />View and edit</DropdownMenuItem><DropdownMenuItem variant="destructive" onClick={() => setConfirmDelete(true)}><Trash2 className="size-4" />Delete invoice</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
    <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}><DialogContent><DialogHeader><DialogTitle>Delete this invoice?</DialogTitle><DialogDescription>{invoice.invoiceNumber} will be permanently removed.</DialogDescription></DialogHeader><div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button variant="outline" onClick={() => setConfirmDelete(false)} disabled={remove.isPending}>Keep invoice</Button><Button variant="destructive" onClick={deleteInvoice} disabled={remove.isPending}>{remove.isPending && <LoaderCircle className="animate-spin" />}Delete invoice</Button></div></DialogContent></Dialog>
  </>;
}

export default function InvoiceTable({ status, searchTerm }: { status?: InvoiceStatus; searchTerm: string }) {
  const [page, setPage] = useState(1);
  const query = useInvoices({ page, limit: PAGE_SIZE, status, searchTerm: searchTerm || undefined });
  const invoices = query.data?.data ?? [];
  const meta = query.data?.meta;
  const total = meta?.total ?? 0;
  const totalPages = Math.max(meta?.totalPages ?? 1, 1);

  return <div className="w-full min-w-0 space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-muted-foreground">{query.isPending ? "Loading invoices…" : <>Showing <span className="font-medium text-foreground">{total ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, total)}</span> of <span className="font-medium text-foreground">{total}</span> invoices</>}</p><Badge variant="outline">{status ?? "All statuses"}</Badge></div>
    <div className="overflow-x-auto rounded-xl border bg-card"><Table><TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead>Invoice</TableHead><TableHead>Work order</TableHead><TableHead>Customer</TableHead><TableHead>Amount</TableHead><TableHead>Due date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
      {query.isPending && <TableRow><TableCell colSpan={7} className="h-40 text-center text-muted-foreground"><LoaderCircle className="mr-2 inline size-4 animate-spin" />Loading invoices…</TableCell></TableRow>}
      {query.isError && <TableRow><TableCell colSpan={7} className="h-40 text-center text-destructive">{query.error.message || "Unable to load invoices."}</TableCell></TableRow>}
      {!query.isPending && !query.isError && invoices.length === 0 && <TableRow><TableCell colSpan={7} className="h-48 text-center"><div className="flex flex-col items-center gap-2"><SearchX className="size-8 text-muted-foreground/60" /><p className="font-medium">No invoices found</p><p className="text-sm text-muted-foreground">Try another status or search term.</p></div></TableCell></TableRow>}
      {invoices.map((invoice) => <TableRow key={invoice.id}><TableCell><div className="space-y-1"><Link className="font-semibold hover:text-primary" href={`/admin/reports/${invoice.id}`}>{invoice.invoiceNumber}</Link><p className="text-xs text-muted-foreground">Created {dateLabel(invoice.createdAt)}</p></div></TableCell><TableCell><div className="space-y-1"><p className="font-medium">{invoice.workOrder?.workOrderNumber ?? "—"}</p><p className="max-w-52 truncate text-xs text-muted-foreground">{invoice.workOrder?.title}</p></div></TableCell><TableCell><div className="space-y-1"><p className="font-medium">{invoice.customer?.user?.name ?? "Customer"}</p><p className="text-xs text-muted-foreground">{[invoice.customer?.city, invoice.customer?.district].filter(Boolean).join(", ") || invoice.customerId}</p></div></TableCell><TableCell className="font-semibold">{money(invoice.amount)}</TableCell><TableCell>{dateLabel(invoice.dueDate)}</TableCell><TableCell><Badge variant={invoice.status === "PAID" ? "secondary" : invoice.status === "CANCELLED" ? "destructive" : "outline"} className={invoice.status === "DRAFT" ? "border-amber-200 bg-amber-50 text-amber-700" : invoice.status === "ISSUED" ? "border-sky-200 bg-sky-50 text-sky-700" : ""}>{invoice.status}</Badge></TableCell><TableCell><div className="flex justify-end gap-1"><Button nativeButton={false} variant="ghost" size="sm" render={<Link href={`/admin/reports/${invoice.id}`} />}><Eye className="size-4" /><span className="sr-only sm:not-sr-only">View</span></Button><InvoiceActions invoice={invoice} /></div></TableCell></TableRow>)}
    </TableBody></Table></div>
    {!query.isError && <RequestPagination page={page} pageSize={PAGE_SIZE} total={total} totalPages={totalPages} onPageChange={setPage} onPageSizeChange={() => setPage(1)} />}
  </div>;
}
