"use client";

import { useState } from "react";
import { ReceiptText } from "lucide-react";
import {
  RecordsPanel,
  type CustomerRecordRow,
} from "@/components/dashboard/records-panel";
import { Button } from "@/components/ui/button";
import { useMyInvoices, useStartInvoicePayment } from "@/hooks/customer.hook";
import { displayDate, displayMoney, listItems } from "@/lib/customer-format";

export default function InvoicesPage() {
  const query = useMyInvoices();
  const payment = useStartInvoicePayment();
  const [paymentError, setPaymentError] = useState<string | null>(null);
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
              onSuccess: (result) =>
                window.location.assign(result.data.paymentUrl),
              onError: (error) =>
                setPaymentError(
                  error instanceof Error
                    ? error.message
                    : "Could not start payment. Try again.",
                ),
            });
          }}
        >
          {payment.isPending ? "Starting…" : "Pay invoice"}
        </Button>
      ) : undefined,
  }));
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
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {paymentError}
        </p>
      )}
    </div>
  );
}
