import { PageHeader } from "@/components/layout/page-header";
import { CreateTeamForm } from "@/components/teams/create-team-form";
import { JoinTeamForm } from "@/components/teams/join-team-form";

export default function NewTeamPage() {
  return (
    <div className="flex-1 bg-white flex flex-col pt-6 pb-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Управление командами"
          description="Создайте новую рабочую группу или присоединитесь к уже существующей по инвайт-коду."
        />
      </div>

      <div className="flex flex-1 flex-col px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <CreateTeamForm />
          <JoinTeamForm />
        </div>
      </div>
    </div>
  );
}
