"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export type TeamState = {
  error?: string;
  success?: boolean;
  teamId?: number;
} | null;

export async function createTeam(
  prevState: TeamState,
  formData: FormData,
): Promise<TeamState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Не авторизован" };

  const title = formData.get("title") as string;
  if (!title) return { error: "Название команды обязательно" };

  let newTeamId: number;

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
    newTeamId = team.id;
    revalidatePath("/dashboard");
  } catch (error) {
    console.error(error);
    return { error: "Ошибка при создании команды" };
  }

  redirect(`/dashboard/teams/${newTeamId}`);
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

export async function updateMemberRole(
  teamId: number,
  targetUserId: number,
  newRole: "manager" | "member",
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Не авторизован" };

  const adminCheck = await prisma.userTeam.findFirst({
    where: { team_id: teamId, user_id: user.id, role: "manager" },
  });
  if (!adminCheck) return { error: "У вас нет прав" };

  try {
    await prisma.userTeam.update({
      where: {
        user_id_team_id: { user_id: targetUserId, team_id: teamId },
      },
      data: { role: newRole },
    });
    revalidatePath(`/dashboard/teams/${teamId}`);
    return { success: true };
  } catch (e) {
    return { error: "Ошибка при смене роли" };
  }
}

export async function removeMember(teamId: number, targetUserId: number) {
  const user = await getCurrentUser();
  if (!user) return { error: "Не авторизован" };

  const adminCheck = await prisma.userTeam.findFirst({
    where: { team_id: teamId, user_id: user.id, role: "manager" },
  });
  if (!adminCheck) return { error: "У вас нет прав" };

  try {
    await prisma.userTeam.delete({
      where: {
        user_id_team_id: { user_id: targetUserId, team_id: teamId },
      },
    });
    revalidatePath(`/dashboard/teams/${teamId}`);
    return { success: true };
  } catch (e) {
    return { error: "Ошибка при удалении" };
  }
}

export async function deleteTeam(teamId: number) {
  const user = await getCurrentUser();
  if (!user) return { error: "Не авторизован" };

  const membership = await prisma.userTeam.findUnique({
    where: {
      user_id_team_id: { user_id: user.id, team_id: teamId },
    },
  });

  if (!membership || membership.role !== "manager") {
    return { error: "У вас нет прав на удаление этой команды" };
  }

  try {
    await prisma.userTeam.deleteMany({
      where: { team_id: teamId },
    });

    await prisma.team.delete({
      where: { id: teamId },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/teams");
  } catch (error) {
    console.error("Ошибка удаления:", error);
    return { error: "Не удалось удалить команду из базы данных" };
  }

  redirect("/dashboard");
}
