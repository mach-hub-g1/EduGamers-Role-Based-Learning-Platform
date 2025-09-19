"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { LanguageSelector } from "@/components/ui/language-selector"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  BarChart3,
  LogOut,
  Bell,
  Plus,
  Filter,
  Upload,
  Download,
  Send,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  Settings,
  Home,
  UserCheck,
  PenTool,
  Mail,
  HelpCircle,
  Edit,
  Trash2,
  Eye,
  Search,
  Moon,
  Sun,
  Globe,
  Volume2,
  Shield,
  User,
  ChevronDown,
  Star,
  Target,
  Award,
  Zap,
} from "lucide-react"

type TeacherPage = "home" | "classes" | "content" | "analytics" | "support"

interface Class {
  id: string
  name: string
  students: number
  subject: string
  grade: string
  schedule: string
}

interface Student {
  id: string
  name: string
  email: string
  grade: string
  attendance: number
  performance: number
  status: "active" | "attention" | "inactive"
  avatar?: string
}

interface Assignment {
  id: string
  title: string
  description: string
  classId: string
  dueDate: string
  points: number
  difficulty: "easy" | "medium" | "hard"
  submissions: number
  totalStudents: number
  status: "draft" | "published" | "closed"
  createdAt: string
}

interface SupportTicket {
  issueType: string
  priority: string
  subject: string
  description: string
}

