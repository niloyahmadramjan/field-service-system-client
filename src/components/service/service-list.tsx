"use client";

import { useState } from "react";
import { useServices } from "@/hooks/service.hook";
import { ServiceCard } from "@/components/service/service-card";
import { ServicePagination } from "@/components/service/service-pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoaderCircle, RefreshCw, Wrench } from "lucide-react";

export function ServiceList() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, refetch, isFetching } = useServices(page);
  const result = data?.data;

  if (isPending) return <div className="flex min-h-64 items-center justify-center gap-3 text-muted-foreground"><LoaderCircle className="size-5 animate-spin" /> Loading services…</div>;
  if (isError) return <Card className="mx-auto flex max-w-xl flex-col items-center gap-4 p-10 text-center"><Wrench className="size-10 text-muted-foreground" /><h2 className="text-xl font-semibold">Services couldn’t be loaded</h2><p className="text-sm text-muted-foreground">Check your connection and try again.</p><Button variant="outline" onClick={() => void refetch()} disabled={isFetching}><RefreshCw className="size-4" /> Try again</Button></Card>;

  return <>
    {result?.data.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{result.data.map((service) => <ServiceCard key={service.id} service={service} />)}</div> : <Card className="flex flex-col items-center gap-3 p-12 text-center"><Wrench className="size-10 text-muted-foreground" /><h2 className="text-xl font-semibold">No services available yet</h2><p className="text-sm text-muted-foreground">Please check back soon.</p></Card>}
    {result && <ServicePagination meta={result.meta} onPageChange={setPage} />}
  </>;
}
