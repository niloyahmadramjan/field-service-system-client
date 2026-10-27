"use client";

import { useState } from "react";
import { CheckCircle2, ClipboardList, Clock3, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssignmentTable, { type AssignmentTab } from "@/components/technician/jobs/assignment-table";

const tabs: { value: AssignmentTab; label: string; icon: typeof ClipboardList }[] = [
  { value: "ALL", label: "All jobs", icon: ClipboardList },
  { value: "PENDING", label: "Pending", icon: Clock3 },
  { value: "ACCEPTED", label: "Accepted", icon: CheckCircle2 },
  { value: "REJECTED", label: "Declined", icon: XCircle },
];

export default function TechnicianJobsPage() {
  const [activeTab, setActiveTab] = useState<AssignmentTab>("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  return <section className="w-full min-w-0 space-y-6">
    <header className="space-y-2"><div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Assigned jobs</h1><Badge variant="secondary">Technician</Badge></div><p className="text-sm text-muted-foreground sm:text-base">Review incoming work and respond to pending assignments.</p></header>
    <Card className="w-full min-w-0 overflow-hidden"><CardHeader className="border-b bg-muted/20 px-4 py-5 sm:px-6"><CardTitle>Your assignments</CardTitle><CardDescription>Accept or decline pending jobs. Open any assignment for full details.</CardDescription></CardHeader><CardContent className="min-w-0 p-4 sm:p-6"><Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value as AssignmentTab); setPage(1); }} className="w-full min-w-0"><div className="overflow-x-auto pb-1"><TabsList className="inline-flex h-10 min-w-full justify-start sm:min-w-0">{tabs.map(({ value, label, icon: Icon }) => <TabsTrigger key={value} value={value} className="shrink-0 gap-1.5 px-3 text-xs sm:text-sm"><Icon className="size-4" />{label}</TabsTrigger>)}</TabsList></div>{tabs.map(({ value }) => <TabsContent key={value} value={value} className="mt-6"><AssignmentTable key={`${value}-${page}-${limit}`} status={value} page={page} limit={limit} onPageChange={setPage} onLimitChange={(nextLimit) => { setLimit(nextLimit); setPage(1); }} /></TabsContent>)}</Tabs></CardContent></Card>
  </section>;
}
