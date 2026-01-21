const metrics = [
  { label: "Active procurements", value: "28" },
  { label: "Pending approvals", value: "12" },
  { label: "Contracts expiring in 30 days", value: "4" },
  { label: "Total budget in review", value: "$1.8M" }
];

export function KPISection() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
          <p className="text-sm text-slate-500">{metric.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {metric.value}
          </p>
        </div>
      ))}
    </section>
  );
}
