"use client";

import { useState, type FormEvent } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  CircleHelp,
  Clock3,
  LoaderCircle,
  RefreshCw,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useApplyAsTechnician,
  useTechnicianApplication,
} from "@/hooks/customer.hook";
import { displayDate } from "@/lib/customer-format";
import type { TechnicianApplication } from "@/types/customer.types";

const statusStyles = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-800",
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  REJECTED: "border-red-200 bg-red-50 text-red-800",
} as const;

function ApplicationStatus({ application }: { application: TechnicianApplication }) {
  const isApproved = application.applicationStatus === "APPROVED";
  const isRejected = application.applicationStatus === "REJECTED";
  const StatusIcon = isApproved ? CheckCircle2 : isRejected ? XCircle : Clock3;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/20 p-4">
        <div className="flex items-center gap-3">
          <div className={`flex size-10 items-center justify-center rounded-full ${isApproved ? "bg-emerald-100 text-emerald-700" : isRejected ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
            <StatusIcon className="size-5" />
          </div>
          <div>
            <p className="font-medium">Application status</p>
            <p className="text-sm text-muted-foreground">
              {isApproved
                ? "Your application has been approved. You can now access the technician workspace."
                : isRejected
                  ? "Your application was not approved. Review the reason below."
                  : "Your application is waiting for review by the operations team."}
            </p>
          </div>
        </div>
        <Badge variant="outline" className={statusStyles[application.applicationStatus]}>
          {application.applicationStatus}
        </Badge>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        {application.employeeId && (
          <div className="rounded-lg border p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Employee ID</dt>
            <dd className="mt-1 font-medium">{application.employeeId}</dd>
          </div>
        )}
        {application.status && (
          <div className="rounded-lg border p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Availability</dt>
            <dd className="mt-1 font-medium">{application.status.replaceAll("_", " ")}</dd>
          </div>
        )}
        {application.createdAt && (
          <div className="rounded-lg border p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Submitted</dt>
            <dd className="mt-1 font-medium">{displayDate(application.createdAt)}</dd>
          </div>
        )}
        {application.updatedAt && (
          <div className="rounded-lg border p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Last updated</dt>
            <dd className="mt-1 font-medium">{displayDate(application.updatedAt)}</dd>
          </div>
        )}
        {application.skills && (
          <div className="rounded-lg border p-4 sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Skills</dt>
            <dd className="mt-1 text-sm leading-6">{application.skills}</dd>
          </div>
        )}
        {application.bio && (
          <div className="rounded-lg border p-4 sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Experience</dt>
            <dd className="mt-1 text-sm leading-6">{application.bio}</dd>
          </div>
        )}
        {isRejected && application.rejectedReason && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-destructive">Review notes</dt>
            <dd className="mt-1 text-sm leading-6">{application.rejectedReason}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}

export default function TechnicianApplicationPage() {
  const query = useTechnicianApplication();
  const apply = useApplyAsTechnician();
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");

  const submitApplication = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    apply.mutate({ skills: skills.trim(), bio: bio.trim() });
  };

  if (query.isPending) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 text-muted-foreground">
        <LoaderCircle className="size-5 animate-spin" /> Loading application status…
      </div>
    );
  }

  if (query.isError) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Application status unavailable</CardTitle>
          <CardDescription>We couldn’t retrieve your technician application right now.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => void query.refetch()}>
            <RefreshCw className="size-4" /> Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const application = query.data?.data;

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BriefcaseBusiness className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Technician application</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Apply to join the technician team and follow your application review here.
          </p>
        </div>
      </div>

      <Card>
        {application ? (
          <>
            <CardHeader>
              <CardTitle>Your application</CardTitle>
              <CardDescription>You have already submitted an application. Its status and details are shown below.</CardDescription>
            </CardHeader>
            <CardContent>
              <ApplicationStatus application={application} />
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Apply as a technician</CardTitle>
              <CardDescription>
                Tell us which services you can handle and summarize your relevant experience. The operations team will review your application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitApplication} className="space-y-5">
                {apply.isError && (
                  <div role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                    <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                    <span>{apply.error instanceof Error ? apply.error.message : "Your application could not be submitted. Please try again."}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="technician-skills">Skills</Label>
                  <Input
                    id="technician-skills"
                    value={skills}
                    onChange={(event) => setSkills(event.target.value)}
                    placeholder="AC repair, refrigerator repair, electrical"
                    maxLength={500}
                    required
                    disabled={apply.isPending}
                  />
                  <p className="text-xs text-muted-foreground">List services or trade skills, separated by commas.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="technician-bio">Experience and background</Label>
                  <textarea
                    id="technician-bio"
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    placeholder="Describe your experience, training, and the work you have done."
                    rows={5}
                    maxLength={2000}
                    required
                    disabled={apply.isPending}
                    className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <p className="text-xs text-muted-foreground">{bio.length}/2000 characters</p>
                </div>
                <Button type="submit" disabled={apply.isPending || !skills.trim() || !bio.trim()}>
                  {apply.isPending ? <LoaderCircle className="size-4 animate-spin" /> : <BriefcaseBusiness className="size-4" />}
                  {apply.isPending ? "Submitting application…" : "Submit application"}
                </Button>
              </form>
              <div className="mt-6 flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                <CircleHelp className="mt-0.5 size-4 shrink-0" />
                <p>After submission, this page will show your application status. You can’t submit a second application while one is on file.</p>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </section>
  );
}
