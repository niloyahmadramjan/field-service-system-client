"use client";

import { useState } from "react";
import { BadgeDollarSign, CheckCircle2, CircleDollarSign, FileText, Search, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceTable from "@/components/admin/reports/invoice-table";
import type { InvoiceStatus } from "@/types/report.types";

type InvoiceTab = "ALL" | InvoiceStatus;

const invoiceTabs: { value: InvoiceTab; label: string; icon: typeof FileText }[] = [
  { value: "ALL", label: "All invoices", icon: FileText },
  { value: "DRAFT", label: "Draft", icon: BadgeDollarSign },
  { value: "ISSUED", label: "Issued", icon: CircleDollarSign },
  { value: "PAID", label: "Paid", icon: CheckCircle2 },
  { value: "CANCELLED", label: "Cancelled", icon: XCircle },
];

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<InvoiceTab>("ALL");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  return <section className="w-full min-w-0 space-y-6">
    <div className="flex flex-col gap-2"><div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Invoices</h1><Badge variant="secondary">Admin reports</Badge></div><p className="text-sm text-muted-foreground sm:text-base">Review invoice status, due dates, and billed work orders.</p></div>
    <Card className="w-full min-w-0 overflow-hidden">
      <CardHeader className="border-b bg-muted/20 px-4 py-5 sm:px-6"><CardTitle>Invoice management</CardTitle><CardDescription>Manage drafts and issued invoices, and track payments.</CardDescription></CardHeader>
      <CardContent className="min-w-0 p-4 sm:p-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as InvoiceTab)} className="w-full min-w-0">
          <div className="flex w-full min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <form onSubmit={(event) => { event.preventDefault(); setSubmittedSearch(search.trim()); }} className="flex w-full min-w-0 flex-col gap-2 sm:flex-row xl:max-w-md"><div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search invoices..." aria-label="Search invoices" className="h-10 pl-9" /></div><Button type="submit" className="h-10">Search</Button>{Boolean(search || submittedSearch) && <Button type="button" variant="outline" className="h-10" onClick={() => { setSearch(""); setSubmittedSearch(""); }}>Clear</Button>}</form>
            <div className="w-full min-w-0 overflow-x-auto pb-1 xl:w-auto"><TabsList className="inline-flex h-10 min-w-full justify-start xl:min-w-0">{invoiceTabs.map(({ value, label, icon: Icon }) => <TabsTrigger key={value} value={value} className="shrink-0 gap-1.5 px-3 text-xs sm:text-sm"><Icon className="size-4" />{label}</TabsTrigger>)}</TabsList></div>
          </div>
          {invoiceTabs.map(({ value }) => <TabsContent key={value} value={value} className="mt-6 w-full min-w-0"><InvoiceTable key={`${value}-${submittedSearch}`} status={value === "ALL" ? undefined : value} searchTerm={submittedSearch} /></TabsContent>)}
        </Tabs>
      </CardContent>
    </Card>
  </section>;
}
