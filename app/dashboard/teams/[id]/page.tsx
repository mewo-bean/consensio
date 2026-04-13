"use client";

import {ChartAreaInteractive} from "@/components/chart-area-interactive";
import {SectionCards} from "@/components/section-cards";
import {PageHeader} from "@/components/layout/page-header";
import { getAnalytics } from "@/app/get-analytics";
import { getMetrics } from "@/app/get-metrics";
import { useParams } from "next/navigation";
import * as React from "react";

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

interface TeamDashboardPageProps {
    teamId?: number;
    title?: string;
}

export default function TeamDashboardPage() {
    const [timeRange, setTimeRange] = React.useState("90d");
    const [data, setData] = React.useState<ChartData[]>([]);
    const [metrics, setMetrics] = React.useState<DashboardMetrics | null>(null);

    const params = useParams();
    const teamId = params.id ? parseInt(params.id as string, 10) : undefined;

    React.useEffect(() => {
        if (!teamId) return;
        getMetrics(teamId)
            .then(setMetrics)
            .catch(console.error);
    }, [teamId]);

    React.useEffect(() => {
        if (!teamId) return;
        const days = parseInt(timeRange);
        getAnalytics(days, teamId)
            .then(setData)
            .catch(console.error);
    }, [timeRange, teamId]);

    return (
        <div className="flex-1 bg-background flex flex-col pt-6 pb-20">
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
