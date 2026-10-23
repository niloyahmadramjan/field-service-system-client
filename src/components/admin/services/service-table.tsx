"use client";

import { useState } from "react";
import { Eye, LoaderCircle, MoreHorizontal, Pencil, SearchX, Trash2, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import RequestPagination from "@/components/admin/requests/request-pagination";
import { useDeleteService, useService, useServices } from "@/hooks/service.hook";
import type { Service } from "@/types/service.types";
import ServiceFormDialog from "./service-form-dialog";

const PAGE_SIZE = 10;
type ServiceFilter = "ALL" | "ACTIVE" | "INACTIVE";

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function ServiceDetailsDialog({ serviceId, onClose }: { serviceId: string | null; onClose: () => void }) {
  const query = useService(serviceId ?? "");
  const service = query.data?.data;
  return <Dialog open={Boolean(serviceId)} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="sm:max-w-2xl">
      {query.isPending && <div className="flex min-h-40 items-center justify-center text-muted-foreground"><LoaderCircle className="mr-2 size-4 animate-spin" />Loading service details…</div>}
      {query.isError && <div className="py-8 text-center text-sm text-destructive">{query.error.message || "Unable to load service details."}</div>}
      {service && <>
        <DialogHeader><div className="flex flex-wrap items-center gap-2 pr-8"><DialogTitle>{service.name}</DialogTitle><Badge variant={service.isActive ? "secondary" : "outline"}>{service.isActive ? "Active" : "Inactive"}</Badge></div><DialogDescription>Service details and catalog pricing.</DialogDescription></DialogHeader>
        <div className="grid gap-5 border-t pt-5 sm:grid-cols-2"><Detail label="Service ID" value={service.id} /><Detail label="Price" value={formatPrice(service.price)} /><Detail label="Created" value={formatDate(service.createdAt)} /><Detail label="Last updated" value={formatDate(service.updatedAt)} /><div className="sm:col-span-2"><Detail label="Description" value={service.description || "No description provided."} /></div></div>
      </>}
    </DialogContent>
  </Dialog>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 space-y-1"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="wrap-break-word text-sm">{value}</p></div>;
}

function formatPrice(value: string) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return value;
  return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 2 }).format(amount);
}

function ServiceActions({ service, onView, onEdit }: { service: Service; onView: () => void; onEdit: () => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const removeService = useDeleteService();
  const remove = () => removeService.mutate(service.id, {
    onSuccess: () => {
      toast.add({ title: "Service deleted", description: `${service.name} has been removed.`, type: "success" });
      setConfirmDelete(false);
    },
    onError: (error) => toast.add({ title: "Could not delete service", description: error.message, type: "error" }),
  });

  return <>
    <DropdownMenu><DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label={`Actions for ${service.name}`}><MoreHorizontal className="size-4" /></Button>} /><DropdownMenuContent align="end"><DropdownMenuItem onClick={onView}><Eye className="size-4" />View details</DropdownMenuItem><DropdownMenuItem onClick={onEdit}><Pencil className="size-4" />Edit service</DropdownMenuItem><DropdownMenuItem variant="destructive" onClick={() => setConfirmDelete(true)}><Trash2 className="size-4" />Delete service</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
    <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}><DialogContent><DialogHeader><DialogTitle>Delete this service?</DialogTitle><DialogDescription>“{service.name}” will be removed from the service catalog.</DialogDescription></DialogHeader><div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button variant="outline" onClick={() => setConfirmDelete(false)} disabled={removeService.isPending}>Keep service</Button><Button variant="destructive" onClick={remove} disabled={removeService.isPending}>{removeService.isPending && <LoaderCircle className="animate-spin" />}Delete service</Button></div></DialogContent></Dialog>
  </>;
}

export default function ServiceTable({ filter, search }: { filter: ServiceFilter; search: string }) {
  const [page, setPage] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const query = useServices(page, PAGE_SIZE);
  const services = query.data?.data.data ?? [];
  const meta = query.data?.data.meta;
  const visibleServices = services.filter((service) => {
    const matchesStatus = filter === "ALL" || (filter === "ACTIVE" ? service.isActive : !service.isActive);
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || [service.name, service.description, service.price].some((value) => value.toLowerCase().includes(term));
    return matchesStatus && matchesSearch;
  });

  return <div className="w-full min-w-0 space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-muted-foreground">{query.isPending ? "Loading services…" : <>Showing <span className="font-medium text-foreground">{visibleServices.length}</span> services on this page · <span className="font-medium text-foreground">{meta?.total ?? 0}</span> total</>}</p><Badge variant="outline">{filter === "ALL" ? "All services" : `${filter === "ACTIVE" ? "Active" : "Inactive"} services`}</Badge></div>
    <div className="overflow-x-auto rounded-xl border bg-card"><Table><TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead>Service</TableHead><TableHead>Description</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead><TableHead>Last updated</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
      {query.isPending && <TableRow><TableCell colSpan={6} className="h-40 text-center text-muted-foreground"><LoaderCircle className="mr-2 inline size-4 animate-spin" />Loading services…</TableCell></TableRow>}
      {query.isError && <TableRow><TableCell colSpan={6} className="h-40 text-center text-destructive">{query.error.message || "Unable to load services."}</TableCell></TableRow>}
      {!query.isPending && !query.isError && visibleServices.length === 0 && <TableRow><TableCell colSpan={6} className="h-48 text-center"><div className="flex flex-col items-center gap-2"><SearchX className="size-8 text-muted-foreground/60" /><p className="font-medium">No services found</p><p className="text-sm text-muted-foreground">Try another search or status filter.</p></div></TableCell></TableRow>}
      {visibleServices.map((service) => <TableRow key={service.id}><TableCell><button type="button" className="flex max-w-64 items-center gap-2 text-left font-semibold hover:text-primary" onClick={() => setDetailsId(service.id)}><Wrench className="size-4 shrink-0 text-muted-foreground" /><span className="truncate">{service.name}</span></button><p className="mt-1 pl-6 text-xs text-muted-foreground">Added {formatDate(service.createdAt)}</p></TableCell><TableCell><p className="max-w-sm truncate text-sm text-muted-foreground">{service.description}</p></TableCell><TableCell className="font-medium">{formatPrice(service.price)}</TableCell><TableCell><Badge variant={service.isActive ? "secondary" : "outline"}>{service.isActive ? "Active" : "Inactive"}</Badge></TableCell><TableCell>{formatDate(service.updatedAt)}</TableCell><TableCell><div className="flex justify-end gap-1"><Button variant="ghost" size="sm" onClick={() => setDetailsId(service.id)}><Eye className="size-4" /><span className="sr-only sm:not-sr-only">View</span></Button><ServiceActions service={service} onView={() => setDetailsId(service.id)} onEdit={() => setSelectedService(service)} /></div></TableCell></TableRow>)}
    </TableBody></Table></div>
    {!query.isError && meta && <RequestPagination page={page} pageSize={PAGE_SIZE} total={meta.total} totalPages={Math.max(meta.totalPages, 1)} onPageChange={setPage} onPageSizeChange={() => setPage(1)} />}
    <ServiceDetailsDialog serviceId={detailsId} onClose={() => setDetailsId(null)} />
    <ServiceFormDialog open={Boolean(selectedService)} onOpenChange={(open) => !open && setSelectedService(null)} service={selectedService} />
  </div>;
}
