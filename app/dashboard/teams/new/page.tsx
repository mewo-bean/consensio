import { PageHeader } from "@/components/layout/page-header";
import { CreateTeamForm } from "@/components/teams/create-team-form";
import { JoinTeamForm } from "@/components/teams/join-team-form";

export default function NewTeamPage() {
  return (
    <div className="flex-1 w-full pt-8 pb-20 px-6 sm:px-10 lg:px-14">
      <PageHeader
        title="Управление командами"
        description="Создайте новую рабочую группу или присоединитесь к уже существующей по инвайт-коду."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <CreateTeamForm />
        <JoinTeamForm />
      </div>
    </div>
  );
}
