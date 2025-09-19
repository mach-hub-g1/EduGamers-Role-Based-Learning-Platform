"use client"

import { useState, useEffect } from "react"
import { StudentDashboard } from "@/components/dashboards/student-dashboard"
import { TeacherDashboard } from "@/components/dashboards/teacher-dashboard"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LanguageSelector } from "@/components/ui/language-selector"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import {
  GraduationCap,
  Users,
  Building2,
  Gamepad2,
  BarChart3,
  Trophy,
  UserCheck,
  FileText,
  PieChart,
  School,
  Settings,
  ArrowRight,
  ArrowLeft,
  Star,
  Zap,
  Globe,
  Target,
  Award,
  BookOpen,
  Sparkles,
  Heart,
  CheckCircle,
  PlayCircle,
  Lightbulb,
  Rocket,
  Shield,
  Clock,
  TrendingUp,
  Quote,
} from "lucide-react"

function RoleSelectionPage({ onRoleSelect }: { onRoleSelect: (role: string) => void }) {
  const { t } = useLanguage()
  const [animatedCounts, setAnimatedCounts] = useState({ students: 0, teachers: 0, schools: 0, languages: 0 })
  const [isVisible, setIsVisible] = useState(false)

  // Animated counter effect
  useEffect(() => {
    setIsVisible(true)
    const targets = { students: 50000, teachers: 2000, schools: 500, languages: 10 }
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    let step = 0
    const interval = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedCounts({
        students: Math.floor(targets.students * easeOut),
        teachers: Math.floor(targets.teachers * easeOut),
        schools: Math.floor(targets.schools * easeOut),
        languages: Math.floor(targets.languages * easeOut),
      })

      if (step >= steps) {
        clearInterval(interval)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-accent/5 rounded-full blur-2xl animate-bounce"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-primary/30 rounded-full animate-ping`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      
      <header className="relative z-10 flex items-center justify-between p-6 backdrop-blur-sm bg-background/80">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-2xl backdrop-blur-sm border border-primary/20">
            <Gamepad2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              EduNova
            </h1>
            <p className="text-xs text-muted-foreground font-medium tracking-wide">Educational Excellence</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground bg-white/50 dark:bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse shadow-lg"></div>
            <span className="font-medium">{t('solar.status')}</span>
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg"></div>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-12">
        {/* Enhanced Hero Section */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <img 
                src="https://i.ibb.co/LDQJ6gPY/edunova-logo.png" 
                alt="EduNova Logo" 
                className="h-48 w-auto object-contain group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -inset-6 bg-gradient-to-r from-primary/30 via-secondary/20 to-accent/30 rounded-full blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
            
            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <Button asChild size="lg" className="group w-full sm:w-auto px-10 py-7 text-xl rounded-2xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105">
                <Link href="/games" className="flex items-center gap-3">
                  <Star className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                  {t('explore.games')}
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="group w-full sm:w-auto px-10 py-7 text-xl rounded-2xl border-2 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                <PlayCircle className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform duration-300" />
                {t('get.started')}
              </Button>
            </div>
          </div>
          
          {/* Feature Highlights with enhanced design */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <Card className="group border-0 bg-gradient-to-br from-blue-50/80 to-blue-100/80 dark:from-blue-950/50 dark:to-blue-900/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-8 w-8 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">Multi-Language Support</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Learn in your native language including Odia, Hindi, and 8 more regional languages</p>
                <div className="mt-4 flex justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="group border-0 bg-gradient-to-br from-green-50/80 to-green-100/80 dark:from-green-950/50 dark:to-green-900/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="h-8 w-8 text-green-600 group-hover:animate-pulse transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">AI-Powered Learning</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Smart adaptive learning paths that evolve with your progress and learning style</p>
                <div className="mt-4 flex justify-center">
                  <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="group border-0 bg-gradient-to-br from-purple-50/80 to-purple-100/80 dark:from-purple-950/50 dark:to-purple-900/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-4 rounded-2xl w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Rocket className="h-8 w-8 text-purple-600 group-hover:-translate-y-1 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">Gamified Learning</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Earn XP, unlock achievements, and compete with friends in an engaging environment</p>
                <div className="mt-4 flex justify-center">
                  <Trophy className="h-5 w-5 text-amber-500 animate-bounce" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Enhanced Role Selection Section */}
        <div className="text-center mb-16">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
              {t('platform.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('platform.subtitle')}
            </p>
          </div>
        </div>

        <div className={`grid md:grid-cols-3 gap-10 max-w-7xl mx-auto mb-20 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Enhanced Student Card */}
          <Card
            className="group p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 hover:border-primary/50 hover:scale-[1.02] bg-gradient-to-br from-white/50 to-primary/5 dark:from-gray-900/50 dark:to-primary/10 backdrop-blur-sm hover:-translate-y-2"
            onClick={() => onRoleSelect("student")}
          >
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-6 p-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl w-fit group-hover:scale-110 transition-all duration-300 group-hover:rotate-3 shadow-xl">
                <GraduationCap className="h-16 w-16 text-primary group-hover:animate-bounce" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors duration-300">
                {t('role.student')}
              </CardTitle>
              <CardDescription className="text-lg leading-relaxed mt-3">
                {t('role.student.desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-base group-hover:translate-x-2 transition-transform duration-300">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">Interactive Learning Games</span>
              </div>
              <div className="flex items-center gap-4 text-base group-hover:translate-x-2 transition-transform duration-300 delay-75">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">Real-time Progress Tracking</span>
              </div>
              <div className="flex items-center gap-4 text-base group-hover:translate-x-2 transition-transform duration-300 delay-150">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">Achievement System</span>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Teacher Card */}
          <Card
            className="group p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 hover:border-secondary/50 hover:scale-[1.02] bg-gradient-to-br from-white/50 to-secondary/5 dark:from-gray-900/50 dark:to-secondary/10 backdrop-blur-sm hover:-translate-y-2"
            onClick={() => onRoleSelect("teacher")}
          >
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-6 p-6 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-3xl w-fit group-hover:scale-110 transition-all duration-300 group-hover:rotate-3 shadow-xl">
                <Users className="h-16 w-16 text-secondary group-hover:animate-bounce" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-secondary transition-colors duration-300">
                {t('role.teacher')}
              </CardTitle>
              <CardDescription className="text-lg leading-relaxed mt-3">
                {t('role.teacher.desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-base group-hover:translate-x-2 transition-transform duration-300">
                <div className="bg-secondary/10 p-2 rounded-lg">
                  <UserCheck className="h-5 w-5 text-secondary" />
                </div>
                <span className="font-medium">Comprehensive Student Management</span>
              </div>
              <div className="flex items-center gap-4 text-base group-hover:translate-x-2 transition-transform duration-300 delay-75">
                <div className="bg-secondary/10 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-secondary" />
                </div>
                <span className="font-medium">Interactive Assignment Creation</span>
              </div>
              <div className="flex items-center gap-4 text-base group-hover:translate-x-2 transition-transform duration-300 delay-150">
                <div className="bg-secondary/10 p-2 rounded-lg">
                  <PieChart className="h-5 w-5 text-secondary" />
                </div>
                <span className="font-medium">Advanced Analytics Dashboard</span>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Government Card */}
          <Card 
            className="group p-8 hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 hover:border-accent/50 hover:scale-[1.02] bg-gradient-to-br from-white/50 to-accent/5 dark:from-gray-900/50 dark:to-accent/10 backdrop-blur-sm hover:-translate-y-2"
            onClick={() => onRoleSelect("admin")}
          >
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-6 p-6 bg-gradient-to-br from-accent/20 to-accent/10 rounded-3xl w-fit group-hover:scale-110 transition-all duration-300 group-hover:rotate-3 shadow-xl">
                <Building2 className="h-16 w-16 text-accent group-hover:animate-bounce" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-accent transition-colors duration-300">
                {t('role.government')}
              </CardTitle>
              <CardDescription className="text-lg leading-relaxed mt-3">
                {t('role.government.desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-base group-hover:translate-x-2 transition-transform duration-300">
                <div className="bg-accent/10 p-2 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-accent" />
                </div>
                <span className="font-medium">Regional Performance Analytics</span>
              </div>
              <div className="flex items-center gap-4 text-base group-hover:translate-x-2 transition-transform duration-300 delay-75">
                <div className="bg-accent/10 p-2 rounded-lg">
                  <School className="h-5 w-5 text-accent" />
                </div>
                <span className="font-medium">School Network Monitoring</span>
              </div>
              <div className="flex items-center gap-4 text-base group-hover:translate-x-2 transition-transform duration-300 delay-150">
                <div className="bg-accent/10 p-2 rounded-lg">
                  <Settings className="h-5 w-5 text-accent" />
                </div>
                <span className="font-medium">Policy Management System</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Enhanced Statistics Section with Testimonials */}
        <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Testimonials Section */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              What Our Community Says
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="group p-6 bg-gradient-to-br from-white/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-900/30 border border-blue-200/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Priya Sharma</h4>
                      <p className="text-sm text-muted-foreground">Class 8 Student</p>
                    </div>
                  </div>
                  <Quote className="h-6 w-6 text-primary/40 mb-2" />
                  <p className="text-sm italic text-gray-600 dark:text-gray-300">
                    "EduNova made learning Odia so much fun! The games help me understand concepts better than traditional methods."
                  </p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="group p-6 bg-gradient-to-br from-white/50 to-green-50/50 dark:from-gray-900/50 dark:to-green-900/30 border border-green-200/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Rajesh Kumar</h4>
                      <p className="text-sm text-muted-foreground">Mathematics Teacher</p>
                    </div>
                  </div>
                  <Quote className="h-6 w-6 text-secondary/40 mb-2" />
                  <p className="text-sm italic text-gray-600 dark:text-gray-300">
                    "The analytics dashboard helps me track each student's progress individually. It's revolutionary for rural education."
                  </p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="group p-6 bg-gradient-to-br from-white/50 to-purple-50/50 dark:from-gray-900/50 dark:to-purple-900/30 border border-purple-200/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Dr. Meena Patel</h4>
                      <p className="text-sm text-muted-foreground">Education Officer</p>
                    </div>
                  </div>
                  <Quote className="h-6 w-6 text-accent/40 mb-2" />
                  <p className="text-sm italic text-gray-600 dark:text-gray-300">
                    "EduNova's multi-language support has significantly improved learning outcomes across our district schools."
                  </p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Enhanced Platform Impact Section */}
          <div className="text-center bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-12 backdrop-blur-sm border border-white/20">
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Platform Impact
            </h3>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Transforming education across India with cutting-edge technology and localized content
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="group text-center">
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2 group-hover:animate-pulse">
                    {animatedCounts.students.toLocaleString()}+
                  </div>
                  <div className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Students
                  </div>
                  <div className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12% this month
                  </div>
                </div>
              </div>
              
              <div className="group text-center">
                <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl md:text-5xl font-bold text-secondary mb-2 group-hover:animate-pulse">
                    {animatedCounts.teachers.toLocaleString()}+
                  </div>
                  <div className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
                    <Users className="h-4 w-4" />
                    Teachers
                  </div>
                  <div className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +8% this month
                  </div>
                </div>
              </div>
              
              <div className="group text-center">
                <div className="bg-gradient-to-br from-accent/20 to-accent/10 p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl md:text-5xl font-bold text-accent mb-2 group-hover:animate-pulse">
                    {animatedCounts.schools}+
                  </div>
                  <div className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
                    <School className="h-4 w-4" />
                    Schools
                  </div>
                  <div className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +15% this month
                  </div>
                </div>
              </div>
              
              <div className="group text-center">
                <div className="bg-gradient-to-br from-orange-500/20 to-orange-500/10 p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2 group-hover:animate-pulse">
                    {animatedCounts.languages}+
                  </div>
                  <div className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
                    <Globe className="h-4 w-4" />
                    Languages
                  </div>
                  <div className="text-xs text-blue-600 mt-1 flex items-center justify-center gap-1">
                    <Shield className="h-3 w-3" />
                    Fully Supported
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Achievement Badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-12">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-6 py-3 rounded-full border border-green-500/30 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <Award className="h-5 w-5" />
                  <span className="font-medium">Best EdTech Platform 2024</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 px-6 py-3 rounded-full border border-blue-500/30 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">24/7 Learning Support</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-6 py-3 rounded-full border border-purple-500/30 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <Heart className="h-5 w-5" />
                  <span className="font-medium">98% User Satisfaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const { t } = useLanguage()

  const handleBackToHome = () => {
    setSelectedRole(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {!selectedRole ? (
        <>
          <RoleSelectionPage onRoleSelect={setSelectedRole} />
        </>
      ) : (
        <div className="relative">
          {/* Back Button */}
          <div className="absolute top-4 left-4 z-10">
            <Button 
              variant="ghost" 
              onClick={handleBackToHome}
              className="flex items-center gap-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('back')}
            </Button>
          </div>
          
          {/* Dashboard Content */}
          {selectedRole === 'student' ? (
            <StudentDashboard />
          ) : selectedRole === 'teacher' ? (
            <TeacherDashboard />
          ) : (
            <AdminDashboard />
          )}
        </div>
      )}
    </div>
  )
}
