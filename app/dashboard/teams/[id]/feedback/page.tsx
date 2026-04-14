import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { FeedbackInput } from "@/components/teams/feedback-input";
import { FeedbackPanel, type FeedbackItem } from "@/components/teams/feedback-panel";
import { PageHeader } from "@/components/layout/page-header";

function userLabel(user: {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  email: string;
}) {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  if (name) return name;
  if (user.username) return `@${user.username}`;
  return user.email;
}

export default async function TeamFeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const teamId = parseInt(id, 10);
  if (Number.isNaN(teamId)) redirect("/dashboard");

  const membership = await prisma.userTeam.findUnique({
    where: { userId_teamId: { userId: user.id, teamId } },
    select: { role: true },
  });

  if (!membership) redirect("/dashboard");

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { id: true, title: true },
  });

  if (!team) redirect("/dashboard");

  let feedbackItems: FeedbackItem[] = [];
  let totalFeedbackCount = 0;

  if (membership.role === "manager") {
    const managerIds = await prisma.userTeam.findMany({
      where: { teamId, role: "manager" },
      select: { userId: true },
    });

    const toUserIds = managerIds.map((m) => m.userId);

    totalFeedbackCount = await prisma.complaint.count({
      where: {
        teamId,
        toUserId: { in: toUserIds },
      },
    });

    const complaints = await prisma.complaint.findMany({
      where: {
        teamId,
        toUserId: { in: toUserIds },
      },
      include: {
        fromUser: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: { id: "desc" },
      take: 50,
    });

    feedbackItems = complaints.map((c) => ({
      id: c.id,
      userLabel: c.isAnon ? "Анонимный участник" : userLabel(c.fromUser),
      content: c.content,
      isAnon: c.isAnon,
    }));
  }

  return (
    <div className="flex-1 w-full px-4 pt-6 pb-20 sm:px-6 lg:px-8">
      <PageHeader
        title="Обратная связь"
        description={
          membership.role === "manager"
            ? `Сообщения от участников команды «${team.title}».`
            : `Оставьте сообщение для команды «${team.title}». Все сообщения отправляются анонимно.`
        }
      />

      {membership.role !== "manager" ? (
        <FeedbackInput teamId={teamId} />
      ) : (
        <div className="mx-auto max-w-3xl">
          <FeedbackPanel items={feedbackItems} totalCount={totalFeedbackCount} />
        </div>
      )}
    </div>
  );
}
