import { ServiceList } from "@/components/service/service-list";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export default function ServicesPage() {
  return <main className="flex-1 bg-muted/20"><section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><div className="mx-auto mb-10 max-w-2xl text-center"><Badge variant="secondary" className="mb-4 gap-1"><Sparkles className="size-3" /> Trusted local professionals</Badge><h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Services for your home</h1><p className="mt-4 text-muted-foreground">Browse our available services, compare details, and request a visit that works for you.</p></div><ServiceList /></section></main>;
}
