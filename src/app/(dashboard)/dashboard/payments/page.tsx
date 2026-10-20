"use client";

import { CreditCard } from "lucide-react";
import { RecordsPanel, type CustomerRecordRow } from "@/components/dashboard/records-panel";
import { useMyPayments } from "@/hooks/customer.hook";
import { displayDate, displayMoney, listItems } from "@/lib/customer-format";

export default function PaymentsPage() {
  const query = useMyPayments();
  const rows: CustomerRecordRow[] = listItems(query.data).map((payment) => ({ id: payment.id, title: payment.transactionId || `Payment ${payment.id.slice(0, 8)}`, description: `Payment via ${payment.method.replaceAll("_", " ")}`, status: payment.status, details: [{ label: "Amount", value: displayMoney(payment.amount) }, { label: "Invoice", value: payment.invoice?.invoiceNumber ?? "—" }, { label: "Method", value: payment.method.replaceAll("_", " ") }, { label: "Date", value: displayDate(payment.createdAt, true) }] }));
  return <RecordsPanel title="Payments" description="Review payment status and transaction details for your invoices." icon={<CreditCard />} rows={rows} isPending={query.isPending} isError={query.isError} onRetry={() => void query.refetch()} emptyTitle="No payments yet" emptyDescription="When you pay an invoice, the transaction will be listed here." />;
}
