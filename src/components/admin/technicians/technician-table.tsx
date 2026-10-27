"use client";

import { useState } from "react";
import { Check, Eye, LoaderCircle, MoreHorizontal, SearchX, ShieldCheck, Trash2, UserRound, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import RequestPagination from "@/components/admin/requests/request-pagination";
import { useApproveTechnician, useDeleteTechnician, useRejectTechnician, useTechnician, useTechnicians } from "@/hooks/technician.hook";
import type { Technician, TechnicianApplicationStatus } from "@/types/technician.types";

const PAGE_SIZE = 10;
type TechnicianFilter = "ALL" | TechnicianApplicationStatus;

function dateLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function statusBadge(status: TechnicianApplicationStatus) {
  if (status === "APPROVED") return <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">Approved</Badge>;
  if (status === "REJECTED") return <Badge variant="destructive">Rejected</Badge>;
  return <Badge className="border-amber-200 bg-amber-50 text-amber-700">Pending</Badge>;
}

function TechnicianDetailDialog({ technicianId, onClose }: { technicianId: string | null; onClose: () => void }) {
  const query = useTechnician(technicianId ?? "");
  const technician = query.data;
  return <Dialog open={Boolean(technicianId)} onOpenChange={(open) => !open && onClose()}><DialogContent className="sm:max-w-2xl">
    {query.isPending && <div className="flex min-h-40 items-center justify-center text-muted-foreground"><LoaderCircle className="mr-2 size-4 animate-spin" />Loading technician details…</div>}
    {query.isError && <div className="py-8 text-center text-sm text-destructive">{query.error.message || "Unable to load technician details."}</div>}
    {!query.isPending && !query.isError && !technician && <div className="py-8 text-center text-sm text-muted-foreground">Technician not found.</div>}
    {technician && <><DialogHeader><div className="flex items-center gap-3 pr-8"><Avatar size="lg"><AvatarImage src={technician.user.avatarUrl ?? undefined} alt={technician.user.name} /><AvatarFallback>{technician.user.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</AvatarFallback></Avatar><div className="min-w-0"><DialogTitle>{technician.user.name}</DialogTitle><DialogDescription>{technician.employeeId}</DialogDescription></div>{statusBadge(technician.applicationStatus)}</div></DialogHeader><div className="grid gap-5 border-t pt-5 sm:grid-cols-2"><Detail label="Email" value={technician.user.email} /><Detail label="Phone" value={technician.user.phone} /><Detail label="Availability" value={technician.status.replaceAll("_", " ")} /><Detail label="Account status" value={technician.user.status} /><Detail label="Application status" value={technician.applicationStatus} /><Detail label="User role" value={technician.user.role} /><Detail label="Applied" value={dateLabel(technician.createdAt)} /><Detail label="Last updated" value={dateLabel(technician.updatedAt)} /><div className="sm:col-span-2"><Detail label="Skills" value={technician.skills || "No skills listed."} /></div><div className="sm:col-span-2"><Detail label="Experience" value={technician.bio || "No biography provided."} /></div>{technician.rejectedReason && <div className="sm:col-span-2"><Detail label="Rejection reason" value={technician.rejectedReason} /></div>}</div></>}
  </DialogContent></Dialog>;
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return <div className="min-w-0 space-y-1"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="wrap-break-word text-sm">{value || "—"}</p></div>;
}

function TechnicianActions({ technician }: { technician: Technician }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"reject" | "delete" | null>(null);
  const approve = useApproveTechnician();
  const reject = useRejectTechnician();
  const remove = useDeleteTechnician();
  const busy = approve.isPending || reject.isPending || remove.isPending;

  const approveApplication = () => approve.mutate(technician.id, {
    onSuccess: () => toast.add({ title: "Technician approved", description: `${technician.user.name} can now receive work orders.`, type: "success" }),
    onError: (error) => toast.add({ title: "Could not approve technician", description: error.message, type: "error" }),
  });

  const confirm = () => {
    if (confirmAction === "reject") reject.mutate(technician.id, {
      onSuccess: () => { toast.add({ title: "Technician rejected", description: `${technician.user.name}'s application was rejected.`, type: "success" }); setConfirmAction(null); },
      onError: (error) => toast.add({ title: "Could not reject technician", description: error.message, type: "error" }),
    });
    if (confirmAction === "delete") remove.mutate(technician.id, {
      onSuccess: () => { toast.add({ title: "Technician deleted", description: `${technician.user.name} was removed.`, type: "success" }); setConfirmAction(null); },
      onError: (error) => toast.add({ title: "Could not delete technician", description: error.message, type: "error" }),
    });
  };

  return <>
    <DropdownMenu><DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label={`Actions for ${technician.user.name}`}><MoreHorizontal className="size-4" /></Button>} /><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => setDetailsOpen(true)}><Eye className="size-4" />View details</DropdownMenuItem>{technician.applicationStatus !== "APPROVED" && <DropdownMenuItem disabled={busy} onClick={approveApplication}><Check className="size-4" />Approve application</DropdownMenuItem>}{technician.applicationStatus !== "REJECTED" && <DropdownMenuItem disabled={busy} onClick={() => setConfirmAction("reject")}><X className="size-4" />Reject application</DropdownMenuItem>}<DropdownMenuItem variant="destructive" onClick={() => setConfirmAction("delete")}><Trash2 className="size-4" />Delete technician</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
    <TechnicianDetailDialog technicianId={detailsOpen ? technician.id : null} onClose={() => setDetailsOpen(false)} />
    <Dialog open={confirmAction !== null} onOpenChange={(open) => !open && setConfirmAction(null)}><DialogContent><DialogHeader><DialogTitle>{confirmAction === "delete" ? "Delete this technician?" : "Reject this application?"}</DialogTitle><DialogDescription>{confirmAction === "delete" ? `${technician.user.name} will be permanently removed.` : `${technician.user.name}'s technician application will be rejected.`}</DialogDescription></DialogHeader><div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button variant="outline" onClick={() => setConfirmAction(null)} disabled={busy}>Cancel</Button><Button variant="destructive" onClick={confirm} disabled={busy}>{busy && <LoaderCircle className="animate-spin" />}{confirmAction === "delete" ? "Delete technician" : "Reject application"}</Button></div></DialogContent></Dialog>
  </>;
}

