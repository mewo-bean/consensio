import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, User as UserIcon } from "lucide-react";
import { MemberActions } from "@/components/teams/member-actions";
import { CopyInviteButton } from "@/components/teams/copy-invite-button";
import { DeleteTeamButton } from "@/components/teams/delete-team-button";
import { LeaveTeamButton } from "@/components/teams/leave-team-button";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const teamId = parseInt(id, 10);

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { members: { include: { user: true } } },
  });

  if (!team) redirect("/dashboard");

  const currentUserMembership = team.members.find((m) => m.userId === user.id);
  if (!currentUserMembership) redirect("/dashboard");
  const isManager = currentUserMembership.role === "manager";

  return (
    <div className="flex-1 space-y-6 w-full pt-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{team.title}</h1>
        <div className="flex items-center gap-3">
          <LeaveTeamButton teamId={teamId} />
          {isManager && <DeleteTeamButton teamId={teamId} />}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Инвайт-ссылка</CardTitle>
            <CardDescription>Доступно только админам</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isManager ? (
              <>
                <div className="p-3 bg-muted rounded-lg border font-mono text-sm text-center">
                  ID: <span className="font-bold text-primary">{team.id}</span>
                </div>
                {/* Новая кнопка копирования */}
                <CopyInviteButton teamId={team.id} />
              </>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">
                Только администраторы могут приглашать новых участников.
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Участники</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {team.members.map((member) => (
              <div
                key={member.userId}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {member.role === "manager" ? (
                    <ShieldAlert className="text-primary size-5" />
                  ) : (
                    <UserIcon className="size-5" />
                  )}
                  <div>
                    <div className="font-medium text-sm">
                      {member.user.firstName || member.user.username}
                      {member.userId === user.id && " (Вы)"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {member.user.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      member.role === "manager" ? "default" : "secondary"
                    }
                  >
                    {member.role === "manager" ? "Админ" : "Участник"}
                  </Badge>

                  {/* Кнопки управления только для админов и не для себя */}
                  {isManager && member.userId !== user.id && (
                    <MemberActions
                      teamId={teamId}
                      userId={member.userId}
                      currentRole={member.role}
                    />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
