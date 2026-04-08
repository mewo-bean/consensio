import { CreateTeamForm } from "@/components/teams/create-team-form";
import { JoinTeamForm } from "@/components/teams/join-team-form";

export default function NewTeamPage() {
  return (
    <div className="flex-1 space-y-8 max-w-4xl mx-auto pt-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Управление командами
        </h2>
        <p className="text-muted-foreground">
          Создайте новую рабочую группу или присоединитесь к уже существующей по
          инвайт-коду.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CreateTeamForm />
        <JoinTeamForm />
      </div>
    </div>
  );
}
