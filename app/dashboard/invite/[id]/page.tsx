import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Users } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const teamId = parseInt(id, 10);

  if (isNaN(teamId)) redirect("/dashboard");

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { members: true },
  });

  if (!team) {
    return (
      <div className="flex-1 bg-white flex flex-col pt-6 pb-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="Группа не найдена"
            description="Похоже, эта команда была удалена или ID неверный."
          />
        </div>
        <div className="flex flex-1 flex-col px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center pt-20">
            <Card className="max-w-md w-full border-destructive/50 shadow-lg text-center">
              <CardHeader>
                <AlertTriangle className="size-12 text-destructive mx-auto mb-2" />
                <CardTitle>Ошибка доступа</CardTitle>
              </CardHeader>
              <CardFooter>
                <Link href="/dashboard" className="w-full">
                  <Button className="w-full" variant="outline">
                    На главную
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const isAlreadyMember = team.members.some((m) => m.userId === user.id);

  async function acceptInvite() {
    "use server";
    const currentUser = await getCurrentUser();
    if (!currentUser) redirect("/login");
    try {
      await prisma.userTeam.create({
        data: { userId: currentUser.id, teamId, role: "member" },
      });
      revalidatePath("/dashboard");
    } catch (e) {}
    redirect(`/dashboard/teams/${teamId}`);
  }

  return (
    <div className="flex-1 bg-white flex flex-col pt-6 pb-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Приглашение"
          description={`Вы получили инвайт в рабочую группу "${team.title}". Присоединяйтесь к проекту.`}
        />
      </div>

      <div className="flex flex-1 flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center pt-10 sm:pt-16">
          <Card className="max-w-md w-full shadow-2xl border-muted/60 overflow-hidden">
            <CardHeader className="text-center pb-2">
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="size-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-black">
                Вас пригласили!
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Рабочая группа{" "}
                <strong className="text-foreground">{team.title}</strong>
              </CardDescription>
            </CardHeader>

            <CardContent className="flex justify-center py-4">
              {isAlreadyMember && (
                <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-4 py-2 rounded-full border border-green-100">
                  <CheckCircle className="size-4" />
                  Вы уже в команде
                </div>
              )}
            </CardContent>

            <CardFooter className="flex-col gap-3 pb-8">
              {isAlreadyMember ? (
                <Link href={`/dashboard/teams/${team.id}`} className="w-full">
                  <Button className="w-full font-bold h-12" variant="secondary">
                    Перейти к дашборду
                  </Button>
                </Link>
              ) : (
                <form action={acceptInvite} className="w-full">
                  <Button
                    type="submit"
                    className="w-full text-base h-12 font-black shadow-lg hover:scale-[1.02] transition-transform"
                  >
                    Принять приглашение
                  </Button>
                </form>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
