"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, LoaderCircle, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateCustomerProfile } from "@/hooks/customer.hook";
import type { ICustomerProfile } from "@/types/auth.types";

export function CustomerAddressEditor({ profile }: { profile: ICustomerProfile }) {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState(profile.address);
  const [city, setCity] = useState(profile.city);
  const [district, setDistrict] = useState(profile.district);
  const update = useUpdateCustomerProfile();

  function openForm() {
    setAddress(profile.address);
    setCity(profile.city);
    setDistrict(profile.district);
    update.reset();
    setOpen(true);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await update.mutateAsync({ address: address.trim(), city: city.trim(), district: district.trim() });
  }

  return <><Button variant="outline" size="sm" onClick={openForm}>Edit service address</Button><Dialog open={open} onOpenChange={setOpen}><DialogContent>{update.isSuccess ? <div className="py-5 text-center"><div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="size-8" /></div><DialogHeader><DialogTitle>Address updated</DialogTitle><DialogDescription>Your customer service address has been saved.</DialogDescription></DialogHeader><Button className="mt-3 w-full" onClick={() => setOpen(false)}>Done</Button></div> : <><DialogHeader><DialogTitle>Update service address</DialogTitle><DialogDescription>This address is used when you request services.</DialogDescription></DialogHeader><form onSubmit={(event) => void submit(event)} className="space-y-4">{update.isError && <p role="alert" className="flex gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"><TriangleAlert className="size-4 shrink-0" />{update.error instanceof Error ? update.error.message : "Could not update your address."}</p>}<div className="space-y-2"><Label htmlFor="customer-address">Street address</Label><Input id="customer-address" required maxLength={250} value={address} onChange={(event) => setAddress(event.target.value)} /></div><div className="space-y-2"><Label htmlFor="customer-city">City</Label><Input id="customer-city" required maxLength={100} value={city} onChange={(event) => setCity(event.target.value)} /></div><div className="space-y-2"><Label htmlFor="customer-district">District</Label><Input id="customer-district" required maxLength={100} value={district} onChange={(event) => setDistrict(event.target.value)} /></div><div className="flex justify-end gap-2 pt-2"><Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={update.isPending}>Cancel</Button><Button type="submit" disabled={update.isPending}>{update.isPending && <LoaderCircle className="size-4 animate-spin" />}{update.isPending ? "Saving…" : "Save address"}</Button></div></form></>}</DialogContent></Dialog></>;
}
