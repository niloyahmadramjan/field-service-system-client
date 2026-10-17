// biome-ignore assist/source/organizeImports: <explanation>
import type { ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Provider({ children }: { children: ReactNode }) {
  return (
      <QueryProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </QueryProvider>
  );
}
