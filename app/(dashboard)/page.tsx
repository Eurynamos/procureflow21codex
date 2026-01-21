import { KPISection } from "@/components/dashboard/KPISection";
import { ProcurementTable } from "@/components/shared/ProcurementTable";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-600">
          Track procurement activity and contract milestones across departments.
        </p>
      </section>
      <KPISection />
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent procurements</h2>
          <span className="text-sm text-slate-500">Sorted by created date</span>
        </div>
        <div className="mt-4">
          <ProcurementTable />
        </div>
      </section>
    </div>
  );
}
