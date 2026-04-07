"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"

interface MetricsProps {
  metrics: {
    participationRate: number
    avgStress: string
    avgEngagement: string
    totalEmployees: number
  } | null
}

export function SectionCards({ metrics }: MetricsProps) {
  const data = metrics ?? {
    participationRate: 0,
    avgStress: "0",
    avgEngagement: "0",
    totalEmployees: 0,
  }

  return (
      <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">

        {/* 1. Участие */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Участие в опросах</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data.participationRate}%
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Активность за 7 дней
            </div>
            <div className="text-muted-foreground"> Из {data.totalEmployees} чел.</div>
          </CardFooter>
        </Card>

        {/* 2. Стресс */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Уровень стресса PSS-14</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-orange-600">
              {data.avgStress}
            </CardTitle>
            <CardAction>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Среднее за неделю
            </div>
            <div className="text-muted-foreground">Показатель нагрузки</div>
          </CardFooter>
        </Card>

        {/* 3. Вовлеченность */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Вовлеченность Gallup</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-primary">
              {data.avgEngagement}
            </CardTitle>
            <CardAction>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Среднее за неделю
            </div>
            <div className="text-muted-foreground">Эмоциональный ресурс</div>
          </CardFooter>
        </Card>
      </div>
  )
}