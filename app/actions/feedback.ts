"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { logProductActivity } from "@/lib/product-metrics";

export async function submitTeamFeedback(teamId: string, content: string) {
    const user = await getCurrentUser();
    if (!user) return { error: "Не авторизован" };

    const trimmed = content.trim();
    if (trimmed.length < 2) return { error: "Сообщение слишком короткое" };
    if (trimmed.length > 2000) return { error: "Сообщение слишком длинное" };

    const membership = await prisma.userTeam.findUnique({
        where: { userId_teamId: { userId: user.id, teamId } },
        select: { role: true },
    });

    if (!membership) return { error: "Нет доступа к команде" };
    if (membership.role === "manager") {
        return { error: "Администратор не может оставлять обратную связь" };
    }

    const primaryManager = await prisma.userTeam.findFirst({
        where: { teamId, role: "manager" },
        orderBy: { userId: "asc" },
        select: { userId: true },
    });

    if (!primaryManager) return { error: "В команде нет администратора" };

    await prisma.complaint.create({
        data: {
            fromUserId: user.id,
            toUserId: primaryManager.userId,
            teamId,
            content: trimmed,
            isAnon: true,
        },
    });

    logProductActivity("feedback_sent", { teamId }).catch(console.error);

    revalidatePath(`/dashboard/teams/${teamId}/feedback`);
    return { success: true };
}
