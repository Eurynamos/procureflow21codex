"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useRole } from "@/components/providers/RoleProvider";
import type { Role } from "@/lib/data/menu";

const roles: Role[] = ["admin", "fiscal", "contracting"];

export function RoleSwitcher() {
  const { role, switchRole, isSwitching, error } = useRole();

  return (
    <div className="flex flex-col items-end gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="secondary" disabled={isSwitching}>
            Role: {role}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {roles.map((item) => (
            <DropdownMenuItem key={item} onClick={() => switchRole(item)}>
              {item.toUpperCase()}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {error ? <span className="text-xs text-rose-500">{error}</span> : null}
    </div>
  );
}
