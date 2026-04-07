'use client'

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { getAnalytics } from "@/app/get-analytics"
import { getMetrics } from "@/app/get-metrics"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

interface DashboardMetrics {
    participationRate: number;
    avgStress: string;
    avgEngagement: string;
    totalEmployees: number;
}

export default function UserClient({ user }: { user: any }) {
    const [timeRange, setTimeRange] = React.useState("90d")
    const [data, setData] = React.useState<any[]>([])
    const [metrics, setMetrics] = React.useState<DashboardMetrics | null>(null)

    React.useEffect(() => {
        getMetrics().then(setMetrics).catch(console.error)
    }, [])

    React.useEffect(() => {
        const days = parseInt(timeRange)
        getAnalytics(days).then(setData).catch(console.error)
    }, [timeRange])

    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties}
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <SectionCards metrics={metrics} />
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
            </SidebarInset>
        </SidebarProvider>
    )
}