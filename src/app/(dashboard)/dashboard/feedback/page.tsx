"use client";

import { useState, type FormEvent } from "react";
import {
  MessageSquareText,
  LoaderCircle,
  Star,
  TriangleAlert,
} from "lucide-react";
import {
  RecordsPanel,
  type CustomerRecordRow,
} from "@/components/dashboard/records-panel";
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
  useMyFeedback,
  useMyInvoices,
  useMyWorkOrders,
  useSubmitFeedback,
} from "@/hooks/customer.hook";
import { displayDate, listItems } from "@/lib/customer-format";

export default function FeedbackPage() {
  const feedback = useMyFeedback();
  const workOrders = useMyWorkOrders();
  const invoices = useMyInvoices();
  const submit = useSubmitFeedback();
  const [workOrderId, setWorkOrderId] = useState("");
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const paidWorkOrderIds = new Set(
    listItems(invoices.data)
      .filter((invoice) => invoice.status === "PAID")
      .map((invoice) => invoice.workOrderId)
      .filter((id): id is string => Boolean(id)),
  );
  const submittedIds = new Set(
    listItems(feedback.data).map((item) => item.workOrderId),
  );
  const eligible = listItems(workOrders.data).filter(
    (order) =>
      order.status === "COMPLETED" &&
      (order.invoice?.status === "PAID" || paidWorkOrderIds.has(order.id)) &&
      !submittedIds.has(order.id),
  );
  const rows: CustomerRecordRow[] = listItems(feedback.data).map((item) => ({
    id: item.id,
    title:
      item.workOrder?.serviceRequest?.service?.name ??
      item.workOrder?.serviceRequest?.title ??
      `Work order ${item.workOrder?.workOrderNumber ?? ""}`,
    description: item.comment,
    details: [
      { label: "Rating", value: `${item.rating} / 5` },
      { label: "Submitted", value: displayDate(item.createdAt) },
      { label: "Work order", value: item.workOrder?.workOrderNumber ?? "—" },
    ],
  }));

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submit.mutateAsync({
      workOrderId,
      rating: Number(rating),
      comment: comment.trim(),
    });
    setWorkOrderId("");
    setComment("");
    setRating("5");
  }

  const listLoading =
    feedback.isPending || workOrders.isPending || invoices.isPending;
  const listError = feedback.isError || workOrders.isError || invoices.isError;
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section>
        <div className="mb-5 flex items-start gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageSquareText className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Feedback</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Share your experience after a completed and paid service.
            </p>
          </div>
        </div>
        {eligible.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Rate a completed service
              </CardTitle>
              <CardDescription>
                Feedback is available after the invoice is paid. You can submit
                one review per work order.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(event) => void onSubmit(event)}
                className="grid gap-4 sm:grid-cols-2"
              >
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="feedback-order">Completed work order</Label>
                  <select
                    id="feedback-order"
                    required
                    value={workOrderId}
                    onChange={(event) => setWorkOrderId(event.target.value)}
                    className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Choose a work order</option>
                    {eligible.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.workOrderNumber} ·{" "}
                        {order.serviceRequest?.service?.name ??
                          order.serviceRequest?.title ??
                          "Service"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedback-rating">Rating</Label>
                  <div className="relative">
                    <Star className="absolute left-3 top-2.5 size-4 fill-amber-400 text-amber-400" />
                    <Input
                      id="feedback-rating"
                      type="number"
                      min="1"
                      max="5"
                      required
                      className="pl-9"
                      value={rating}
                      onChange={(event) => setRating(event.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="feedback-comment">Comment</Label>
                  <textarea
                    id="feedback-comment"
                    required
                    maxLength={1500}
                    rows={3}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Tell us how the service went"
                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                </div>
                {submit.isError && (
                  <p
                    role="alert"
                    className="flex items-start gap-2 text-sm text-destructive sm:col-span-2"
                  >
                    <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                    {submit.error instanceof Error
                      ? submit.error.message
                      : "Could not submit feedback."}
                  </p>
                )}
                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    disabled={!workOrderId || submit.isPending}
                  >
                    {submit.isPending && (
                      <LoaderCircle className="size-4 animate-spin" />
                    )}
                    Submit feedback
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        {!listLoading && !listError && eligible.length === 0 && (
          <p className="rounded-lg border bg-background p-4 text-sm text-muted-foreground">
            There are no completed, paid services waiting for feedback.
          </p>
        )}
      </section>
      {/* <RecordsPanel
        title="Your feedback"
        description="Reviews you have already submitted."
        icon={<MessageSquareText />}
        rows={rows}
        isPending={listLoading}
        isError={listError}
        onRetry={() => {
          void feedback.refetch();
          void workOrders.refetch();
          void invoices.refetch();
        }}
        emptyTitle="No feedback submitted"
        emptyDescription="Your service reviews will appear here after you submit them."
      /> */}
    </div>
  );
}
