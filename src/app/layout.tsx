import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/provider";
import { Toaster } from "@/components/ui/toast";
import HeaderSection from "@/components/home/public/header";
import Footer from "@/components/home/footer/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Service Management System",
  description:
    "A comprehensive platform for managing service requests, appointments, and field operations efficiently.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Provider>
          <HeaderSection/>
          {children}
          <Footer/>
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
