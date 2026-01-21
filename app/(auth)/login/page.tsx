import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-600">
            Sign in to manage procurements and contracts.
          </p>
        </div>
        <div className="space-y-3">
          <Button className="w-full">Sign in with SSO</Button>
          <Button variant="secondary" className="w-full">
            Sign in with email
          </Button>
        </div>
        <p className="text-center text-xs text-slate-500">
          Need access? Contact your department administrator.
        </p>
        <Link className="block text-center text-xs text-slate-400" href="/dashboard">
          Skip to dashboard (dev only)
        </Link>
      </div>
    </div>
  );
}
