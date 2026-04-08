"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteTeam } from "@/app/actions/team";

export function DeleteTeamButton({ teamId }: { teamId: number }) {
  const handleDelete = async () => {
    if (
      confirm(
        "Вы уверены? Это действие удалит команду и все связанные данные навсегда!",
      )
    ) {
      await deleteTeam(teamId);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      className="gap-2"
      onClick={handleDelete}
    >
      <Trash2 className="size-4" />
      Удалить команду
    </Button>
  );
}
