"use client";

import { LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { leaveTeam } from "@/app/actions/team";
import { useState } from "react";
import { toast } from "sonner";

export function LeaveTeamButton({ teamId }: { teamId: number }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLeave = async () => {
    const isConfirmed = confirm(
      "Вы уверены, что хотите покинуть эту команду? Вы потеряете доступ ко всем её данным.",
    );

    if (!isConfirmed) return;

    setIsLoading(true);

    try {
      const response = await leaveTeam(teamId);

      if (response?.error) {
        toast.error(response.error);
      } else {
        toast.success("Вы покинули команду");
      }
    } catch (e) {
      toast.error("Произошла ошибка при выходе из команды.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      disabled={isLoading}
      className="w-full sm:w-auto gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 h-10 sm:h-9"
      onClick={handleLeave}
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin shrink-0" />
      ) : (
        <LogOut className="size-4 shrink-0" />
      )}
      <span className="font-bold text-xs uppercase tracking-wider truncate">
        {isLoading ? "Обработка..." : "Покинуть"}
      </span>
    </Button>
  );
}
