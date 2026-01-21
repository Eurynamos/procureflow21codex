export type Role = "admin" | "fiscal" | "contracting";

export const roleMenu: Record<Role, { label: string; href: string }[]> = {
  admin: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Procurements", href: "/procurements" },
    { label: "Contracts", href: "/contracts" },
    { label: "Vendors", href: "/vendors" },
    { label: "Audit Logs", href: "/audit-logs" },
    { label: "Users", href: "/users" }
  ],
  fiscal: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Procurements", href: "/procurements" },
    { label: "Budgets", href: "/budgets" },
    { label: "Reports", href: "/reports" }
  ],
  contracting: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Procurements", href: "/procurements" },
    { label: "Contracts", href: "/contracts" },
    { label: "Vendors", href: "/vendors" }
  ]
};
