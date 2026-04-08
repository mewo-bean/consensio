"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// Экспортируем тип состояния для наших форм
export type TeamState = {
  error?: string;
  success?: boolean;
  teamId?: number;
} | null;

// Обязательно принимаем prevState первым аргументом!
export async function createTeam(
  prevState: TeamState,
  formData: FormData,
): Promise<TeamState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Не авторизован" };

  const title = formData.get("title") as string;
  if (!title) return { error: "Название команды обязательно" };

  try {
    const team = await prisma.team.create({
      data: {
        title: title,
        members: {
          create: {
            user_id: user.id,
            role: "manager",
          },
        },
      },
    });

    revalidatePath("/dashboard");
    return { success: true, teamId: team.id };
  } catch (error) {
    return { error: "Ошибка при создании команды" };
  }
}

export async function joinTeam(
  prevState: TeamState,
  formData: FormData,
): Promise<TeamState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Не авторизован" };

  const inviteId = parseInt(formData.get("inviteId") as string, 10);
  if (isNaN(inviteId)) return { error: "Неверный ID команды" };

  try {
    await prisma.userTeam.create({
      data: {
        user_id: user.id,
        team_id: inviteId,
        role: "member",
      },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return {
      error:
        "Не удалось присоединиться. Возможно, ты уже в этой команде или ID неверен.",
    };
  }
}
