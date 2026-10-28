"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, FileText, LoaderCircle, MapPin, Plus, ReceiptText, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { useAddInvoiceItem, useDeleteInvoice, useInvoice, useUpdateInvoice } from "@/hooks/report.hook";
import type { Invoice, InvoiceItemCategory, InvoiceStatus } from "@/types/report.types";

const statuses: InvoiceStatus[] = ["DRAFT", "ISSUED", "PAID", "CANCELLED"];
const categories: InvoiceItemCategory[] = ["MATERIAL", "LABOR", "TRANSPORT", "OTHER"];

function money(value: string | number) {
  const amount = Number(value);
  return Number.isFinite(amount) ? new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 2 }).format(amount) : String(value);
}

function dateLabel(value?: string | null) {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not set" : new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function dateInputValue(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function Detail({ label, value }: { label: string; value?: ReactNode }) {
  return <div className="min-w-0 space-y-1"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="wrap-break-word text-sm">{value || "—"}</p></div>;
}

function EditInvoiceDialog({ invoice, open, onOpenChange }: { invoice: Invoice; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [status, setStatus] = useState<InvoiceStatus>(invoice.status);
  const [dueDate, setDueDate] = useState(() => dateInputValue(invoice.dueDate));
  const update = useUpdateInvoice();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    update.mutate({
      invoiceId: invoice.id,
      payload: { status, dueDate: dueDate ? `${dueDate}T00:00:00.000Z` : null },
    }, {
      onSuccess: () => {
        toast.add({ title: "Invoice updated", description: `${invoice.invoiceNumber} has been updated.`, type: "success" });
        onOpenChange(false);
      },
      onError: (error) => toast.add({ title: "Could not update invoice", description: error.message, type: "error" }),
    });
  };

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Update invoice</DialogTitle><DialogDescription>Change the due date or request a status transition. The server validates allowed transitions.</DialogDescription></DialogHeader><form onSubmit={submit} className="space-y-4"><div className="space-y-2"><Label htmlFor="edit-invoice-status">Status</Label><Select value={status} onValueChange={(value) => { if (statuses.includes(value as InvoiceStatus)) setStatus(value as InvoiceStatus); }}><SelectTrigger id="edit-invoice-status" className="w-full"><SelectValue /></SelectTrigger><SelectContent>{statuses.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="edit-invoice-due">Due date</Label><Input id="edit-invoice-due" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></div><div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={update.isPending}>Cancel</Button><Button type="submit" disabled={update.isPending}>{update.isPending && <LoaderCircle className="animate-spin" />}Save changes</Button></div></form></DialogContent></Dialog>;
}

function AddItemDialog({ invoice, open, onOpenChange }: { invoice: Invoice; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<InvoiceItemCategory>("OTHER");
  const [amount, setAmount] = useState("");
  const addItem = useAddInvoiceItem();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addItem.mutate({ invoiceId: invoice.id, payload: { title: title.trim(), category, amount: Number(amount) } }, {
      onSuccess: () => {
        toast.add({ title: "Invoice item added", description: "The invoice total has been updated.", type: "success" });
        onOpenChange(false);
      },
      onError: (error) => toast.add({ title: "Could not add invoice item", description: error.message, type: "error" }),
    });
  };

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Add invoice item</DialogTitle><DialogDescription>The item amount is added to the current invoice total.</DialogDescription></DialogHeader><form onSubmit={submit} className="space-y-4"><div className="space-y-2"><Label htmlFor="item-title">Description</Label><Input id="item-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Replacement part" required maxLength={160} /></div><div className="space-y-2"><Label htmlFor="item-category">Category</Label><Select value={category} onValueChange={(value) => { if (categories.includes(value as InvoiceItemCategory)) setCategory(value as InvoiceItemCategory); }}><SelectTrigger id="item-category" className="w-full"><SelectValue /></SelectTrigger><SelectContent>{categories.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="item-amount">Amount</Label><Input id="item-amount" type="number" min="0.01" step="0.01" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} required /></div><div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={addItem.isPending}>Cancel</Button><Button type="submit" disabled={addItem.isPending || !title.trim() || Number(amount) <= 0}>{addItem.isPending && <LoaderCircle className="animate-spin" />}Add item</Button></div></form></DialogContent></Dialog>;
}

export default function InvoiceDetailPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const router = useRouter();
  const query = useInvoice(invoiceId);
  const remove = useDeleteInvoice();
  const [editOpen, setEditOpen] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const invoice = query.data?.data;

  const deleteInvoice = () => remove.mutate(invoiceId, {
    onSuccess: () => {
      toast.add({ title: "Invoice deleted", description: "The invoice has been removed.", type: "success" });
      router.push("/admin/reports");
    },
    onError: (error) => toast.add({ title: "Could not delete invoice", description: error.message, type: "error" }),
  });

  if (query.isPending) return <div className="flex min-h-64 items-center justify-center text-muted-foreground"><LoaderCircle className="mr-2 size-5 animate-spin" />Loading invoice…</div>;
  if (query.isError || !invoice) return <section className="space-y-4"><Button nativeButton={false} variant="ghost" render={<Link href="/admin/reports" />}><ArrowLeft className="size-4" />Back to invoices</Button><Card><CardContent className="py-12 text-center text-destructive">{query.error?.message || "Invoice could not be found."}</CardContent></Card></section>;

  const canAddItems = invoice.status === "DRAFT" || invoice.status === "ISSUED";
  const location = [invoice.customer?.address, invoice.customer?.city, invoice.customer?.district].filter(Boolean).join(", ");

  return <section className="mx-auto w-full min-w-0 space-y-6">
    <Button nativeButton={false} variant="ghost" className="-ml-3" render={<Link href="/admin/reports" />}><ArrowLeft className="size-4" />Back to invoices</Button>
    <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{invoice.invoiceNumber}</h1><Badge variant={invoice.status === "PAID" ? "secondary" : invoice.status === "CANCELLED" ? "destructive" : "outline"}>{invoice.status}</Badge></div><p className="mt-1 text-sm text-muted-foreground">Invoice details, billing status, and itemized costs.</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => setEditOpen(true)}><FileText className="size-4" />Edit invoice</Button><Button variant="destructive" onClick={() => setConfirmDelete(true)}><Trash2 className="size-4" />Delete</Button></div></header>

    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.7fr)]">
      <div className="space-y-6">
        <Card><CardHeader><div className="flex items-center gap-2"><ReceiptText className="size-5 text-primary" /><CardTitle>Invoice summary</CardTitle></div><CardDescription>Created {dateLabel(invoice.createdAt)}</CardDescription></CardHeader><CardContent className="grid gap-5 border-t pt-5 sm:grid-cols-2"><Detail label="Invoice number" value={invoice.invoiceNumber} /><Detail label="Status" value={invoice.status} /><Detail label="Amount due" value={money(invoice.amount)} /><Detail label="Issued at" value={dateLabel(invoice.issuedAt)} /><Detail label="Due date" value={dateLabel(invoice.dueDate)} /><Detail label="Last updated" value={dateLabel(invoice.updatedAt)} /></CardContent></Card>

        <Card><CardHeader><CardTitle>Work order and customer</CardTitle><CardDescription>Reference information for this invoice.</CardDescription></CardHeader><CardContent className="grid gap-5 border-t pt-5 sm:grid-cols-2"><Detail label="Work order" value={invoice.workOrder?.workOrderNumber ?? invoice.workOrderId} /><Detail label="Work order status" value={invoice.workOrder?.status} /><Detail label="Job" value={invoice.workOrder?.title} /><Detail label="Customer" value={invoice.customer?.user?.name ?? invoice.customerId} /><Detail label="Email" value={invoice.customer?.user?.email} /><Detail label="Phone" value={invoice.customer?.user?.phone} /><div className="sm:col-span-2"><Detail label="Service location" value={location ? <span className="inline-flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" />{location}</span> : "Not provided"} /></div></CardContent></Card>

        <Card><CardHeader><div className="flex flex-wrap items-center justify-between gap-3"><div><CardTitle>Invoice items</CardTitle><CardDescription>{invoice.items.length} line {invoice.items.length === 1 ? "item" : "items"}</CardDescription></div>{canAddItems && <Button onClick={() => setAddItemOpen(true)}><Plus className="size-4" />Add item</Button>}</div></CardHeader><CardContent className="border-t pt-5"><div className="overflow-x-auto rounded-lg border"><Table><TableHeader><TableRow><TableHead>Description</TableHead><TableHead>Category</TableHead><TableHead>Added</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader><TableBody>{invoice.items.length ? invoice.items.map((item) => <TableRow key={item.id}><TableCell className="font-medium">{item.title}</TableCell><TableCell><Badge variant="outline">{item.category}</Badge></TableCell><TableCell>{dateLabel(item.createdAt)}</TableCell><TableCell className="text-right">{money(item.amount)}</TableCell></TableRow>) : <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No additional items have been added.</TableCell></TableRow>}</TableBody></Table></div><div className="ml-auto mt-4 flex max-w-sm justify-between border-t pt-4 text-base font-semibold"><span>Invoice total</span><span>{money(invoice.amount)}</span></div>{!canAddItems && <p className="mt-3 text-xs text-muted-foreground">Items can only be added while an invoice is a draft or issued.</p>}</CardContent></Card>
      </div>

      <Card className="h-fit"><CardHeader><div className="flex items-center gap-2"><CalendarDays className="size-4 text-muted-foreground" /><CardTitle className="text-base">Billing dates</CardTitle></div></CardHeader><CardContent className="space-y-4 border-t pt-5"><Detail label="Created" value={dateLabel(invoice.createdAt)} /><Detail label="Issued" value={dateLabel(invoice.issuedAt)} /><Detail label="Due" value={dateLabel(invoice.dueDate)} /><Button variant="outline" className="w-full" onClick={() => setEditOpen(true)}>Change status or due date</Button></CardContent></Card>
    </div>

    {editOpen && <EditInvoiceDialog key={`${invoice.id}-${invoice.updatedAt}`} invoice={invoice} open onOpenChange={setEditOpen} />}
    {addItemOpen && <AddItemDialog key={`${invoice.id}-${invoice.updatedAt}`} invoice={invoice} open onOpenChange={setAddItemOpen} />}
    <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}><DialogContent><DialogHeader><DialogTitle>Delete this invoice?</DialogTitle><DialogDescription>{invoice.invoiceNumber} will be permanently removed.</DialogDescription></DialogHeader><div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button variant="outline" onClick={() => setConfirmDelete(false)} disabled={remove.isPending}>Keep invoice</Button><Button variant="destructive" onClick={deleteInvoice} disabled={remove.isPending}>{remove.isPending && <LoaderCircle className="animate-spin" />}Delete invoice</Button></div></DialogContent></Dialog>
  </section>;
}
