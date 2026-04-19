import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    CheckCircle2Icon,
    ClockIcon,
    UsersIcon,
    ArrowRightIcon,
} from "lucide-react";
import { formatCountRu } from "@/lib/i18n/ru-plural";
import { getSurveyInterpretation } from "@/lib/surveys/interpretations";

type SurveyListItem = {
    id: number;
    title: string;
    teamTitle: string;
    createdAt: string;
    expiresAt: string;
    totalResponses: number;
    status: "active" | "completed" | "expired";
    userScore?: number | null;
};

function formatTimeLeft(expiresAtIso: string) {
    const diff = new Date(expiresAtIso).getTime() - Date.now();
    if (diff <= 0) return "Завершён";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days} дн. ${hours} ч.`;
    if (hours > 0) return `${hours} ч.`;
    return "Менее часа";
}

export function SurveyCard({ survey }: { survey: SurveyListItem }) {
    const timeLeft = formatTimeLeft(survey.expiresAt);
    const isCompleted = survey.status === "completed";
    const isExpired = survey.status === "expired";

    // Получаем данные для отображения, если опрос пройден
    const interpretation =
        typeof survey.userScore === "number"
            ? getSurveyInterpretation(survey.title, survey.userScore)
            : null;

    return (
        <Card
            className={cn(
                "transition-all flex flex-col hover:shadow-md",
                isCompleted && "border-primary/20 bg-muted/5",
                isExpired && "border-muted bg-muted/20",
            )}
        >
            <CardHeader className="flex-1 pb-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                        <div
                            className="inline-flex min-w-0 max-w-[200px] sm:max-w-[250px] items-center gap-2 rounded-md border border-border/80 bg-background px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm"
                            title={survey.teamTitle}
                        >
                            <div className="size-1.5 shrink-0 rounded-full bg-primary" />
                            <span className="truncate">
                                От команды: {survey.teamTitle}
                            </span>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            {isCompleted ? (
                                <Badge className="gap-1 bg-primary/10 text-primary border-primary/20">
                                    <CheckCircle2Icon className="size-3" />
                                    Пройден
                                </Badge>
                            ) : isExpired ? (
                                <Badge
                                    variant="secondary"
                                    className="gap-1 text-muted-foreground"
                                >
                                    <ClockIcon className="size-3" />
                                    Окончен
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="gap-1">
                                    <ClockIcon className="size-3" />
                                    {timeLeft}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Основной контент: Заголовок и счетчик */}
                    <div className="space-y-1.5">
                        <CardTitle className="line-clamp-2 break-words text-base leading-tight sm:text-lg">
                            {survey.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <UsersIcon className="size-3.5" />
                            {formatCountRu(
                                survey.totalResponses,
                                "ответ",
                                "ответа",
                                "ответов",
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex items-end justify-between gap-3 mt-auto">
                {isCompleted && interpretation ? (
                    <div className="flex flex-col gap-1.5 min-w-0">
                        <div className="text-xs text-muted-foreground">
                            Результат:{" "}
                            <span className="font-semibold text-foreground">
                                {survey.userScore}
                            </span>
                        </div>
                        <span
                            className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border truncate w-fit max-w-full",
                                interpretation.colorClass,
                            )}
                        >
                            {interpretation.level}
                        </span>
                    </div>
                ) : isExpired ? (
                    <div className="min-w-0 text-sm text-muted-foreground">
                        Завершился:{" "}
                        {new Date(survey.expiresAt).toLocaleDateString("ru-RU")}
                    </div>
                ) : (
                    <div className="min-w-0 text-sm text-muted-foreground">
                        Назначен:{" "}
                        {new Date(survey.createdAt).toLocaleDateString("ru-RU")}
                    </div>
                )}

                {isExpired ? (
                    <Button variant="secondary" disabled className="shrink-0">
                        Окончен
                    </Button>
                ) : (
                    <Button
                        asChild
                        variant={isCompleted ? "outline" : "default"}
                        className="shrink-0 gap-2"
                    >
                        <Link href={`/dashboard/surveys/${survey.id}`}>
                            {isCompleted ? "Детали" : "Пройти"}
                            <ArrowRightIcon className="size-4" />
                        </Link>
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
