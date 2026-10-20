"use client";

import { Wrench } from "lucide-react";
import { RecordsPanel, type CustomerRecordRow } from "@/components/dashboard/records-panel";
import { useMyWorkOrders } from "@/hooks/customer.hook";
import { displayDate, displayMoney, listItems } from "@/lib/customer-format";

export default function WorkOrdersPage() {
  const query = useMyWorkOrders();
  const rows: CustomerRecordRow[] = listItems(query.data).map((order) => ({ id: order.id, title: order.workOrderNumber, description: order.serviceRequest?.service?.name ?? order.serviceRequest?.title ?? "Customer work order", status: order.status, details: [{ label: "Request", value: order.serviceRequest?.title ?? "—" }, { label: "Technician", value: order.technician?.user?.name ?? "Not assigned" }, { label: "Estimated cost", value: displayMoney(order.estimatedCost) }, { label: "Actual cost", value: displayMoney(order.actualCost) }, { label: "Created", value: displayDate(order.createdAt) }, { label: "Completed", value: displayDate(order.completedAt) }] }));
  return <RecordsPanel title="Work orders" description="Follow approved service requests through assignment and completion." icon={<Wrench />} rows={rows} isPending={query.isPending} isError={query.isError} onRetry={() => void query.refetch()} emptyTitle="No work orders yet" emptyDescription="An approved request will appear here as a work order." />;
}
