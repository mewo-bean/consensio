"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function submitAppFeedback(rating: number, comment: string) {
    const user = await getCurrentUser();
    if (!user) return { error: "Вы не авторизованы" };

    if (rating < 1 || rating > 5) {
        return { error: "Некорректная оценка" };
    }

    try {
        await prisma.appFeedback.create({
            data: {
                rating,
                comment: comment.trim() || null,
                userId: user.id,
            },
        });
        return { success: true };
    } catch (error) {
        console.error("Ошибка при сохранении отзыва:", error);
        return { error: "Не удалось отправить отзыв. Попробуйте позже." };
    }
}
