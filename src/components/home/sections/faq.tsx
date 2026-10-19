"use client";

import SectionHeading from "./section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I create a service request?",
    answer:
      "Register a customer account, pick a service from the service list, then submit a request with a title, description, preferred date and your address. Your request starts with a PENDING status and appears immediately for the manager to review.",
  },
  {
    question: "How long does approval take?",
    answer:
      "Managers review incoming requests from their dashboard. Once approved, a work order is created and a technician is assigned. If a request is rejected, it is closed and you can create a new request.",
  },
  {
    question: "Can I track my request and work order status?",
    answer:
      "Yes. Your dashboard shows the live status of every request and work order — from PENDING, APPROVED and ASSIGNED through IN_PROGRESS and COMPLETED, plus the scheduled visit details of the assigned technician.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "You can pay an invoice with cash, card, bank transfer, bKash or Nagad. After a successful payment the invoice is marked PAID and the transaction ID is stored with the payment record.",
  },
  {
    question: "What if a technician rejects an assignment?",
    answer:
      "The manager is notified immediately and can assign another technician to the same work order. Nothing about the request or schedule is lost in the process.",
  },
  {
    question: "When can I leave feedback?",
    answer:
      "After a work order is completed, you can submit one rating between 1 and 5 with a comment. Your feedback is tied to that work order so reviews stay authentic.",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Quick answers about requests, assignments, payments and feedback."
        />

        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border bg-card p-5 shadow-sm ring-1 ring-foreground/10 sm:p-7">
          <Accordion multiple>
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="py-4 text-base hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-7 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
