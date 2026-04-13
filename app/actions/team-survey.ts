"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function assignSurveyToTeam(teamId: number, sampleSurveyId: number) {
  const user = await getCurrentUser();
  if (!user) return { error: "Не авторизован" };

  const membership = await prisma.userTeam.findUnique({
    where: { userId_teamId: { userId: user.id, teamId } },
    select: { role: true },
  });

  if (!membership || membership.role !== "manager") {
    return { error: "У вас нет прав назначать опросы в этой команде" };
  }

  const template = await prisma.sampleSurvey.findUnique({
    where: { id: sampleSurveyId },
    select: { id: true },
  });

  if (!template) return { error: "Шаблон опроса не найден" };

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const existing = await prisma.teamSurvey.findFirst({
    where: {
      teamId,
      sampleSurveyId,
      createdAt: { gte: oneWeekAgo },
    },
    select: { id: true },
  });

  if (existing) {
    return { error: "Этот опрос уже назначен команде за последнюю неделю" };
  }

  await prisma.teamSurvey.create({
    data: {
      teamId,
      sampleSurveyId,
    },
  });

  revalidatePath(`/dashboard/teams/${teamId}/surveys`);
  revalidatePath("/dashboard/surveys");
  return { success: true };
}

export async function ensureDefaultSurveyTemplates(teamId: number) {
  const user = await getCurrentUser();
  if (!user) return { error: "Не авторизован" };

  const membership = await prisma.userTeam.findUnique({
    where: { userId_teamId: { userId: user.id, teamId } },
    select: { role: true },
  });

  if (!membership || membership.role !== "manager") {
    return { error: "У вас нет прав" };
  }

  const requiredTitles = [
    "Шкала воспринимаемого стресса (PSS-14)",
    "Опрос Gallup Q12",
  ];

  const existing = await prisma.sampleSurvey.findMany({
    where: { title: { in: requiredTitles } },
    select: { title: true },
  });

  const existingTitles = new Set(existing.map((s) => s.title));
  const toCreate = requiredTitles.filter((title) => !existingTitles.has(title));

  if (toCreate.length > 0) {
    await prisma.sampleSurvey.createMany({
      data: toCreate.map((title) => ({ title })),
    });
  }

  revalidatePath(`/dashboard/teams/${teamId}/surveys`);
  return { success: true, created: toCreate.length };
}
