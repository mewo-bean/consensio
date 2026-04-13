"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function getMetrics(targetTeamId?: number) {
    const session = await auth()
    if (!session?.user?.id) return null

    const userId = parseInt(session.user.id)

    let teamIds: number[] = [];

    if (targetTeamId) {
        const membership = await prisma.userTeam.findFirst({
            where: {
                userId: userId,
                teamId: targetTeamId
            }
        });
        if (!membership) throw new Error("Нет доступа к команде");
        teamIds = [targetTeamId];
    } else {
        // берем все команды юзера, если id не указали
        const userTeams = await prisma.userTeam.findMany({
            where: { userId: userId },
            select: { teamId: true }
        });
        teamIds = userTeams.map(ut => ut.teamId);
    }

    if (teamIds.length === 0) return null

    const now = new Date()
    const windowStart = new Date()
    windowStart.setDate(now.getDate() - 8)

    // 3. Считаем общее кол-во сотрудников в этих командах
    const totalEmployees = await prisma.userTeam.count({
        where: {
            teamId: { in: teamIds },
            role: 'member'
        }
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
            sentAt: { gte: windowStart },
            user: {
                teams: {
                    some: {
                        teamId: { in: teamIds },
                        role: 'member'
                    }
                }
            }
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
