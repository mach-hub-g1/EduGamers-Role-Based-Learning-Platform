"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Shield,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  TrendingUp,
  AlertTriangle,
  Filter,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Flag,
  MessageSquare,
  Home,
  UserCheck,
  FileCheck,
  Activity,
  Lock,
  Unlock,
  Plus,
  Mail,
  HelpCircle,
} from "lucide-react"

type AdminPage = "home" | "users" | "content" | "analytics" | "system" | "support"

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState<AdminPage>("home")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [gamificationEnabled, setGamificationEnabled] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "users", label: "User Management", icon: Users },
    { id: "content", label: "Content Management", icon: BookOpen },
    { id: "analytics", label: "Analytics & Reports", icon: BarChart3 },
    { id: "system", label: "System Settings", icon: Settings },
    { id: "support", label: "Support Oversight", icon: HelpCircle },
  ]

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />
      case "users":
        return <UserManagementPage />
      case "content":
        return <ContentManagementPage />
      case "analytics":
        return <AnalyticsPage />
      case "system":
        return <SystemSettingsPage />
      case "support":
        return <SupportOversightPage />
      default:
        return <HomePage />
    }
  }

  const HomePage = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h2>
        <p className="text-muted-foreground">System overview and platform management</p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-xl font-bold">2,847</p>
                <p className="text-xs text-green-600">+12% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Courses</p>
                <p className="text-xl font-bold">156</p>
                <p className="text-xs text-green-600">+8 new</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Platform Engagement</p>
                <p className="text-xl font-bold">94.2%</p>
                <p className="text-xs text-green-600">+2.1%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-destructive/10 p-2 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Critical Issues</p>
                <p className="text-xl font-bold">3</p>
                <p className="text-xs text-red-600">Needs attention</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Real-time Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Real-time Platform Activity
                </CardTitle>
                <CardDescription>Live system metrics and user engagement</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Active Users (Live)</p>
                  <p className="text-2xl font-bold">1,234</p>
                  <p className="text-xs text-green-600">+5.2% from yesterday</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Lessons Completed Today</p>
                  <p className="text-2xl font-bold">456</p>
                  <p className="text-xs text-green-600">+12% from yesterday</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Server Performance</span>
                  <span className="text-green-600">Excellent</span>
                </div>
                <Progress value={95} />
                <div className="flex justify-between text-sm">
                  <span>Database Response Time</span>
                  <span className="text-green-600">45ms avg</span>
                </div>
                <Progress value={88} />
              </div>
            </CardContent>
          </Card>

          {/* Recent System Events */}
          <Card>
            <CardHeader>
              <CardTitle>Recent System Activity</CardTitle>
              <CardDescription>Latest platform events and administrative actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  type: "approval",
                  message: "New teacher registration approved",
                  details: "Dr. Sunita Patel • Mathematics Department",
                  time: "1 hour ago",
                  priority: "normal",
                },
                {
                  type: "content",
                  message: "Course content updated",
                  details: "Physics Grade 12 • Quantum Mechanics chapter",
                  time: "2 hours ago",
                  priority: "normal",
                },
                {
                  type: "system",
                  message: "System maintenance completed",
                  details: "Database optimization and security updates",
                  time: "3 hours ago",
                  priority: "high",
                },
                {
                  type: "alert",
                  message: "Unusual login activity detected",
                  details: "Multiple failed login attempts from IP 192.168.1.100",
                  time: "4 hours ago",
                  priority: "urgent",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "approval"
                        ? "bg-primary"
                        : activity.type === "content"
                          ? "bg-secondary"
                          : activity.type === "system"
                            ? "bg-accent"
                            : "bg-destructive"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{activity.message}</p>
                      {activity.priority === "urgent" && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                      {activity.priority === "high" && (
                        <Badge variant="secondary" className="text-xs">
                          High
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.details}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <FileCheck className="h-4 w-4 mr-2" />
                Content Approval
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-primary/5 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Teacher Applications</p>
                  <p className="text-xs text-muted-foreground">5 pending review</p>
                </div>
                <Button size="sm" variant="outline">
                  Review
                </Button>
              </div>
              <div className="flex items-center justify-between p-2 bg-secondary/5 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Course Content</p>
                  <p className="text-xs text-muted-foreground">12 awaiting approval</p>
                </div>
                <Button size="sm" variant="outline">
                  Review
                </Button>
              </div>
              <div className="flex items-center justify-between p-2 bg-accent/5 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Support Tickets</p>
                  <p className="text-xs text-muted-foreground">3 urgent tickets</p>
                </div>
                <Button size="sm" variant="outline">
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Server Status</span>
                <Badge className="bg-green-500 text-white">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <Badge className="bg-green-500 text-white">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">CDN</span>
                <Badge className="bg-green-500 text-white">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Backup Status</span>
                <Badge className="bg-green-500 text-white">Current</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const UserManagementPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage users, roles, and access permissions</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," + 
                "Name,Email,Role,Status,Last Login,Classes/XP\n" +
                "Dr. Priya Sharma,priya.sharma@edu.gov.in,teacher,active,2 hours ago,3 Classes\n" +
                "Rahul Kumar,rahul.kumar@student.edu.gov.in,student,active,1 hour ago,1250 XP\n" +
                "Ankit Singh,ankit.singh@student.edu.gov.in,student,inactive,5 days ago,450 XP\n" +
                "Dr. Amit Patel,amit.patel@edu.gov.in,admin,active,30 minutes ago,Full Access"
              const encodedUri = encodeURI(csvContent)
              const link = document.createElement("a")
              link.setAttribute("href", encodedUri)
              link.setAttribute("download", "users_export.csv")
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>User Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input placeholder="Search users by name, email, or ID..." className="w-full" />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="students">Students Only</SelectItem>
                <SelectItem value="teachers">Teachers Only</SelectItem>
                <SelectItem value="admins">Admins Only</SelectItem>
                <SelectItem value="active">Active Users</SelectItem>
                <SelectItem value="inactive">Inactive Users</SelectItem>
                <SelectItem value="flagged">Flagged Users</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-xl font-bold">2,456</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <UserCheck className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Teachers</p>
                <p className="text-xl font-bold">234</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Administrators</p>
                <p className="text-xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-destructive/10 p-2 rounded-lg">
                <Flag className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Flagged Users</p>
                <p className="text-xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Directory</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Bulk Actions
            </Button>
            <Button variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              Activity Log
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: "Dr. Priya Sharma",
                email: "priya.sharma@edu.gov.in",
                role: "teacher",
                status: "active",
                lastLogin: "2 hours ago",
                classes: 3,
                flagged: false,
              },
              {
                name: "Rahul Kumar",
                email: "rahul.kumar@student.edu.gov.in",
                role: "student",
                status: "active",
                lastLogin: "1 hour ago",
                xp: 1250,
                flagged: false,
              },
              {
                name: "Ankit Singh",
                email: "ankit.singh@student.edu.gov.in",
                role: "student",
                status: "inactive",
                lastLogin: "5 days ago",
                xp: 450,
                flagged: true,
              },
              {
                name: "Dr. Amit Patel",
                email: "amit.patel@edu.gov.in",
                role: "admin",
                status: "active",
                lastLogin: "30 minutes ago",
                permissions: "Full Access",
                flagged: false,
              },
            ].map((user, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{user.name}</h4>
                      {user.flagged && <Flag className="h-4 w-4 text-destructive" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <Badge
                        variant={user.role === "admin" ? "default" : user.role === "teacher" ? "secondary" : "outline"}
                      >
                        {user.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Last login: {user.lastLogin}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {user.role === "student" && <p className="text-sm font-medium">{user.xp} XP</p>}
                    {user.role === "teacher" && <p className="text-sm font-medium">{user.classes} Classes</p>}
                    {user.role === "admin" && <p className="text-sm font-medium">{user.permissions}</p>}
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      {user.status === "active" ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const ContentManagementPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Management & Approval</h2>
          <p className="text-muted-foreground">Review, approve, and manage educational content</p>
        </div>
        <Button
          onClick={() => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = '.pdf,.doc,.docx,.ppt,.pptx,.txt,.mp4,.mp3'
            input.multiple = true
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files
              if (files && files.length > 0) {
                alert(`Uploaded ${files.length} content file(s): ${Array.from(files).map(f => f.name).join(', ')}`)
              }
            }
            input.click()
          }}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Content
        </Button>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="approved">Approved Content</TabsTrigger>
          <TabsTrigger value="rejected">Rejected Content</TabsTrigger>
          <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Content Awaiting Approval</CardTitle>
                <CardDescription>Review and approve educational materials</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Bulk Approve
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: "Advanced Calculus - Chapter 12",
                  author: "Dr. Priya Sharma",
                  subject: "Mathematics",
                  type: "Lesson",
                  submitted: "2 days ago",
                  priority: "high",
                  size: "2.5 MB",
                },
                {
                  title: "Quantum Physics Quiz Set",
                  author: "Prof. Amit Kumar",
                  subject: "Physics",
                  type: "Quiz",
                  submitted: "1 day ago",
                  priority: "medium",
                  size: "1.2 MB",
                },
                {
                  title: "English Literature Assignment",
                  author: "Ms. Neha Patel",
                  subject: "English",
                  type: "Assignment",
                  submitted: "3 hours ago",
                  priority: "low",
                  size: "800 KB",
                },
              ].map((content, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{content.title}</h4>
                        <Badge
                          variant={
                            content.priority === "high"
                              ? "destructive"
                              : content.priority === "medium"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {content.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        By {content.author} • {content.subject} • {content.type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Submitted {content.submitted} • {content.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Content Library</CardTitle>
              <CardDescription>Successfully approved educational materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "Algebra Basics", downloads: 1250, rating: 4.8, subject: "Mathematics" },
                  { title: "Cell Biology", downloads: 890, rating: 4.6, subject: "Biology" },
                  { title: "World History", downloads: 1100, rating: 4.7, subject: "History" },
                  { title: "Grammar Essentials", downloads: 950, rating: 4.5, subject: "English" },
                ].map((content, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">{content.title}</h4>
                      <Badge variant="outline" className="mb-3">
                        {content.subject}
                      </Badge>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Downloads</span>
                          <span>{content.downloads}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Rating</span>
                          <span>{content.rating}/5.0</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Content</CardTitle>
              <CardDescription>Content that requires revision before approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Rejected Content</h3>
                <p className="text-muted-foreground">All submitted content has been approved or is pending review</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Download className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Downloads</p>
                    <p className="text-xl font-bold">45,230</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary/10 p-2 rounded-lg">
                    <Eye className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Content Views</p>
                    <p className="text-xl font-bold">128,450</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-accent/10 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Rating</p>
                    <p className="text-xl font-bold">4.6/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )

  const AnalyticsPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics & Reports</h2>
          <p className="text-muted-foreground">Comprehensive platform insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," + 
                "Metric,Value,Change,Period\n" +
                "Daily Active Users,1234,+8.2%,vs last week\n" +
                "Lessons Completed,5678,+15.3%,vs last week\n" +
                "Avg Session Time,42 min,+5.1%,vs last week\n" +
                "Platform Growth,+12.4%,Monthly growth rate\n" +
                "Mathematics Performance,87%,+3.2%,1250 students\n" +
                "Science Performance,82%,+1.8%,1100 students\n" +
                "English Performance,89%,+4.1%,1350 students\n" +
                "History Performance,78%,-0.5%,950 students"
              const encodedUri = encodeURI(csvContent)
              const link = document.createElement("a")
              link.setAttribute("href", encodedUri)
              link.setAttribute("download", "analytics_report.csv")
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <BarChart3 className="h-4 w-4 mr-2" />
            Custom Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Daily Active Users</p>
                <p className="text-xl font-bold">1,234</p>
                <p className="text-xs text-green-600">+8.2% vs last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lessons Completed</p>
                <p className="text-xl font-bold">5,678</p>
                <p className="text-xs text-green-600">+15.3% vs last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Session Time</p>
                <p className="text-xl font-bold">42 min</p>
                <p className="text-xs text-green-600">+5.1% vs last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-chart-3/10 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Platform Growth</p>
                <p className="text-xl font-bold">+12.4%</p>
                <p className="text-xs text-green-600">Monthly growth rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Engagement Trends</CardTitle>
            <CardDescription>Platform usage over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Engagement analytics visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance by Subject</CardTitle>
            <CardDescription>Student performance across different subjects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { subject: "Mathematics", performance: 87, students: 1250, trend: "+3.2%" },
              { subject: "Science", performance: 82, students: 1100, trend: "+1.8%" },
              { subject: "English", performance: 89, students: 1350, trend: "+4.1%" },
              { subject: "History", performance: 78, students: 950, trend: "-0.5%" },
            ].map((subject) => (
              <div key={subject.subject}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{subject.subject}</span>
                  <div className="flex items-center gap-2">
                    <span>{subject.performance}% avg</span>
                    <span className={`text-xs ${subject.trend.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                      {subject.trend}
                    </span>
                  </div>
                </div>
                <Progress value={subject.performance} />
                <p className="text-xs text-muted-foreground mt-1">{subject.students} students enrolled</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Predictive Insights & Alerts</CardTitle>
          <CardDescription>AI-powered analytics and automated system alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              type: "prediction",
              title: "Enrollment Growth Forecast",
              message: "Based on current trends, expect 15% growth in student enrollment next quarter",
              priority: "info",
            },
            {
              type: "alert",
              title: "Low Engagement Alert",
              message: "Grade 9 Mathematics class showing 20% decrease in engagement this week",
              priority: "warning",
            },
            {
              type: "recommendation",
              title: "Content Recommendation",
              message: "Consider adding more interactive content for Physics - high demand detected",
              priority: "info",
            },
            {
              type: "alert",
              title: "Performance Drop",
              message: "Overall platform performance decreased by 5% - investigate server capacity",
              priority: "urgent",
            },
          ].map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
              <div
                className={`w-2 h-2 rounded-full mt-2 ${
                  insight.priority === "urgent"
                    ? "bg-destructive"
                    : insight.priority === "warning"
                      ? "bg-yellow-500"
                      : "bg-primary"
                }`}
              ></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{insight.title}</h4>
                  <Badge
                    variant={
                      insight.priority === "urgent"
                        ? "destructive"
                        : insight.priority === "warning"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {insight.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{insight.message}</p>
              </div>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  const SystemSettingsPage = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">System Settings & Security</h2>
        <p className="text-muted-foreground">Configure platform settings and security options</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="security">Security & Access</TabsTrigger>
          <TabsTrigger value="features">Feature Toggles</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Configuration</CardTitle>
              <CardDescription>General platform settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Enable to temporarily disable user access for maintenance
                  </p>
                </div>
                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">User Registration</p>
                  <p className="text-sm text-muted-foreground">Allow new users to register accounts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Send system notifications via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input id="platform-name" defaultValue="Government Education Platform" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input id="support-email" defaultValue="support@edu.gov.in" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Monitoring</CardTitle>
              <CardDescription>Monitor and configure security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Login Attempt Monitoring</p>
                  <p className="text-sm text-muted-foreground">Monitor and alert on suspicious login attempts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input id="session-timeout" type="number" defaultValue="60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                <Input id="max-login-attempts" type="number" defaultValue="5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { event: "Failed login attempt", ip: "192.168.1.100", time: "2 hours ago", severity: "medium" },
                { event: "Admin password changed", user: "admin@edu.gov.in", time: "1 day ago", severity: "low" },
                { event: "Multiple failed logins", ip: "10.0.0.50", time: "3 days ago", severity: "high" },
              ].map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{event.event}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.ip && `IP: ${event.ip}`}
                      {event.user && `User: ${event.user}`} • {event.time}
                    </p>
                  </div>
                  <Badge
                    variant={
                      event.severity === "high" ? "destructive" : event.severity === "medium" ? "secondary" : "outline"
                    }
                  >
                    {event.severity}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Management</CardTitle>
              <CardDescription>Enable or disable platform features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Gamification System</p>
                  <p className="text-sm text-muted-foreground">Enable XP, badges, and leaderboards</p>
                </div>
                <Switch checked={gamificationEnabled} onCheckedChange={setGamificationEnabled} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">AI Mentor</p>
                  <p className="text-sm text-muted-foreground">Enable AI-powered learning assistance</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Real-time Chat</p>
                  <p className="text-sm text-muted-foreground">Allow real-time messaging between users</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Content Sharing</p>
                  <p className="text-sm text-muted-foreground">Allow teachers to share content with each other</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Parent Portal</p>
                  <p className="text-sm text-muted-foreground">Enable parent access to student progress</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode Default</p>
                  <p className="text-sm text-muted-foreground">Set dark mode as the default theme</p>
                </div>
                <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary rounded border"></div>
                  <Input id="primary-color" defaultValue="#d97706" className="w-32" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-secondary rounded border"></div>
                  <Input id="secondary-color" defaultValue="#ec4899" className="w-32" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo-upload">Platform Logo</Label>
                <div className="flex items-center gap-4">
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                  <span className="text-sm text-muted-foreground">Recommended: 200x50px PNG</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  const SupportOversightPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Support Oversight</h2>
          <p className="text-muted-foreground">Manage support tickets and user assistance</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
      </div>

      {/* Support Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open Tickets</p>
                <p className="text-xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Response Time</p>
                <p className="text-xl font-bold">2.5h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resolved Today</p>
                <p className="text-xl font-bold">15</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-destructive/10 p-2 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Urgent Tickets</p>
                <p className="text-xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Support Ticket Dashboard</CardTitle>
            <CardDescription>Manage and track support requests</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tickets</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              id: "TKT-001",
              title: "Unable to access student dashboard",
              user: "Rahul Kumar",
              type: "Technical",
              priority: "high",
              status: "open",
              created: "2 hours ago",
              assignee: "Unassigned",
            },
            {
              id: "TKT-002",
              title: "Quiz submission not working",
              user: "Priya Singh",
              type: "Technical",
              priority: "urgent",
              status: "in-progress",
              created: "4 hours ago",
              assignee: "Support Team A",
            },
            {
              id: "TKT-003",
              title: "Request for additional course materials",
              user: "Dr. Amit Patel",
              type: "Feature Request",
              priority: "medium",
              status: "open",
              created: "1 day ago",
              assignee: "Content Team",
            },
            {
              id: "TKT-004",
              title: "Password reset not working",
              user: "Neha Sharma",
              type: "Account",
              priority: "high",
              status: "resolved",
              created: "2 days ago",
              assignee: "Support Team B",
            },
          ].map((ticket) => (
            <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium">{ticket.id}</p>
                  <Badge
                    variant={
                      ticket.priority === "urgent"
                        ? "destructive"
                        : ticket.priority === "high"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {ticket.priority}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium">{ticket.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {ticket.user} • {ticket.type} • Created {ticket.created}
                  </p>
                  <p className="text-xs text-muted-foreground">Assigned to: {ticket.assignee}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant={
                    ticket.status === "resolved" ? "default" : ticket.status === "in-progress" ? "secondary" : "outline"
                  }
                >
                  {ticket.status}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-accent/10 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Portal</h1>
              <p className="text-sm text-muted-foreground">Government Education Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t">
          <div className="container mx-auto px-4">
            <nav className="flex space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id as AdminPage)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                      currentPage === item.id
                        ? "border-accent text-accent"
                        : "border-transparent text-foreground hover:text-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">{renderPage()}</main>
    </div>
  )
}
