import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

let lastClickTime = 0;

export async function logProductActivity(
    type:
        | "survey_created"
        | "survey_completed"
        | "feedback_sent"
        | "notification_click",
    details?: any,
) {
    const nowTime = Date.now();

    if (type === "notification_click") {
        if (nowTime - lastClickTime < 10000) return;
        lastClickTime = nowTime;
    }

    const filePath = path.join(process.cwd(), "app_metrics.json");
    const now = new Date();

    // Количество созданных опросов
    const totalSurveysCreated = await prisma.teamSurvey.count();

    // Отправленная анонимная обратная связь
    let totalFeedbacksSent = 0;
    try {
        totalFeedbacksSent = await prisma.complaint.count();
    } catch (e) {}

    // (Все реальные прохождения / Все ожидаемые прохождения) * 100
    const allTeams = await prisma.team.findMany({
        select: { id: true },
    });

    let totalExpected = 0;
    let totalCompleted = 0;

    for (const team of allTeams) {
        // Находим рядовых участников в команде
        const members = await prisma.userTeam.findMany({
            where: { teamId: team.id, role: "member" },
            select: { userId: true },
        });
        const memberCount = members.length;

        // Находим все опросы, выданные этой команде
        const surveys = await prisma.teamSurvey.findMany({
            where: { teamId: team.id },
            select: { id: true },
        });
        const surveyCount = surveys.length;

        // Если в команде есть и участники, и опросы
        if (memberCount > 0 && surveyCount > 0) {
            // Ожидаемое количество прохождений = (число участников) * (число опросов)
            totalExpected += memberCount * surveyCount;

            const memberIds = members.map((m) => m.userId);
            const surveyIds = surveys.map((s) => s.id);

            const completedCount = await prisma.surveyResult.count({
                where: {
                    teamSurveyId: { in: surveyIds },
                    userId: { in: memberIds },
                },
            });

            totalCompleted += completedCount;
        }
    }

    const participationRate =
        totalExpected > 0
            ? ((totalCompleted / totalExpected) * 100).toFixed(1) + "%"
            : "0.0%";

    const newEntry = {
        timestamp: now.toISOString(),
        trigger_event: type,
        system_metrics: {
            total_surveys: totalSurveysCreated,
            total_feedbacks: totalFeedbacksSent,
            participation_rate: participationRate,
        },
        event_details: details || {},
    };

    try {
        let logs = [];
        try {
            const data = await fs.readFile(filePath, "utf-8");
            logs = JSON.parse(data);
        } catch (e) {}

        logs.push(newEntry);
        await fs.writeFile(filePath, JSON.stringify(logs, null, 2));
    } catch (e) {
        console.error("Ошибка записи логов метрик:", e);
    }
}
