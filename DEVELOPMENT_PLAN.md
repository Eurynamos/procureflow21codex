# Procurement & Contract Management SaaS — Technical Blueprint

This document outlines the development roadmap, proposed Next.js App Router directory structure, Supabase schema and RLS strategy, component architecture using Shadcn/ui, and implementation snippets for auto-login (dev) and role switching. The entire interface and codebase naming conventions are in English.

## 1) Development Roadmap (Phased)

### Phase 1 — Foundation & Auth (Week 1–2)
- Initialize Next.js (App Router), Tailwind CSS, and Shadcn/ui.
- Configure Supabase (auth, database, storage if needed).
- Implement auth flows: sign-in, session handling, protected routes.
- Enforce roles: Admin, Fiscal, Contracting.
- Build base layout with collapsible left sidebar.

### Phase 2 — Data Model & RLS (Week 2–3)
- Define core tables for procurement lifecycle.
- Implement Row Level Security (RLS) with role separation.
- Seed baseline data (statuses, departments, sample users).
- Build Supabase query utilities (server/client helpers).

### Phase 3 — Core UI Modules (Week 3–4)
- Dashboard: KPIs and assigned tasks by role.
- Procurement requests list with sorting and filters.
- Contract management module.
- Vendor module (if needed).
- Shadcn/ui tables with ascending/descending sorting.

### Phase 4 — Workflow & Reporting (Week 4–6)
- Workflow status transitions (Draft → Submitted → Approved → Ordered).
- Role-based approvals.
- Contract expiration alerts.
- Reporting (export CSV, summary counts).

### Phase 5 — Hardening & QA (Week 6–7)
- Audit logs.
- Role revocation and data access edge cases.
- UX polish and accessibility checks.
- Performance tuning and indexing.

## 2) Project Directory Structure (Next.js App Router)

```
/app
  /(auth)
    /login
      page.tsx
  /(dashboard)
    /layout.tsx                # sidebar + header + main layout
    /page.tsx                  # default dashboard
    /procurements
      page.tsx
      /[id]
        page.tsx
    /contracts
      page.tsx
      /[id]
        page.tsx
    /vendors
      page.tsx
  /api
    /auth
      /dev-login
        route.ts               # dev-only auto login endpoint
    /role
      /switch
        route.ts               # role switching endpoint
/components
  /layout
    Sidebar.tsx
    SidebarNav.tsx
    TopBar.tsx
    RoleSwitcher.tsx
  /dashboard
    KPIStats.tsx
    RecentActivity.tsx
  /tables
    ProcurementTable.tsx
    ContractTable.tsx
  /shared
    DataTable.tsx
    EmptyState.tsx
/lib
  /supabase
    client.ts                  # browser client
    server.ts                  # server client
    admin.ts                   # service role (server-only)
  /auth
    roles.ts                   # role enum & helpers
    requireRole.ts             # guard utilities
  /data
    menu.ts                    # role-based menu definitions
  /utils
    formatters.ts
    permissions.ts
/styles
  globals.css
```

## 3) Supabase Database Schema & RLS Policies

### Core Tables

**profiles**
- `id` (uuid, pk, references auth.users)
- `email` (text)
- `full_name` (text)
- `role` (text, enum: admin | fiscal | contracting)
- `department_id` (uuid, fk)
- `created_at` (timestamptz)

**departments**
- `id` (uuid, pk)
- `name` (text)
- `created_at`

**procurements**
- `id` (uuid, pk)
- `title` (text)
- `description` (text)
- `status` (text: draft/submitted/approved/ordered/closed)
- `requested_by` (uuid, fk profiles)
- `department_id` (uuid, fk)
- `budget` (numeric)
- `created_at`, `updated_at`

**contracts**
- `id` (uuid, pk)
- `procurement_id` (uuid, fk)
- `vendor_id` (uuid, fk)
- `value` (numeric)
- `start_date`, `end_date`
- `status` (text: active/expired/terminated)
- `created_at`, `updated_at`

**vendors**
- `id` (uuid, pk)
- `name` (text)
- `contact_email` (text)
- `created_at`

**audit_logs**
- `id` (uuid, pk)
- `actor_id` (uuid)
- `action` (text)
- `entity_type` (text)
- `entity_id` (uuid)
- `created_at`

### RLS Policy Highlights (Supabase)
- **profiles**: users can read their own profile; admins can read all.
- **procurements**:
  - Admin: full access.
  - Fiscal: can read all in their department; update only when status is in “submitted/approved”.
  - Contracting: read all; update contract-specific fields only (if stored here).
- **contracts**:
  - Admin: full access.
  - Fiscal: read-only.
  - Contracting: create/update within assigned procurements.
- **vendors**: Admin + Contracting can read/write; Fiscal read-only.

### Suggested RLS Policy Templates

Enable RLS on all core tables:

```sql
alter table profiles enable row level security;
alter table procurements enable row level security;
alter table contracts enable row level security;
alter table vendors enable row level security;
alter table audit_logs enable row level security;
```

Admin full access via role claim:

```sql
create policy "admin_all_access"
on procurements for all
using (auth.jwt() ->> 'role' = 'admin')
with check (auth.jwt() ->> 'role' = 'admin');
```

Fiscal read-only within department:

```sql
create policy "fiscal_department_read"
on procurements for select
using (
  exists (
    select 1 from profiles p
    where p.id = auth.uid()
      and p.role = 'fiscal'
      and p.department_id = procurements.department_id
  )
);
```

Contracting update on contracts, scoped to assigned procurements:

