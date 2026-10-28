"use client";

import { useState } from "react";
import { CheckCircle2, Plus, Search, Wrench, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceFormDialog from "@/components/admin/services/service-form-dialog";
import ServiceTable from "@/components/admin/services/service-table";

type ServiceFilter = "ALL" | "ACTIVE" | "INACTIVE";

const serviceTabs: { value: ServiceFilter; label: string; icon: typeof Wrench }[] = [
  { value: "ALL", label: "All services", icon: Wrench },
  { value: "ACTIVE", label: "Active", icon: CheckCircle2 },
  { value: "INACTIVE", label: "Inactive", icon: XCircle },
];

export default function AdminServicesPage() {
  const [activeTab, setActiveTab] = useState<ServiceFilter>("ALL");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  return <section className="w-full min-w-0 space-y-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-2"><div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Services</h1><Badge variant="secondary">Admin</Badge></div><p className="text-sm text-muted-foreground sm:text-base">Manage the services available to customers, including descriptions and pricing.</p></div>
      <Button onClick={() => setCreateOpen(true)}><Plus className="size-4" />Create service</Button>
    </div>

    <Card className="w-full min-w-0 overflow-hidden">
      <CardHeader className="border-b bg-muted/20 px-4 py-5 sm:px-6"><CardTitle>Service catalog</CardTitle><CardDescription>Review, create, update, or remove services from the catalog.</CardDescription></CardHeader>
      <CardContent className="min-w-0 p-4 sm:p-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ServiceFilter)} className="w-full min-w-0">
          <div className="flex w-full min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <form onSubmit={(event) => { event.preventDefault(); setSubmittedSearch(search.trim()); }} className="flex w-full min-w-0 flex-col gap-2 sm:flex-row xl:max-w-md">
              <div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search services..." aria-label="Search services" className="h-10 pl-9" /></div>
              <Button type="submit" className="h-10">Search</Button>
              {Boolean(search || submittedSearch) && <Button type="button" variant="outline" className="h-10" onClick={() => { setSearch(""); setSubmittedSearch(""); }}>Clear</Button>}
            </form>
            <div className="w-full min-w-0 overflow-x-auto pb-1 xl:w-auto"><TabsList className="inline-flex h-10 min-w-full justify-start xl:min-w-0">{serviceTabs.map(({ value, label, icon: Icon }) => <TabsTrigger key={value} value={value} className="shrink-0 gap-1.5 px-3 text-xs sm:text-sm"><Icon className="size-4" />{label}</TabsTrigger>)}</TabsList></div>
          </div>
          {serviceTabs.map(({ value }) => <TabsContent key={value} value={value} className="mt-6 w-full min-w-0"><ServiceTable key={`${value}-${submittedSearch}`} filter={value} search={submittedSearch} /></TabsContent>)}
        </Tabs>
      </CardContent>
    </Card>
    {createOpen && <ServiceFormDialog open onOpenChange={setCreateOpen} service={null} />}
  </section>;
}
