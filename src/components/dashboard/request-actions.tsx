"use client";

import { useState, type FormEvent } from "react";
import { LoaderCircle, Pencil, Trash2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeleteServiceRequest, useUpdateServiceRequest } from "@/hooks/customer.hook";
import type { CustomerServiceRequest, UpdateServiceRequestPayload } from "@/types/customer.types";

function toLocalDateTime(value: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function RequestActions({ request }: { request: CustomerServiceRequest }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState<UpdateServiceRequestPayload>({ title: request.title, description: request.description, preferredDate: toLocalDateTime(request.preferredDate), address: request.address, city: request.city, district: request.district });
  const update = useUpdateServiceRequest();
  const remove = useDeleteServiceRequest();
  if (request.status !== "PENDING") return null;

  function startEdit() {
    setForm({ title: request.title, description: request.description, preferredDate: toLocalDateTime(request.preferredDate), address: request.address, city: request.city, district: request.district });
    update.reset();
    setEditOpen(true);
  }
  function change(field: keyof UpdateServiceRequestPayload, value: string) { setForm((current) => ({ ...current, [field]: value })); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const date = new Date(form.preferredDate);
    if (!Number.isFinite(date.getTime())) return;
    await update.mutateAsync({ requestId: request.id, payload: { ...form, preferredDate: date.toISOString() } });
    setEditOpen(false);
  }

  return <div className="flex gap-2"><Button size="sm" variant="outline" onClick={startEdit}><Pencil className="size-3.5" /> Edit</Button><Button size="sm" variant="destructive" onClick={() => { remove.reset(); setDeleteOpen(true); }}><Trash2 className="size-3.5" /> Cancel</Button>
    <Dialog open={editOpen} onOpenChange={setEditOpen}><DialogContent><DialogHeader><DialogTitle>Edit service request</DialogTitle><DialogDescription>Pending requests can be updated before manager review.</DialogDescription></DialogHeader><form onSubmit={(event) => void submit(event)} className="space-y-3">{update.isError && <p role="alert" className="flex gap-2 text-sm text-destructive"><TriangleAlert className="size-4 shrink-0" />{update.error instanceof Error ? update.error.message : "Could not update this request."}</p>}<div className="space-y-1.5"><Label htmlFor={`edit-title-${request.id}`}>Title</Label><Input id={`edit-title-${request.id}`} required maxLength={120} value={form.title} onChange={(event) => change("title", event.target.value)} /></div><div className="space-y-1.5"><Label htmlFor={`edit-description-${request.id}`}>Description</Label><textarea id={`edit-description-${request.id}`} required rows={3} maxLength={2000} value={form.description} onChange={(event) => change("description", event.target.value)} className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50" /></div><div className="space-y-1.5"><Label htmlFor={`edit-date-${request.id}`}>Preferred date</Label><Input id={`edit-date-${request.id}`} type="datetime-local" required min={new Date().toISOString().slice(0, 16)} value={form.preferredDate} onChange={(event) => change("preferredDate", event.target.value)} /></div><div className="space-y-1.5"><Label htmlFor={`edit-address-${request.id}`}>Address</Label><Input id={`edit-address-${request.id}`} required value={form.address} onChange={(event) => change("address", event.target.value)} /></div><div className="grid grid-cols-2 gap-3"><div className="space-y-1.5"><Label htmlFor={`edit-city-${request.id}`}>City</Label><Input id={`edit-city-${request.id}`} required value={form.city} onChange={(event) => change("city", event.target.value)} /></div><div className="space-y-1.5"><Label htmlFor={`edit-district-${request.id}`}>District</Label><Input id={`edit-district-${request.id}`} required value={form.district} onChange={(event) => change("district", event.target.value)} /></div></div><div className="flex justify-end gap-2 pt-2"><Button type="button" variant="outline" onClick={() => setEditOpen(false)} disabled={update.isPending}>Close</Button><Button type="submit" disabled={update.isPending}>{update.isPending && <LoaderCircle className="size-4 animate-spin" />}Save changes</Button></div></form></DialogContent></Dialog>
    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}><DialogContent><DialogHeader><DialogTitle>Cancel this request?</DialogTitle><DialogDescription>“{request.title}” will be removed. This action is available only while the request is pending.</DialogDescription></DialogHeader>{remove.isError && <p role="alert" className="text-sm text-destructive">{remove.error instanceof Error ? remove.error.message : "Could not cancel the request."}</p>}<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={remove.isPending}>Keep request</Button><Button variant="destructive" disabled={remove.isPending} onClick={() => remove.mutate(request.id, { onSuccess: () => setDeleteOpen(false) })}>{remove.isPending && <LoaderCircle className="size-4 animate-spin" />}Cancel request</Button></div></DialogContent></Dialog>
  </div>;
}
