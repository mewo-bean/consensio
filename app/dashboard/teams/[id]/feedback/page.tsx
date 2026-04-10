import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { FeedbackInput } from "@/components/teams/feedback-input";
import { FeedbackPanel, type FeedbackItem } from "@/components/teams/feedback-panel";

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
    select: { id: true },
  });

  if (!team) redirect("/dashboard");

  let feedbackItems: FeedbackItem[] = [];

  if (membership.role === "manager") {
    const managerIds = await prisma.userTeam.findMany({
      where: { teamId, role: "manager" },
      select: { userId: true },
    });

    const toUserIds = managerIds.map((m) => m.userId);

    const complaints = await prisma.complaint.findMany({
      where: {
        teamId,
        toUserId: { in: toUserIds },
        isAnon: false,
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
      userLabel: userLabel(c.fromUser),
      content: c.content,
    }));
  }

  return (
    <div className="flex-1 w-full pt-6 px-4 sm:px-6 lg:px-8 pb-20">
      {membership.role !== "manager" ? (
        <div className="max-w-2xl">
          <FeedbackInput teamId={teamId} />
        </div>
      ) : (
        <div className="max-w-3xl">
          <FeedbackPanel items={feedbackItems} />
        </div>
      )}
    </div>
  );
}
