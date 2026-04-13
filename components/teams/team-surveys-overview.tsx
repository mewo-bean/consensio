import { ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCountRu } from "@/lib/i18n/ru-plural";

type TeamSurveyOverviewItem = {
  id: number;
  title: string;
  createdAt: string;
  totalResponses: number;
};

export function TeamSurveysOverview({
  items,
}: {
  items: TeamSurveyOverviewItem[];
}) {
  return (
    <Card className="shadow-sm overflow-hidden border-muted/60">
      <CardHeader className="bg-muted/30 pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <ClipboardList className="size-4 text-primary" />
          Назначенные опросы
        </CardTitle>
        <CardDescription>Последние 10 назначений</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-muted/60 bg-muted/10 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{item.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {new Date(item.createdAt).toLocaleString("ru-RU")}
                  </div>
                </div>
                <Badge variant="outline" className="shrink-0 h-6">
                  {formatCountRu(
                    item.totalResponses,
                    "ответ",
                    "ответа",
                    "ответов",
                  )}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Опросы ещё не назначались.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
