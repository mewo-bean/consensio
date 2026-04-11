import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getActiveSurveys, getCompletedSurveys } from "@/app/dashboard/surveys/actions";
import { SurveysTab } from "@/components/surveys/surveys-tab";
import { PageHeader } from "@/components/layout/page-header";
import { DeleteTeamButton } from "@/components/teams/delete-team-button";
import { LeaveTeamButton } from "@/components/teams/leave-team-button";
import { AssignSurveyCard } from "@/components/teams/assign-survey-card";
import { TeamSurveysOverview } from "@/components/teams/team-surveys-overview";

export default async function TeamSurveysPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const teamId = parseInt(id, 10);
  if (Number.isNaN(teamId)) redirect("/dashboard");

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: true,
      teamSurveys: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          sampleSurvey: true,
          _count: { select: { surveyResults: true } },
        },
      },
    },
  });

  if (!team) redirect("/dashboard");

  const membership = team.members.find((member) => member.userId === user.id);
  if (!membership) redirect("/dashboard");

  if (membership.role === "manager") {
    const templates = await prisma.sampleSurvey.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    });

    return (
      <div className="flex-1 w-full pt-6 px-4 sm:px-6 lg:px-8 pb-20">
        <PageHeader
          title="Опросы"
          description="Назначайте опросы этой команде и следите за последними запусками."
        >
          <LeaveTeamButton teamId={teamId} />
          <DeleteTeamButton teamId={teamId} />
        </PageHeader>

        <div className="grid grid-cols-1 gap-8 items-start lg:grid-cols-3">
          <div className="lg:sticky lg:top-6">
            <AssignSurveyCard teamId={teamId} templates={templates} />
          </div>
          <div className="lg:col-span-2">
            <TeamSurveysOverview
              items={team.teamSurveys.map((survey) => ({
                id: survey.id,
                title: survey.sampleSurvey.title,
                createdAt: survey.createdAt.toISOString(),
                totalResponses: survey._count.surveyResults,
              }))}
            />
          </div>
        </div>
      </div>
    );
  }

  const [activeSurveys, completedSurveys] = await Promise.all([
    getActiveSurveys(teamId),
    getCompletedSurveys(teamId),
  ]);

  return (
    <SurveysTab
      initialActiveSurveys={activeSurveys}
      initialCompletedSurveys={completedSurveys}
      title="Опросы команды"
      description={`Назначенные опросы и история ваших ответов для команды «${team.title}».`}
    />
  );
}
