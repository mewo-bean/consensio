"use client";

import { useState } from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { PageHeader } from "@/components/layout/page-header";
import data from "@/app/dashboard/data.json";

export default function TeamDashboardPage() {
  const [timeRange, setTimeRange] = useState("90d");

  return (
    <div className="flex-1 bg-white flex flex-col pt-6 pb-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Дашборд"
          description="Динамика состояния команды и ключевые показатели."
        />
      </div>

      <div className="@container/main flex flex-1 flex-col gap-10 px-4 sm:px-6 lg:px-8">
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
