"use client";

import { MoreHorizontal, UserCog, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateMemberRole, removeMember } from "@/app/actions/team";

export function MemberActions({
  teamId,
  userId,
  currentRole,
}: {
  teamId: number;
  userId: number;
  currentRole: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="gap-2"
          onClick={() =>
            updateMemberRole(
              teamId,
              userId,
              currentRole === "manager" ? "member" : "manager",
            )
          }
        >
          <UserCog className="size-4" />
          Сделать {currentRole === "manager" ? "участником" : "админом"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-destructive"
          onClick={() => {
            if (confirm("Удалить участника?")) removeMember(teamId, userId);
          }}
        >
          <UserMinus className="size-4" />
          Исключить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
