import Link from "next/link";

import SectionHeading from "./section-heading";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Snowflake,
  Droplets,
  Zap,
  Refrigerator,
  PaintRoller,
  Hammer,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: Snowflake,
    title: "AC Repair",
    description:
      "Cooling issues, gas refilling, compressor repair and seasonal AC servicing.",
    price: "1,500",
  },
  {
    icon: Zap,
    title: "Electrical Repair",
    description:
      "Wiring faults, switches, sockets, fans and complete electrical troubleshooting.",
    price: "1,000",
  },
  {
    icon: Droplets,
    title: "Plumbing",
    description:
      "Leakage fixing, pipe fitting, tap replacement and bathroom repairs.",
    price: "1,200",
  },
  {
    icon: Refrigerator,
    title: "Appliance Repair",
    description:
      "Refrigerator, washing machine, microwave and other home appliance repairs.",
    price: "1,400",
  },
  {
    icon: PaintRoller,
    title: "Painting & Décor",
    description:
      "Interior painting, wall touch-ups, wallpaper and decoration work.",
    price: "2,500",
  },
  {
    icon: Hammer,
    title: "Carpentry",
    description:
      "Furniture repair, door locks, shelves and custom woodwork installations.",
    price: "1,300",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Our services"
          title="Book the service you need, in a few clicks"
          description="Transparent starting prices, verified technicians and status tracking for every request you create."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card
              key={service.title}
              className="group gap-5 rounded-2xl [--card-spacing:--spacing(6)] transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader className="gap-4">
                <span className="flex size-12 items-center justify-center rounded-xl bg-muted text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <service.icon className="size-6" />
                </span>

                <CardTitle className="text-lg font-semibold">
                  {service.title}
                </CardTitle>
                <CardDescription className="leading-6">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="mt-auto justify-between rounded-b-2xl bg-transparent">
                <div>
                  <p className="text-xs text-muted-foreground">Starting at</p>
                  <p className="text-lg font-bold">
                    ৳{service.price}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      BDT
                    </span>
                  </p>
                </div>

                <Link
                  href="/register"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:underline"
                >
                  Request
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
