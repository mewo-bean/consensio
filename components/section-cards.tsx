"use client";

import { Card } from "@/components/ui/card";

interface MetricsProps {
  metrics: {
    participationRate: number;
    avgStress: string;
    avgEngagement: string;
    totalEmployees: number;
  } | null;
}

export function SectionCards({ metrics }: MetricsProps) {
  const data = metrics ?? {
    participationRate: 0,
    avgStress: "0",
    avgEngagement: "0",
    totalEmployees: 0,
  };

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-6 px-4 lg:px-6">
      {/* 1. Участие */}
      <Card className="flex flex-col justify-between p-3 sm:p-6 shadow-sm border-muted/60 transition-all hover:shadow-md">
        <div className="space-y-1 sm:space-y-2">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight line-clamp-2 sm:truncate">
            Участие<span className="hidden sm:inline"> в опросах</span>
          </p>
          <div className="text-xl sm:text-4xl font-black tabular-nums tracking-tighter">
            {data.participationRate}%
          </div>
        </div>
        <p className="text-[10px] sm:text-sm text-muted-foreground mt-3 sm:mt-4 leading-tight truncate">
          Из {data.totalEmployees} чел.
        </p>
      </Card>

      {/* 2. Стресс */}
      <Card className="flex flex-col justify-between p-3 sm:p-6 shadow-sm border-muted/60 transition-all hover:shadow-md">
        <div className="space-y-1 sm:space-y-2">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight line-clamp-2 sm:truncate">
            Стресс<span className="hidden lg:inline"> PSS-14</span>
          </p>
          <div className="text-xl sm:text-4xl font-black tabular-nums tracking-tighter text-orange-500">
            {data.avgStress}
          </div>
        </div>
        <p className="text-[10px] sm:text-sm text-muted-foreground mt-3 sm:mt-4 leading-tight line-clamp-2 sm:truncate">
          Среднее<span className="hidden sm:inline"> за неделю</span>
        </p>
      </Card>

      {/* 3. Вовлеченность */}
      <Card className="flex flex-col justify-between p-3 sm:p-6 shadow-sm border-muted/60 transition-all hover:shadow-md">
        <div className="space-y-1 sm:space-y-2">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight break-words line-clamp-2 sm:truncate">
            Вовлеченность<span className="hidden lg:inline"> Gallup</span>
          </p>
          <div className="text-xl sm:text-4xl font-black tabular-nums tracking-tighter text-primary">
            {data.avgEngagement}
          </div>
        </div>
        <p className="text-[10px] sm:text-sm text-muted-foreground mt-3 sm:mt-4 leading-tight line-clamp-2 sm:truncate">
          Среднее<span className="hidden sm:inline"> за неделю</span>
        </p>
      </Card>
    </div>
  );
}
