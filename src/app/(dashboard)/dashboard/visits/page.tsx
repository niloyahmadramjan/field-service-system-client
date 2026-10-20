"use client";

import { CalendarDays } from "lucide-react";
import { RecordsPanel, type CustomerRecordRow } from "@/components/dashboard/records-panel";
import { useMyVisits } from "@/hooks/customer.hook";
import { displayDate, listItems } from "@/lib/customer-format";

export default function VisitsPage() {
  const query = useMyVisits();
  const rows: CustomerRecordRow[] = listItems(query.data).map((visit) => ({ id: visit.id, title: visit.workOrder?.serviceRequest?.service?.name ?? visit.workOrder?.serviceRequest?.title ?? "Service visit", description: visit.workOrder?.workOrderNumber ? `Work order ${visit.workOrder.workOrderNumber}` : "Scheduled field service visit", status: visit.status, details: [{ label: "Scheduled start", value: displayDate(visit.scheduledStart, true) }, { label: "Scheduled end", value: displayDate(visit.scheduledEnd, true) }, { label: "Technician", value: visit.technician?.user?.name ?? "Not assigned" }, { label: "Actual start", value: displayDate(visit.actualStart, true) }, { label: "Actual end", value: displayDate(visit.actualEnd, true) }] }));
  return <RecordsPanel title="Service visits" description="View upcoming visits and the history of completed appointments." icon={<CalendarDays />} rows={rows} isPending={query.isPending} isError={query.isError} onRetry={() => void query.refetch()} emptyTitle="No visits scheduled" emptyDescription="Your scheduled service appointments will appear here." />;
}
