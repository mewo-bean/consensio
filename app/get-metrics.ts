"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function getMetrics(teamId?: number) {
    const session = await auth()
    if (!session?.user?.id) return null

    const userId = parseInt(session.user.id)

    let teamIds: number[] = []
    if (typeof teamId === "number" && Number.isFinite(teamId)) {
        const membership = await prisma.userTeam.findUnique({
            where: { userId_teamId: { userId, teamId } },
            select: { teamId: true },
        })
        if (!membership) return null
        teamIds = [teamId]
    } else {
        // 1. Находим ВСЕ команды, в которых состоит пользователь (любая роль)
        const userTeams = await prisma.userTeam.findMany({
            where: { userId: userId },
            select: { teamId: true }
        })

        teamIds = userTeams.map(t => t.teamId)
    }

    // Если пользователь не привязан ни к одной команде
    if (teamIds.length === 0) return null

    // 2. Окно времени (8 дней, чтобы точно захватить данные сида)
    const now = new Date()
    const windowStart = new Date()
    windowStart.setDate(now.getDate() - 8)

    // 3. Считаем общее кол-во сотрудников в этих командах
    const totalEmployees = await prisma.userTeam.count({
        where: { teamId: { in: teamIds } }
    })

    // 4. Получаем запуски опросов для этих команд
    const activeTeamSurveys = await prisma.teamSurvey.findMany({
        where: {
            teamId: { in: teamIds },
            createdAt: { gte: windowStart }
        }
    })

    // 5. Получаем результаты за неделю
    const results = await prisma.surveyResult.findMany({
        where: {
            teamSurvey: { teamId: { in: teamIds } },
            sentAt: { gte: windowStart }
        },
        include: {
            sampleSurvey: { select: { title: true } }
        }
    })

    // Расчет участия
    const expectedCount = totalEmployees * activeTeamSurveys.length
    const participationRate = expectedCount > 0
        ? Math.round((results.length / expectedCount) * 100)
        : 0

    // Расчет средних баллов
    const stressResults = results.filter(r =>
        r.sampleSurvey.title.toLowerCase().includes("pss")
    )
    const engageResults = results.filter(r =>
        r.sampleSurvey.title.toLowerCase().includes("gallup")
    )

    const avgStress = stressResults.length > 0
        ? (stressResults.reduce((sum, item) => sum + item.totalScore, 0) / stressResults.length).toFixed(1)
        : "0"

    const avgEngagement = engageResults.length > 0
        ? (engageResults.reduce((sum, item) => sum + item.totalScore, 0) / engageResults.length).toFixed(1)
        : "0"

    return {
        participationRate,
        avgStress,
        avgEngagement,
        totalEmployees
    }
}
