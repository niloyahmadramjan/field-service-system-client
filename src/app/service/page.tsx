import { ServiceList } from "@/components/service/service-list";

export default function ServicesPage() {
  return (
    <main className="flex-1 bg-muted/20">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-left">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Services for your home
          </h1>
        </div>
        <ServiceList />
      </section>
    </main>
  );
}
