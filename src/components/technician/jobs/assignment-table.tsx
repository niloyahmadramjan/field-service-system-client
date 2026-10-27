"use client";

import Link from "next/link";
import { Eye, LoaderCircle, SearchX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import RequestPagination from "@/components/admin/requests/request-pagination";
import { useAssignments } from "@/hooks/assignment.hook";
import type { Assignment, AssignmentStatus } from "@/types/assignment.types";
import AssignmentActions from "./assignment-actions";

export type AssignmentTab = "ALL" | AssignmentStatus;
function dateLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
function statusBadge(status: AssignmentStatus) {
  const styles: Record<AssignmentStatus, string> = { PENDING: "border-amber-200 bg-amber-50 text-amber-700", ACCEPTED: "border-emerald-200 bg-emerald-50 text-emerald-700", REJECTED: "border-rose-200 bg-rose-50 text-rose-700" };
  return <Badge variant="outline" className={styles[status]}>{status}</Badge>;
}

export default function AssignmentTable({ status, page, limit, onPageChange, onLimitChange }: { status: AssignmentTab; page: number; limit: number; onPageChange: (page: number) => void; onLimitChange: (limit: number) => void }) {
  const query = useAssignments({ page, limit });
  const assignments = (query.data?.data ?? []).filter((item: Assignment) => status === "ALL" || item.status === status);
  return <div className="space-y-4">
    <div className="overflow-x-auto rounded-xl border bg-card"><Table><TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead>Assignment</TableHead><TableHead>Work order</TableHead><TableHead>Assigned</TableHead><TableHead>Work status</TableHead><TableHead>Response</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
      {query.isPending && <TableRow><TableCell colSpan={6} className="h-40 text-center text-muted-foreground"><LoaderCircle className="mr-2 inline size-4 animate-spin" />Loading assignments…</TableCell></TableRow>}
      {query.isError && <TableRow><TableCell colSpan={6} className="h-40 text-center text-destructive">{query.error.message || "Unable to load assignments."}</TableCell></TableRow>}
      {!query.isPending && !query.isError && assignments.length === 0 && <TableRow><TableCell colSpan={6} className="h-44 text-center"><div className="flex flex-col items-center gap-2"><SearchX className="size-8 text-muted-foreground/60" /><span className="font-medium">No assignments found</span><span className="text-sm text-muted-foreground">New jobs assigned to you will appear here.</span></div></TableCell></TableRow>}
      {assignments.map((assignment) => <TableRow key={assignment.id}>
        <TableCell><div className="space-y-1"><span className="font-semibold">{assignment.workOrder?.title ?? "Work assignment"}</span><p className="text-xs text-muted-foreground">Assigned {dateLabel(assignment.assignedAt)}</p></div></TableCell>
        <TableCell><Link className="font-medium hover:text-primary" href={`/technician/work-orders/${assignment.workOrderId}`}>{assignment.workOrder?.workOrderNumber ?? assignment.workOrderId}</Link></TableCell>
        <TableCell>{dateLabel(assignment.assignedAt)}</TableCell>
        <TableCell><Badge variant="secondary">{assignment.workOrder?.status?.replaceAll("_", " ") ?? "—"}</Badge></TableCell>
        <TableCell>{statusBadge(assignment.status)}</TableCell>
        <TableCell><div className="flex flex-wrap justify-end gap-2"><Button nativeButton={false} variant="ghost" size="sm" render={<Link href={`/technician/jobs/${assignment.id}`} />}><Eye className="size-4" /><span className="sr-only sm:not-sr-only">Details</span></Button>{assignment.status === "PENDING" && <AssignmentActions assignmentId={assignment.id} />}</div></TableCell>
      </TableRow>)}
    </TableBody></Table></div>
    {query.data?.meta && <RequestPagination page={page} pageSize={limit} total={query.data.meta.total} totalPages={query.data.meta.totalPages} onPageChange={onPageChange} onPageSizeChange={onLimitChange} />}
  </div>;
}
