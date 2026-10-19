import SectionHeading from "./section-heading";
import {
  ShieldCheck,
  Route,
  CalendarCheck,
  Paperclip,
  ReceiptText,
  Star,
  LayoutDashboard,
  Users,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Role-based access",
    description:
      "Admin, manager, technician and customer each get a secure, purpose-built view.",
  },
  {
    icon: Route,
    title: "Live status tracking",
    description:
      "Follow every job through pending, approved, assigned, in progress and completed.",
  },
  {
    icon: CalendarCheck,
    title: "Visit scheduling",
    description:
      "Plan service visits with dates, time windows and technician availability.",
  },
  {
    icon: Paperclip,
    title: "Reports & attachments",
    description:
      "Diagnosis, work performed and notes with photo and document uploads.",
  },
  {
    icon: ReceiptText,
    title: "Invoicing & payments",
    description:
      "Automatic invoices with cash, card, bank transfer, bKash and Nagad support.",
  },
  {
    icon: Star,
    title: "Feedback & ratings",
    description:
      "Collect a 1–5 star rating and comment for every completed work order.",
  },
  {
    icon: LayoutDashboard,
    title: "Role dashboards",
    description:
      "Each role lands on a dashboard with the numbers and tasks that matter.",
  },
  {
    icon: Users,
    title: "Team management",
    description:
      "Manage users, customers, technicians and the service catalog in one place.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="border-y bg-muted/40 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Features"
          title="Everything a service company needs"
          description="No add-ons or complex setup — the essentials are included from day one."
        />

        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg border bg-card text-primary shadow-sm">
                <feature.icon className="size-5" />
              </span>

              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
