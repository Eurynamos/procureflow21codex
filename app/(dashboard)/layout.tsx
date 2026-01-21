import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { RoleProvider } from "@/components/providers/RoleProvider";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProvider>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1">
          <TopBar />
          <div className="px-6 pb-10 pt-4">{children}</div>
        </main>
      </div>
    </RoleProvider>
  );
}
