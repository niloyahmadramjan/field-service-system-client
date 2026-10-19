import SectionHeading from "./section-heading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "I booked an AC repair in the morning and a technician arrived the same day. Every status update was visible and I paid the invoice straight from my phone.",
    name: "Rahim Hasan",
    meta: "Homeowner · Dhaka",
    initials: "RH",
  },
  {
    quote:
      "Our request was approved in minutes and a technician was assigned. The service report and invoice were ready by the evening — no follow-up calls needed.",
    name: "Nusrat Jahan",
    meta: "Shop owner · Chattogram",
    initials: "NJ",
  },
  {
    quote:
      "My dashboard shows every assignment and visit for the day. Uploading photos and submitting the service report after a job takes about a minute.",
    name: "Karim Uddin",
    meta: "Field technician · Sylhet",
    initials: "KU",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Customer stories"
          title="Loved by customers and field teams"
          description="Real feedback from the people who book services, run operations and do the work."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="relative flex flex-col gap-5 rounded-2xl border bg-card p-6 shadow-sm ring-1 ring-foreground/10 sm:p-7"
            >
              <Quote
                aria-hidden
                className="absolute top-5 right-5 size-8 text-muted-foreground/15"
              />

              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-primary text-primary" />
                ))}
              </div>

              <blockquote className="flex-1 text-sm leading-7 text-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <figcaption className="flex items-center gap-3 border-t pt-5">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.meta}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
