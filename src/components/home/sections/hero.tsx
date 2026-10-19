import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, ArrowRight, CircleCheck } from "lucide-react";

const reviewers = ["RH", "KS", "AN", "TM"];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/60 via-background to-background">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 size-72 rounded-full bg-primary/5 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -bottom-24 size-80 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-14 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:pt-20 lg:pb-24">
        {/* Copy */}
        <div className="flex flex-col items-start gap-6">
          <Badge variant="secondary" className="h-7 gap-1.5 px-3 text-sm">
            <Star className="size-3.5 fill-primary text-primary" />
            Trusted by 500+ service companies in Bangladesh
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Manage every field job
            <span className="block text-muted-foreground">
              from request to payment.
            </span>
          </h1>

          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Customers raise requests, managers approve and assign technicians,
            technicians complete visits and submit reports — then invoicing,
            payment and feedback all happen in one organized workspace.
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              size="lg"
              render={<Link href="/register" />}
              nativeButton={false}
              className="h-11 px-6 text-base"
            >
              Get started free
              <ArrowRight data-icon="inline-end" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              render={<Link href="/#services" />}
              nativeButton={false}
              className="h-11 px-6 text-base"
            >
              Browse services
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex -space-x-2.5">
              {reviewers.map((name) => (
                <Avatar key={name} className="size-9 border-2 border-background">
                  <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                    {name}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>

            <div className="text-sm">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-primary text-primary"
                  />
                ))}
                <span className="ml-1.5 font-semibold">4.9/5</span>
              </div>
              <p className="text-muted-foreground">
                from 1,200+ completed jobs
              </p>
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className="relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-muted shadow-xl ring-1 ring-foreground/10 sm:aspect-[3/2]">
            <Image
              src="/Field-Service-Register.webp"
              alt="Field technician servicing equipment on site"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Floating status card */}
          <div className="absolute -top-4 -left-2 hidden rounded-xl border bg-card p-3 shadow-lg ring-1 ring-foreground/10 sm:block sm:-left-6">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <CircleCheck className="size-5" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Work Order</p>
                <p className="text-sm font-semibold">WO-1001 · Approved</p>
              </div>
            </div>
          </div>

          {/* Floating technician card */}
          <div className="absolute -right-2 -bottom-5 hidden rounded-xl border bg-card p-3 shadow-lg ring-1 ring-foreground/10 sm:block sm:-right-6">
            <div className="flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarFallback className="bg-muted text-xs font-semibold">
                  KA
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-muted-foreground">Technician</p>
                <p className="text-sm font-semibold">Karim · Assigned</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
