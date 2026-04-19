import { Badge } from "@/components/ui/badge";
import { SurveyCard } from "@/components/surveys/survey-card";
import { PageHeader } from "@/components/layout/page-header";

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

export type ExpiredSurveyItem = {
    id: number;
    title: string;
    teamTitle: string;
    createdAt: string;
    expiresAt: string;
    totalResponses: number;
};

export function SurveysTab({
    initialActiveSurveys,
    initialCompletedSurveys,
    initialExpiredSurveys,
    title = "Опросы",
    description = "Назначенные опросы и история ваших ответов. Все опросы проходят анонимно.",
}: {
    initialActiveSurveys: ActiveSurveyItem[];
    initialCompletedSurveys: CompletedSurveyItem[];
    initialExpiredSurveys: ExpiredSurveyItem[];
    title?: string;
    description?: string;
}) {
    return (
        <div className="flex-1 flex flex-col pt-6 pb-20">
            <div className="px-4 sm:px-6 lg:px-8">
                <PageHeader title={title} description={description} />
            </div>

            <div className="flex flex-1 justify-center px-4 sm:px-6 lg:px-8">
                <div className="flex w-full max-w-6xl flex-col gap-6">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">
                            Активных: {initialActiveSurveys.length}
                        </Badge>
                        <Badge variant="outline">
                            Пройдено: {initialCompletedSurveys.length}
                        </Badge>
                        <Badge variant="outline">
                            Просрочено: {initialExpiredSurveys.length}
                        </Badge>
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
                                            totalResponses:
                                                survey.totalResponses,
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

                    <section className="space-y-4">
                        <div className="space-y-1">
                            <h2 className="text-lg font-medium">
                                Просроченные
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Эти опросы уже закрыты и больше недоступны для
                                прохождения.
                            </p>
                        </div>

                        {initialExpiredSurveys.length > 0 ? (
                            <div className="grid gap-4 xl:grid-cols-2">
                                {initialExpiredSurveys.map((survey) => (
                                    <SurveyCard
                                        key={survey.id}
                                        survey={{
                                            ...survey,
                                            status: "expired",
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
                                Просроченных опросов нет.
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
