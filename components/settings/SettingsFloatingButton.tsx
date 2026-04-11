"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BellRing } from "lucide-react";
import NotificationSettings from "./NotificationSettings";

const excludedPaths = ["/login", "/register"];

export default function SettingsFloatingButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (excludedPaths.includes(pathname)) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="fixed bottom-6 left-4 sm:left-6 z-50 flex items-center justify-center sm:justify-start gap-3 px-4 sm:px-5 py-2.5 sm:py-3 sm:w-52 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-1 hover:bg-primary/90 transition-all duration-300"
          aria-label="Настройки уведомлений"
        >
          <BellRing className="size-4.5 sm:size-5 shrink-0" />
          <span className="font-bold text-sm">Уведомления</span>
        </button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] sm:max-w-95 max-h-[90vh] overflow-y-auto rounded-xl p-4 sm:p-5">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-lg font-black">
            Настройки уведомлений
          </DialogTitle>
        </DialogHeader>
        <NotificationSettings />
      </DialogContent>
    </Dialog>
  );
}
