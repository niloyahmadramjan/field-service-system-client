"use client";

import { usePathname } from "next/navigation";
import HeaderSection from "@/components/home/public/header";
import Footer from "@/components/home/footer/footer";
import { ReactNode } from "react";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/"))
    return <>{children}</>;
  return (
    <>
      <HeaderSection />
      {children}
      <Footer />
    </>
  );
}
