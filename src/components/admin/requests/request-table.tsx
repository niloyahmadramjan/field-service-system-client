"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  Check,
  Eye,
  LoaderCircle,
  MapPin,
  SearchX,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import type { RequestStatus } from "@/app/(dashboard)/admin/requests/page";
import RequestPagination from "./request-pagination";
import {
  AdminServiceRequest,
  ServiceRequestStatus,
} from "@/types/serviceRequest.types";
import {
  approveServiceRequest,
  getAdminRequests,
  rejectServiceRequest,
} from "@/api/serviceRequest";

interface RequestTableProps {
  status: RequestStatus;
  search: string;
}

const PAGE_SIZE = 10;
const requestKeys = ["admin", "requests"] as const;

function formatDate(value: string | null) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function StatusBadge({ status }: { status: string }) {
  if (status === "PENDING") {
    return (
      <Badge className="border-amber-200 bg-amber-50 text-amber-700">
        Pending
      </Badge>
    );
  }
  if (status === "APPROVED") {
    return (
      <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
        Approved
      </Badge>
    );
  }
  if (status === "REJECTED")
    return <Badge variant="destructive">Rejected</Badge>;
  return <Badge variant="secondary">{status}</Badge>;
}

function RequestDetails({
  request,
  onClose,
}: {
  request: AdminServiceRequest | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const approve = useMutation({
    mutationFn: approveServiceRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: requestKeys });
      toast.add({
        title: "Request approved",
        description: "The request has been approved.",
        type: "success",
      });
      onClose();
    },
    onError: (error) =>
      toast.add({
        title: "Could not approve request",
        description: error.message,
        type: "error",
      }),
  });
  const reject = useMutation({
    mutationFn: rejectServiceRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: requestKeys });
      toast.add({
        title: "Request rejected",
        description: "The request has been rejected.",
        type: "success",
      });
      onClose();
    },
    onError: (error) =>
      toast.add({
        title: "Could not reject request",
        description: error.message,
        type: "error",
      }),
  });
  const busy = approve.isPending || reject.isPending;

  return (
    <Dialog open={Boolean(request)} onOpenChange={(open) => !open && onClose()}>
      {request && (
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex flex-wrap items-center gap-2 pr-8">
              <DialogTitle>{request.title}</DialogTitle>
              <StatusBadge status={request.status} />
            </div>
            <DialogDescription>{request.requestNumber}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 sm:grid-cols-2">
            <Detail
              label="Customer"
              value={request.customer?.user?.name || "Customer"}
            />
            <Detail
              label="Email"
              value={request.customer?.user?.email || "Not provided"}
            />
            <Detail
              label="Phone"
              value={request.customer?.user?.phone || "Not provided"}
            />
            <Detail
              label="Service"
              value={request.service?.name || "Service"}
            />
            <Detail
              label="Preferred date"
              value={formatDate(request.preferredDate)}
            />
            <Detail label="Submitted" value={formatDate(request.createdAt)} />
            <Detail
              label="Location"
              value={[request.address, request.city, request.district]
                .filter(Boolean)
                .join(", ")}
            />
            <Detail
              label="Work order"
              value={request.workOrder?.workOrderNumber || "Not created"}
            />
            <div className="sm:col-span-2">
              <Detail
                label="Description"
                value={request.description || "No description provided."}
              />
            </div>
          </div>

          {request.status === "PENDING" && (
            <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => reject.mutate(request.id)}
                disabled={busy}
              >
                {reject.isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <X />
                )}
                Reject request
              </Button>
              <Button
                onClick={() => approve.mutate(request.id)}
                disabled={busy}
              >
                {approve.isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Check />
                )}
                Approve request
              </Button>
            </div>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="wrap-break-word text-sm">{value}</p>
    </div>
  );
}

export default function RequestTable({ status, search }: RequestTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [selectedRequest, setSelectedRequest] =
    useState<AdminServiceRequest | null>(null);
  const requestStatus: ServiceRequestStatus | undefined =
    status === "ALL" ? undefined : status;
  const requestsQuery = useQuery({
    queryKey: [...requestKeys, page, pageSize, requestStatus, search],
    queryFn: () =>
      getAdminRequests({
        page,
        limit: pageSize,
        status: requestStatus,
        searchTerm: search || undefined,
      }),
  });

  const requests = requestsQuery.data?.data ?? [];
  const meta = requestsQuery.data?.data.meta;
  const total = meta?.total ?? 0;
  const totalPages = Math.max(meta?.totalPages ?? 1, 1);

  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {requestsQuery.isPending ? (
            "Loading requests…"
          ) : (
            <>
              Showing{" "}
              <span className="font-medium text-foreground">
                {total ? (page - 1) * pageSize + 1 : 0}–
                {Math.min(page * pageSize, total)}
              </span>{" "}
              of <span className="font-medium text-foreground">{total}</span>{" "}
              requests
            </>
          )}
        </p>
        <Badge variant="outline">
          {status === "ALL" ? "All statuses" : status}
        </Badge>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Request</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Preferred date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requestsQuery.isPending && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-40 text-center text-muted-foreground"
                >
                  <LoaderCircle className="mr-2 inline size-4 animate-spin" />
                  Loading service requests…
                </TableCell>
              </TableRow>
            )}
            {requestsQuery.isError && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-40 text-center text-destructive"
                >
                  {requestsQuery.error.message ||
                    "Unable to load service requests."}
                </TableCell>
              </TableRow>
            )}
            {!requestsQuery.isPending &&
              !requestsQuery.isError &&
              requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <SearchX className="size-8 text-muted-foreground/60" />
                      <p className="font-medium">No requests found</p>
                      <p className="text-sm text-muted-foreground">
                        Try another status or search term.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-semibold">{request.requestNumber}</p>
                    <p className="max-w-56 truncate text-sm text-muted-foreground">
                      {request.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created {formatDate(request.createdAt)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">
                      {request.customer?.user?.name || "Customer"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {request.customer?.user?.email || "No email"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {request.customer?.user?.phone || ""}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{request.service?.name || "—"}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-muted-foreground" />
                    {formatDate(request.preferredDate)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex max-w-48 items-start gap-2 whitespace-normal">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    {[request.city, request.district]
                      .filter(Boolean)
                      .join(", ") ||
                      request.address ||
                      "—"}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={request.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRequest(request)}
                  >
                    <Eye className="size-4" />
                    <span className="sr-only sm:not-sr-only">View</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {requestsQuery.isError ? null : (
        <RequestPagination
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      )}
      <RequestDetails
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
}
