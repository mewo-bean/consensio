"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function getMetrics() {
    const session = await auth()
    if (!session?.user?.id) return null

    const userId = parseInt(session.user.id)

    // 1. Находим ВСЕ команды, в которых состоит пользователь (любая роль)
    const userTeams = await prisma.userTeam.findMany({
        where: { user_id: userId },
        select: { team_id: true }
    })

    const teamIds = userTeams.map(t => t.team_id)

    // Если пользователь не привязан ни к одной команде
    if (teamIds.length === 0) return null

    // 2. Окно времени (8 дней, чтобы точно захватить данные сида)
    const now = new Date()
    const windowStart = new Date()
    windowStart.setDate(now.getDate() - 8)

    // 3. Считаем общее кол-во сотрудников в этих командах
    const totalEmployees = await prisma.userTeam.count({
        where: { team_id: { in: teamIds } }
    })

    // 4. Получаем запуски опросов для этих команд
    const activeTeamSurveys = await prisma.teamSurvey.findMany({
        where: {
            team_id: { in: teamIds },
            created_at: { gte: windowStart }
        }
    })

    // 5. Получаем результаты за неделю
    const results = await prisma.surveyResult.findMany({
        where: {
            team_survey: { team_id: { in: teamIds } },
            sent_at: { gte: windowStart }
        },
        include: {
            sample_survey: { select: { title: true } }
        }
    })

    // Расчет участия
    const expectedCount = totalEmployees * activeTeamSurveys.length
    const participationRate = expectedCount > 0
        ? Math.round((results.length / expectedCount) * 100)
        : 0

    // Расчет средних баллов
    const stressResults = results.filter(r =>
        r.sample_survey.title.toLowerCase().includes("pss")
    )
    const engageResults = results.filter(r =>
        r.sample_survey.title.toLowerCase().includes("gallup")
    )

    const avgStress = stressResults.length > 0
        ? (stressResults.reduce((sum, item) => sum + item.total_score, 0) / stressResults.length).toFixed(1)
        : "0"

    const avgEngagement = engageResults.length > 0
        ? (engageResults.reduce((sum, item) => sum + item.total_score, 0) / engageResults.length).toFixed(1)
        : "0"

    return {
        participationRate,
        avgStress,
        avgEngagement,
        totalEmployees
    }
}