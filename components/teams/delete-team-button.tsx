"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteTeam } from "@/app/actions/team";

export function DeleteTeamButton({ teamId }: { teamId: number }) {
  const handleDelete = async () => {
    if (confirm("Удалить команду навсегда?")) {
      await deleteTeam(teamId);
    }
  };

  return (
    <Button
      variant="destructive"
      className="w-full sm:w-auto gap-2 h-10 sm:h-9"
      onClick={handleDelete}
    >
      <Trash2 className="size-4 shrink-0" />
      <span className="font-bold text-xs uppercase tracking-wider">
        Удалить
      </span>
    </Button>
  );
}
