"use client";

import { BriefcaseBusiness, CircleHelp, LoaderCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTechnicianApplication } from "@/hooks/customer.hook";
import { displayDate } from "@/lib/customer-format";

export default function TechnicianApplicationPage() {
  const query = useTechnicianApplication();
  if (query.isPending) return <div className="flex min-h-64 items-center justify-center gap-3 text-muted-foreground"><LoaderCircle className="size-5 animate-spin" /> Loading application status…</div>;
  if (query.isError) return <Card className="mx-auto max-w-xl"><CardHeader><CardTitle>Application status unavailable</CardTitle><CardDescription>We couldn’t retrieve your technician application right now.</CardDescription></CardHeader><CardContent><Button variant="outline" onClick={() => void query.refetch()}><RefreshCw className="size-4" /> Try again</Button></CardContent></Card>;
  const application = query.data?.data;
  return <section className="mx-auto max-w-3xl"><div className="mb-6 flex items-start gap-3"><div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><BriefcaseBusiness className="size-5" /></div><div><h1 className="text-2xl font-bold tracking-tight">Technician application</h1><p className="mt-1 text-sm text-muted-foreground">View the status of your application to join the technician team.</p></div></div><Card><CardHeader><CardTitle>{application ? "Your application" : "No application found"}</CardTitle><CardDescription>{application ? "Your application status is shown below." : "There is no technician application associated with your account."}</CardDescription></CardHeader><CardContent>{application ? <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-muted/30 p-4"><div><p className="font-medium">Application status</p>{application.createdAt && <p className="mt-1 text-sm text-muted-foreground">Submitted {displayDate(application.createdAt)}</p>}{application.employeeId && <p className="mt-1 text-sm text-muted-foreground">Employee ID: {application.employeeId}</p>}</div><Badge variant={application.applicationStatus === "APPROVED" ? "default" : application.applicationStatus === "REJECTED" ? "destructive" : "secondary"}>{application.applicationStatus}</Badge></div> : <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4"><CircleHelp className="mt-0.5 size-5 text-muted-foreground" /><p className="text-sm leading-6 text-muted-foreground">The backend documentation describes an application endpoint but does not define its submission fields. Please contact the service team to apply; this page will display your status once an application exists.</p></div>}</CardContent></Card></section>;
}
