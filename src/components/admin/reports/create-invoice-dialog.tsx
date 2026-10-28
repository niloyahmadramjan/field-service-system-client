"use client";

import { useState, type FormEvent } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { useCreateInvoice } from "@/hooks/report.hook";
import type { CreateInvoicePayload } from "@/types/report.types";

function messageFrom(error: Error) {
  return (error as Error & { data?: { message?: string } }).data?.message || error.message;
}

export default function CreateInvoiceDialog({
  open,
  onOpenChange,
  workOrder,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workOrder: { id: string; workOrderNumber: string; title: string; customer?: { user?: { name?: string } | null } | null };
}) {
  const [dueDate, setDueDate] = useState("");
  const create = useCreateInvoice();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: CreateInvoicePayload = {
      workOrderId: workOrder.id,
      status: "DRAFT",
      dueDate: dueDate ? `${dueDate}T00:00:00.000Z` : null,
    };
    create.mutate(payload, {
      onSuccess: (response) => {
        toast.add({ title: "Invoice created", description: `${response.data.invoiceNumber} created for ${workOrder.workOrderNumber}.`, type: "success" });
        onOpenChange(false);
      },
      onError: (error) => toast.add({ title: "Could not create invoice", description: messageFrom(error), type: "error" }),
    });
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader><DialogTitle>Create invoice</DialogTitle><DialogDescription>Create an invoice for {workOrder.workOrderNumber} · {workOrder.title}{workOrder.customer?.user?.name ? ` · ${workOrder.customer.user.name}` : ""}.</DialogDescription></DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2"><Label htmlFor="invoice-due-date">Due date</Label><Input id="invoice-due-date" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></div>
        <p className="text-sm text-muted-foreground">New invoices are created as drafts. You can issue them from the invoice details page.</p>
        <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={create.isPending}>Cancel</Button><Button type="submit" disabled={create.isPending}>{create.isPending && <LoaderCircle className="animate-spin" />}Create draft</Button></div>
      </form>
    </DialogContent>
  </Dialog>;
}
