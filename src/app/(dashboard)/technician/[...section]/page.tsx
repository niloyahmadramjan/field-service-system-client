import { LayoutDashboard } from "lucide-react";

const sectionTitles: Record<string, string> = {
  dashboard: "Overview",
  jobs: "Assigned jobs",
  schedule: "Schedule",
  "work-orders": "Work orders",
  profile: "Profile",
};

export default async function TechnicianSectionPage({
  params,
}: {
  params: Promise<{ section: string[] }>;
}) {
  const { section } = await params;
  const title = sectionTitles[section.at(-1) ?? "dashboard"] ?? "Workspace";

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-start gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LayoutDashboard className="size-5" />
        </span>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your technician workspace is ready. This section is ready for its data and tools.
          </p>
        </div>
      </div>
      <div className="rounded-xl border border-dashed bg-background px-6 py-12 text-center">
        <p className="font-medium">{title} workspace</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Add the API powered content for this section here.
        </p>
      </div>
    </section>
  );
}
