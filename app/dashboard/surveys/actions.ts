"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { getSurveyTemplateForTitle } from "@/lib/surveys/templates";

export type ActiveSurveyDto = {
  id: number;
  title: string;
  teamTitle: string;
  createdAt: string;
  expiresAt: string;
  totalResponses: number;
};

export type CompletedSurveyDto = {
  id: number;
  title: string;
  teamTitle: string;
  createdAt: string;
  expiresAt: string;
  totalResponses: number;
  userScore: number;
  sentAt: string;
};

function expiresAt(createdAt: Date) {
  return new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
}

export async function getActiveSurveys(teamId?: number): Promise<ActiveSurveyDto[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  let teamIds: number[] = [];
  if (typeof teamId === "number" && Number.isFinite(teamId)) {
    const membership = await prisma.userTeam.findUnique({
      where: { userId_teamId: { userId: user.id, teamId } },
      select: { teamId: true },
    });

    if (!membership) return [];
    teamIds = [teamId];
  } else {
    const userTeams = await prisma.userTeam.findMany({
      where: { userId: user.id },
      select: { teamId: true },
    });

    teamIds = userTeams.map((ut) => ut.teamId);
    if (teamIds.length === 0) return [];
  }

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const teamSurveys = await prisma.teamSurvey.findMany({
    where: {
      teamId: { in: teamIds },
      createdAt: { gte: oneWeekAgo },
      surveyResults: { none: { userId: user.id } },
    },
    include: {
      sampleSurvey: { select: { title: true } },
      team: { select: { title: true } },
      _count: { select: { surveyResults: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return teamSurveys.map((ts) => ({
    id: ts.id,
    title: ts.sampleSurvey.title,
    teamTitle: ts.team.title,
    createdAt: ts.createdAt.toISOString(),
    expiresAt: expiresAt(ts.createdAt),
    totalResponses: ts._count.surveyResults,
  }));
}

export async function getCompletedSurveys(
  teamId?: number,
): Promise<CompletedSurveyDto[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  let teamIds: number[] = [];
  if (typeof teamId === "number" && Number.isFinite(teamId)) {
    const membership = await prisma.userTeam.findUnique({
      where: { userId_teamId: { userId: user.id, teamId } },
      select: { teamId: true },
    });

    if (!membership) return [];
    teamIds = [teamId];
  } else {
    const userTeams = await prisma.userTeam.findMany({
      where: { userId: user.id },
      select: { teamId: true },
    });

    teamIds = userTeams.map((ut) => ut.teamId);
    if (teamIds.length === 0) return [];
  }

  const teamSurveys = await prisma.teamSurvey.findMany({
    where: {
      teamId: { in: teamIds },
      surveyResults: { some: { userId: user.id } },
    },
    include: {
      sampleSurvey: { select: { title: true } },
      team: { select: { title: true } },
      surveyResults: {
        where: { userId: user.id },
        select: { totalScore: true, sentAt: true },
      },
      _count: { select: { surveyResults: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return teamSurveys.map((ts) => ({
    id: ts.id,
    title: ts.sampleSurvey.title,
    teamTitle: ts.team.title,
    createdAt: ts.createdAt.toISOString(),
    expiresAt: expiresAt(ts.createdAt),
    totalResponses: ts._count.surveyResults,
    userScore: ts.surveyResults[0]?.totalScore ?? 0,
    sentAt: ts.surveyResults[0]?.sentAt.toISOString() ?? ts.createdAt.toISOString(),
  }));
}

export async function submitTeamSurvey(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const teamSurveyId = Number(formData.get("teamSurveyId"));
  if (!Number.isFinite(teamSurveyId)) {
    throw new Error("Некорректный опрос");
  }

  const teamSurvey = await prisma.teamSurvey.findUnique({
    where: { id: teamSurveyId },
    include: { sampleSurvey: { select: { id: true, title: true } } },
  });

  if (!teamSurvey) throw new Error("Опрос не найден");

  const membership = await prisma.userTeam.findUnique({
    where: { userId_teamId: { userId: user.id, teamId: teamSurvey.teamId } },
    select: { role: true },
  });

  if (!membership) throw new Error("Нет доступа к опросу");

  const existing = await prisma.surveyResult.findFirst({
    where: { userId: user.id, teamSurveyId },
    select: { id: true },
  });

  if (existing) {
    redirect("/dashboard/surveys");
  }

  const template = getSurveyTemplateForTitle(teamSurvey.sampleSurvey.title);
  const allowedValues = new Set(template.choices.map((c) => c.value));
  const isAnon = formData.get("isAnon") === "on";
  let totalScore = 0;

  for (let i = 0; i < template.questions.length; i += 1) {
    const raw = formData.get(`q_${i}`);
    const value = typeof raw === "string" ? Number(raw) : NaN;
    if (!Number.isFinite(value) || !allowedValues.has(value)) {
      throw new Error("Некорректный вариант ответа");
    }
    totalScore += value;
  }

  await prisma.surveyResult.create({
    data: {
      userId: user.id,
      teamSurveyId,
      sampleSurveyId: teamSurvey.sampleSurvey.id,
      totalScore,
      isAnon,
      sentAt: new Date(),
    },
  });

  revalidatePath("/dashboard/surveys");
  redirect("/dashboard/surveys");
}

export async function getSurveysStats() {
  const user = await getCurrentUser();
  if (!user) {
    return { total: 0, completed: 0, avgParticipation: 0 };
  }

  const userTeams = await prisma.userTeam.findMany({
    where: { userId: user.id },
    select: { teamId: true },
  });

  const teamIds = userTeams.map((ut) => ut.teamId);
  if (teamIds.length === 0) {
    return { total: 0, completed: 0, avgParticipation: 0 };
  }

  const allSurveys = await prisma.teamSurvey.findMany({
    where: { teamId: { in: teamIds } },
    include: {
      surveyResults: {
        where: { userId: user.id },
        select: { id: true },
      },
    },
  });

  const total = allSurveys.length;
  const completed = allSurveys.filter((s) => s.surveyResults.length > 0).length;

  const participationValues = await Promise.all(
    allSurveys.map(async (survey) => {
      const totalResults = await prisma.surveyResult.count({
        where: { teamSurveyId: survey.id },
      });

      const teamMembers = await prisma.userTeam.count({
        where: { teamId: survey.teamId },
      });

      return teamMembers > 0 ? (totalResults / teamMembers) * 100 : 0;
    }),
  );

  const avgParticipation =
    participationValues.length > 0
      ? Math.round(
          participationValues.reduce((sum, value) => sum + value, 0) /
            participationValues.length,
        )
      : 0;

  return { total, completed, avgParticipation };
}
