import { RoleSwitcher } from "@/components/layout/RoleSwitcher";

export function TopBar() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Procurement and Contract Management
        </p>
        <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
      </div>
      <div className="flex items-center gap-3">
        <RoleSwitcher />
      </div>
    </header>
  );
}
