import Link from "next/link";

import Logo from "../logo/Logo";
import { Mail, Phone, MapPin } from "lucide-react";

const productLinks = [
  { name: "Services", href: "/#services" },
  { name: "How it works", href: "/#how-it-works" },
  { name: "Features", href: "/#roles" },
  { name: "FAQ", href: "/#faq" },
];

const roleLinks = [
  { name: "Customer", href: "/#roles" },
  { name: "Manager", href: "/#roles" },
  { name: "Technician", href: "/#roles" },
  { name: "Admin", href: "/#roles" },
];

const companyLinks = [
  { name: "Sign in", href: "/login" },
  { name: "Create account", href: "/register" },
  { name: "Privacy Policy", href: "#" },
  { name: "Terms of Service", href: "#" },
];

const socials = [
  {
    name: "Facebook",
    href: "#",
    path: "M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.2C16.6 2.1 15.6 2 14.5 2 11.9 2 10.2 3.6 10.2 6.4v2.1H7.5V12h2.7v10H14V12h2.7l.4-3.5H14z",
  },
  {
    name: "X",
    href: "#",
    path: "M17.5 3h3l-6.6 7.5L21.7 21h-6l-4.7-6.1L5.6 21h-3l7-8L2.6 3h6.1l4.2 5.6L17.5 3zm-1 16h1.7L8.1 4.7H6.3L16.5 19z",
  },
  {
    name: "LinkedIn",
    href: "#",
    path: "M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM3.2 8.5h3.5V21H3.2V8.5zm5.6 0h3.35v1.7h.05c.47-.85 1.6-1.75 3.3-1.75 3.53 0 4.18 2.2 4.18 5.06V21h-3.5v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21H8.8V8.5z",
  },
  {
    name: "YouTube",
    href: "#",
    path: "M22.5 7.2a2.75 2.75 0 0 0-1.94-1.95C18.84 4.8 12 4.8 12 4.8s-6.84 0-8.56.45A2.75 2.75 0 0 0 1.5 7.2 28.9 28.9 0 0 0 1.05 12c0 1.62.15 3.23.45 4.8a2.75 2.75 0 0 0 1.94 1.95c1.72.45 8.56.45 8.56.45s6.84 0 8.56-.45a2.75 2.75 0 0 0 1.94-1.95c.3-1.57.45-3.18.45-4.8s-.15-3.23-.45-4.8zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z",
  },
];

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) {
  return (
    <nav className="flex flex-col gap-3" aria-label={title}>
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
            <Logo />

            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              The complete platform for field service companies — requests,
              work orders, technicians, invoices and feedback in one place.
            </p>

            <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href="mailto:support@fieldservice.com"
                  className="flex items-center gap-2.5 transition-colors hover:text-foreground"
                >
                  <Mail className="size-4 shrink-0" />
                  support@fieldservice.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801700000000"
                  className="flex items-center gap-2.5 transition-colors hover:text-foreground"
                >
                  <Phone className="size-4 shrink-0" />
                  +880 1700-000000
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="size-4 shrink-0" />
                Dhaka, Bangladesh
              </li>
            </ul>

            <ul className="flex items-center gap-2.5">
              {socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    aria-label={social.name}
                    className="flex size-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden
                      className="size-4 fill-current"
                    >
                      <path d={social.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          <LinkColumn title="Product" links={productLinks} />
          <LinkColumn title="For each role" links={roleLinks} />
          <LinkColumn title="Company" links={companyLinks} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:px-6 md:flex-row">
          <p>
            &copy; 2026 Field Service Management System.
            All rights reserved.
          </p>

          <p className="flex items-center gap-1.5">
            Built for service teams that keep things
            <span className="font-medium text-foreground">running.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
