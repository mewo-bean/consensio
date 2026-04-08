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

export default async function InvitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const resolvedParams = await params;
  const teamId = parseInt(resolvedParams.id, 10);

  // 1. Проверяем, существует ли такая команда
  if (isNaN(teamId)) redirect("/dashboard");

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { members: true },
  });

  if (!team) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center border-destructive">
          <CardHeader>
            <AlertTriangle className="size-12 text-destructive mx-auto mb-2" />
            <CardTitle>Ошибка приглашения</CardTitle>
            <CardDescription>
              Группа не найдена или была удалена.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/dashboard" className="w-full">
              <Button className="w-full">На главную</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // 2. Проверяем, состоит ли пользователь уже в этой команде
  const isAlreadyMember = team.members.some((m) => m.userId === user.id);

  // 3. Серверный экшен для мгновенного вступления
  async function acceptInvite() {
    "use server";
    const currentUser = await getCurrentUser();
    if (!currentUser) redirect("/login");

    try {
      await prisma.userTeam.create({
        data: {
          userId: currentUser.id,
          teamId: teamId,
          role: "member",
        },
      });
      revalidatePath("/dashboard");
    } catch (e) {
      // Игнорируем ошибку, если кто-то кликнул дважды и нарушил уникальность
    }

    redirect(`/dashboard/teams/${teamId}`);
  }

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-muted/20">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center">
          <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="size-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Вас пригласили!</CardTitle>
          <CardDescription className="text-base mt-2">
            Присоединяйтесь к рабочей группе <br />
            <strong className="text-foreground">{team.title}</strong>
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center pb-2">
          {isAlreadyMember && (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <CheckCircle className="size-5" />
              Вы уже состоите в этой группе
            </div>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-3">
          {isAlreadyMember ? (
            <Link href={`/dashboard/teams/${team.id}`} className="w-full">
              <Button className="w-full" variant="secondary">
                Перейти к команде
              </Button>
            </Link>
          ) : (
            <form action={acceptInvite} className="w-full">
              <Button type="submit" className="w-full text-base py-6">
                Присоединиться к группе
              </Button>
            </form>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
