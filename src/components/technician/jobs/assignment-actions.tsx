"use client";

import { useState } from "react";
import { Check, LoaderCircle, X } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAcceptAssignment, useRejectAssignment } from "@/hooks/assignment.hook";

export default function AssignmentActions({ assignmentId, disabled = false }: { assignmentId: string; disabled?: boolean }) {
  const [confirmReject, setConfirmReject] = useState(false);
  const accept = useAcceptAssignment();
  const reject = useRejectAssignment();

  async function decide(action: "accept" | "reject") {
    const mutation = action === "accept" ? accept : reject;
    try {
      await mutation.mutateAsync(assignmentId);
      toast.add({ title: action === "accept" ? "Assignment accepted" : "Assignment declined", description: "Your assignment response has been saved.", type: "success" });
      setConfirmReject(false);
    } catch (error) {
      toast.add({ title: "Could not update assignment", description: error instanceof Error ? error.message : "Please try again.", type: "error" });
    }
  }

  return <>
    <div className="flex flex-wrap gap-2">
      <Button size="sm" disabled={disabled || accept.isPending || reject.isPending} onClick={() => void decide("accept")}><Check className="size-4" />{accept.isPending ? "Accepting…" : "Accept"}</Button>
      <Button size="sm" variant="outline" disabled={disabled || accept.isPending || reject.isPending} onClick={() => setConfirmReject(true)}><X className="size-4" />Decline</Button>
    </div>
    <Dialog open={confirmReject} onOpenChange={setConfirmReject}>
      <DialogContent>
        <DialogHeader><DialogTitle>Decline this assignment?</DialogTitle><DialogDescription>This will send a rejection response for this job assignment.</DialogDescription></DialogHeader>
        <div className="flex justify-end gap-2"><Button variant="outline" disabled={reject.isPending} onClick={() => setConfirmReject(false)}>Keep assignment</Button><Button variant="destructive" disabled={reject.isPending} onClick={() => void decide("reject")}>{reject.isPending && <LoaderCircle className="size-4 animate-spin" />}Decline assignment</Button></div>
      </DialogContent>
    </Dialog>
  </>;
}
