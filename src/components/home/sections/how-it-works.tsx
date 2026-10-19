import SectionHeading from "./section-heading";
import {
  ClipboardList,
  ThumbsUp,
  UserRoundCheck,
  Wrench,
  FileText,
  HandCoins,
} from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Customer raises a request",
    description:
      "The customer picks a service and submits a request with the preferred date, address and problem description.",
    status: "PENDING",
  },
  {
    icon: ThumbsUp,
    title: "Manager approves or rejects",
    description:
      "The manager reviews the request and approves it to open a work order — or rejects it to close the request.",
    status: "APPROVED",
  },
  {
    icon: UserRoundCheck,
    title: "Technician is assigned",
    description:
      "A technician is assigned to the work order, accepts the job and a service visit is scheduled.",
    status: "ASSIGNED",
  },
  {
    icon: Wrench,
    title: "Work starts on site",
    description:
      "The technician visits the customer, starts the work and the job moves to in progress with live status updates.",
    status: "IN_PROGRESS",
  },
  {
    icon: FileText,
    title: "Report & invoice issued",
    description:
      "The technician submits a service report with photos, and an invoice is generated for the completed work.",
    status: "COMPLETED",
  },
  {
    icon: HandCoins,
    title: "Payment & feedback",
    description:
      "The customer pays by cash, card, bKash or Nagad and leaves a 1–5 star rating for the service.",
    status: "PAID",
  },
];

const flow = [
  "PENDING",
  "APPROVED",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "PAID",
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-y bg-muted/40 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title="One clear flow, from request to feedback"
          description="Every job follows the same predictable path, so customers, managers and technicians always know what happens next."
        />

        {/* Steps */}
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm ring-1 ring-foreground/10"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <step.icon className="size-5" />
                </span>

                <span className="text-4xl font-bold text-muted-foreground/25">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>

              <span className="w-fit rounded-full border bg-muted px-2.5 py-1 font-mono text-[11px] font-medium tracking-wide">
                {step.status}
              </span>
            </li>
          ))}
        </ol>

        {/* Status flow */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {flow.map((status, index) => (
            <div key={status} className="flex items-center gap-2 sm:gap-3">
              <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                {status}
              </span>
              {index < flow.length - 1 && (
                <span
                  aria-hidden
                  className="text-muted-foreground/50"
                >
                  &rarr;
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
