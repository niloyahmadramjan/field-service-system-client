import { Suspense } from "react";
import { ServiceDetail } from "@/components/service/service-detail";

export default function ServiceDetailPage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 items-center justify-center text-muted-foreground">
          Loading service…
        </main>
      }
    >
      <ServiceDetail />
    </Suspense>
  );
}
