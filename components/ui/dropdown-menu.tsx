import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type DropdownMenuProps = HTMLAttributes<HTMLDetailsElement>;

export function DropdownMenu({ className, ...props }: DropdownMenuProps) {
  return (
    <details className={cn("relative", className)} {...props} />
  );
}

export function DropdownMenuTrigger({
  children,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <summary className={cn("list-none cursor-pointer", props.className)}>
      {children}
    </summary>
  );
}

export function DropdownMenuContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "absolute right-0 z-10 mt-2 w-40 rounded-md border border-slate-200 bg-white shadow-lg",
        className
      )}
      {...props}
    />
  );
}

export function DropdownMenuItem({
  className,
  ...props
}: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50",
        className
      )}
      {...props}
    />
  );
}
