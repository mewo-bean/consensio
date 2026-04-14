import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2Icon, ClockIcon, UsersIcon, ArrowRightIcon } from "lucide-react";
import { formatCountRu } from "@/lib/i18n/ru-plural";

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

  return (
    <Card
      className={cn(
        "transition-all",
        isCompleted && "border-primary/20 bg-muted/5",
        isExpired && "border-muted bg-muted/20",
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-1">
            <CardTitle className="line-clamp-2 break-words text-base leading-tight sm:text-lg">
              {survey.title}
            </CardTitle>
            <CardDescription className="truncate text-sm">
              От команды: {survey.teamTitle}
            </CardDescription>
            <CardDescription className="flex items-center gap-2">
              <UsersIcon className="size-3" />
              {formatCountRu(survey.totalResponses, "ответ", "ответа", "ответов")}
            </CardDescription>
          </div>

          <div className="flex shrink-0 items-center gap-2 self-start">
            {isCompleted ? (
              <Badge className="gap-1 bg-primary/10 text-primary border-primary/20">
                <CheckCircle2Icon className="size-3" />
                Пройден
              </Badge>
            ) : isExpired ? (
              <Badge variant="secondary" className="gap-1 text-muted-foreground">
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
      </CardHeader>

      <CardContent className="flex items-center justify-between gap-3">
        {isCompleted ? (
          <div className="min-w-0 text-sm text-muted-foreground">
            Ваш результат:{" "}
            <span className="font-semibold text-foreground">
              {typeof survey.userScore === "number" ? survey.userScore : "—"}
            </span>
          </div>
        ) : isExpired ? (
          <div className="min-w-0 text-sm text-muted-foreground">
            Срок прохождения завершился: {new Date(survey.expiresAt).toLocaleDateString("ru-RU")}
          </div>
        ) : (
          <div className="min-w-0 text-sm text-muted-foreground">
            Назначен: {new Date(survey.createdAt).toLocaleDateString("ru-RU")}
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
              {isCompleted ? "Открыть" : "Пройти"}
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
