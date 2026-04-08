"use client";

import { useState } from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import data from "@/app/dashboard/data.json";

export default function TeamDashboardPage() {
  const [timeRange, setTimeRange] = useState("90d");

  return (
    <div className="flex flex-1 flex-col w-full">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-3xl font-bold tracking-tight">Дашборд</h1>
            <p className="text-muted-foreground mt-1">
              Динамика состояния команды и ключевые показатели.
            </p>
          </div>

          <SectionCards metrics={null} />

          <div className="px-4 lg:px-6">
            <ChartAreaInteractive
              data={data}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
            />
          </div>

          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
}
