"use client";

import Link from "next/link";
import { useState } from "react";
import { FileText } from "lucide-react";
import { RecordsPanel, type CustomerRecordRow } from "@/components/dashboard/records-panel";
import { Button } from "@/components/ui/button";
import { RequestActions } from "@/components/dashboard/request-actions";
import { listPageMeta } from "@/lib/customer-format";
import { useMyRequests } from "@/hooks/customer.hook";
import { displayDate, listItems } from "@/lib/customer-format";

export default function RequestsPage() {
  const [page, setPage] = useState(1);
  const query = useMyRequests(page, 10);
  const rows: CustomerRecordRow[] = listItems(query.data).map((request) => ({ id: request.id, href: `/dashboard/requests/${request.id}`, title: request.title, description: request.service?.name ?? `Request ${request.requestNumber}`, status: request.status, details: [{ label: "Request number", value: request.requestNumber }, { label: "Requested visit", value: displayDate(request.preferredDate, true) }, { label: "Address", value: [request.address, request.city, request.district].filter(Boolean).join(", ") }, { label: "Submitted", value: displayDate(request.createdAt) }], action: <RequestActions request={request} /> }));
  const meta = listPageMeta(query.data);
  return <div className="space-y-5"><RecordsPanel title="Service requests" description="Track the requests you’ve submitted and their review status." icon={<FileText />} rows={rows} isPending={query.isPending} isError={query.isError} onRetry={() => void query.refetch()} emptyTitle="No service requests yet" emptyDescription="When you request a service, its status and details will appear here." emptyAction={<Button render={<Link href="/services" />} nativeButton={false}>Browse services</Button>} />{meta && meta.totalPages > 1 && <nav aria-label="Request pages" className="flex items-center justify-center gap-2"><Button variant="outline" size="sm" disabled={page <= 1 || query.isFetching} onClick={() => setPage((current) => current - 1)}>Previous</Button><span className="px-3 text-sm text-muted-foreground">Page {meta.page} of {meta.totalPages} · {meta.total} requests</span><Button variant="outline" size="sm" disabled={page >= meta.totalPages || query.isFetching} onClick={() => setPage((current) => current + 1)}>Next</Button></nav>}</div>;
}
