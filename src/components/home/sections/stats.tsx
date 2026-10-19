const stats = [
  { value: "12k+", label: "Service requests handled" },
  { value: "500+", label: "Trained technicians" },
  { value: "98%", label: "Jobs completed on time" },
  { value: "4.9/5", label: "Average customer rating" },
];

export default function StatsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-1 rounded-2xl border bg-card px-4 py-7 text-center shadow-sm ring-1 ring-foreground/10 sm:px-6"
          >
            <p className="text-3xl font-bold tracking-tight sm:text-4xl">
              {stat.value}
            </p>
            <p className="text-sm text-balance text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
