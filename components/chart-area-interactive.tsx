"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

const chartConfig = {
  stress: {
    label: "Стресс",
    color: "var(--chart-4)",
  },
  engagement: {
    label: "Вовлеченность",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

interface ChartProps {
  data: any[]
  timeRange: string
  setTimeRange: (value: string) => void
}

export function ChartAreaInteractive({ data, timeRange, setTimeRange }: ChartProps) {
  const isMobile = useIsMobile()

  // Если мобилка, по умолчанию ставим 30 дней (так как 7 удалили)
  React.useEffect(() => {
    if (isMobile && timeRange === "7d") {
      setTimeRange("30d")
    }
  }, [isMobile, timeRange, setTimeRange])

  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const date = new Date(item.date)
      const referenceDate = new Date() // Используем текущую дату вместо хардкода
      let daysToSubtract = 90
      if (timeRange === "30d") daysToSubtract = 30
      else if (timeRange === "7d") daysToSubtract = 7

      const startDate = new Date(referenceDate)
      startDate.setDate(startDate.getDate() - daysToSubtract)
      return date >= startDate
    })
  }, [data, timeRange])

  return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Состояние команды</CardTitle>
          <CardDescription>
          <span className="hidden @[540px]/card:block">
            Динамика стресса и вовлеченности сотрудников
          </span>
            <span className="@[540px]/card:hidden">Стресс и вовлеченность</span>
          </CardDescription>
          <CardAction>
            <ToggleGroup
                type="single"
                value={timeRange}
                onValueChange={(value) => value && setTimeRange(value)}
                variant="outline"
                className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
            >
              <ToggleGroupItem value="90d">3 месяца</ToggleGroupItem>
              <ToggleGroupItem value="30d">30 дней</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                  className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                  size="sm"
              >
                <SelectValue placeholder="Период" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">3 месяца</SelectItem>
                <SelectItem value="30d" className="rounded-lg">30 дней</SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillStress" x1="0" y1="0" x2="0" y2="1">
                  <stop
                      offset="5%"
                      stopColor="var(--color-stress)"
                      stopOpacity={1.0}
                  />
                  <stop
                      offset="95%"
                      stopColor="var(--color-stress)"
                      stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop
                      offset="5%"
                      stopColor="var(--color-engagement)"
                      stopOpacity={0.8}
                  />
                  <stop
                      offset="95%"
                      stopColor="var(--color-engagement)"
                      stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("ru-RU", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
              />
              <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("ru-RU", {
                            month: "short",
                            day: "numeric",
                          })
                        }}
                        indicator="dot"
                    />
                  }
              />
              {/* engagement заменяет mobile */}
              <Area
                  dataKey="engagement"
                  type="natural"
                  fill="url(#fillEngagement)"
                  stroke="var(--color-engagement)"
                  stackId="a"
              />
              {/* stress заменяет desktop */}
              <Area
                  dataKey="stress"
                  type="natural"
                  fill="url(#fillStress)"
                  stroke="var(--color-stress)"
                  stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
  )
}