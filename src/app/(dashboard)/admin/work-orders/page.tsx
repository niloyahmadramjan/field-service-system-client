"use client";

import { useState } from "react";
import { BriefcaseBusiness, CheckCircle2, Clock3, ClipboardList, Search, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { WorkOrderStatus } from "@/types/work-order.types";
import WorkOrderTable from "@/components/admin/work-orders/work-order-table";

type WorkOrderTab = "ALL" | WorkOrderStatus;

const tabs: { value: WorkOrderTab; label: string; icon: typeof ClipboardList }[] = [
  { value: "ALL", label: "All work", icon: ClipboardList },
  { value: "CREATED", label: "Created", icon: Clock3 },
  { value: "ASSIGNED", label: "Assigned", icon: BriefcaseBusiness },
  { value: "IN_PROGRESS", label: "In progress", icon: Clock3 },
  { value: "COMPLETED", label: "Completed", icon: CheckCircle2 },
  { value: "CANCELLED", label: "Cancelled", icon: XCircle },
];

export default function AdminWorkOrdersPage() {
  const [activeTab, setActiveTab] = useState<WorkOrderTab>("ALL");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  return (
    <section className="w-full min-w-0 space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Work orders</h1>
          <Badge variant="secondary">Admin</Badge>
        </div>
        <p className="text-sm text-muted-foreground sm:text-base">Track service work, assign technicians, and manage order status.</p>
      </div>

      <Card className="w-full min-w-0 overflow-hidden">
        <CardHeader className="border-b bg-muted/20 px-4 py-5 sm:px-6">
          <CardTitle>Work order management</CardTitle>
          <CardDescription>Review customer jobs and follow each order through completion.</CardDescription>
        </CardHeader>
        <CardContent className="min-w-0 p-4 sm:p-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as WorkOrderTab)} className="w-full min-w-0">
            <div className="flex w-full min-w-0 flex-col gap-4">
              <form onSubmit={(event) => { event.preventDefault(); setSubmittedSearch(search.trim()); }} className="flex w-full min-w-0 flex-col gap-2 sm:flex-row">
                <div className="relative min-w-0 flex-1 sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search work orders..." aria-label="Search work orders" className="h-10 pl-9" />
                </div>
                <Button type="submit" className="h-10">Search</Button>
                {Boolean(search || submittedSearch) && <Button type="button" variant="outline" className="h-10" onClick={() => { setSearch(""); setSubmittedSearch(""); }}>Clear</Button>}
              </form>
              <div className="w-full overflow-x-auto pb-1">
                <TabsList className="inline-flex h-10 min-w-full justify-start sm:min-w-0">
                  {tabs.map(({ value, label, icon: Icon }) => <TabsTrigger key={value} value={value} className="shrink-0 gap-1.5 px-3 text-xs sm:text-sm"><Icon className="size-4" />{label}</TabsTrigger>)}
                </TabsList>
              </div>
            </div>
            {tabs.map(({ value }) => (
              <TabsContent key={value} value={value} className="mt-6 w-full min-w-0">
                <WorkOrderTable status={value === "ALL" ? undefined : value} search={submittedSearch} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
}
