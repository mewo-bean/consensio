"use client";

import {ChartAreaInteractive} from "@/components/chart-area-interactive";
import {SectionCards} from "@/components/section-cards";
import {PageHeader} from "@/components/layout/page-header";
import { getAnalytics } from "@/app/get-analytics";
import { getMetrics } from "@/app/get-metrics";
import * as React from "react";
import { useParams } from "next/navigation";

interface DashboardMetrics {
    participationRate: number;
    avgStress: string;
    avgEngagement: string;
    totalEmployees: number;
}

interface ChartData {
    date: string;
    stress: number | null;
    engagement: number | null;
}

export default function TeamDashboardPage() {
    const params = useParams<{ id: string }>();
    const teamId = React.useMemo(() => {
        const id = params?.id;
        const parsed = typeof id === "string" ? parseInt(id, 10) : NaN;
        return Number.isFinite(parsed) ? parsed : null;
    }, [params]);

    const [timeRange, setTimeRange] = React.useState("90d");
    const [data, setData] = React.useState<ChartData[]>([]);
    const [metrics, setMetrics] = React.useState<DashboardMetrics | null>(null);

    React.useEffect(() => {
        if (!teamId) return;
        getMetrics(teamId).then(setMetrics).catch(console.error);
    }, [teamId]);

    React.useEffect(() => {
        const days = parseInt(timeRange);
        if (!teamId) return;
        getAnalytics(days, teamId).then(setData).catch(console.error);
    }, [timeRange, teamId]);

    return (
        <div className="flex-1 bg-white flex flex-col pt-6 pb-20">
            <div className="px-4 sm:px-6 lg:px-8">
                <PageHeader
                    title="Дашборд"
                    description="Динамика состояния команды и ключевые показатели."
                />
            </div>

            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <SectionCards metrics={metrics}/>
                    <div className="px-4 lg:px-6">
                        <ChartAreaInteractive
                            data={data}
                            timeRange={timeRange}
                            setTimeRange={setTimeRange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
