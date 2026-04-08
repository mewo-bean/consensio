import { Sidebar } from "@/components/layout/sidebar";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Получаем команды пользователя через промежуточную таблицу UserTeam
  const userTeams = await prisma.userTeam.findMany({
    where: { user_id: user.id },
    include: { team: true },
  });

  // Проверяем, является ли пользователь менеджером хотя бы в одной команде
  const isManager = userTeams.some((ut) => ut.role === "manager");

  // Мапим результат для пропсов сайдбара
  const teams = userTeams.map((ut) => ut.team);

  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar isManager={isManager} teams={teams} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
