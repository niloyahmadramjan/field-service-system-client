"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, LoaderCircle, RefreshCw, Wrench } from "lucide-react";
import { useService } from "@/hooks/service.hook";
import { ServiceRequestDialog } from "@/components/service/service-request-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format, isValid, parseISO } from "date-fns";

export function ServiceDetail() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { data, isPending, isError, refetch, isFetching } =
    useService(serviceId);

  if (isPending)
    return (
      <main className="flex flex-1 items-center justify-center gap-3 text-muted-foreground">
        <LoaderCircle className="size-5 animate-spin" /> Loading service…
      </main>
    );
  if (isError || !data?.data)
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <Card className="flex max-w-md flex-col items-center gap-4 p-10 text-center">
          <Wrench className="size-10 text-muted-foreground" />
          <h1 className="text-xl font-semibold">Service details unavailable</h1>
          <p className="text-sm text-muted-foreground">
            We couldn’t find this service. It may have been removed or there may
            be a connection issue.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              <RefreshCw className="size-4" /> Retry
            </Button>
            <Button render={<Link href="/services" />}>All services</Button>
          </div>
        </Card>
      </main>
    );

  const service = data.data;
  const createdDate = parseISO(service.createdAt);
  return (
    <main className="flex-1 bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6"
          render={<Link href="/services" />}
        >
          <ArrowLeft /> All services
        </Button>
        <Card className="overflow-hidden">
          <div className="relative flex min-h-52 items-center justify-center bg-gradient-to-br from-primary/15 via-primary/5 to-background sm:min-h-64">
            <div className="absolute -right-12 -top-24 size-80 rounded-full bg-primary/10 blur-3xl" />
            <Wrench
              className="relative size-20 text-primary/70"
              strokeWidth={1.2}
            />
          </div>
          <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-[1fr_auto]">
            <div>
              <Badge variant={service.isActive ? "default" : "secondary"}>
                {service.isActive ? "Available" : "Currently unavailable"}
              </Badge>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                {service.name}
              </h1>
              <p className="mt-4 max-w-2xl whitespace-pre-line leading-7 text-muted-foreground">
                {service.description}
              </p>
              {isValid(createdDate) && (
                <p className="mt-6 text-sm text-muted-foreground">
                  Service listed {format(createdDate, "MMMM d, yyyy")}
                </p>
              )}
            </div>
            <aside className="flex min-w-56 flex-col items-start gap-3 rounded-xl bg-muted/50 p-5 md:items-end md:text-right">
              <p className="text-sm text-muted-foreground">Service price</p>
              <p className="text-3xl font-bold">
                ৳{service.price}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  BDT
                </span>
              </p>
              <ServiceRequestDialog service={service} />
            </aside>
          </div>
        </Card>
      </div>
    </main>
  );
}
