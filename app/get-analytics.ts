"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function getAnalytics(days: number = 90) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    // Вычисляем дату начала периода
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const results = await prisma.surveyResult.findMany({
        where: {
            sent_at: { gte: startDate },
        },
        include: {
            sample_survey: { select: { title: true } }
        },
        orderBy: { sent_at: 'asc' }
    })

    // Группировка через Map для чистого кода
    const dataMap = new Map<string, { stress: number[], engagement: number[] }>()

    results.forEach(res => {
        // Получаем ключ в формате ГГГГ-ММ-ДД
        const dateKey = res.sent_at.toISOString().split('T')[0];

        if (!dataMap.has(dateKey)) {
            dataMap.set(dateKey, { stress: [], engagement: [] })
        }

        const entry = dataMap.get(dateKey)!
        if (res.sample_survey.title.includes("PSS-14")) {
            entry.stress.push(res.total_score)
        } else if (res.sample_survey.title.includes("Gallup")) {
            entry.engagement.push(res.total_score)
        }
    })

    // Превращаем в массив для Recharts
    return Array.from(dataMap.entries()).map(([date, values]) => ({
        date,
        stress: values.stress.length > 0
            ? Number((values.stress.reduce((a, b) => a + b, 0) / values.stress.length).toFixed(4))
            : null,
        engagement: values.engagement.length > 0
            ? Number((values.engagement.reduce((a, b) => a + b, 0) / values.engagement.length).toFixed(4))
            : null
    })).sort((a, b) => a.date.localeCompare(b.date))
}