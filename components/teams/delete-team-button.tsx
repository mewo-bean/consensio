"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteTeam } from "@/app/actions/team";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteTeamButton({ teamId }: { teamId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (
            confirm(
                "Удалить команду навсегда? Все опросы и участники будут стерты.",
            )
        ) {
            setIsDeleting(true);
            try {
                const response = await deleteTeam(teamId);

                if (response?.error) {
                    alert(response.error);
                    setIsDeleting(false);
                    return;
                }

                router.push("/dashboard");
                router.refresh();
            } catch (error) {
                alert("Произошла неизвестная ошибка.");
                setIsDeleting(false);
            }
        }
    };

    return (
        <Button
            variant="destructive"
            className="w-full sm:w-auto gap-2 h-10 sm:h-9"
            onClick={handleDelete}
            disabled={isDeleting}
        >
            <Trash2 className="size-4 shrink-0" />
            <span className="font-bold text-xs uppercase tracking-wider">
                {isDeleting ? "Удаление..." : "Удалить"}
            </span>
        </Button>
    );
}
