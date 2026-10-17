
import Logo from "@/components/home/logo/Logo";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-2">
      {/* Image Section */}
      <aside className="relative hidden overflow-hidden bg-muted lg:block">
        <Image
          src="/Field-Service-Register.webp"
          alt="Field service technician"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

         <Logo/>

        <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12 xl:p-16">
          <p className="mb-4 text-sm font-medium text-white/70">
            BUILT FOR BETTER OPERATIONS
          </p>
          <h2 className="max-w-xl text-3xl font-bold leading-tight text-white xl:text-5xl">
            Bring your entire field team together.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/80 sm:text-base">
            Organize service requests, schedule visits, and keep
            every job moving forward.
          </p>
        </div>
      </aside>

      {/* Form Section */}
      <section className="flex min-h-svh flex-col px-5 py-6 sm:px-8 md:px-12 lg:px-16">
        <div className="flex justify-end">
          <p className="text-sm text-muted-foreground">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <div className="mb-8 space-y-2">
              <p className="text-sm font-medium text-primary">
                Get started today
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Create your account
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                Join the platform to manage your field service
                operations more efficiently.
              </p>
            </div>

            {/* <RegisterForm /> */}

            <p className="mt-8 text-center text-xs leading-5 text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-4">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground lg:text-left">
          © {new Date().getFullYear()} Field Service Management System
        </p>
      </section>
    </main>
  );
}