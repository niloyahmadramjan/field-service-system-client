"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, LoaderCircle, TriangleAlert } from "lucide-react";
import { useGetMe } from "@/hooks/auth.hook";
import { useRequestService } from "@/hooks/service.hook";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Service, ServiceRequestPayload } from "@/types/service.types";
import { format } from "date-fns";

const emptyForm: ServiceRequestPayload = {
  title: "",
  description: "",
  preferredDate: "",
  address: "",
  city: "",
  district: "",
};

function errorMessage(error: unknown) {
  if (error && typeof error === "object" && "data" in error) {
    const body = (error as { data?: { message?: string } }).data;
    if (body?.message) return body.message;
  }
  return error instanceof Error
    ? error.message
    : "Your request could not be submitted. Please try again.";
}

export function ServiceRequestDialog({ service }: { service: Service }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { data: auth, isPending: checkingAuth } = useGetMe();
  const request = useRequestService();
  const created = request.data?.data;

  function update(field: keyof ServiceRequestPayload, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const preferredDate = new Date(form.preferredDate);
    if (!Number.isFinite(preferredDate.getTime())) return;
    await request.mutateAsync({
      serviceId: service.id,
      payload: { ...form, preferredDate: preferredDate.toISOString() },
    });
  }

  function closeDialog(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      request.reset();
      setForm(emptyForm);
    }
  }

  return (
    <>
      <Button
        size="lg"
        className="w-full sm:w-auto"
        onClick={() => setOpen(true)}
        disabled={!service.isActive}
      >
        Request this service
      </Button>
      <Dialog open={open} onOpenChange={closeDialog}>
        <DialogContent className="max-w-xl">
          {created ? (
            <div className="py-5 text-center">
              <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="size-9" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  Request submitted!
                </DialogTitle>
                <DialogDescription>
                  Your service request has been created successfully.
                </DialogDescription>
              </DialogHeader>
              <div className="my-5 rounded-lg border bg-muted/40 p-4 text-left">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Request number</span>
                  <span className="font-semibold">{created.requestNumber}</span>
                </div>
                <div className="mt-3 flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-800">
                    {created.status}
                  </span>
                </div>
                <div className="mt-3 flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="mt-3 flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Preferred date</span>
                  <span className="font-medium">
                    {format(new Date(created.preferredDate), "PPP p")}
                  </span>
                </div>
              </div>
              <Button className="w-full" onClick={() => closeDialog(false)}>
                Done
              </Button>
            </div>
          ) : !auth?.data ? (
            <>
              <DialogHeader>
                <DialogTitle>Sign in to request a service</DialogTitle>
                <DialogDescription>
                  You need a customer account to send a service request.
                </DialogDescription>
              </DialogHeader>
              {checkingAuth ? (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <LoaderCircle className="size-4 animate-spin" /> Checking your
                  account…
                </p>
              ) : (
                <div className="flex gap-3">
                  <Button render={<Link href="/login" />} nativeButton={false}>Sign in</Button>
                  <Button variant="outline" render={<Link href="/register" />} nativeButton={false}>
                    Create account
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Request {service.name}</DialogTitle>
                <DialogDescription>
                  Tell us what you need and where we should provide the service.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(event) => void submit(event)}
                className="space-y-4"
              >
                {request.isError && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
                  >
                    <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                    {errorMessage(request.error)}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="request-title">Request title</Label>
                  <Input
                    id="request-title"
                    required
                    maxLength={120}
                    placeholder="e.g. AC not cooling properly"
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="request-description">
                    Describe the issue
                  </Label>
                  <textarea
                    id="request-description"
                    required
                    maxLength={2000}
                    rows={3}
                    placeholder="Share details that will help our technician prepare"
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferred-date">
                    Preferred date and time
                  </Label>
                  <Input
                    id="preferred-date"
                    type="datetime-local"
                    required
                    min={new Date().toISOString().slice(0, 16)}
                    value={form.preferredDate}
                    onChange={(e) => update("preferredDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="request-address">Street address</Label>
                  <Input
                    id="request-address"
                    required
                    maxLength={250}
                    placeholder="House, road, and area"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="request-city">City</Label>
                    <Input
                      id="request-city"
                      required
                      maxLength={100}
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="request-district">District</Label>
                    <Input
                      id="request-district"
                      required
                      maxLength={100}
                      value={form.district}
                      onChange={(e) => update("district", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => closeDialog(false)}
                    disabled={request.isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={request.isPending}>
                    {request.isPending && (
                      <LoaderCircle className="size-4 animate-spin" />
                    )}
                    {request.isPending ? "Sending request…" : "Submit request"}
                  </Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
