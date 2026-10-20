import { Suspense } from "react";
import { RequestDetail } from "@/components/dashboard/request-detail";

export default function RequestDetailPage() {
  return <Suspense fallback={<div className="flex min-h-64 items-center justify-center text-muted-foreground">Loading request…</div>}><RequestDetail /></Suspense>;
}
