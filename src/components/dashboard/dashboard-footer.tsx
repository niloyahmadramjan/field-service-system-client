import Link from "next/link";
import { LifeBuoy } from "lucide-react";

export function DashboardFooter() {
  return (
    <footer className="border-t bg-background/80">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© 2026 Field Service Management System</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/services" className="hover:text-foreground">
            Browse services
          </Link>
          <a
            href="mailto:support@fieldservice.com"
            className="inline-flex items-center gap-1.5 hover:text-foreground"
          >
            <LifeBuoy className="size-4" /> Customer support
          </a>
        </div>
      </div>
    </footer>
  );
}
