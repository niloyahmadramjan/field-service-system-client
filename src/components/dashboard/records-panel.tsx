"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, LoaderCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CustomerRecordRow {
  id: string;
  title: string;
  href?: string;
  description: string;
  status?: string;
  details: Array<{ label: string; value: string }>;
  action?: ReactNode;
}

export function RecordsPanel({ title, description, icon, rows, isPending, isError, onRetry, emptyTitle, emptyDescription, emptyAction }: {
  title: string;
  description: string;
  icon: ReactNode;
  rows: CustomerRecordRow[];
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction?: ReactNode;
}) {
  return <section className="mx-auto max-w-5xl"><div className="mb-6 flex items-start gap-3"><div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-5">{icon}</div><div><h1 className="text-2xl font-bold tracking-tight">{title}</h1><p className="mt-1 text-sm text-muted-foreground">{description}</p></div></div>
    {isPending ? <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-muted-foreground"><LoaderCircle className="size-5 animate-spin" /> Loading your {title.toLowerCase()}…</div> : isError ? <Card className="flex flex-col items-center gap-3 p-10 text-center"><AlertCircle className="size-8 text-destructive" /><h2 className="font-semibold">Couldn’t load {title.toLowerCase()}</h2><p className="max-w-md text-sm text-muted-foreground">There was a problem retrieving your information. Try again in a moment.</p><Button variant="outline" onClick={onRetry}><RefreshCw className="size-4" /> Try again</Button></Card> : rows.length === 0 ? <Card className="flex flex-col items-center gap-3 p-10 text-center"><div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-6">{icon}</div><h2 className="font-semibold">{emptyTitle}</h2><p className="max-w-md text-sm text-muted-foreground">{emptyDescription}</p>{emptyAction}</Card> : <div className="space-y-4">{rows.map((row) => <Card key={row.id} className="p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h2 className="font-semibold">{row.href ? <Link href={row.href} className="underline-offset-4 hover:text-primary hover:underline">{row.title}</Link> : row.title}</h2><p className="mt-1 text-sm text-muted-foreground">{row.description}</p></div><div className="flex items-center gap-2">{row.status && <Badge className={cn(row.status === "PAID" || row.status === "COMPLETED" || row.status === "APPROVED" || row.status === "SUCCESS" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" : row.status === "REJECTED" || row.status === "CANCELLED" || row.status === "FAILED" ? "bg-red-100 text-red-800 hover:bg-red-100" : "")} variant="secondary">{row.status.replaceAll("_", " ")}</Badge>}{row.action}</div></div><div className="mt-5 grid gap-x-5 gap-y-4 border-t pt-4 sm:grid-cols-2 lg:grid-cols-3">{row.details.map((detail) => <div key={detail.label}><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{detail.label}</p><p className="mt-1 break-words text-sm font-medium">{detail.value || "—"}</p></div>)}</div></Card>)}</div>}
  </section>;
}
