"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Check,
  LoaderCircle,
  MapPin,
  Search,
  UserRound,
  Wrench,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import RequestPagination from "@/components/admin/requests/request-pagination";
import {
  useApprovedTechnicians,
  useAssignTechnician,
  useWorkOrder,
} from "@/hooks/work-order.hook";
import type { WorkOrderTechnician } from "@/types/work-order.types";

function displayDate(value?: string | null) {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not set"
    : new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

function Detail({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="wrap-break-word text-sm">{value || "—"}</p>
    </div>
  );
}

function RelatedRecords({
  title,
  records,
}: {
  title: string;
  records: Array<Record<string, unknown>> | null | undefined;
}) {
  if (!records?.length) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {title}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            ({records.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 border-t pt-5">
        {records.map((record, index) => {
          const fields = Object.entries(record).filter(
            ([, value]) =>
              value == null ||
              ["string", "number", "boolean"].includes(typeof value),
          );
          return (
            <div
              key={String(record.id ?? index)}
              className="grid gap-3 rounded-lg border bg-muted/20 p-3 sm:grid-cols-2"
            >
              {fields.map(([key, value]) => (
                <Detail
                  key={key}
                  label={key.replace(
                    /[A-Z]/g,
                    (letter) => ` ${letter.toLowerCase()}`,
                  )}
                  value={value == null ? "—" : String(value)}
                />
              ))}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function TechnicianOption({
  technician,
  selected,
  onSelect,
}: {
  technician: WorkOrderTechnician;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors hover:bg-muted/50 ${selected ? "border-primary bg-primary/5 ring-1 ring-primary" : ""}`}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
        {technician.user.name
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase()}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{technician.user.name}</span>
          <Badge
            variant={
              technician.status === "AVAILABLE" ? "secondary" : "outline"
            }
          >
            {technician.status.replaceAll("_", " ")}
          </Badge>
        </span>
        <span className="mt-1 block text-xs text-muted-foreground">
          {technician.employeeId} ·{" "}
          {technician.user.phone || technician.user.email}
        </span>
        <span className="mt-2 block text-sm text-muted-foreground">
          {technician.skills || "Skills not listed"}
        </span>
      </span>
      <span
        className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"}`}
      >
        {selected && <Check className="size-3" />}
      </span>
    </button>
  );
}

export default function WorkOrderAssignmentPage() {
  const { workOrderId } = useParams<{ workOrderId: string }>();
  const router = useRouter();
  const workOrderQuery = useWorkOrder(workOrderId);
  const assign = useAssignTechnician();
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("ALL");
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [technicianPage, setTechnicianPage] = useState(1);
  const techniciansQuery = useApprovedTechnicians({
    page: technicianPage,
    limit: 10,
    applicationStatus: "APPROVED",
  });

  const technicians = useMemo(
    () =>
      (techniciansQuery.data?.data ?? []).filter((technician) => {
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          [
            technician.user.name,
            technician.user.email,
            technician.user.phone,
            technician.employeeId,
            technician.skills,
          ].some((value) => value?.toLowerCase().includes(query));
        const matchesAvailability =
          availability === "ALL" || technician.status === availability;
        return matchesSearch && matchesAvailability;
      }),
    [techniciansQuery.data?.data, search, availability],
  );

  const workOrder = workOrderQuery.data?.data;
  const submitAssignment = () => {
    if (!selectedTechnicianId) return;
    assign.mutate(
      { workOrderId, technicianId: selectedTechnicianId },
      {
        onSuccess: () => {
          toast.add({
            title: "Technician assigned",
            description: "The technician has been assigned to this work order.",
            type: "success",
          });
          router.push("/admin/work-orders");
        },
        onError: (error) =>
          toast.add({
            title: "Could not assign technician",
            description: error.message,
            type: "error",
          }),
      },
    );
  };

  if (workOrderQuery.isPending)
    return (
      <div className="flex min-h-64 items-center justify-center text-muted-foreground">
        <LoaderCircle className="mr-2 size-5 animate-spin" />
        Loading work order…
      </div>
    );
  if (workOrderQuery.isError || !workOrder)
    return (
      <section className="space-y-4">
        <Button nativeButton={false} variant="ghost" render={<Link href="/admin/work-orders" />}>
          <ArrowLeft />
          Back to work orders
        </Button>
        <Card>
          <CardContent className="py-12 text-center text-destructive">
            {workOrderQuery.error?.message || "Work order could not be found."}
          </CardContent>
        </Card>
      </section>
    );

  const location = [
    workOrder.request?.address ?? workOrder.customer?.address,
    workOrder.request?.city ?? workOrder.customer?.city,
    workOrder.request?.district ?? workOrder.customer?.district,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="mx-auto w-full min-w-0 space-y-6">
      <Button
        nativeButton={false}
        variant="ghost"
        className="-ml-3"
        render={<Link href="/admin/work-orders" />}
      >
        <ArrowLeft className="size-4" />
        Back to work orders
      </Button>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Assign technician
            </h1>
            <Badge variant="secondary">
              {workOrder.status.replaceAll("_", " ")}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Review the work details and choose an approved technician.
          </p>
        </div>
        <Badge variant="outline" className="w-fit">
          {workOrder.workOrderNumber}
        </Badge>
      </header>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BriefcaseBusiness className="size-5" />
                </span>
                <div className="min-w-0">
                  <CardTitle>{workOrder.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {workOrder.description || "No work description provided."}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5 border-t pt-5 sm:grid-cols-2">
              <Detail
                label="Work order number"
                value={workOrder.workOrderNumber}
              />
              <Detail
                label="Status"
                value={workOrder.status.replaceAll("_", " ")}
              />
              <Detail
                label="Created"
                value={displayDate(workOrder.createdAt)}
              />
              <Detail
                label="Last updated"
                value={displayDate(workOrder.updatedAt)}
              />
              <Detail
                label="Started"
                value={displayDate(workOrder.startedAt)}
              />
              <Detail
                label="Completed"
                value={displayDate(workOrder.completedAt)}
              />
              <Detail
                label="Estimated cost"
                value={
                  workOrder.estimatedCost == null
                    ? "Not estimated"
                    : String(workOrder.estimatedCost)
                }
              />
              <Detail
                label="Actual cost"
                value={
                  workOrder.actualCost == null
                    ? "Not recorded"
                    : String(workOrder.actualCost)
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserRound className="size-4 text-muted-foreground" />
                <CardTitle className="text-base">
                  Customer and service
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5 border-t pt-5 sm:grid-cols-2">
              <Detail label="Customer" value={workOrder.customer?.user?.name} />
              <Detail label="Email" value={workOrder.customer?.user?.email} />
              <Detail label="Phone" value={workOrder.customer?.user?.phone} />
              <Detail label="Customer account" value={workOrder.customer?.id} />
              <Detail
                label="Service"
                value={workOrder.request?.service?.name}
              />
              <Detail
                label="Service price"
                value={
                  workOrder.request?.service?.price == null
                    ? "—"
                    : String(workOrder.request.service.price)
                }
              />
              <Detail
                label="Request"
                value={workOrder.request?.requestNumber}
              />
              <Detail
                label="Request status"
                value={workOrder.request?.status}
              />
              <Detail
                label="Preferred date"
                value={displayDate(workOrder.request?.preferredDate)}
              />
              <div className="sm:col-span-2">
                <Detail
                  label="Service location"
                  value={
                    location ? (
                      <span className="inline-flex items-start gap-2">
                        <MapPin className="mt-0.5 size-4 shrink-0" />
                        {location}
                      </span>
                    ) : (
                      "Not provided"
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>

          <RelatedRecords title="Assignments" records={workOrder.assignments} />
          <RelatedRecords title="Service visits" records={workOrder.visits} />
          {workOrder.serviceReport && (
            <RelatedRecords
              title="Service report"
              records={[workOrder.serviceReport]}
            />
          )}
          {workOrder.invoice && (
            <RelatedRecords title="Invoice" records={[workOrder.invoice]} />
          )}
          {workOrder.feedback && (
            <RelatedRecords
              title="Customer feedback"
              records={[workOrder.feedback]}
            />
          )}

          {workOrder.technician && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Current technician</CardTitle>
              </CardHeader>
              <CardContent className="border-t pt-5">
                <p className="font-medium">{workOrder.technician.user.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {workOrder.technician.employeeId} ·{" "}
                  {workOrder.technician.user.phone}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="h-fit min-w-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wrench className="size-4 text-muted-foreground" />
              <CardTitle>Choose a technician</CardTitle>
            </div>
            <CardDescription>
              Only approved technicians are listed. Search by name, skills,
              employee ID, email, or phone.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setTechnicianPage(1);
                  }}
                  placeholder="Search technicians..."
                  className="pl-9"
                  aria-label="Search technicians"
                />
              </div>
              <Select
                value={availability}
                onValueChange={(value) => {
                  if (value) {
                    setAvailability(value);
                    setTechnicianPage(1);
                  }
                }}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All availability</SelectItem>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="BUSY">Busy</SelectItem>
                  <SelectItem value="ON_LEAVE">On leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {techniciansQuery.isPending && (
              <div className="py-10 text-center text-sm text-muted-foreground">
                <LoaderCircle className="mr-2 inline size-4 animate-spin" />
                Loading approved technicians…
              </div>
            )}
            {techniciansQuery.isError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {techniciansQuery.error.message ||
                  "Unable to load technicians."}
              </div>
            )}
            {!techniciansQuery.isPending &&
              !techniciansQuery.isError &&
              technicians.length === 0 && (
                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No approved technicians match this search and availability
                  filter.
                </div>
              )}
            {!techniciansQuery.isError && technicians.length > 0 && (
              <div className="space-y-3">
                {technicians.map((technician) => (
                  <TechnicianOption
                    key={technician.id}
                    technician={technician}
                    selected={selectedTechnicianId === technician.id}
                    onSelect={() => setSelectedTechnicianId(technician.id)}
                  />
                ))}
              </div>
            )}
            {!techniciansQuery.isError &&
              (techniciansQuery.data?.meta.total ?? 0) > 0 && (
                <RequestPagination
                  page={technicianPage}
                  pageSize={10}
                  total={techniciansQuery.data?.meta.total ?? 0}
                  totalPages={Math.max(
                    techniciansQuery.data?.meta.totalPages ?? 1,
                    1,
                  )}
                  onPageChange={setTechnicianPage}
                  onPageSizeChange={() => setTechnicianPage(1)}
                />
              )}
            <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
              <Button
                nativeButton={false}
                variant="outline"
                render={<Link href="/admin/work-orders" />}
              >
                Back
              </Button>
              <Button
                onClick={submitAssignment}
                disabled={
                  !selectedTechnicianId ||
                  assign.isPending ||
                  techniciansQuery.isError
                }
              >
                {assign.isPending && <LoaderCircle className="animate-spin" />}
                Assign technician
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
