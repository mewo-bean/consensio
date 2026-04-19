"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import { PageHeader } from "@/components/layout/page-header";
import { getAnalytics } from "@/app/get-analytics";
import { getMetrics } from "@/app/get-metrics";
import { useParams } from "next/navigation";
import * as React from "react";
import {TriangleAlert} from "lucide-react";
import {Alert, AlertTitle} from "@/components/ui/alert";

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
    teamId?: string;
    title?: string;
}

export default function TeamDashboardPage() {
    const [timeRange, setTimeRange] = React.useState("90d");
    const [data, setData] = React.useState<ChartData[]>([]);
    const [metrics, setMetrics] = React.useState<DashboardMetrics | null>(null);

    const params = useParams();
    const teamId = typeof params.id === "string" ? params.id : undefined;

    React.useEffect(() => {
        if (!teamId) return;
        getMetrics(teamId).then(setMetrics).catch(console.error);
    }, [teamId]);

    React.useEffect(() => {
        if (!teamId) return;
        getAnalytics(90, teamId).then(setData).catch(console.error);
    }, [timeRange, teamId]);

    return (
        <div className="flex-1 bg-background flex flex-col pt-6 pb-20">
            <div className="px-4 sm:px-6 lg:px-8">
                <PageHeader
                    title="Дашборд"
                    description="Динамика состояния команды и ключевые показатели."
                />
            </div>

            <div className="@container/main flex flex-1 flex-col">
                <div className="flex flex-col gap-6 pb-4 md:pb-6">
                    <SectionCards metrics={metrics} />
                    <div className="px-4 lg:px-6 flex flex-col gap-6">
                        <Alert className="text-amber-600 font-bold">
                            <TriangleAlert/>
                            <AlertTitle>Пройденные менеджерами опросы не учитываются</AlertTitle>
                        </Alert>
                        <ChartAreaInteractive
                            data={data}
                            dataKey="stress"
                            title="Уровень стресса (PSS-14)"
                            description="Динамика стресса"
                            yAxisLabel="Баллы стресса"
                            interpretation={`0–13: низкий уровень стресса
                            14–26: умеренный уровень стресса
                            27+: высокий уровень воспринимаемого стресса`}
                        />
                        <ChartAreaInteractive
                            data={data}
                            dataKey="engagement"
                            title="Вовлечённость(Gallup)"
                            description="Динамика вовлечённости"
                            yAxisLabel="Баллы вовлечённости"
                            interpretation={`0-34: плохая вовлечённость
                            35-45: нормальный уровень
                            45+: отличная`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
