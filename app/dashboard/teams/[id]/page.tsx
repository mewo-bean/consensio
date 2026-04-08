"use client";

import { useState } from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import data from "../../data.json";

export default function TeamDashboardPage() {
  const [timeRange, setTimeRange] = useState("90d");

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Дашборд</h1>
        <p className="text-muted-foreground mt-1">
          Ключевые метрики: уровень стресса, вовлеченность и динамика состояний.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <SectionCards metrics={null} />

        <ChartAreaInteractive
          data={data}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />

        <DataTable data={data} />
      </div>
    </div>
  );
}
