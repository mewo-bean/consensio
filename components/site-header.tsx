"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function SiteHeader({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <SidebarTrigger className="size-9" />
    </div>
  );
}
