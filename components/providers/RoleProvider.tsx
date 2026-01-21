"use client";

import { createContext, useContext, useMemo, useState } from "react";

import type { Role } from "@/lib/data/menu";

type RoleContextValue = {
  role: Role;
  switchRole: (role: Role) => Promise<void>;
  isSwitching: boolean;
  error: string | null;
};

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

const defaultRole: Role = "admin";

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(defaultRole);
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const switchRole = async (nextRole: Role) => {
    if (nextRole === role) return;
    setIsSwitching(true);
    setError(null);
    try {
      const response = await fetch("/api/role/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nextRole })
      });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Unable to switch role.");
      }
      setRole(nextRole);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to switch role.");
    } finally {
      setIsSwitching(false);
    }
  };

  const value = useMemo(
    () => ({
      role,
      switchRole,
      isSwitching,
      error
    }),
    [role, isSwitching, error]
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within RoleProvider.");
  }
  return context;
}
