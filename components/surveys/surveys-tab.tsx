import { Badge } from "@/components/ui/badge";
import { SurveyCard } from "@/components/surveys/survey-card";

export type ActiveSurveyItem = {
  id: number;
  title: string;
  teamTitle: string;
  createdAt: string;
  expiresAt: string;
  totalResponses: number;
};

export type CompletedSurveyItem = {
  id: number;
  title: string;
  teamTitle: string;
  createdAt: string;
  expiresAt: string;
  totalResponses: number;
  userScore: number;
  sentAt: string;
};

export function SurveysTab({
  initialActiveSurveys,
  initialCompletedSurveys,
  title = "Опросы",
  description = "Назначенные опросы и история ваших ответов.",
}: {
  initialActiveSurveys: ActiveSurveyItem[];
  initialCompletedSurveys: CompletedSurveyItem[];
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Активных: {initialActiveSurveys.length}</Badge>
          <Badge variant="outline">Пройдено: {initialCompletedSurveys.length}</Badge>
        </div>
      </div>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-medium">Активные</h2>
          <p className="text-sm text-muted-foreground">
            Пройдите доступные опросы, пока они открыты.
          </p>
        </div>

        {initialActiveSurveys.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {initialActiveSurveys.map((survey) => (
              <SurveyCard
                key={survey.id}
                survey={{ ...survey, status: "active" }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
            Сейчас нет активных опросов.
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-medium">Завершённые</h2>
          <p className="text-sm text-muted-foreground">
            Здесь сохраняются уже пройденные вами опросы.
          </p>
        </div>

        {initialCompletedSurveys.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {initialCompletedSurveys.map((survey) => (
              <SurveyCard
                key={survey.id}
                survey={{
                  id: survey.id,
                  title: survey.title,
                  teamTitle: survey.teamTitle,
                  createdAt: survey.createdAt,
                  expiresAt: survey.expiresAt,
                  totalResponses: survey.totalResponses,
                  status: "completed",
                  userScore: survey.userScore,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
            Вы ещё не проходили опросы.
          </div>
        )}
      </section>
    </div>
  );
}
