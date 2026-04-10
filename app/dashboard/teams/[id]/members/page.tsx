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
import { ShieldAlert, User as UserIcon, Hash, ClipboardList } from "lucide-react";
import { MemberActions } from "@/components/teams/member-actions";
import { CopyInviteButton } from "@/components/teams/copy-invite-button";
import { DeleteTeamButton } from "@/components/teams/delete-team-button";
import { LeaveTeamButton } from "@/components/teams/leave-team-button";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";
import { AssignSurveyCard } from "@/components/teams/assign-survey-card";
import { formatCountRu } from "@/lib/i18n/ru-plural";

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
    include: {
      members: { include: { user: true } },
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

  const currentUserMembership = team.members.find((m) => m.userId === user.id);
  if (!currentUserMembership) redirect("/dashboard");
  const isManager = currentUserMembership.role === "manager";

  const templates = isManager
    ? await prisma.sampleSurvey.findMany({
        select: { id: true, title: true },
        orderBy: { title: "asc" },
      })
    : [];

  return (
    <div className="flex-1 w-full pt-6 px-4 sm:px-6 lg:px-8 pb-20">
      <PageHeader
        title={team.title}
        description="Управляйте участниками вашей команды, назначайте роли и используйте ID для приглашения новых коллег."
      >
        <LeaveTeamButton teamId={teamId} />
        {isManager && <DeleteTeamButton teamId={teamId} />}
      </PageHeader>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:sticky lg:top-6 space-y-6">
          <Card className="shadow-sm overflow-hidden border-muted/60">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Hash className="size-4 text-primary" />
                Инвайт-код
              </CardTitle>
              <CardDescription>
                Используйте ID для добавления коллег
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {isManager ? (
                <>
                  <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-xl border-2 border-dashed border-muted-foreground/20">
                    <span className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-1">
                      ID команды
                    </span>
                    <span className="text-3xl font-black text-primary tracking-tighter">
                      {team.id}
                    </span>
                  </div>
                  <CopyInviteButton teamId={team.id} />
                </>
              ) : (
                <div className="text-center py-6 px-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Только администраторы могут создавать приглашения.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {isManager && <AssignSurveyCard teamId={teamId} templates={templates} />}

          <Card className="shadow-sm overflow-hidden border-muted/60">
            <CardHeader className="bg-muted/30 pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardList className="size-4 text-primary" />
                Назначенные опросы
              </CardTitle>
              <CardDescription>Последние 10 назначений</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {team.teamSurveys.length > 0 ? (
                <div className="space-y-2">
                  {team.teamSurveys.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-start justify-between gap-3 rounded-lg border border-muted/60 bg-muted/10 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">
                          {s.sampleSurvey.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {new Date(s.createdAt).toLocaleString("ru-RU")}
                        </div>
                      </div>
                      <Badge variant="outline" className="shrink-0 h-6">
                        {formatCountRu(
                          s._count.surveyResults,
                          "ответ",
                          "ответа",
                          "ответов",
                        )}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Опросы ещё не назначались.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-2 shadow-sm border-muted/60">
          <CardHeader className="border-b border-muted/50 pb-4">
            <CardTitle className="text-lg">
              Участники ({team.members.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-muted/50">
              {team.members.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center justify-between p-4 sm:p-5 hover:bg-muted/20 transition-colors gap-3"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={cn(
                        "size-10 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                        member.role === "manager"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {member.role === "manager" ? (
                        <ShieldAlert className="size-5" />
                      ) : (
                        <UserIcon className="size-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm sm:text-base truncate flex items-center gap-2">
                        {[member.user.firstName, member.user.lastName]
                          .filter(Boolean)
                          .join(" ") || member.user.username}
                        {member.userId === user.id && (
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase font-black">
                            Вы
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
                        {member.user.username && (
                          <>
                            <span className="font-medium text-muted-foreground/80">
                              @{member.user.username}
                            </span>
                            <span className="text-[10px] text-muted-foreground/40">
                              &bull;
                            </span>
                          </>
                        )}
                        <span>{member.user.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge
                      variant={
                        member.role === "manager" ? "default" : "outline"
                      }
                      className="hidden xs:inline-flex h-6"
                    >
                      {member.role === "manager" ? "Админ" : "Участник"}
                    </Badge>

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
            </div>
          </CardContent>
        </Card>

        <div className="sm:hidden mt-12 pt-8 border-t border-destructive/20">
          <div className="flex flex-col gap-3">
            <LeaveTeamButton teamId={teamId} />
            {isManager && <DeleteTeamButton teamId={teamId} />}
          </div>
        </div>
      </div>
    </div>
  );
}
