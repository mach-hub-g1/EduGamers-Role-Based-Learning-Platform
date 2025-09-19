"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Download, CalendarIcon, Clock, CheckCircle } from "lucide-react"
import { format } from "date-fns"

interface ReportConfig {
  type: "performance" | "engagement" | "progress" | "comprehensive"
  format: "pdf" | "excel" | "csv"
  timeframe: "week" | "month" | "quarter" | "year" | "custom"
  startDate?: Date
  endDate?: Date
  includeCharts: boolean
  includeRawData: boolean
  includeRecommendations: boolean
  recipients: string[]
  schedule?: "none" | "daily" | "weekly" | "monthly"
}

interface ReportGeneratorProps {
  userRole: "student" | "teacher" | "admin"
  onGenerateReport: (config: ReportConfig) => void
}

export function ReportGenerator({ userRole, onGenerateReport }: ReportGeneratorProps) {
  const [config, setConfig] = useState<ReportConfig>({
    type: "performance",
    format: "pdf",
    timeframe: "month",
    includeCharts: true,
    includeRawData: false,
    includeRecommendations: true,
    recipients: [],
    schedule: "none",
  })

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [newRecipient, setNewRecipient] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const reportTypes = {
    performance: "Performance Analysis",
    engagement: "Engagement Metrics",
    progress: "Learning Progress",
    comprehensive: "Comprehensive Report",
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    onGenerateReport(config)
    setIsGenerating(false)
  }

  const addRecipient = () => {
    if (newRecipient && !config.recipients.includes(newRecipient)) {
      setConfig({
        ...config,
        recipients: [...config.recipients, newRecipient],
      })
      setNewRecipient("")
    }
  }

  const removeRecipient = (email: string) => {
    setConfig({
      ...config,
      recipients: config.recipients.filter((r) => r !== email),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-amber-600" />
          Report Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Type */}
        <div className="space-y-2">
          <Label>Report Type</Label>
          <Select value={config.type} onValueChange={(value: any) => setConfig({ ...config, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(reportTypes).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Format and Timeframe */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Format</Label>
            <Select value={config.format} onValueChange={(value: any) => setConfig({ ...config, format: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Timeframe</Label>
            <Select value={config.timeframe} onValueChange={(value: any) => setConfig({ ...config, timeframe: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Custom Date Range */}
        {config.timeframe === "custom" && (
          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {config.startDate ? format(config.startDate, "PPP") : "Start Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={config.startDate}
                    onSelect={(date) => setConfig({ ...config, startDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {config.endDate ? format(config.endDate, "PPP") : "End Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={config.endDate}
                    onSelect={(date) => setConfig({ ...config, endDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        {/* Content Options */}
        <div className="space-y-3">
          <Label>Include in Report</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="charts"
                checked={config.includeCharts}
                onCheckedChange={(checked) => setConfig({ ...config, includeCharts: !!checked })}
              />
              <Label htmlFor="charts" className="text-sm">
                Charts and Visualizations
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rawdata"
                checked={config.includeRawData}
                onCheckedChange={(checked) => setConfig({ ...config, includeRawData: !!checked })}
              />
              <Label htmlFor="rawdata" className="text-sm">
                Raw Data Tables
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recommendations"
                checked={config.includeRecommendations}
                onCheckedChange={(checked) => setConfig({ ...config, includeRecommendations: !!checked })}
              />
              <Label htmlFor="recommendations" className="text-sm">
                AI Recommendations
              </Label>
            </div>
          </div>
        </div>

        {/* Recipients */}
        {(userRole === "teacher" || userRole === "admin") && (
          <div className="space-y-3">
            <Label>Email Recipients</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter email address"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addRecipient()}
              />
              <Button onClick={addRecipient} variant="outline">
                Add
              </Button>
            </div>
            {config.recipients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {config.recipients.map((email) => (
                  <Badge key={email} variant="secondary" className="flex items-center gap-1">
                    {email}
                    <button onClick={() => removeRecipient(email)} className="ml-1 hover:text-red-600">
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Scheduling */}
        <div className="space-y-2">
          <Label>Schedule</Label>
          <Select value={config.schedule} onValueChange={(value: any) => setConfig({ ...config, schedule: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Generate Once</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Generate Button */}
        <Button onClick={handleGenerateReport} disabled={isGenerating} className="w-full">
          {isGenerating ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </>
          )}
        </Button>

        {/* Recent Reports */}
        <div className="space-y-2">
          <Label>Recent Reports</Label>
          <div className="space-y-2">
            {[
              { name: "Weekly Performance Report", date: "2024-01-15", status: "completed" },
              { name: "Monthly Engagement Analysis", date: "2024-01-10", status: "completed" },
              { name: "Quarterly Progress Summary", date: "2024-01-05", status: "processing" },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <div>
                  <div className="text-sm font-medium">{report.name}</div>
                  <div className="text-xs text-slate-600">{report.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  {report.status === "completed" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-amber-600" />
                  )}
                  <Button variant="ghost" size="sm">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
