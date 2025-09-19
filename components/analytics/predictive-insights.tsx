"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, Target, Brain, Lightbulb, Clock } from "lucide-react"

interface Insight {
  id: string
  type: "prediction" | "recommendation" | "alert" | "achievement"
  title: string
  description: string
  confidence: number
  impact: "low" | "medium" | "high"
  timeframe: string
  actionable: boolean
  actions?: string[]
}

interface PredictiveInsightsProps {
  insights: Insight[]
  userRole: "student" | "teacher" | "admin"
}

export function PredictiveInsights({ insights, userRole }: PredictiveInsightsProps) {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "prediction":
        return <Brain className="h-5 w-5 text-blue-600" />
      case "recommendation":
        return <Lightbulb className="h-5 w-5 text-amber-600" />
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "achievement":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      default:
        return <Target className="h-5 w-5 text-slate-600" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "prediction":
        return "bg-blue-50 border-blue-200"
      case "recommendation":
        return "bg-amber-50 border-amber-200"
      case "alert":
        return "bg-red-50 border-red-200"
      case "achievement":
        return "bg-green-50 border-green-200"
      default:
        return "bg-slate-50 border-slate-200"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const sampleInsights: Insight[] = [
    {
      id: "1",
      type: "prediction",
      title: "Performance Trajectory",
      description: "Based on current learning patterns, you're projected to achieve 94% average score by month end.",
      confidence: 87,
      impact: "high",
      timeframe: "Next 2 weeks",
      actionable: true,
      actions: ["Continue current study schedule", "Focus on weak areas identified"],
    },
    {
      id: "2",
      type: "alert",
      title: "Engagement Drop Detected",
      description: "Mathematics engagement has decreased by 15% this week. Early intervention recommended.",
      confidence: 92,
      impact: "medium",
      timeframe: "This week",
      actionable: true,
      actions: ["Schedule additional math practice", "Review challenging concepts", "Consider peer tutoring"],
    },
    {
      id: "3",
      type: "recommendation",
      title: "Optimal Study Time",
      description:
        "Your peak performance occurs between 2-4 PM. Consider scheduling important lessons during this time.",
      confidence: 78,
      impact: "medium",
      timeframe: "Ongoing",
      actionable: true,
      actions: ["Adjust study schedule", "Block calendar for focused learning"],
    },
    {
      id: "4",
      type: "achievement",
      title: "Milestone Approaching",
      description: "You're 85% complete with the Science module. Completion expected in 3 days.",
      confidence: 95,
      impact: "low",
      timeframe: "3 days",
      actionable: false,
    },
  ]

  const displayInsights = insights.length > 0 ? insights : sampleInsights

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-amber-600" />
          AI-Powered Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayInsights.map((insight) => (
            <Card key={insight.id} className={`${getInsightColor(insight.type)} transition-all hover:shadow-md`}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getImpactColor(insight.impact)}>
                        {insight.impact} impact
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {insight.type}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-700">{insight.description}</p>

                  {/* Confidence and Timeframe */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <span>Confidence:</span>
                        <span className="font-medium">{insight.confidence}%</span>
                      </div>
                      <Progress value={insight.confidence} className="h-1 w-20" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <Clock className="h-3 w-3" />
                      {insight.timeframe}
                    </div>
                  </div>

                  {/* Actions */}
                  {insight.actionable && insight.actions && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-slate-700">Recommended Actions:</div>
                      <div className="space-y-1">
                        {insight.actions.map((action, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-slate-400 rounded-full" />
                            <span className="text-xs text-slate-600">{action}</span>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                        Take Action
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">
                {displayInsights.filter((i) => i.type === "prediction").length}
              </div>
              <div className="text-xs text-slate-600">Predictions</div>
            </div>
            <div>
              <div className="text-lg font-bold text-amber-600">
                {displayInsights.filter((i) => i.type === "recommendation").length}
              </div>
              <div className="text-xs text-slate-600">Recommendations</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">
                {displayInsights.filter((i) => i.type === "alert").length}
              </div>
              <div className="text-xs text-slate-600">Alerts</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {Math.round(displayInsights.reduce((sum, i) => sum + i.confidence, 0) / displayInsights.length)}%
              </div>
              <div className="text-xs text-slate-600">Avg Confidence</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
