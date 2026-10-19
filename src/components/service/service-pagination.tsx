"use client";

import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types/service.types";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ServicePagination({ meta, onPageChange }: { meta: PaginationMeta; onPageChange: (page: number) => void }) {
  if (meta.totalPages <= 1) return null;
  const start = Math.max(1, Math.min(meta.page - 2, meta.totalPages - 4));
  const pages = Array.from({ length: Math.min(5, meta.totalPages) }, (_, index) => start + index);
  return (
    <nav aria-label="Service pages" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <Button variant="outline" size="sm" disabled={meta.page <= 1} onClick={() => onPageChange(meta.page - 1)}><ChevronLeft /> Previous</Button>
      {pages.map((page) => <Button key={page} size="sm" variant={page === meta.page ? "default" : "outline"} aria-current={page === meta.page ? "page" : undefined} onClick={() => onPageChange(page)}>{page}</Button>)}
      <Button variant="outline" size="sm" disabled={meta.page >= meta.totalPages} onClick={() => onPageChange(meta.page + 1)}>Next <ChevronRight /></Button>
    </nav>
  );
}
