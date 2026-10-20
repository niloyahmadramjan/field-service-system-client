"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText, LoaderCircle, RefreshCw } from "lucide-react";
import { RequestActions } from "@/components/dashboard/request-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMyRequest } from "@/hooks/customer.hook";
import { displayDate } from "@/lib/customer-format";

export function RequestDetail() {
  const { requestId } = useParams<{ requestId: string }>();
  const query = useMyRequest(requestId);
  if (query.isPending) return <div className="flex min-h-64 items-center justify-center gap-3 text-muted-foreground"><LoaderCircle className="size-5 animate-spin" /> Loading request…</div>;
  if (query.isError || !query.data?.data) return <Card className="mx-auto max-w-xl"><CardHeader><CardTitle>Request unavailable</CardTitle><CardDescription>This request could not be found or loaded.</CardDescription></CardHeader><CardContent className="flex gap-2"><Button variant="outline" onClick={() => void query.refetch()}><RefreshCw className="size-4" /> Retry</Button><Button render={<Link href="/dashboard/requests" />} nativeButton={false}>All requests</Button></CardContent></Card>;
  const request = query.data.data;
  return <section className="mx-auto max-w-4xl"><Button variant="ghost" className="mb-5" render={<Link href="/dashboard/requests" />} nativeButton={false}><ArrowLeft /> All requests</Button><Card><CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4"><div className="flex items-start gap-3"><div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileText className="size-5" /></div><div><CardTitle>{request.title}</CardTitle><CardDescription className="mt-1">Request {request.requestNumber}</CardDescription></div></div><div className="flex items-center gap-3"><Badge variant={request.status === "APPROVED" ? "default" : request.status === "REJECTED" || request.status === "CANCELLED" ? "destructive" : "secondary"}>{request.status}</Badge><RequestActions request={request} /></div></CardHeader><CardContent><p className="whitespace-pre-wrap leading-7 text-muted-foreground">{request.description}</p><div className="mt-6 grid gap-5 border-t pt-5 sm:grid-cols-2"><Detail label="Preferred appointment" value={displayDate(request.preferredDate, true)} /><Detail label="Address" value={request.address} /><Detail label="City" value={request.city} /><Detail label="District" value={request.district} /><Detail label="Created" value={displayDate(request.createdAt, true)} /><Detail label="Last updated" value={displayDate(request.updatedAt, true)} /></div></CardContent></Card></section>;
}

function Detail({ label, value }: { label: string; value: string }) { return <div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 text-sm font-medium">{value || "—"}</p></div>; }
