"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { roleMenu, type Role } from "@/lib/data/menu";
import { cn } from "@/lib/utils";

const defaultRole: Role = "admin";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const menu = roleMenu[defaultRole];

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-slate-200 bg-white transition-all",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <div className={cn("text-lg font-semibold text-slate-900", collapsed && "sr-only")}>
          ProcureFlow
        </div>
        <Button
          variant="ghost"
          className="h-8 w-8 rounded-full p-0"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? ">" : "<"}
        </Button>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100",
              collapsed && "justify-center px-2"
            )}
          >
            {collapsed ? item.label.slice(0, 1) : item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
