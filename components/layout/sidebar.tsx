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
} from "lucide-react";
import { useState } from "react";

// Типы под твою схему
type TeamInfo = { id: number; title: string };
type SidebarProps = {
  isManager: boolean;
  teams: TeamInfo[];
};

export function Sidebar({ isManager, teams }: SidebarProps) {
  const pathname = usePathname();
  const [isTeamsOpen, setIsTeamsOpen] = useState(true);

  // Стили активной ссылки для выделения текущей вкладки
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
        <h1 className="text-3xl font-extrabold tracking-tight text-primary">
          consensio.
        </h1>
      </div>

      <nav className="flex flex-col gap-2">
        {/* Аккордеон со списком команд */}
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
                    className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                  >
                    <div className="size-6 rounded-full bg-gradient-to-br from-purple-200 to-green-200 shrink-0" />
                    <span className="truncate">{team.title}</span>
                  </Link>
                ))
              ) : (
                <span className="text-xs text-muted-foreground px-2 py-1">
                  Нет групп
                </span>
              )}

              {/* Кнопка добавления команды */}
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

        {/* Ссылки доступные всем */}
        <Link
          href="/dashboard/surveys"
          className={navLinkClass("/dashboard/surveys")}
        >
          <ClipboardCheck className="size-4 shrink-0 text-purple-400" />
          <span>Опросы</span>
        </Link>

        {/* Ссылки только для менеджеров */}
        {isManager && (
          <>
            <Link
              href="/dashboard/reports"
              className={navLinkClass("/dashboard/reports")}
            >
              <BarChart2 className="size-4 shrink-0 text-green-500" />
              <span>Отчеты</span>
            </Link>
            <Link
              href="/dashboard/feedback"
              className={navLinkClass("/dashboard/feedback")}
            >
              <MessageSquareQuote className="size-4 shrink-0 text-purple-400" />
              <span>Обратная связь</span>
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
