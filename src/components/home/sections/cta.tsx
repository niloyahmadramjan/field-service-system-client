import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:pb-24">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12 sm:py-16">
        {/* Decorative */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-16 size-64 rounded-full bg-white/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -bottom-28 size-72 rounded-full bg-white/10"
        />

        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Ready to run your field service from one platform?
          </h2>

          <p className="max-w-xl text-sm leading-7 text-balance text-white/75 sm:text-base">
            Create an account in minutes — raise requests, approve jobs,
            dispatch technicians, send invoices and collect feedback without
            switching tools.
          </p>

          <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              render={<Link href="/register" />}
              nativeButton={false}
              className="h-11 bg-background px-6 text-base text-foreground hover:bg-background/90"
            >
              Get started free
              <ArrowRight data-icon="inline-end" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              render={<Link href="/login" />}
              nativeButton={false}
              className="h-11 border-white/30 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white"
            >
              <Phone data-icon="inline-start" />
              Talk to our team
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
