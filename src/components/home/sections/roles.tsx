import Link from "next/link";

import SectionHeading from "./section-heading";
import { Button } from "@/components/ui/button";
import { CircleCheck, ArrowRight, UserRound, ClipboardCheck, Wrench, ShieldCheck } from "lucide-react";

const roles = [
  {
    icon: UserRound,
    role: "Customer",
    title: "Request services without phone calls",
    description:
      "Everything a customer needs to book, track and pay for a service.",
    permissions: [
      "Browse services & create requests",
      "Track request and work order status",
      "View invoice and pay online",
      "Rate and review completed jobs",
    ],
    cta: "Create customer account",
  },
  {
    icon: ClipboardCheck,
    role: "Manager",
    title: "Run the operation with full control",
    description:
      "Review incoming requests and keep every work order moving on schedule.",
    permissions: [
      "Approve or reject service requests",
      "Create and manage work orders",
      "Assign technicians & schedule visits",
      "Monitor progress and review reports",
    ],
    cta: "See manager workflow",
  },
  {
    icon: Wrench,
    role: "Technician",
    title: "Know exactly what to do today",
    description:
      "A simple field view of assignments, visits and jobs in progress.",
    permissions: [
      "Accept or reject assignments",
      "Start and complete assigned work",
      "Submit detailed service reports",
      "Upload photos and documents",
    ],
    cta: "Join as technician",
  },
  {
    icon: ShieldCheck,
    role: "Admin",
    title: "Configure the whole platform",
    description:
      "Full oversight of users, services and system-wide data.",
    permissions: [
      "Manage users and roles",
      "Manage the service catalog",
      "View all requests and work orders",
      "Oversee invoices, payments & reports",
    ],
    cta: "Explore admin panel",
  },
];

export default function RolesSection() {
  return (
    <section id="roles" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Built for every role"
          title="Four roles, one shared workflow"
          description="Each person sees only what they need — while the whole job stays connected from request to feedback."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {roles.map((role) => (
            <article
              key={role.role}
              className="group flex flex-col gap-5 rounded-2xl border bg-card p-6 shadow-sm ring-1 ring-foreground/10 transition-all hover:-translate-y-1 hover:shadow-lg sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                  <role.icon className="size-6" />
                </span>

                <span className="rounded-full border bg-muted px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                  {role.role}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold tracking-tight">
                  {role.title}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {role.description}
                </p>
              </div>

              <ul className="flex flex-col gap-2.5">
                {role.permissions.map((permission) => (
                  <li
                    key={permission}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <CircleCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{permission}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto border-t pt-4">
                <Button
                  variant="ghost"
                  render={<Link href="/register" />}
                  nativeButton={false}
                  className="-ml-2.5 w-full justify-start text-primary hover:text-primary sm:w-auto"
                >
                  {role.cta}
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
