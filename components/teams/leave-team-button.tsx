"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { leaveTeam } from "@/app/actions/team";
import { useState } from "react";

export function LeaveTeamButton({ teamId }: { teamId: number }) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLeave = async () => {
    if (
      !confirm(
        "Вы уверены, что хотите покинуть эту команду? Вы потеряете доступ ко всем её данным.",
      )
    ) {
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await leaveTeam(teamId);

      if (response?.error) {
        setErrorMsg(response.error);
      }
    } catch (e) {
      setErrorMsg("Произошла ошибка при выходе из команды.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        disabled={isLoading}
        className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
        onClick={handleLeave}
      >
        <LogOut className="size-4" />
        {isLoading ? "Обработка..." : "Покинуть команду"}
      </Button>

      {errorMsg && (
        <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-background border border-destructive/30 shadow-lg rounded-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-xs text-destructive font-medium text-center text-balance">
            {errorMsg}
          </p>
        </div>
      )}
    </div>
  );
}