export default function TechnicianTable({ filter, searchTerm }: { filter: TechnicianFilter; searchTerm: string }) {
  const [page, setPage] = useState(1);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const query = useTechnicians({ page, limit: PAGE_SIZE, applicationStatus: filter === "ALL" ? undefined : filter, searchTerm: searchTerm || undefined });
  const technicians = query.data?.data ?? [];
  const meta = query.data?.meta;
  const total = meta?.total ?? 0;

  return <div className="w-full min-w-0 space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-muted-foreground">{query.isPending ? "Loading technicians…" : <>Showing <span className="font-medium text-foreground">{total ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, total)}</span> of <span className="font-medium text-foreground">{total}</span> technicians</>}</p><Badge variant="outline">{filter === "ALL" ? "All applications" : filter}</Badge></div>
    <div className="overflow-x-auto rounded-xl border bg-card"><Table><TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead>Technician</TableHead><TableHead>Contact</TableHead><TableHead>Skills</TableHead><TableHead>Availability</TableHead><TableHead>Application</TableHead><TableHead>Joined</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
      {query.isPending && <TableRow><TableCell colSpan={7} className="h-40 text-center text-muted-foreground"><LoaderCircle className="mr-2 inline size-4 animate-spin" />Loading technicians…</TableCell></TableRow>}
      {query.isError && <TableRow><TableCell colSpan={7} className="h-40 text-center text-destructive">{query.error.message || "Unable to load technicians."}</TableCell></TableRow>}
      {!query.isPending && !query.isError && technicians.length === 0 && <TableRow><TableCell colSpan={7} className="h-48 text-center"><div className="flex flex-col items-center gap-2"><SearchX className="size-8 text-muted-foreground/60" /><p className="font-medium">No technicians found</p><p className="text-sm text-muted-foreground">Try another application status or search term.</p></div></TableCell></TableRow>}
      {technicians.map((technician) => <TableRow key={technician.id}><TableCell><div className="flex min-w-48 items-center gap-3"><Avatar><AvatarImage src={technician.user.avatarUrl ?? undefined} alt={technician.user.name} /><AvatarFallback>{technician.user.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</AvatarFallback></Avatar><div className="min-w-0"><p className="truncate font-semibold">{technician.user.name}</p><p className="text-xs text-muted-foreground">{technician.employeeId}</p></div></div></TableCell><TableCell><p className="font-medium">{technician.user.email}</p><p className="text-xs text-muted-foreground">{technician.user.phone}</p></TableCell><TableCell><p className="max-w-56 truncate text-sm" title={technician.skills ?? undefined}>{technician.skills || "—"}</p></TableCell><TableCell><Badge variant={technician.status === "AVAILABLE" ? "secondary" : "outline"}>{technician.status.replaceAll("_", " ")}</Badge></TableCell><TableCell>{statusBadge(technician.applicationStatus)}</TableCell><TableCell>{dateLabel(technician.createdAt)}</TableCell><TableCell><div className="flex justify-end gap-1"><Button variant="ghost" size="sm" onClick={() => setDetailsId(technician.id)}><UserRound className="size-4" /><span className="sr-only sm:not-sr-only">Details</span></Button><TechnicianActions technician={technician} /></div></TableCell></TableRow>)}
    </TableBody></Table></div>
    {!query.isError && <RequestPagination page={page} pageSize={PAGE_SIZE} total={total} totalPages={Math.max(meta?.totalPages ?? 1, 1)} onPageChange={setPage} onPageSizeChange={() => setPage(1)} />}
    <TechnicianDetailDialog technicianId={detailsId} onClose={() => setDetailsId(null)} />
  </div>;
}
