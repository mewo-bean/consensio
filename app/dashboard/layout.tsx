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
    <div className="flex min-h-screen">
      <Sidebar teams={teams} />
      <main className="flex-1 overflow-y-auto bg-muted/10">{children}</main>
    </div>
  );
}
