"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export type FeedbackItem = {
  id: number;
  userLabel: string;
  content: string;
  createdAt?: string;
  isAnon?: boolean;
};

export function FeedbackPanel({
  items,
  totalCount,
}: {
  items: FeedbackItem[];
  totalCount?: number;
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [expandedIds, setExpandedIds] = React.useState<Set<number>>(() => new Set());
  const visibleCount = items.length;
  const countLabel = typeof totalCount === "number" ? totalCount : visibleCount;

  const toggle = (id: number) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Card className="shadow-sm overflow-hidden border-muted/60">
      <CardHeader className="bg-muted/30 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <CardTitle className="text-lg">Обратная связь</CardTitle>
            <CardDescription>Сообщения от участников команды</CardDescription>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="secondary" className="h-6">
              {countLabel}
            </Badge>
            <Button
              type="button"
              size="xs"
              variant="ghost"
              onClick={() => setIsCollapsed((v) => !v)}
              className="h-7 px-2"
              disabled={visibleCount === 0}
            >
              {isCollapsed ? "Показать все" : "Только последняя"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        {visibleCount > 0 ? (
          (isCollapsed ? items.slice(0, 1) : items).map((item) => {
            const isExpanded = expandedIds.has(item.id);
            const lines = item.content.split("\n").length;
            const canExpand = item.content.length > 160 || lines > 3;

            return (
              <div
                key={item.id}
                role={canExpand ? "button" : undefined}
                tabIndex={canExpand ? 0 : undefined}
                onClick={canExpand ? () => toggle(item.id) : undefined}
                onKeyDown={
                  canExpand
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggle(item.id);
                        }
                      }
                    : undefined
                }
                className={[
                  "rounded-lg border border-muted/60 bg-muted/10 px-3 py-2",
                  canExpand ? "cursor-pointer" : "",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-semibold text-sm truncate">
                    {item.userLabel}
                  </div>
                  {item.isAnon ? (
                    <Badge variant="outline" className="h-6 shrink-0">
                      Анонимно
                    </Badge>
                  ) : null}
                </div>
                <div
                  className={[
                    "text-sm text-foreground/90 mt-1 whitespace-pre-wrap break-words",
                    !isExpanded ? "line-clamp-3" : "",
                  ].join(" ")}
                >
                  {item.content}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-sm text-muted-foreground">
            Пока нет сообщений.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
