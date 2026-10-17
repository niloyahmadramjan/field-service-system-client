"use client";

import Logo from "@/components/home/logo/Logo";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-2">
      {/* Form Section */}
      <section className="flex min-h-svh flex-col px-5 py-6 sm:px-8 md:px-12 lg:px-16">
       <Logo/>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <div className="mb-8 space-y-2">
              <p className="text-sm font-medium text-primary">
                Welcome back
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Sign in to your account
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                Manage your service requests, appointments, and
                field operations from one place.
              </p>
            </div>

            {/* <LoginForm /> */}

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground lg:text-left">
          © {new Date().getFullYear()} Field Service Management System
        </p>
      </section>

      {/* Image Section */}
      <aside className="relative hidden overflow-hidden bg-muted lg:block">
        <Image
          src="/Field-Service-Register.webp"
          alt="Field technician working on a service task"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

        <div className="absolute left-10 right-10 top-10">
          <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
            Field operations made simple
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12 xl:p-16">
          <div className="max-w-xl space-y-5 text-white">
            <div className="h-1 w-12 rounded-full bg-white" />
            <h2 className="text-3xl font-bold leading-tight xl:text-5xl">
              Every service.
              <br />
              Every visit.
              <br />
              Under control.
            </h2>
            <p className="max-w-md text-sm leading-7 text-white/80 sm:text-base">
              Coordinate your technicians, track work orders, and
              deliver better customer service with one organized
              workspace.
            </p>
          </div>
        </div>
      </aside>
    </main>
  );
}