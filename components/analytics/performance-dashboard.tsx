"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Target,
  Clock,
  Download,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

interface PerformanceDashboardProps {
  userRole: "student" | "teacher" | "admin"
  timeframe?: "daily" | "weekly" | "monthly" | "yearly"
}

export function PerformanceDashboard({ userRole, timeframe = "weekly" }: PerformanceDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe)
  const [selectedSubject, setSelectedSubject] = useState("all")

  // Sample data - in real app, this would come from API
  const performanceData = [
    { name: "Mon", score: 85, time: 45, lessons: 3 },
    { name: "Tue", score: 92, time: 60, lessons: 4 },
    { name: "Wed", score: 78, time: 30, lessons: 2 },
    { name: "Thu", score: 88, time: 55, lessons: 3 },
    { name: "Fri", score: 95, time: 70, lessons: 5 },
    { name: "Sat", score: 82, time: 40, lessons: 2 },
    { name: "Sun", score: 90, time: 50, lessons: 3 },
  ]

  const subjectData = [
    { subject: "Mathematics", score: 88, color: "#f59e0b" },
    { subject: "Science", score: 92, color: "#3b82f6" },
    { subject: "English", score: 85, color: "#10b981" },
    { subject: "Social Studies", score: 79, color: "#8b5cf6" },
    { subject: "Arts", score: 94, color: "#f97316" },
  ]

  const engagementData = [
    { name: "Week 1", active: 450, total: 500 },
    { name: "Week 2", active: 480, total: 520 },
    { name: "Week 3", active: 420, total: 510 },
    { name: "Week 4", active: 510, total: 530 },
  ]

  const getMetricCard = (title: string, value: string, change: number, icon: React.ReactNode) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="text-slate-400">{icon}</div>
        </div>
        <div className="flex items-center mt-2">
          {change > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
          )}
          <span className={`text-sm ${change > 0 ? "text-green-600" : "text-red-600"}`}>
            {Math.abs(change)}% from last {selectedTimeframe.slice(0, -2)}
          </span>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="math">Mathematics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="social">Social Studies</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {userRole === "student" && (
          <>
            {getMetricCard("Average Score", "87%", 5.2, <Target className="h-6 w-6" />)}
            {getMetricCard("Study Time", "52h", 12.3, <Clock className="h-6 w-6" />)}
            {getMetricCard("Lessons Completed", "24", 8.7, <BookOpen className="h-6 w-6" />)}
            {getMetricCard("Current Streak", "15 days", 25.0, <CheckCircle className="h-6 w-6" />)}
          </>
        )}

        {userRole === "teacher" && (
          <>
            {getMetricCard("Class Average", "84%", 3.1, <Target className="h-6 w-6" />)}
            {getMetricCard("Active Students", "28/30", -6.7, <Users className="h-6 w-6" />)}
            {getMetricCard("Assignments Graded", "156", 15.2, <BookOpen className="h-6 w-6" />)}
            {getMetricCard("Engagement Rate", "92%", 8.4, <TrendingUp className="h-6 w-6" />)}
          </>
        )}

        {userRole === "admin" && (
          <>
            {getMetricCard("Total Users", "1,247", 12.5, <Users className="h-6 w-6" />)}
            {getMetricCard("Platform Usage", "89%", 4.2, <TrendingUp className="h-6 w-6" />)}
            {getMetricCard("Content Items", "2,456", 18.7, <BookOpen className="h-6 w-6" />)}
            {getMetricCard("Support Tickets", "23", -15.3, <AlertTriangle className="h-6 w-6" />)}
          </>
        )}
      </div>

      {/* Charts */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance Trends</TabsTrigger>
          <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Study Time Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="time" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lessons Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="lessons" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={subjectData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="score"
                      label={({ subject, score }) => `${subject}: ${score}%`}
                    >
                      {subjectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subject Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjectData.map((subject) => (
                    <div key={subject.subject} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{subject.subject}</span>
                        <span className="text-sm text-slate-600">{subject.score}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${subject.score}%`,
                            backgroundColor: subject.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="active" stackId="1" stroke="#10b981" fill="#10b981" />
                  <Area type="monotone" dataKey="total" stackId="2" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Performance Prediction</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Based on current trends, you're likely to achieve 92% average score by month end.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <span className="font-medium text-amber-800">Attention Needed</span>
                  </div>
                  <p className="text-sm text-amber-700">
                    Mathematics performance has declined 8% this week. Consider additional practice.
                  </p>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Goal Achievement</span>
                  </div>
                  <p className="text-sm text-green-700">
                    At current pace, you'll complete the Science module 3 days ahead of schedule.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