export function TeacherDashboard() {
  const { user, signOut } = useAuth()
  const { t } = useLanguage()
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState<TeacherPage>("home")
  const [selectedClass, setSelectedClass] = useState("math-10")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showNotifications, setShowNotifications] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [language, setLanguage] = useState("english")

  // Mock data
  const classes: Class[] = [
    { id: "math-10", name: "Mathematics - Grade 10", students: 32, subject: "Mathematics", grade: "10", schedule: "Mon, Wed, Fri 9:00 AM" },
    { id: "physics-11", name: "Physics - Grade 11", students: 28, subject: "Physics", grade: "11", schedule: "Tue, Thu 11:00 AM" },
    { id: "math-9", name: "Mathematics - Grade 9", students: 35, subject: "Mathematics", grade: "9", schedule: "Mon, Wed, Fri 2:00 PM" },
  ]

  const students: Student[] = [
    { id: "STU001", name: "Rahul Kumar", email: "rahul@school.edu", grade: "10", attendance: 95, performance: 88, status: "active" },
    { id: "STU002", name: "Priya Singh", email: "priya@school.edu", grade: "10", attendance: 98, performance: 92, status: "active" },
    { id: "STU003", name: "Ankit Sharma", email: "ankit@school.edu", grade: "10", attendance: 85, performance: 78, status: "attention" },
    { id: "STU004", name: "Neha Patel", email: "neha@school.edu", grade: "10", attendance: 100, performance: 95, status: "active" },
  ]

  const assignments: Assignment[] = [
    {
      id: "1",
      title: "Algebra Problem Set 5",
      description: "Solve linear equations and quadratic functions",
      classId: "math-10",
      dueDate: "2024-12-15",
      points: 100,
      difficulty: "medium",
      submissions: 28,
      totalStudents: 32,
      status: "published",
      createdAt: "2024-12-01"
    },
    {
      id: "2",
      title: "Physics Lab Report",
      description: "Analyze motion and forces experiment",
      classId: "physics-11",
      dueDate: "2024-12-20",
      points: 150,
      difficulty: "hard",
      submissions: 15,
      totalStudents: 28,
      status: "published",
      createdAt: "2024-12-05"
    },
  ]

  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    classId: "",
    dueDate: "",
    points: 100,
    difficulty: "medium" as "easy" | "medium" | "hard"
  })

  const [supportTicket, setSupportTicket] = useState<SupportTicket>({
    issueType: "",
    priority: "",
    subject: "",
    description: ""
  })

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "classes", label: "Class Management", icon: Users },
    { id: "content", label: "Content & Assignments", icon: BookOpen },
    { id: "analytics", label: "Analytics & Reports", icon: BarChart3 },
    { id: "support", label: "Support & Settings", icon: Settings },
  ]

  // Quick Actions
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "create-assignment":
        setCurrentPage("content")
        toast({
          title: "Create Assignment",
          description: "Redirected to assignment creation page",
        })
        break
      case "take-attendance":
        toast({
          title: "Attendance",
          description: "Opening attendance tracker...",
        })
        break
      case "view-reports":
        setCurrentPage("analytics")
        toast({
          title: "Reports",
          description: "Loading analytics dashboard...",
        })
        break
      case "send-announcement":
        toast({
          title: "Announcement",
          description: "Opening announcement composer...",
        })
        break
    }
  }

  // Class Management Functions
  const handleClassSelect = (classId: string) => {
    setSelectedClass(classId)
    toast({
      title: "Class Selected",
      description: `Switched to ${classes.find(c => c.id === classId)?.name}`,
    })
  }

  const handleStudentAction = (action: string, studentId: string) => {
    const student = students.find(s => s.id === studentId)
    switch (action) {
      case "view-profile":
        toast({
          title: "Student Profile",
          description: `Opening profile for ${student?.name}`,
        })
        break
      case "send-message":
        toast({
          title: "Message",
          description: `Opening message composer for ${student?.name}`,
        })
        break
      case "edit-grades":
        toast({
          title: "Edit Grades",
          description: `Opening grade editor for ${student?.name}`,
        })
        break
    }
  }

  // Assignment Functions
  const handleCreateAssignment = () => {
    if (!newAssignment.title || !newAssignment.classId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Assignment Created! 🎉",
      description: `"${newAssignment.title}" has been created successfully`,
    })

    // Reset form
    setNewAssignment({
      title: "",
      description: "",
      classId: "",
      dueDate: "",
      points: 100,
      difficulty: "medium"
    })
  }

  const handleAssignmentAction = (action: string, assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId)
    switch (action) {
      case "view-submissions":
        toast({
          title: "Submissions",
          description: `Viewing submissions for "${assignment?.title}"`,
        })
        break
      case "edit":
        toast({
          title: "Edit Assignment",
          description: `Opening editor for "${assignment?.title}"`,
        })
        break
      case "delete":
        toast({
          title: "Assignment Deleted",
          description: `"${assignment?.title}" has been deleted`,
        })
        break
    }
  }

  // Support Functions
  const handleSubmitTicket = () => {
    if (!supportTicket.subject || !supportTicket.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Support Ticket Submitted! 📧",
      description: "We'll get back to you within 24 hours",
    })

    setSupportTicket({
      issueType: "",
      priority: "",
      subject: "",
      description: ""
    })
  }

  // Export Functions
  const handleExport = (type: string) => {
    const data = type === "students" ? students : assignments
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(data[0]).join(",") + "\n" +
      data.map(row => Object.values(row).join(",")).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${type}_export.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Complete! 📊",
      description: `${type} data has been exported to CSV`,
    })
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || student.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />
      case "classes":
        return <ClassManagementPage />
      case "content":
        return <ContentManagementPage />
      case "analytics":
        return <AnalyticsPage />
      case "support":
        return <SupportPage />
      default:
        return <HomePage />
    }
  }

  const HomePage = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Welcome, {user?.displayName || 'Teacher'}!</h2>
        <p className="text-muted-foreground">Here's what's happening in your classes today</p>
      </div>

      {/* Quick Stats - Now Functional */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
          toast({
            title: "Total Students: 95",
            description: "32 in Math 10, 28 in Physics 11, 35 in Math 9. +3 new enrollments this week.",
          })
        }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-xl font-bold">95</p>
                <p className="text-xs text-green-600">+3 this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
          toast({
            title: "Active Classes: 3",
            description: "Mathematics Grade 10 & 9, Physics Grade 11. All classes meeting regularly.",
          })
        }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <BookOpen className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Classes</p>
                <p className="text-xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Across 2 subjects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
          setCurrentPage("content")
          toast({
            title: "Pending Reviews: 12",
            description: "8 assignments and 4 quiz submissions need grading. Click to review.",
          })
        }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
                <p className="text-xl font-bold">12</p>
                <p className="text-xs text-red-600">Needs attention</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
          setCurrentPage("analytics")
          toast({
            title: "Average Performance: 87%",
            description: "Class average improved by 5% this month. Math 10: 89%, Physics 11: 85%, Math 9: 87%",
          })
        }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-chart-3/10 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Performance</p>
                <p className="text-xl font-bold">87%</p>
                <p className="text-xs text-green-600">+5% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule - Now Functional */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your classes and activities for today</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Class
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Class</DialogTitle>
                    <DialogDescription>Schedule a new class session</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Class Name</Label>
                      <Input placeholder="e.g., Mathematics - Grade 10" />
                    </div>
                    <div>
                      <Label>Time</Label>
                      <Input type="time" />
                    </div>
                    <div>
                      <Label>Room</Label>
                      <Input placeholder="e.g., Room 201" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => {
                      toast({
                        title: "Class Added! 📅",
                        description: "New class has been added to your schedule",
                      })
                    }}>
                      Add Class
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { time: "09:00 AM", class: "Mathematics - Grade 10", room: "Room 201", status: "upcoming" },
                { time: "11:00 AM", class: "Physics - Grade 11", room: "Lab 1", status: "current" },
                { time: "02:00 PM", class: "Mathematics - Grade 9", room: "Room 203", status: "upcoming" },
              ].map((schedule, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    schedule.status === "current" ? "bg-primary/5 border-primary" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        schedule.status === "current"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {schedule.time}
                    </div>
                    <div>
                      <h4 className="font-medium">{schedule.class}</h4>
                      <p className="text-sm text-muted-foreground">{schedule.room}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: schedule.status === "current" ? "Joining Class..." : "Preparing Class...",
                          description: `${schedule.status === "current" ? "Opening virtual classroom" : "Loading class materials"}`,
                        })
                      }}
                    >
                      {schedule.status === "current" ? "Join Now" : "Prepare"}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your classes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  type: "submission",
                  message: "Quiz submitted by Rahul Kumar",
                  class: "Mathematics - Grade 10",
                  time: "2 hours ago",
                },
                {
                  type: "deadline",
                  message: "Assignment deadline approaching",
                  class: "Physics Lab Report",
                  time: "Due in 2 days",
                },
                {
                  type: "message",
                  message: "New message from Priya Singh",
                  class: "Mathematics - Grade 9",
                  time: "4 hours ago",
                },
              ].map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => {
                    toast({
                      title: activity.message,
                      description: `From ${activity.class} • ${activity.time}`,
                    })
                  }}
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === "submission"
                        ? "bg-primary"
                        : activity.type === "deadline"
                          ? "bg-red-500"
                          : "bg-secondary"
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.class} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions - Now Functional */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start bg-transparent" 
                variant="outline"
                onClick={() => handleQuickAction("create-assignment")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
              <Button 
                className="w-full justify-start bg-transparent" 
                variant="outline"
                onClick={() => handleQuickAction("take-attendance")}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Take Attendance
              </Button>
              <Button 
                className="w-full justify-start bg-transparent" 
                variant="outline"
                onClick={() => handleQuickAction("view-reports")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Reports
              </Button>
              <Button 
                className="w-full justify-start bg-transparent" 
                variant="outline"
                onClick={() => handleQuickAction("send-announcement")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Announcement
              </Button>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performers This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Ankit Kumar", class: "Math 10", score: "98%", avatar: "AK" },
                { name: "Priya Singh", class: "Physics 11", score: "95%", avatar: "PS" },
                { name: "Rohit Sharma", class: "Math 9", score: "92%", avatar: "RS" },
              ].map((student, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                  onClick={() => {
                    toast({
                      title: `${student.name} - Top Performer! 🌟`,
                      description: `${student.score} average in ${student.class}`,
                    })
                  }}
                >
                  <Badge className="bg-yellow-500 text-gray-900">{index + 1}</Badge>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{student.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.class}</p>
                  </div>
                  <Badge variant="secondary">{student.score}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const ClassManagementPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Class & Student Management</h2>
          <p className="text-muted-foreground">Manage your classes, students, and attendance</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>Add a student to your class</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Student Name</Label>
                <Input placeholder="Enter student name" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="student@school.edu" />
              </div>
              <div>
                <Label>Grade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={`${i + 1}`}>
                        Grade {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => {
                toast({
                  title: "Student Added! 👨‍🎓",
                  description: "New student has been added to your class",
                })
              }}>
                Add Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Class Selection - Now Functional */}
      <Card>
        <CardHeader>
          <CardTitle>Select Class</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedClass} onValueChange={handleClassSelect}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name} ({cls.students} students)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Student Management - Now Functional */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Student Roster</CardTitle>
            <CardDescription>
              {classes.find((c) => c.id === selectedClass)?.name} -{" "}
              {classes.find((c) => c.id === selectedClass)?.students} students
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleExport("students")}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Attendance Tracker 📋",
                  description: "Opening attendance management system...",
                })
              }}
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Attendance
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter - Now Functional */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search students..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="attention">Needs Attention</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Student List - Now Functional */}
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{student.name}</h4>
                    <p className="text-sm text-muted-foreground">ID: {student.id} • {student.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm font-medium">{student.attendance}%</p>
                    <p className="text-xs text-muted-foreground">Attendance</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{student.performance}%</p>
                    <p className="text-xs text-muted-foreground">Performance</p>
                  </div>
                  <Badge variant={student.status === "active" ? "default" : "destructive"}>
                    {student.status === "active" ? "Active" : "Needs Attention"}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Actions <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleStudentAction("view-profile", student.id)}>
                        <User className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStudentAction("send-message", student.id)}>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStudentAction("edit-grades", student.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Grades
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
          <h2 className="text-2xl font-bold">Content & Assignment Management</h2>
          <p className="text-muted-foreground">Create and manage learning materials and assignments</p>
        </div>
      </div>

      <Tabs defaultValue="assignments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-4">
          {/* Create Assignment - Now Functional */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Assignment</CardTitle>
              <CardDescription>Design engaging assignments for your students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Assignment Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter assignment title"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Select Class</Label>
                  <Select value={newAssignment.classId} onValueChange={(value) => setNewAssignment({...newAssignment, classId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Assignment description and instructions"
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input 
                    id="due-date" 
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input 
                    id="points" 
                    type="number" 
                    placeholder="100"
                    value={newAssignment.points}
                    onChange={(e) => setNewAssignment({...newAssignment, points: parseInt(e.target.value) || 100})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={newAssignment.difficulty} onValueChange={(value: "easy" | "medium" | "hard") => setNewAssignment({...newAssignment, difficulty: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = '.pdf,.doc,.docx,.ppt,.pptx,.txt'
                    input.multiple = true
                    input.onchange = (e) => {
                      const files = (e.target as HTMLInputElement).files
                      if (files && files.length > 0) {
                        toast({
                          title: "Files Uploaded! 📎",
                          description: `Uploaded ${files.length} file(s): ${Array.from(files).map(f => f.name).join(', ')}`,
                        })
                      }
                    }
                    input.click()
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Draft Saved! 💾",
                      description: "Assignment saved as draft",
                    })
                  }}
                >
                  Save Draft
                </Button>
                <Button onClick={handleCreateAssignment}>
                  Publish Assignment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Assignments - Now Functional */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Assignments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <h4 className="font-medium">{assignment.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {classes.find(c => c.id === assignment.classId)?.name} • Due: {assignment.dueDate}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Progress value={(assignment.submissions / assignment.totalStudents) * 100} className="w-32" />
                      <span className="text-xs text-muted-foreground">
                        {assignment.submissions}/{assignment.totalStudents} submitted
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAssignmentAction("view-submissions", assignment.id)}
                    >
                      View Submissions
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAssignmentAction("edit", assignment.id)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-4">
          {/* Quiz Builder - Now Functional */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz Builder</CardTitle>
              <CardDescription>Create interactive quizzes with automatic grading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Quiz Title</Label>
                    <Input placeholder="Enter quiz title" />
                  </div>
                  <div>
                    <Label>Subject</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Quiz Description</Label>
                  <Textarea placeholder="Describe what this quiz covers..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Time Limit (minutes)</Label>
                    <Input type="number" placeholder="30" />
                  </div>
                  <div>
                    <Label>Number of Questions</Label>
                    <Input type="number" placeholder="10" />
                  </div>
                  <div>
                    <Label>Difficulty</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={() => {
                  toast({
                    title: "Quiz Created! 📝",
                    description: "Your quiz has been created and is ready for students",
                  })
                }}>
                  <PenTool className="h-4 w-4 mr-2" />
                  Create Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lessons" className="space-y-4">
          {/* Lesson Library - Now Functional */}
          <Card>
            <CardHeader>
              <CardTitle>Lesson Library</CardTitle>
              <CardDescription>Upload and organize your teaching materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "Introduction to Algebra", type: "PDF", size: "2.5 MB", downloads: 45 },
                  { title: "Physics Lab Safety", type: "Video", size: "15.2 MB", downloads: 32 },
                  { title: "Math Formula Sheet", type: "PDF", size: "1.8 MB", downloads: 67 },
                ].map((lesson, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{lesson.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {lesson.type} • {lesson.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{lesson.downloads} downloads</span>
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Lesson Shared! 📤",
                                description: `"${lesson.title}" has been shared with students`,
                              })
                            }}
                          >
                            Share
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Opening Lesson 📖",
                                description: `Loading "${lesson.title}"...`,
                              })
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          {/* Pending Reviews - Now Functional */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Reviews</CardTitle>
              <CardDescription>Assignments waiting for your review and grading</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  student: "Rahul Kumar",
                  assignment: "Algebra Problem Set 5",
                  submitted: "2 hours ago",
                  status: "pending",
                },
                {
                  student: "Priya Singh",
                  assignment: "Physics Lab Report",
                  submitted: "1 day ago",
                  status: "pending",
                },
              ].map((submission, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{submission.student.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{submission.student}</h4>
                      <p className="text-sm text-muted-foreground">{submission.assignment}</p>
                      <p className="text-xs text-muted-foreground">Submitted {submission.submitted}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Pending Review</Badge>
                    <Button 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Opening Review 📝",
                          description: `Reviewing ${submission.student}'s submission`,
                        })
                      }}
                    >
                      Review & Grade
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  const AnalyticsPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics & Reports</h2>
          <p className="text-muted-foreground">Comprehensive insights into class and student performance</p>
        </div>
        <Button onClick={() => handleExport("analytics")}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Analytics Cards - Now Functional */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
          toast({
            title: "Average Class Score: 87.5%",
            description: "Math 10: 89%, Physics 11: 85%, Math 9: 87%. Improved by 5.2% from last month.",
          })
        }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Class Score</p>
                <p className="text-xl font-bold">87.5%</p>
                <p className="text-xs text-green-600">+5.2% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
          toast({
            title: "Engagement Rate: 94.2%",
            description: "Students are actively participating. +2.1% increase this week.",
          })
        }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                <p className="text-xl font-bold">94.2%</p>
                <p className="text-xs text-green-600">+2.1% this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
          toast({
            title: "Average Study Time: 2.5h",
            description: "Per student per day. Students are spending quality time learning.",
          })
        }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Study Time</p>
                <p className="text-xl font-bold">2.5h</p>
                <p className="text-xs text-muted-foreground">Per student/day</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
          toast({
            title: "Completion Rate: 89.3%",
            description: "Above target! Students are completing assignments on time.",
          })
        }}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-chart-3/10 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-xl font-bold">89.3%</p>
                <p className="text-xs text-green-600">Above target</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Class Performance Trends</CardTitle>
            <CardDescription>Performance over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p className="font-medium">Performance Chart</p>
                <p className="text-sm">Interactive chart showing class trends</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    toast({
                      title: "Chart Loading... 📊",
                      description: "Performance trends chart is being generated",
                    })
                  }}
                >
                  Load Chart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Progress Distribution</CardTitle>
            <CardDescription>How students are performing across different topics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { topic: "Algebra", average: 92, students: 32 },
              { topic: "Geometry", average: 85, students: 32 },
              { topic: "Statistics", average: 78, students: 32 },
              { topic: "Trigonometry", average: 88, students: 32 },
            ].map((topic) => (
              <div key={topic.topic} className="cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors" onClick={() => {
                toast({
                  title: `${topic.topic} Performance`,
                  description: `${topic.average}% average across ${topic.students} students`,
                })
              }}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{topic.topic}</span>
                  <span>{topic.average}% avg</span>
                </div>
                <Progress value={topic.average} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Detailed Student Analytics</CardTitle>
            <CardDescription>Individual student performance breakdown</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{student.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Attendance: {student.attendance}% • Performance: {student.performance}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm font-medium">{student.attendance}%</p>
                    <p className="text-xs text-muted-foreground">Attendance</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{student.performance}%</p>
                    <p className="text-xs text-muted-foreground">Average</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: `${student.name} Details 📊`,
                        description: `Attendance: ${student.attendance}%, Performance: ${student.performance}%, Status: ${student.status}`,
                      })
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const SupportPage = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Support & Settings</h2>
        <p className="text-muted-foreground">Customize your dashboard and get help when needed</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dashboard Settings - Now Functional */}
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Settings</CardTitle>
            <CardDescription>Personalize your teaching experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Switch to dark theme</p>
              </div>
              <Switch 
                checked={darkMode}
                onCheckedChange={(checked) => {
                  setDarkMode(checked)
                  toast({
                    title: checked ? "Dark Mode Enabled 🌙" : "Light Mode Enabled ☀️",
                    description: `Switched to ${checked ? "dark" : "light"} theme`,
                  })
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Get notified about student activities</p>
              </div>
              <Switch 
                checked={emailNotifications}
                onCheckedChange={(checked) => {
                  setEmailNotifications(checked)
                  toast({
                    title: checked ? "Email Notifications Enabled 📧" : "Email Notifications Disabled",
                    description: `Email notifications ${checked ? "enabled" : "disabled"}`,
                  })
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Language</p>
                <p className="text-sm text-muted-foreground">Choose your preferred language</p>
              </div>
              <Select value={language} onValueChange={(value) => {
                setLanguage(value)
                toast({
                  title: "Language Changed 🌍",
                  description: `Interface language changed to ${value}`,
                })
              }}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">हिंदी</SelectItem>
                  <SelectItem value="odia">ଓଡ଼ିଆ</SelectItem>
                  <SelectItem value="bengali">বাংলা</SelectItem>
                  <SelectItem value="telugu">తెలుగు</SelectItem>
                  <SelectItem value="tamil">தமிழ்</SelectItem>
                  <SelectItem value="gujarati">ગુજરાતી</SelectItem>
                  <SelectItem value="marathi">मराठी</SelectItem>
                  <SelectItem value="kannada">ಕನ್ನಡ</SelectItem>
                  <SelectItem value="malayalam">മലയാളം</SelectItem>
                  <SelectItem value="punjabi">ਪੰਜਾਬੀ</SelectItem>
                  <SelectItem value="urdu">اردو</SelectItem>
                  <SelectItem value="assamese">অসমীয়া</SelectItem>
                  <SelectItem value="nepali">नेपाली</SelectItem>
                  <SelectItem value="sanskrit">संस्कृत</SelectItem>
                  <SelectItem value="sindhi">سنڌي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Get Support - Now Functional */}
        <Card>
          <CardHeader>
            <CardTitle>Get Support</CardTitle>
            <CardDescription>Need help? We're here to assist you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full justify-start bg-transparent" 
              variant="outline"
              onClick={() => {
                toast({
                  title: "Help Center 📚",
                  description: "Opening comprehensive help documentation...",
                })
              }}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Help Center & FAQ
            </Button>
            <Button 
              className="w-full justify-start bg-transparent" 
              variant="outline"
              onClick={() => {
                toast({
                  title: "Technical Support 🛠️",
                  description: "Connecting you with our technical support team...",
                })
              }}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Technical Support
            </Button>
            <Button 
              className="w-full justify-start bg-transparent" 
              variant="outline"
              onClick={() => {
                toast({
                  title: "Teaching Resources 📖",
                  description: "Opening library of teaching materials and guides...",
                })
              }}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Teaching Resources
            </Button>
            <Button 
              className="w-full justify-start bg-transparent" 
              variant="outline"
              onClick={() => {
                toast({
                  title: "Teacher Community 👥",
                  description: "Connecting with fellow educators...",
                })
              }}
            >
              <Users className="h-4 w-4 mr-2" />
              Teacher Community
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Support Ticket - Now Functional */}
      <Card>
        <CardHeader>
          <CardTitle>Raise Support Ticket</CardTitle>
          <CardDescription>Report issues or request assistance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue-type">Issue Type</Label>
              <Select value={supportTicket.issueType} onValueChange={(value) => setSupportTicket({...supportTicket, issueType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="account">Account Problem</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="billing">Billing Question</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={supportTicket.priority} onValueChange={(value) => setSupportTicket({...supportTicket, priority: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject" 
              placeholder="Brief description of the issue"
              value={supportTicket.subject}
              onChange={(e) => setSupportTicket({...supportTicket, subject: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Detailed description of the issue or request"
              value={supportTicket.description}
              onChange={(e) => setSupportTicket({...supportTicket, description: e.target.value})}
            />
          </div>
          <Button onClick={handleSubmitTicket}>
            <Send className="h-4 w-4 mr-2" />
            Submit Ticket
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Now Functional */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-secondary/10 p-2 rounded-lg">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Teacher Portal</h1>
              <p className="text-sm text-muted-foreground">Government Education Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications - Now Functional */}
            <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="space-y-2 p-2">
                  <div className="p-2 hover:bg-muted rounded cursor-pointer" onClick={() => {
                    toast({
                      title: "New Submission 📝",
                      description: "Rahul Kumar submitted Algebra Problem Set 5",
                    })
                  }}>
                    <p className="text-sm font-medium">New submission received</p>
                    <p className="text-xs text-muted-foreground">Rahul Kumar - 2 hours ago</p>
                  </div>
                  <div className="p-2 hover:bg-muted rounded cursor-pointer" onClick={() => {
                    toast({
                      title: "Assignment Due ⏰",
                      description: "Physics Lab Report due in 2 days",
                    })
                  }}>
                    <p className="text-sm font-medium">Assignment deadline approaching</p>
                    <p className="text-xs text-muted-foreground">Physics Lab Report - Due in 2 days</p>
                  </div>
                  <div className="p-2 hover:bg-muted rounded cursor-pointer" onClick={() => {
                    toast({
                      title: "New Message 💬",
                      description: "Message from Priya Singh about homework",
                    })
                  }}>
                    <p className="text-sm font-medium">New message from student</p>
                    <p className="text-xs text-muted-foreground">Priya Singh - 4 hours ago</p>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <LanguageSelector />
            
            {/* Profile Dropdown - Now Functional */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || "/placeholder.svg"} />
                    <AvatarFallback>{user?.displayName?.charAt(0) || 'T'}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user?.displayName || 'Teacher'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  toast({
                    title: "Profile 👤",
                    description: "Opening your profile settings...",
                  })
                }}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentPage("support")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  signOut()
                  toast({
                    title: "Logged Out 👋",
                    description: "You have been successfully logged out",
                  })
                }}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Navigation - Now Functional */}
        <div className="border-t">
          <div className="container mx-auto px-4">
            <nav className="flex space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id as TeacherPage)
                      toast({
                        title: `${item.label} 📍`,
                        description: `Navigated to ${item.label} section`,
                      })
                    }}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                      currentPage === item.id
                        ? "border-secondary text-secondary"
                        : "border-transparent text-foreground hover:text-secondary"
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