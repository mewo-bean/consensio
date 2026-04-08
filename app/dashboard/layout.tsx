import { Sidebar } from "@/components/layout/sidebar";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar"; // Добавляем импорт

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const userTeams = await prisma.userTeam.findMany({
    where: { user_id: user.id },
    include: { team: true },
  });

  const teams = userTeams.map((ut) => ({
    id: ut.team.id,
    title: ut.team.title,
    role: ut.role,
  }));

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar teams={teams} />
        <main className="flex-1 overflow-y-auto bg-muted/10">{children}</main>
      </div>
    </SidebarProvider>
  );
}
