"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, CalendarDays, LoaderCircle, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AssignmentActions from "@/components/technician/jobs/assignment-actions";
import { useAssignment } from "@/hooks/assignment.hook";

function dateLabel(value?: string | null) {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not set" : new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
function Detail({ label, value }: { label: string; value?: ReactNode }) {
  return <div className="min-w-0 space-y-1"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="wrap-break-word text-sm">{value || "—"}</p></div>;
}

export default function TechnicianAssignmentDetailPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const query = useAssignment(assignmentId);
  const assignment = query.data?.data;
  if (query.isPending) return <div className="flex min-h-64 items-center justify-center text-muted-foreground"><LoaderCircle className="mr-2 size-5 animate-spin" />Loading assignment…</div>;
  if (query.isError || !assignment) return <section className="space-y-4"><Button nativeButton={false} variant="ghost" render={<Link href="/technician/jobs" />}><ArrowLeft className="size-4" />Back to assignments</Button><Card><CardContent className="py-12 text-center text-destructive">{query.error?.message || "Assignment could not be found."}</CardContent></Card></section>;

  return <section className="mx-auto w-full min-w-0 space-y-6">
    <Button nativeButton={false} variant="ghost" className="-ml-3" render={<Link href="/technician/jobs" />}><ArrowLeft className="size-4" />Back to assignments</Button>
    <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Assignment details</h1><Badge variant={assignment.status === "ACCEPTED" ? "secondary" : assignment.status === "REJECTED" ? "destructive" : "outline"}>{assignment.status}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{assignment.workOrder.workOrderNumber} · Assigned {dateLabel(assignment.assignedAt)}</p></div>{assignment.status === "PENDING" && <AssignmentActions assignmentId={assignment.id} />}</header>
    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.7fr)]"><div className="space-y-6">
      <Card><CardHeader><div className="flex items-start gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><BriefcaseBusiness className="size-5" /></span><div className="min-w-0"><CardTitle>{assignment.workOrder.title}</CardTitle><CardDescription className="mt-1">{assignment.workOrder.description || "No work description provided."}</CardDescription></div></div></CardHeader><CardContent className="grid gap-5 border-t pt-5 sm:grid-cols-2"><Detail label="Work order" value={assignment.workOrder.workOrderNumber} /><Detail label="Work order status" value={<Badge variant="secondary">{assignment.workOrder.status.replaceAll("_", " ")}</Badge>} /><Detail label="Assignment response" value={assignment.status} /><Detail label="Assigned at" value={dateLabel(assignment.assignedAt)} /><Detail label="Responded at" value={dateLabel(assignment.respondedAt)} /><Detail label="Estimated cost" value={assignment.workOrder.estimatedCost == null ? "Not estimated" : String(assignment.workOrder.estimatedCost)} /></CardContent></Card>
      <Card><CardHeader><div className="flex items-center gap-2"><UserRound className="size-4 text-muted-foreground" /><CardTitle className="text-base">Assigned technician</CardTitle></div></CardHeader><CardContent className="grid gap-5 border-t pt-5 sm:grid-cols-2"><Detail label="Name" value={assignment.technician?.user?.name} /><Detail label="Employee ID" value={assignment.technician?.employeeId} /><Detail label="Email" value={assignment.technician?.user?.email} /><Detail label="Phone" value={assignment.technician?.user?.phone} /><Detail label="Skills" value={assignment.technician?.skills} /><Detail label="Availability" value={assignment.technician?.status} /></CardContent></Card>
    </div>
    <Card className="h-fit"><CardHeader><div className="flex items-center gap-2"><CalendarDays className="size-4 text-muted-foreground" /><CardTitle className="text-base">Assignment record</CardTitle></div><CardDescription>Assignment and coordinator information.</CardDescription></CardHeader><CardContent className="space-y-4 border-t pt-5"><Detail label="Assignment ID" value={assignment.id} /><Detail label="Work order ID" value={assignment.workOrderId} /><Detail label="Assigned by" value={assignment.assignedBy?.name} /><Detail label="Coordinator email" value={assignment.assignedBy?.email} /><Detail label="Coordinator phone" value={assignment.assignedBy?.phone} /><Detail label="Last updated" value={dateLabel(assignment.updatedAt)} /></CardContent></Card></div>
  </section>;
}
