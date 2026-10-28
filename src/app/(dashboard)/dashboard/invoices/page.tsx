"use client";

import { Suspense, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, CircleDollarSign, CircleX, LoaderCircle, ReceiptText, TriangleAlert } from "lucide-react";
import {
  RecordsPanel,
  type CustomerRecordRow,
} from "@/components/dashboard/records-panel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMyInvoices, useStartInvoicePayment } from "@/hooks/customer.hook";
import { displayDate, displayMoney, listItems } from "@/lib/customer-format";
import { customerKeys } from "@/hooks/customer.hook";

type PaymentResult = "success" | "failure" | "cancel";

const paymentResultContent: Record<PaymentResult, { title: string; description: string; icon: typeof CheckCircle2; iconClass: string }> = {
  success: {
    title: "Payment successful",
    description: "Your payment has been confirmed. The invoice and payment history are being refreshed.",
    icon: CheckCircle2,
    iconClass: "bg-emerald-100 text-emerald-700",
  },
  failure: {
    title: "Payment failed",
    description: "The payment could not be completed. Your invoice remains available so you can try again.",
    icon: TriangleAlert,
    iconClass: "bg-destructive/10 text-destructive",
  },
  cancel: {
    title: "Payment cancelled",
    description: "You cancelled the payment. No payment was completed, and you can try again whenever you are ready.",
    icon: CircleX,
    iconClass: "bg-amber-100 text-amber-700",
  },
};

function InvoiceList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const payment = useStartInvoicePayment();
  const query = useMyInvoices();
  const resultValue = searchParams.get("payment");
  const result = resultValue === "success" || resultValue === "failure" || resultValue === "cancel" ? resultValue : null;
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (!result) return;
    void Promise.all([
      queryClient.invalidateQueries({ queryKey: customerKeys.invoices }),
      queryClient.invalidateQueries({ queryKey: customerKeys.payments }),
    ]);
  }, [queryClient, result]);

  const closeResult = () => router.replace("/dashboard/invoices", { scroll: false });
  const rows: CustomerRecordRow[] = listItems(query.data).map((invoice) => ({
    id: invoice.id,
    title: invoice.invoiceNumber,
    description:
      invoice.workOrder?.serviceRequest?.service?.name ??
      invoice.workOrder?.serviceRequest?.title ??
      `Work order ${invoice.workOrder?.workOrderNumber ?? ""}`,
    status: invoice.status,
    details: [
      { label: "Amount due", value: displayMoney(invoice.amount) },
      { label: "Work order", value: invoice.workOrder?.workOrderNumber ?? "—" },
      { label: "Issued", value: displayDate(invoice.createdAt) },
      { label: "Due date", value: displayDate(invoice.dueDate) },
    ],
    action:
      invoice.status === "ISSUED" ? (
        <Button
          size="sm"
          disabled={payment.isPending}
          onClick={() => {
            setPaymentError(null);
            payment.mutate(invoice.id, {
              onSuccess: (response) => window.location.assign(response.data.paymentUrl),
              onError: (error) =>
                setPaymentError(error instanceof Error ? error.message : "Could not start payment. Try again."),
            });
          }}
        >
          {payment.isPending ? <LoaderCircle className="size-4 animate-spin" /> : <CircleDollarSign className="size-4" />}
          {payment.isPending ? "Starting…" : "Pay invoice"}
        </Button>
      ) : undefined,
  }));
  const resultContent = result ? paymentResultContent[result] : null;
  const ResultIcon = resultContent?.icon;

  return (
    <div className="space-y-4">
      <RecordsPanel
        title="Invoices"
        description="Review charges for completed work and pay invoices that are due."
        icon={<ReceiptText />}
        rows={rows}
        isPending={query.isPending}
        isError={query.isError}
        onRetry={() => void query.refetch()}
        emptyTitle="No invoices yet"
        emptyDescription="Invoices will appear here when completed work is ready for billing."
      />
      {paymentError && (
        <p role="alert" className="mx-auto max-w-5xl rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {paymentError}
        </p>
      )}
      <Dialog open={Boolean(result)} onOpenChange={(open) => !open && closeResult()}>
        <DialogContent>
          <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-full">
            {ResultIcon && <span className={`flex size-14 items-center justify-center rounded-full ${resultContent?.iconClass}`}><ResultIcon className="size-7" /></span>}
          </div>
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle>{resultContent?.title}</DialogTitle>
            <DialogDescription>{resultContent?.description}</DialogDescription>
          </DialogHeader>
          <div className="mt-5">
            <Button className="w-full" onClick={closeResult}>Back to invoices</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function InvoicesPage() {
  return <Suspense fallback={<div className="flex min-h-56 items-center justify-center gap-2 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" />Loading invoices…</div>}><InvoiceList /></Suspense>;
}
