"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar, TrendingUp } from "lucide-react"

interface HeatmapData {
  date: string
  value: number
  level: 0 | 1 | 2 | 3 | 4 // 0 = no activity, 4 = highest activity
}

interface PerformanceHeatmapProps {
  data: HeatmapData[]
  title?: string
  metric?: string
}

export function PerformanceHeatmap({ data, title = "Activity Heatmap", metric = "score" }: PerformanceHeatmapProps) {
  // Generate sample data for the last 12 weeks
  const generateSampleData = (): HeatmapData[] => {
    const sampleData: HeatmapData[] = []
    const today = new Date()

    for (let i = 83; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      const value = Math.random() * 100
      let level: 0 | 1 | 2 | 3 | 4 = 0

      if (value > 80) level = 4
      else if (value > 60) level = 3
      else if (value > 40) level = 2
      else if (value > 20) level = 1
      else level = 0

      sampleData.push({
        date: date.toISOString().split("T")[0],
        value: Math.round(value),
        level,
      })
    }

    return sampleData
  }

  const heatmapData = data.length > 0 ? data : generateSampleData()

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-slate-100"
      case 1:
        return "bg-green-200"
      case 2:
        return "bg-green-300"
      case 3:
        return "bg-green-500"
      case 4:
        return "bg-green-700"
      default:
        return "bg-slate-100"
    }
  }

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 0:
        return "No activity"
      case 1:
        return "Low activity"
      case 2:
        return "Moderate activity"
      case 3:
        return "High activity"
      case 4:
        return "Very high activity"
      default:
        return "No activity"
    }
  }

  // Group data by weeks
  const weeks: HeatmapData[][] = []
  for (let i = 0; i < heatmapData.length; i += 7) {
    weeks.push(heatmapData.slice(i, i + 7))
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-amber-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="space-y-4">
            {/* Month labels */}
            <div className="flex justify-between text-xs text-slate-600 px-4">
              {Array.from({ length: 12 }, (_, i) => {
                const monthIndex = (new Date().getMonth() - 11 + i + 12) % 12
                return <span key={i}>{monthNames[monthIndex]}</span>
              })}
            </div>

            {/* Heatmap grid */}
            <div className="flex gap-1">
              {/* Day labels */}
              <div className="flex flex-col gap-1 text-xs text-slate-600 pr-2">
                {dayNames.map((day, index) => (
                  <div key={day} className="h-3 flex items-center">
                    {index % 2 === 1 && <span>{day}</span>}
                  </div>
                ))}
              </div>

              {/* Heatmap cells */}
              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <Tooltip key={`${weekIndex}-${dayIndex}`}>
                        <TooltipTrigger>
                          <div
                            className={`w-3 h-3 rounded-sm ${getLevelColor(day.level)} hover:ring-2 hover:ring-slate-400 cursor-pointer transition-all`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-center">
                            <div className="font-medium">{new Date(day.date).toLocaleDateString()}</div>
                            <div className="text-sm">
                              {day.value}% {metric}
                            </div>
                            <div className="text-xs text-slate-600">{getLevelLabel(day.level)}</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span>Less</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div key={level} className={`w-3 h-3 rounded-sm ${getLevelColor(level)}`} />
                  ))}
                </div>
                <span>More</span>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {Math.round(heatmapData.reduce((sum, day) => sum + day.value, 0) / heatmapData.length)}% avg
                </Badge>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
