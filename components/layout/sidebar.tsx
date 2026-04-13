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
  CircleUser,
  Send,
} from "lucide-react";
import { useState } from "react";
import { Sidebar as SidebarBase } from "@/components/ui/sidebar";

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
      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm font-medium overflow-hidden",
      "max-sm:min-h-[44px] max-sm:py-3 max-sm:text-base",
      pathname === path
        ? "bg-primary/10 text-foreground border-l-4 border-primary rounded-l-none"
        : "text-muted-foreground hover:bg-muted hover:text-foreground border-l-4 border-transparent rounded-l-none",
    );

  return (
    <SidebarBase collapsible="offcanvas">
      <div className="flex w-full flex-col gap-6 px-4 py-4">
        <div className="px-2 overflow-hidden">
          <Link href="/dashboard" className="block max-sm:py-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-primary truncate">
              consensio.
            </h1>
          </Link>
        </div>

        <nav className="flex flex-col gap-2 w-full">
          <div>
            <Link
                href="/dashboard/profile"
                className={navLinkClass("/dashboard/profile")}
            >
              <CircleUser className="size-4 shrink-0 text-purple-400" />
              <span>Профиль</span>
            </Link>

            <button
              onClick={() => setIsTeamsOpen(!isTeamsOpen)}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors",
                "max-sm:min-h-11 max-sm:py-3 max-sm:text-base",
              )}
            >
              <div className="flex items-center gap-3">
                <Users className="size-4 shrink-0 text-purple-400" />
                <span>Мои группы</span>
              </div>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 transition-transform",
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
                        "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors overflow-hidden",
                        "max-sm:min-h-11 max-sm:py-3 max-sm:text-base",
                        currentTeamId === team.id.toString()
                          ? "text-foreground bg-muted font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                    >
                      <div className="size-6 rounded-full bg-linear-to-br from-purple-200 to-green-200 shrink-0" />
                      <span className="truncate">{team.title}</span>
                    </Link>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground px-2 py-1">
                    Нет групп
                  </span>
                )}

                <Link
                  href="/dashboard/teams/new"
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 mt-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors",
                    "max-sm:min-h-11 max-sm:py-3 max-sm:text-base",
                  )}
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
            <div className="mt-4 flex flex-col gap-2 border-t pt-4 w-full">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate max-sm:text-xs">
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

              <Link
                href={`/dashboard/teams/${currentTeamId}/feedback`}
                className={navLinkClass(`/dashboard/teams/${currentTeamId}/feedback`)}
              >
                <MessageSquareQuote className="size-4 shrink-0 text-purple-400" />
                <span>Обратная связь</span>
              </Link>

              <Link
                href={`/dashboard/teams/${currentTeamId}/surveys`}
                className={navLinkClass(`/dashboard/teams/${currentTeamId}/surveys`)}
              >
                <Send className="size-4 shrink-0 text-emerald-500" />
                <span>Опросы</span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </SidebarBase>
  );
}