```sql
create policy "contracting_contract_write"
on contracts for insert, update
using (
  exists (
    select 1 from procurements pr
    join profiles p on p.id = auth.uid()
    where pr.id = contracts.procurement_id
      and p.role = 'contracting'
  )
)
with check (
  exists (
    select 1 from procurements pr
    join profiles p on p.id = auth.uid()
    where pr.id = contracts.procurement_id
      and p.role = 'contracting'
  )
);
```

### Indexing Suggestions
- `procurements (department_id, status, created_at)` for role dashboards.
- `contracts (procurement_id, status, end_date)` for renewals/alerts.
- `audit_logs (actor_id, created_at)` for admin reviews.

Example policy (conceptual):

```sql
create policy "fiscal_department_read"
on procurements for select
using (
  exists (
    select 1 from profiles p
    where p.id = auth.uid()
      and p.role = 'fiscal'
      and p.department_id = procurements.department_id
  )
);
```

## 4) Component Architecture (Shadcn/ui + Tailwind)

### Layout
- **Sidebar**: collapsible left nav, role-specific menu.
- **TopBar**: breadcrumb + role switcher + user menu.
- **Main Content**: role-aware dashboard & route content.

### Key Components
- `Sidebar.tsx`
  - Shadcn `Button`, `Tooltip`, `Separator`, `ScrollArea`.
  - Collapsible toggle via `useState` + `cn` for width.
- `RoleSwitcher.tsx`
  - Shadcn `DropdownMenu` + `Button`.
  - Switch role via `/api/role/switch`.
- `DataTable.tsx`
  - Shadcn `Table` + sorting handlers.

### Role-Based Menu Definitions (`/lib/data/menu.ts`)
- Admin: Dashboard, Procurements, Contracts, Vendors, Audit Logs, Users.
- Fiscal: Dashboard, Procurements, Budgets, Reports.
- Contracting: Dashboard, Procurements, Contracts, Vendors.

### Role-to-Menu Matrix (English UI Labels)

| Role | Menu Items |
| --- | --- |
| Admin | Dashboard, Procurements, Contracts, Vendors, Audit Logs, Users |
| Fiscal | Dashboard, Procurements, Budgets, Reports |
| Contracting | Dashboard, Procurements, Contracts, Vendors |

### Sidebar Layout Notes
- Collapsible by toggling a `collapsed` state and switching between `w-64` and `w-16`.
- Use icon + text in expanded mode; icon-only with tooltip in collapsed mode.
- Keep role switcher in the top bar, not in the sidebar, to avoid accidental role changes.

## 5) Code Snippets

### A) Auto-login Admin Button (Dev Mode)

**UI Button**

```tsx
// components/auth/DevAutoLoginButton.tsx
import { Button } from "@/components/ui/button";

export function DevAutoLoginButton() {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <Button
      variant="secondary"
      onClick={async () => {
        await fetch("/api/auth/dev-login", { method: "POST" });
        window.location.href = "/dashboard";
      }}
    >
      Auto-login Admin (Dev)
    </Button>
  );
}
```

**API Route**

```ts
// app/api/auth/dev-login/route.ts
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.auth.admin.createUser({
    email: "admin@local.dev",
    password: "password",
    email_confirm: true,
    user_metadata: { role: "admin" },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true, userId: data.user.id });
}
```

### B) Role Switching Logic

**Role Switcher Component**

```tsx
// components/layout/RoleSwitcher.tsx
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const roles = ["admin", "fiscal", "contracting"] as const;

export function RoleSwitcher({ currentRole }: { currentRole: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Role: {currentRole}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {roles.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={async () => {
              await fetch("/api/role/switch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
              });
              window.location.reload();
            }}
          >
            {role.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

**API Route**

```ts
// app/api/role/switch/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { role } = await req.json();
  if (!["admin", "fiscal", "contracting"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await supabase.from("profiles").update({ role }).eq("id", user.id);

  return NextResponse.json({ ok: true });
}
```

### C) Data Table Sorting (Ascending/Descending)

```tsx
// components/shared/DataTable.tsx
import { useMemo, useState } from "react";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type SortDirection = "asc" | "desc";

export function DataTable<T extends Record<string, unknown>>({
  rows,
  columns,
  defaultSortKey,
}: {
  rows: T[];
  columns: { key: keyof T; label: string }[];
  defaultSortKey: keyof T;
}) {
  const [sortKey, setSortKey] = useState<keyof T>(defaultSortKey);
  const [direction, setDirection] = useState<SortDirection>("desc");

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const left = a[sortKey];
      const right = b[sortKey];
      if (left === right) return 0;
      if (left === null || left === undefined) return 1;
      if (right === null || right === undefined) return -1;
      return left > right ? 1 : -1;
    });
    return direction === "asc" ? copy : copy.reverse();
  }, [rows, sortKey, direction]);

  const toggleSort = (key: keyof T) => {
    if (key === sortKey) {
      setDirection(direction === "asc" ? "desc" : "asc");
      return;
    }
    setSortKey(key);
    setDirection("asc");
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={String(column.key)}
              className="cursor-pointer select-none"
              onClick={() => toggleSort(column.key)}
            >
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      {/* Render sortedRows with TableBody */}
    </Table>
  );
}
```

### D) Role Switching Guardrails
- Allow role switching only in development or when the current user is Admin.
- Prefer server-side validation using claims or a `profiles.role` check.
- Log role changes in `audit_logs`.

## 6) UI/UX Notes (English-only, modern & minimal)

- Collapsible sidebar with icon-only mode.
- Consistent typography and spacing.
- Utility-focused dashboard with clear status badges.
- Soft backgrounds for KPI cards, high-contrast for status chips.
