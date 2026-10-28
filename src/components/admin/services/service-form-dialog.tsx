"use client";

import { useState, type FormEvent } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useCreateService, useUpdateService } from "@/hooks/service.hook";
import type { Service, ServicePayload } from "@/types/service.types";

function errorMessage(error: Error) {
  const responseMessage = (error as Error & { data?: { message?: string } }).data?.message;
  return responseMessage || error.message || "Please try again.";
}

export default function ServiceFormDialog({ open, onOpenChange, service }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
}) {
  const [name, setName] = useState(service?.name ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [price, setPrice] = useState(service?.price ?? "");
  const create = useCreateService();
  const update = useUpdateService();
  const busy = create.isPending || update.isPending;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: ServicePayload = { name: name.trim(), description: description.trim(), price: price.trim() };
    const callbacks = {
      onSuccess: () => {
        toast.add({ title: service ? "Service updated" : "Service created", description: `${payload.name} has been saved.`, type: "success" });
        onOpenChange(false);
      },
      onError: (error: Error) => toast.add({ title: service ? "Could not update service" : "Could not create service", description: errorMessage(error), type: "error" }),
    };
    if (service) update.mutate({ serviceId: service.id, payload }, callbacks);
    else create.mutate(payload, callbacks);
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>{service ? "Edit service" : "Create service"}</DialogTitle>
        <DialogDescription>{service ? "Update the service information shown to customers." : "Add a service to the customer service catalog."}</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2"><Label htmlFor="service-name">Service name</Label><Input id="service-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. AC Repair Service" required maxLength={120} /></div>
        <div className="space-y-2"><Label htmlFor="service-description">Description</Label><Textarea id="service-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe what this service includes" required rows={4} maxLength={1000} /></div>
        <div className="space-y-2"><Label htmlFor="service-price">Price</Label><Input id="service-price" type="number" inputMode="decimal" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="1200" required /></div>
        <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button><Button type="submit" disabled={busy || !name.trim() || !description.trim() || !price.trim()}>{busy && <LoaderCircle className="animate-spin" />}{service ? "Save changes" : "Create service"}</Button></div>
      </form>
    </DialogContent>
  </Dialog>;
}
