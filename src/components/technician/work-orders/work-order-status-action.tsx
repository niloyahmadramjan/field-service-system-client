"use client";

import { useState } from "react";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateMyWorkOrderStatus } from "@/hooks/technician-work-order.hook";
import type { WorkOrder, WorkOrderStatus } from "@/types/work-order.types";

const statuses: WorkOrderStatus[] = ["CREATED", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

function errorMessage(error: Error) {
  return (error as Error & { data?: { message?: string } }).data?.message || error.message || "Please try again.";
}

export default function WorkOrderStatusAction({ workOrder }: { workOrder: WorkOrder }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<WorkOrderStatus>(workOrder.status);
  const update = useUpdateMyWorkOrderStatus();

  const changeStatus = () => update.mutate({ workOrderId: workOrder.id, status }, {
    onSuccess: () => {
      toast.add({
        title: "Work order status updated",
        description: `${workOrder.workOrderNumber} is now ${status.replaceAll("_", " ").toLowerCase()}.`,
        type: "success",
      });
      setOpen(false);
    },
    onError: (error) => toast.add({ title: "Could not update work order", description: errorMessage(error), type: "error" }),
  });

  return <>
    <Button variant="outline" size="sm" onClick={() => { setStatus(workOrder.status); setOpen(true); }}>
      <RefreshCw className="size-4" />
      <span>Change status</span>
    </Button>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update work order status</DialogTitle>
          <DialogDescription>Select the new status for {workOrder.workOrderNumber}. The server will validate whether this transition is allowed.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <label htmlFor={`technician-work-order-status-${workOrder.id}`} className="text-sm font-medium">Status</label>
          <Select value={status} onValueChange={(value) => { if (statuses.includes(value as WorkOrderStatus)) setStatus(value as WorkOrderStatus); }}>
            <SelectTrigger id={`technician-work-order-status-${workOrder.id}`} className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>{statuses.map((value) => <SelectItem key={value} value={value}>{value.replaceAll("_", " ")}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={update.isPending}>Cancel</Button>
          <Button onClick={changeStatus} disabled={update.isPending || status === workOrder.status}>
            {update.isPending && <LoaderCircle className="size-4 animate-spin" />}
            Save status
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </>;
}
