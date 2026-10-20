import Link from "next/link";
import { ArrowRight, CalendarDays, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Service } from "@/types/service.types";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden border-border/70 transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-background">
        <div className="absolute -right-8 -top-12 size-40 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/20" />
        <Wrench className="relative size-14 text-primary/75" strokeWidth={1.25} />
        <Badge className="absolute right-4 top-4" variant={service.isActive ? "default" : "secondary"}>
          {service.isActive ? "Available" : "Unavailable"}
        </Badge>
      </div>
      <CardHeader className="flex-1 gap-2">
        <CardTitle className="text-lg">{service.name}</CardTitle>
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{service.description}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground">Service price</p>
        <p className="text-2xl font-semibold tracking-tight">৳{service.price}<span className="ml-1 text-sm font-normal text-muted-foreground">BDT</span></p>
      </CardContent>
      <CardFooter className="flex justify-between gap-3 border-t bg-muted/30">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays className="size-3.5" /> Professional service</span>
        <Button size="sm" disabled={!service.isActive} render={<Link href={`/services/${service.id}`} />} nativeButton={false}>
          View details <ArrowRight data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  );
}
