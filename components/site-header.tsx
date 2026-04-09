"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header className="flex h-14 sm:h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <SidebarTrigger className="-ml-2" />

      <div className="flex flex-1 items-center justify-between"></div>
    </header>
  );
}
