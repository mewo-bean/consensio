"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export type TeamState = {
    error?: string;
    success?: boolean;
    teamId?: string;
} | null;

function generateInviteCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function createTeam(
    prevState: TeamState,
    formData: FormData,
): Promise<TeamState> {
    const user = await getCurrentUser();
    if (!user) return { error: "Не авторизован" };

    const title = formData.get("title") as string;
    if (!title) return { error: "Название команды обязательно" };

    let newTeamId: string;

    try {
        const team = await prisma.team.create({
            data: {
                title: title,
                inviteCode: generateInviteCode(),
                members: {
                    create: {
                        userId: user.id,
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

    const inviteCode = formData.get("inviteId") as string;
    if (!inviteCode) return { error: "Неверный код" };

    const team = await prisma.team.findUnique({
        where: { inviteCode: inviteCode.toUpperCase() },
    });

    if (!team) return { error: "Команда с таким кодом не найдена" };

    try {
        await prisma.userTeam.create({
            data: {
                userId: user.id,
                teamId: team.id,
                role: "member",
            },
        });
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        return {
            error: "Не удалось присоединиться. Возможно, ты уже в этой команде.",
        };
    }
}

export async function updateMemberRole(
    teamId: string,
    targetUserId: number,
    newRole: "manager" | "member",
) {
    const user = await getCurrentUser();
    if (!user) return { error: "Не авторизован" };

    const adminCheck = await prisma.userTeam.findFirst({
        where: { teamId: teamId, userId: user.id, role: "manager" },
    });
    if (!adminCheck) return { error: "У вас нет прав" };

    try {
        await prisma.userTeam.update({
            where: {
                userId_teamId: { userId: targetUserId, teamId: teamId },
            },
            data: { role: newRole },
        });
        revalidatePath(`/dashboard/teams/${teamId}`);
        return { success: true };
    } catch (e) {
        return { error: "Ошибка при смене роли" };
    }
}

export async function removeMember(teamId: string, targetUserId: number) {
    const user = await getCurrentUser();
    if (!user) return { error: "Не авторизован" };

    const adminCheck = await prisma.userTeam.findFirst({
        where: { teamId: teamId, userId: user.id, role: "manager" },
    });
    if (!adminCheck) return { error: "У вас нет прав" };

    try {
        await prisma.userTeam.delete({
            where: {
                userId_teamId: { userId: targetUserId, teamId: teamId },
            },
        });
        revalidatePath(`/dashboard/teams/${teamId}`);
        return { success: true };
    } catch (e) {
        return { error: "Ошибка при удалении" };
    }
}

export async function deleteTeam(teamId: string) {
    const user = await getCurrentUser();
    if (!user) return { error: "Не авторизован" };

    const membership = await prisma.userTeam.findUnique({
        where: {
            userId_teamId: { userId: user.id, teamId: teamId },
        },
    });

    if (!membership || membership.role !== "manager") {
        return { error: "У вас нет прав на удаление этой команды" };
    }

    try {
        await prisma.userTeam.deleteMany({
            where: { teamId: teamId },
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

export async function leaveTeam(teamId: string) {
    const user = await getCurrentUser();
    if (!user) return { error: "Не авторизован" };

    try {
        const membership = await prisma.userTeam.findUnique({
            where: {
                userId_teamId: { userId: user.id, teamId: teamId },
            },
        });

        if (!membership) return { error: "Вы не состоите в этой команде" };

        if (membership.role === "manager") {
            const managersCount = await prisma.userTeam.count({
                where: {
                    teamId: teamId,
                    role: "manager",
                },
            });

            if (managersCount <= 1) {
                return {
                    error: "Вы единственный администратор! Назначьте админом кого-нибудь еще перед выходом или удалите команду целиком.",
                };
            }
        }

        await prisma.userTeam.delete({
            where: {
                userId_teamId: { userId: user.id, teamId: teamId },
            },
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/teams");
    } catch (error) {
        console.error("Ошибка при выходе из команды:", error);
        return { error: "Не удалось покинуть команду" };
    }

    redirect("/dashboard");
}
