import { CreateTeamForm } from "@/components/teams/create-team-form";
import { JoinTeamForm } from "@/components/teams/join-team-form";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function NewTeamPage() {
  return (
    <div className="flex-1 w-full pt-8 pb-20">
      <header className="border-b border-border/60 pb-8 mb-10 space-y-5 px-6 sm:px-10 lg:px-14">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-9 w-9 shrink-0" />
          <h2 className="text-3xl font-black tracking-tight leading-none">
            Управление командами
          </h2>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl pl-13 leading-relaxed">
          Создайте новую рабочую группу или присоединитесь к уже существующей по
          инвайт-коду.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start px-6 sm:px-10 lg:px-14">
        <CreateTeamForm />
        <JoinTeamForm />
      </div>
    </div>
  );
}
