"use client";

import { useTransition } from "react";
import { MoreHorizontal, UserCog, UserMinus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateMemberRole, removeMember } from "@/app/actions/team";
import { toast } from "sonner";

export function MemberActions({
  teamId,
  userId,
  currentRole,
}: {
  teamId: number;
  userId: number;
  currentRole: string;
}) {
  // useTransition позволяет нам отслеживать состояние загрузки Server Actions
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = () => {
    startTransition(async () => {
      try {
        await updateMemberRole(
          teamId,
          userId,
          currentRole === "manager" ? "member" : "manager",
        );
        toast.success("Роль успешно изменена");
      } catch (e) {
        toast.error("Не удалось изменить роль");
      }
    });
  };

  const handleRemove = () => {
    if (confirm("Вы уверены, что хотите удалить этого участника?")) {
      startTransition(async () => {
        try {
          await removeMember(teamId, userId);
          toast.success("Участник исключен из команды");
        } catch (e) {
          toast.error("Не удалось исключить участника");
        }
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          className="size-8 sm:size-10 shrink-0"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : (
            <MoreHorizontal className="size-4" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          className="gap-3 py-3 sm:py-2 cursor-pointer"
          onClick={handleRoleChange}
          disabled={isPending}
        >
          <UserCog className="size-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 whitespace-normal text-sm text-balance">
            Сделать {currentRole === "manager" ? "участником" : "админом"}
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="gap-3 py-3 sm:py-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
          onClick={handleRemove}
          disabled={isPending}
        >
          <UserMinus className="size-4 shrink-0" />
          <span className="flex-1 whitespace-normal text-sm">Исключить</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
