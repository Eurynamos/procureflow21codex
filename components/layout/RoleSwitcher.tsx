"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type { Role } from "@/lib/data/menu";

const roles: Role[] = ["admin", "fiscal", "contracting"];

export function RoleSwitcher() {
  const [currentRole, setCurrentRole] = useState<Role>("admin");

  const handleSwitch = (role: Role) => {
    setCurrentRole(role);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="secondary">Role: {currentRole}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {roles.map((role) => (
          <DropdownMenuItem key={role} onClick={() => handleSwitch(role)}>
            {role.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
