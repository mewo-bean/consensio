"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  ClipboardCheck,
  BarChart2,
  MessageSquareQuote,
  ChevronDown,
  PlusCircle,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";

type TeamInfo = { id: number; title: string; role: string };

type SidebarProps = {
  teams: TeamInfo[];
};

export function Sidebar({ teams }: SidebarProps) {
  const pathname = usePathname();
  const [isTeamsOpen, setIsTeamsOpen] = useState(true);
  const currentTeamId = pathname.split("/")[3];
  const currentTeam = teams.find((t) => t.id.toString() === currentTeamId);
  const isManager = currentTeam?.role === "manager";

  const navLinkClass = (path: string) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm font-medium",
      pathname === path
        ? "bg-primary/10 text-foreground border-l-4 border-primary rounded-l-none"
        : "text-muted-foreground hover:bg-muted hover:text-foreground border-l-4 border-transparent rounded-l-none",
    );

  return (
    <aside className="w-64 border-r bg-background min-h-screen flex flex-col p-4 gap-6">
      <div className="px-2">
        <Link href="/dashboard">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">
            consensio.
          </h1>
        </Link>
      </div>

      <nav className="flex flex-col gap-2">
        <div>
          <button
            onClick={() => setIsTeamsOpen(!isTeamsOpen)}
            className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
          >
            <div className="flex items-center gap-3">
              <Users className="size-4 text-purple-500" />
              <span>Мои группы</span>
            </div>
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                !isTeamsOpen && "-rotate-90",
              )}
            />
          </button>

          {isTeamsOpen && (
            <div className="ml-5 mt-1 flex flex-col gap-1 border-l pl-3 border-border/50">
              {teams.length > 0 ? (
                teams.map((team) => (
                  <Link
                    key={team.id}
                    href={`/dashboard/teams/${team.id}`}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
                      currentTeamId === team.id.toString()
                        ? "text-foreground bg-muted font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                  >
                    <div className="size-6 rounded-full bg-gradient-to-br from-purple-200 to-green-200 shrink-0" />
                    <span className="truncate">{team.title}</span>
                  </Link>
                ))
              ) : (
                <span className="text-xs text-muted-foreground px-2 py-1 text-balance">
                  Нет групп
                </span>
              )}

              <Link
                href="/dashboard/teams/new"
                className="flex items-center gap-2 px-2 py-1.5 mt-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
              >
                <PlusCircle className="size-4 shrink-0" />
                <span>Добавить команду</span>
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/dashboard/surveys"
          className={navLinkClass("/dashboard/surveys")}
        >
          <ClipboardCheck className="size-4 shrink-0 text-purple-400" />
          <span>Мои опросы</span>
        </Link>

        {currentTeamId && currentTeam && (
          <div className="mt-4 flex flex-col gap-2 border-t pt-4">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
              {currentTeam.title}
            </p>

            <Link
              href={`/dashboard/teams/${currentTeamId}`}
              className={navLinkClass(`/dashboard/teams/${currentTeamId}`)}
            >
              <BarChart2 className="size-4 shrink-0 text-green-500" />
              <span>Дашборд</span>
            </Link>

            <Link
              href={`/dashboard/teams/${currentTeamId}/members`}
              className={navLinkClass(
                `/dashboard/teams/${currentTeamId}/members`,
              )}
            >
              <Users className="size-4 shrink-0 text-blue-500" />
              <span>Участники группы</span>
            </Link>

            {/* Эти ссылки видны только администраторам */}
            {isManager && (
              <>
                <Link
                  href={`/dashboard/teams/${currentTeamId}/feedback`}
                  className={navLinkClass(
                    `/dashboard/teams/${currentTeamId}/feedback`,
                  )}
                >
                  <MessageSquareQuote className="size-4 shrink-0 text-purple-400" />
                  <span>Обратная связь</span>
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </aside>
  );
}
