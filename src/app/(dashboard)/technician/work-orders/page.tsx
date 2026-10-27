"use client";

import { useState } from "react";
import { BriefcaseBusiness, CheckCircle2, Clock3, ClipboardList, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TechnicianWorkOrderTable from "@/components/technician/work-orders/work-order-table";
import type { WorkOrderStatus } from "@/types/work-order.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

type WorkOrderTab = "ALL" | WorkOrderStatus;

const tabs: { value: WorkOrderTab; label: string; icon: typeof ClipboardList }[] = [
  { value: "ALL", label: "All work", icon: ClipboardList },
  { value: "CREATED", label: "Created", icon: Clock3 },
  { value: "ASSIGNED", label: "Assigned", icon: BriefcaseBusiness },
  { value: "IN_PROGRESS", label: "In progress", icon: Clock3 },
  { value: "COMPLETED", label: "Completed", icon: CheckCircle2 },
  { value: "CANCELLED", label: "Cancelled", icon: XCircle },
];

export default function TechnicianWorkOrdersPage() {
  const [activeTab, setActiveTab] = useState<WorkOrderTab>("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  return <section className="w-full min-w-0 space-y-6">
    <div className="flex flex-col gap-2"><div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My work orders</h1><Badge variant="secondary">Technician</Badge></div><p className="text-sm text-muted-foreground sm:text-base">Review the work orders assigned to you.</p></div>
    <Card className="w-full min-w-0 overflow-hidden"><CardHeader className="border-b bg-muted/20 px-4 py-5 sm:px-6"><CardTitle>Assigned work</CardTitle><CardDescription>Open a work order to review customer, service, and visit details.</CardDescription></CardHeader><CardContent className="min-w-0 p-4 sm:p-6"><Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value as WorkOrderTab); setPage(1); }} className="w-full min-w-0"><div className="w-full overflow-x-auto pb-1"><TabsList className="inline-flex h-10 min-w-full justify-start sm:min-w-0">{tabs.map(({ value, label, icon: Icon }) => <TabsTrigger key={value} value={value} className="shrink-0 gap-1.5 px-3 text-xs sm:text-sm"><Icon className="size-4" />{label}</TabsTrigger>)}</TabsList></div><div className="mt-5 flex flex-col gap-2 sm:flex-row"><form className="flex min-w-0 flex-1 gap-2" onSubmit={(event) => { event.preventDefault(); setPage(1); setSearchTerm(searchInput.trim()); }}><div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search work order, title, or customer…" className="pl-9" /></div><Button type="submit">Search</Button></form>{searchTerm && <Button type="button" variant="outline" onClick={() => { setSearchInput(""); setSearchTerm(""); setPage(1); }}><X className="mr-1 size-4" />Clear</Button>}</div>{tabs.map(({ value }) => <TabsContent key={value} value={value} className="mt-6 w-full min-w-0"><TechnicianWorkOrderTable key={`${value}-${page}-${limit}-${searchTerm}`} status={value} page={page} limit={limit} searchTerm={searchTerm} onPageChange={setPage} onLimitChange={(nextLimit) => { setLimit(nextLimit); setPage(1); }} /></TabsContent>)}</Tabs></CardContent></Card>
  </section>;
}
