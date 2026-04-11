import { Sidebar } from "@/components/layout/sidebar";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const userTeams = await prisma.userTeam.findMany({
    where: { userId: user.id },
    include: { team: true },
  });

  const teams = userTeams.map((ut) => ({
    id: ut.team.id,
    title: ut.team.title,
    role: ut.role,
  }));

  return (
    <SidebarProvider>
      <Sidebar teams={teams} />
      <SidebarInset className="bg-muted/10">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </SidebarInset>
      <Toaster
        theme="dark"
        closeButton
        richColors
        expand={true}
        position="top-center"
      />
    </SidebarProvider>
  );
}
