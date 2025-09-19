"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import dynamic from 'next/dynamic'
import { useAuth } from "@/lib/auth-context"
import { UserProgress } from "@/lib/firestore-services"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { updateProfile } from "firebase/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LanguageSelector } from "@/components/ui/language-selector"
import { useLanguage } from "@/lib/language-context"
// Custom progress bar component
const Progress = ({ value, className = "" }: { value: number; className?: string }) => (
  <div className={`bg-muted rounded-full h-2 w-full overflow-hidden ${className}`}>
    <div 
      className="bg-primary h-full rounded-full transition-all duration-300" 
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
)
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Flame, Gift, LogOut, Clock, FileText, Video, Headphones, Target as TargetIcon, Play, Bookmark } from "lucide-react"
import {
  BookOpen,
  Trophy,
  Target,
  Zap,
  Bell,
  Home,
  Gamepad2,
  BarChart3,
  Timer,
  ChevronDown,
  Calendar,
  HelpCircle,
  Brain,
  Settings,
  Volume2,
  Sun,
  Moon,
  Languages,
  User,
  MessageCircle,
  PieChart,
  Coins,
  Camera,
  Sparkles,
  Heart,
  GraduationCap,
  School,
  Eye
} from "lucide-react"
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Import our new components
import { AIQuestInterface } from '@/components/quests/ai-quest-interface'
import { EduCoinSystem } from '@/components/scholarships/edu-coin-system'
// import { VoiceGestureInterface } from '@/components/accessibility/voice-gesture-interface' // Removed
import { ARClassroom } from '@/components/ar/ar-classroom'
import NextGenGamificationHub from '@/components/gamification/next-gen-gamification-hub'
import AIVoiceTutorInterface from '@/components/ai-mentor/ai-voice-tutor-interface'
import AccessibilityHub from '@/components/accessibility/accessibility-hub'
import ImpactMeasurementDashboard from '@/components/impact/impact-measurement-dashboard'
import CulturalPreservationHub from '@/components/cultural/cultural-preservation-hub'

// Define HeatmapData type for the performance heatmap
interface HeatmapData {
  date: string;
  value: number;
  level: 0 | 1 | 2 | 3 | 4;
}

// Extended UserProgress with additional properties used in the dashboard
type ExtendedUserProgress = UserProgress & {
  // Add any additional properties that might be used in the dashboard
  coins?: number;
  recentActivity?: string[];
  totalXP?: number;
  xpToNextLevel?: number;
  streakDays?: number;
};

interface ReviewingMaterial {
  material: {
    id: string;
    title: string;
    type: string;
    duration: string;
    description: string;
  };
  subject: {
    id: string;
    name: string;
  };
}

import { useFirestoreProgress } from "@/hooks/use-firestore-progress"
import { getLeaderboard } from "@/lib/firestore-services"
import { RewardStore } from "@/components/gamification/reward-store"
import { PerformanceHeatmap } from "@/components/analytics/performance-heatmap"
import { fcmService } from "@/lib/fcm-service"
import { StudentSettings } from "@/components/settings/student-settings"
import { SubjectManager } from "@/components/subjects/subject-manager"
import { ComprehensiveGameHub } from "@/components/games/comprehensive-game-hub"
import { GoalTracker } from "@/components/goals/goal-tracker-fixed"

const StudentProfile = dynamic(
  () => import('@/components/profile/student-profile').then(mod => mod.StudentProfile),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
);



type StudentPage = "home" | "lessons" | "games" | "profile" | "settings" | "pomodoro-timer" | "quests" | "educoins" | "ar-classroom" | "next-gen-hub" | "ai-tutor" | "accessibility" | "impact-dashboard" | "cultural-hub"

interface Challenge {
  id: string
  task: string
  xp: number
  completed: boolean
  emoji: string
}

interface Subject {
  id: string
  subject: string
  progress: number
  level: number
  unlocked: boolean
  color: string
  emoji: string
}

interface Quiz {
  id: string
  title: string
  time: string
  questions: number
  difficulty: string
  emoji: string
  completed: boolean
}

export { StudentDashboard }
interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  children?: NavItem[]
}

export default function StudentDashboard() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { t } = useLanguage()
  const { toast } = useToast();
  const { progress, loading } = useFirestoreProgress(user?.uid);
  
  const [currentPage, setCurrentPage] = useState<StudentPage>("home");
  
  // Debug user authentication
  useEffect(() => {
    if (user) {
      console.log('User state changed:', {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        isAnonymous: user.isAnonymous,
        photoURL: user.photoURL
      });
    }
  }, [user]);
  
  // Debug progress data
  useEffect(() => {
    console.log('StudentDashboard: Progress data changed:', {
      progress,
      loading,
      hasProgressData: !!progress,
      progressKeys: progress ? Object.keys(progress) : [],
      subjects: progress?.subjects
    });
  }, [progress, loading]);
  
  // Handle escape key for closing modals
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowGoalTracker(false);
        setShowProgressDashboard(false);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id: string; message: string; date: string; read: boolean}>>([
    // Example notification - can be removed or kept as a placeholder
    // {
    //   id: '1',
    //   message: 'Welcome to EduNova! Start your learning journey now.',
    //   date: 'Just now',
    //   read: false
    // }
  ]);
  const [leaderboard, setLeaderboard] = useState<Array<{id: string; name: string; xp: number}>>([]);
  
  // Review state
  const [reviewingMaterial, setReviewingMaterial] = useState<ReviewingMaterial | null>(null);
  const [isTimerRunning] = useState(false)
  const [showGoalTracker, setShowGoalTracker] = useState(false)
  const [showProgressDashboard, setShowProgressDashboard] = useState(false)

  // Transform progress to include additional properties
  const extendedProgress = progress ? {
    ...progress,
    level: 1, // Force level to be 1
    totalXP: progress.xp, // Map xp to totalXP for compatibility
    xpToNextLevel: 100 - (progress.xp % 100), // Calculate xp to next level (always 100 XP per level)
    coins: Math.floor(progress.xp / 10), // Calculate coins based on xp
    recentActivity: [], // Initialize empty recent activity
    streakDays: progress.streak, // Alias streak to streakDays
  } : null;
  
  const currentStreak = extendedProgress?.streak ?? 0;
  const level = 1; // Always start at level 1
  const rewards = Math.floor((extendedProgress?.xp || 0) / 10) || 0;
  
  // Data for the pie chart
  const completedXP = extendedProgress ? extendedProgress.xp % 100 : 0;
  const remainingXP = extendedProgress ? (extendedProgress.xpToNextLevel || 100) : 100;
  
  const progressData = [
    { name: 'Completed', value: completedXP, color: '#3b82f6' },
    { name: 'Remaining', value: remainingXP, color: '#e5e7eb' },
  ];
  
  // Helper function to safely access UserProgress properties
  const getProgressValue = <T extends keyof ExtendedUserProgress>(
    key: T,
    defaultValue: ExtendedUserProgress[T] = 0 as ExtendedUserProgress[T]
  ): ExtendedUserProgress[T] => {
    return extendedProgress?.[key] ?? defaultValue;
  };
  
  // Helper function to transform subject data for the UI
  const transformSubjectData = (subjects: UserProgress['subjects'] = {}) => {
    return Object.entries(subjects).map(([id, data]) => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      progress: data.progress,
      level: 1, // Set subject level to 1
      completedLessons: data.lessonsCompleted || 0,
      totalLessons: (data.lessonsCompleted || 0) + 5, // Assuming 5 more lessons to complete
    }));
  };

  // Generate weekly progress data based on user activity
  const weeklyProgress: HeatmapData[] = [
    { date: '2023-01-01', value: 120, level: 1 },
    { date: '2023-01-02', value: 85, level: 1 },
    { date: '2023-01-03', value: 150, level: 1 },
    { date: '2023-01-04', value: 95, level: 1 },
    { date: '2023-01-05', value: 180, level: 1 },
    { date: '2023-01-06', value: 200, level: 1 },
    { date: '2023-01-07', value: 110, level: 1 },
  ]

  interface SubjectAnalytics {
    subject: string;
    completed: number;
    total: number;
    accuracy: number;
    timeSpent: number;
  }

  const subjectAnalytics: SubjectAnalytics[] = extendedProgress?.subjects
    ? Object.entries(extendedProgress.subjects).map(([key, data]) => ({
        subject: key.charAt(0).toUpperCase() + key.slice(1),
        completed: data.lessonsCompleted || 0,
        total: (data.lessonsCompleted || 0) + Math.floor(Math.random() * 20) + 10,
        accuracy: Math.min(95, 75 + Math.floor((data.xp || 0) / 10)),
        timeSpent: (data.lessonsCompleted || 0) * 15,
      }))
    : [];

  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: "1", task: "Complete 3 Math quizzes", xp: 50, completed: false, emoji: "🧮" },
    { id: "2", task: "Read 2 Science chapters", xp: 30, completed: true, emoji: "🔬" },
    { id: "3", task: "Practice English vocabulary", xp: 25, completed: false, emoji: "📚" },
  ])

  const subjects = progress
    ? Object.entries(progress.subjects).map(([key, data]) => {
        console.log(`Subject ${key}:`, data); // Debug log
        return {
          id: key,
          subject: key.charAt(0).toUpperCase() + key.slice(1),
          progress: data.progress,
          level: Math.floor(data.xp / 100) + 1,
          unlocked: data.progress > 0 || key === "mathematics",
          color: key === "mathematics" ? "primary" : key === "science" ? "secondary" : "accent",
          emoji: key === "mathematics" ? "🧮" : key === "science" ? "🔬" : key === "english" ? "📚" : "🏛️",
        };
      })
    : []

  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: "1",
      title: "Algebra Quick Quiz",
      time: "5 min",
      questions: 10,
      difficulty: "Easy",
      emoji: "🔢",
      completed: false,
    },
    {
      id: "2",
      title: "Physics Challenge",
      time: "15 min",
      questions: 20,
      difficulty: "Hard",
      emoji: "⚡",
      completed: false,
    },
    {
      id: "3",
      title: "English Grammar",
      time: "8 min",
      questions: 15,
      difficulty: "Medium",
      emoji: "✍️",
      completed: false,
    },
  ])

  const completeChallenge = async (challengeId: string) => {
    const challenge = challenges.find((c) => c.id === challengeId)
    if (challenge && !challenge.completed) {
      setChallenges((prev) => prev.map((c) => (c.id === challengeId ? { ...c, completed: true } : c)))
      toast({
        title: "🎉 Challenge Complete!",
        description: `Great job completing the challenge! ${challenge.emoji}`,
      })
    }
  }

  const completeQuiz = async (quizId: string) => {
    const quiz = quizzes.find((q) => q.id === quizId)
    if (quiz && !quiz.completed) {
      toast({
        title: "🎉 Quiz Completed!",
        description: `Great job completing the ${quiz.title} quiz!`,
      })
    }
  }

  const completeLesson = async (lessonId: string) => {
    const lesson = subjects.find((l) => l.id === lessonId)
    if (lesson) {
      toast({
        title: "📚 Lesson Completed!",
        description: `Great job completing the ${lesson.subject} lesson!`,
      })
    }
  }

  const startQuiz = (quizId: string) => {
    const quiz = quizzes.find((q) => q.id === quizId)
    if (quiz) {
      toast({
        title: `${quiz.emoji} Starting ${quiz.title}`,
        description: `Get ready for ${quiz.questions} questions in ${quiz.time}!`,
      })
      // Simulate quiz completion after 3 seconds
      setTimeout(() => {
        setQuizzes((prev) => prev.map((q) => (q.id === quizId ? { ...q, completed: true } : q)))
        toast({
          title: `🏆 Quiz Complete!`,
          description: `Excellent work!`,
        })
      }, 3000)
    }
  }

  const navItems: NavItem[] = [
    { id: "home", label: t('home') || "Home", icon: Home },
    { id: "next-gen-hub", label: "🌟 Next-Gen Hub", icon: Sparkles },
    { id: "ai-tutor", label: "🤖 AI Tutor", icon: Brain },
    { id: "lessons", label: t('lessons') || "Lessons", icon: BookOpen },
    { id: "games", label: t('games') || "Games", icon: Gamepad2 },
    { id: "quests", label: "AI Quests", icon: Sparkles },
    { id: "educoins", label: "EduCoins", icon: Coins },
    { id: "ar-classroom", label: "AR Classroom", icon: Camera },
    { id: "accessibility", label: "♿ Accessibility", icon: Eye },
    { id: "impact-dashboard", label: "🎯 SDG Impact", icon: Target },
    { id: "cultural-hub", label: "🌍 Cultural Hub", icon: Heart },
    { id: "pomodoro-timer", label: "Study Timer", icon: Timer },
    { id: "profile", label: t('profile') || "Profile", icon: User },
    { id: "settings", label: t('settings') || "Settings", icon: Settings }
  ]

  const handleNavigation = (pageId: string) => {
    console.log('Navigating to:', pageId); // Debug log
    
    // Ensure the page ID is valid before updating state
    if (['home', 'lessons', 'games', 'profile', 'settings', 'pomodoro-timer', 'quests', 'educoins', 'ar-classroom', 'next-gen-hub', 'ai-tutor', 'accessibility', 'impact-dashboard', 'cultural-hub'].includes(pageId)) {
      setCurrentPage(pageId as StudentPage);
      // Close any open dropdown menus
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    } else {
      console.warn('Invalid page ID:', pageId);
    }
  }

  // Move the dynamic import to the top of the file with other imports
  const PomodoroTimer = dynamic(
    () => import('@/components/study/pomodoro-timer'),
    { 
      ssr: false,
      loading: () => (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ),
    }
  );

  const renderPage = (): React.ReactNode => {
    console.log('Current page:', currentPage); // Debug log
    if (reviewingMaterial) {
      return renderReviewSection();
    }

    switch (currentPage) {
      case "next-gen-hub":
        return (
          <NextGenGamificationHub 
            studentId={user?.uid || ''}
            studentData={{
              totalXP: extendedProgress?.totalXP || 0,
              level: extendedProgress?.level || 1,
              consecutiveDays: extendedProgress?.streak || 0,
              skillMasteries: [],
              culturalContributions: Math.floor((extendedProgress?.totalXP || 0) / 50),
              peerTeachingSessions: Math.floor((extendedProgress?.totalXP || 0) / 100),
              sdgContributions: [],
              avatar: {
                id: 'default',
                baseModel: 'student',
                culturalElements: { clothing: [], accessories: [], backgroundTheme: {} as any },
                animations: ['idle'],
                level: extendedProgress?.level || 1,
                prestigeLevel: 0
              },
              unlockedAchievements: [],
              country: 'India',
              region: 'Sample Region',
              displayName: user?.displayName || 'Student'
            }}
            onXPUpdate={(newXP) => {
              toast({
                title: "XP Updated!",
                description: `Your new XP total: ${newXP}`,
              })
            }}
            onAchievementUnlocked={(achievement) => {
              toast({
                title: "🎉 Achievement Unlocked!",
                description: achievement.name,
              })
            }}
          />
        );
      case "ai-tutor":
        return (
          <AIVoiceTutorInterface 
            studentId={user?.uid || ''}
            subject="mathematics"
            onLearningProgress={(progress) => {
              toast({
                title: "Learning Progress!",
                description: `Session progress: ${progress.progress}%`,
              })
            }}
            onCulturalDiscovery={(content) => {
              toast({
                title: "Cultural Discovery!",
                description: "New cultural insights discovered!",
              })
            }}
          />
        );
      case "pomodoro-timer":
        return <PomodoroTimer />;
      case "quests":
        return (
          <AIQuestInterface 
            studentId={user?.uid || ''}
            studentName={user?.displayName || 'Student'}
            currentGrade={8} // This could come from user profile
            onXPGained={(amount) => {
              toast({
                title: "XP Gained!",
                description: `You earned ${amount} XP from your quest!`,
              })
            }}
          />
        );
      case "educoins":
        return (
          <EduCoinSystem 
            studentId={user?.uid || ''}
            studentName={user?.displayName || 'Student'}
            currentGrade={8}
            district="Sample District"
            state="Sample State"
            onCoinUpdate={(newBalance) => {
              toast({
                title: "EduCoins Updated!",
                description: `Your new balance: ${newBalance} EduCoins`,
              })
            }}
          />
        );
      case "ar-classroom":
        return (
          <ARClassroom 
            studentId={user?.uid || ''}
            currentSubject="science"
            onXPEarned={(amount) => {
              toast({
                title: "AR Session Complete!",
                description: `You earned ${amount} XP from AR learning!`,
              })
            }}
          />
        );
      case "accessibility":
        return (
          <AccessibilityHub />
        );
      case "impact-dashboard":
        return (
          <ImpactMeasurementDashboard studentId={user?.uid || ''} />
        );
      case "cultural-hub":
        return (
          <CulturalPreservationHub studentId={user?.uid || ''} />
        );
      case "home":
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Progress</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[100px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={progressData}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={40}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {progressData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-between text-xs text-center mt-2">
                    <div>
                      <div className="font-medium">{progressData[0].value}%</div>
                      <div className="text-muted-foreground">Complete</div>
                    </div>
                    <div>
                      <div className="font-medium">{extendedProgress?.totalXP || 0}</div>
                      <div className="text-muted-foreground">Total XP</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Level</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">
                    {extendedProgress?.xpToNextLevel ? `${extendedProgress.xpToNextLevel} XP to next level` : 'Max level reached'}
                  </p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${100 - (extendedProgress?.xpToNextLevel || 0)}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Streak</CardTitle>
                  <Flame className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{extendedProgress?.streakDays || 0} days</div>
                  <p className="text-xs text-muted-foreground">Keep it up!</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Coins</CardTitle>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{extendedProgress?.coins || 0}</div>
                  <p className="text-xs text-muted-foreground">Earn more by completing lessons</p>
                </CardContent>
              </Card>
            </div>
            
            <PerformanceHeatmap data={weeklyProgress} title="Weekly Activity" metric="XP" />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>🚀 New Features Available!</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Button 
                      variant="outline" 
                      className="justify-start h-auto p-4"
                      onClick={() => setCurrentPage('next-gen-hub')}
                    >
                      <div className="text-left">
                        <div className="flex items-center gap-2 font-medium">
                          <Sparkles className="h-4 w-4" />
                          🌟 Next-Gen Hub
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Advanced gamification with global leaderboards!
                        </div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="justify-start h-auto p-4"
                      onClick={() => setCurrentPage('ai-tutor')}
                    >
                      <div className="text-left">
                        <div className="flex items-center gap-2 font-medium">
                          <Brain className="h-4 w-4" />
                          🤖 AI Voice Tutor
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Multilingual AI tutor with cultural awareness!
                        </div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="justify-start h-auto p-4"
                      onClick={() => setCurrentPage('quests')}
                    >
                      <div className="text-left">
                        <div className="flex items-center gap-2 font-medium">
                          <Sparkles className="h-4 w-4" />
                          AI Learning Quests
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Story-driven adventures that make learning fun!
                        </div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="justify-start h-auto p-4"
                      onClick={() => setCurrentPage('educoins')}
                    >
                      <div className="text-left">
                        <div className="flex items-center gap-2 font-medium">
                          <Coins className="h-4 w-4" />
                          EduCoin System
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Earn coins, apply for scholarships, help schools!
                        </div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="justify-start h-auto p-4"
                      onClick={() => setCurrentPage('ar-classroom')}
                    >
                      <div className="text-left">
                        <div className="flex items-center gap-2 font-medium">
                          <Camera className="h-4 w-4" />
                          AR Classrooms
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Point camera at diagrams for 3D learning!
                        </div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="justify-start h-auto p-4"
                      onClick={() => setCurrentPage('accessibility')}
                    >
                      <div className="text-left">
                        <div className="flex items-center gap-2 font-medium">
                          <Eye className="h-4 w-4" />
                          ♿ Accessibility Hub
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Offline-first with 100+ language support!
                        </div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="justify-start h-auto p-4"
                      onClick={() => setCurrentPage('impact-dashboard')}
                    >
                      <div className="text-left">
                        <div className="flex items-center gap-2 font-medium">
                          <Target className="h-4 w-4" />
                          🎯 SDG Impact Dashboard
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Track your real-world impact contributions!
                        </div>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="justify-start h-auto p-4"
                      onClick={() => setCurrentPage('cultural-hub')}
                    >
                      <div className="text-left">
                        <div className="flex items-center gap-2 font-medium">
                          <Heart className="h-4 w-4" />
                          🌍 Cultural Preservation Hub
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Preserve heritage & collaborate globally!
                        </div>
                      </div>
                    </Button>
                    

                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <Button variant="outline" className="justify-start" onClick={() => setCurrentPage('lessons')}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Continue Learning
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => setShowGoalTracker(true)}>
                      <Target className="mr-2 h-4 w-4" />
                      Set Daily Goal
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => setShowProgressDashboard(true)}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "lessons":
        return <SubjectManager onReviewMaterial={handleReviewMaterial} />;
      case "games":
        return <ComprehensiveGameHub />;
      case "pomodoro-timer":
        return (
          <div className="flex justify-center items-center h-full">
            <PomodoroTimer />
          </div>
        );
      case "profile":
        return <StudentProfile />;
      case "settings":
        return <StudentSettings />;
      default:
        return null;
    }
  };

  interface StudyMaterial {
    id: string;
    title: string;
    type: string;
    duration: string;
    description: string;
    completed?: boolean;
    locked?: boolean;
  }

  interface Subject {
    id: string;
    name: string;
  }

  const handleReviewMaterial = (material: StudyMaterial, subject: Subject) => {
    setReviewingMaterial({ material, subject });
  };

  const renderReviewSection = () => {
    if (!reviewingMaterial || !reviewingMaterial.material || !reviewingMaterial.subject) {
      return null;
    }
    
    const { material, subject } = reviewingMaterial;
    
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Review: {material.title}</h2>
          <Button 
            variant="outline" 
            onClick={() => setReviewingMaterial(null)}
            className="flex items-center gap-2"
          >
            <span>←</span> Back to Lessons
          </Button>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                {material.type === 'video' ? (
                  <Video className="h-6 w-6" />
                ) : material.type === 'document' ? (
                  <FileText className="h-6 w-6" />
                ) : material.type === 'audio' ? (
                  <Headphones className="h-6 w-6" />
                ) : (
                  <Target className="h-6 w-6" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{material.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="capitalize">{material.type}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {material.duration}
                  </span>
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-lg">{material.description}</p>
              <div className="flex items-center gap-4">
                <Button variant="default" className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Play className="h-4 w-4" />
                  Start Review
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Bookmark
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };


  return (
    <div className="flex h-screen flex-col">
      {/* Voice & Gesture Interface Overlay - Removed */}

      {/* Goal Tracker Modal */}
      {showGoalTracker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Set Your Daily Goals</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowGoalTracker(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </Button>
              </div>
              <GoalTracker />
            </div>
          </div>
        </div>
      )}

      {/* Progress Dashboard Modal */}
      {showProgressDashboard && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Your Progress Dashboard</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowProgressDashboard(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Performance Heatmap */}
                <PerformanceHeatmap data={weeklyProgress} title="Learning Activity" metric="XP" />
                
                {/* Subject Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Subject Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {subjectAnalytics.map((subject) => (
                        <div key={subject.subject} className="space-y-2 p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{subject.subject}</h4>
                            <Badge variant="outline">{subject.accuracy}% accuracy</Badge>
                          </div>
                          <Progress value={(subject.completed / subject.total) * 100} className="h-2" />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{subject.completed}/{subject.total} lessons</span>
                            <span>{subject.timeSpent} min total</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Overall Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Overall Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{extendedProgress?.totalXP || 0}</div>
                        <div className="text-sm text-muted-foreground">Total XP</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{extendedProgress?.streak || 0}</div>
                        <div className="text-sm text-muted-foreground">Day Streak</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{progress?.totalLessonsCompleted || 0}</div>
                        <div className="text-sm text-muted-foreground">Lessons Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{extendedProgress?.coins || 0}</div>
                        <div className="text-sm text-muted-foreground">Coins Earned</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-6 w-6" />
            <span className="text-lg font-semibold">EduNova</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setCurrentPage(item.id as StudentPage)}
                className="flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <Bell className="h-4 w-4" />
              {notifications.some(n => !n.read) && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
              )}
            </Button>
            
            <LanguageSelector variant="outline" size="sm" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                    <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.displayName || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || 'No email'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => setCurrentPage('settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Notification Panel */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          showNotifications ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowNotifications(false)}
      ></div>
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-background border-l shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          showNotifications ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowNotifications(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
        </div>
        <div className="p-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p>No notifications yet</p>
              <p className="text-xs mt-1">We'll notify you when there's something new</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-background'
                  }`}
                >
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300 ${
        showNotifications ? 'mr-80' : ''
      }`}>
        {currentPage === 'pomodoro-timer' ? (
          <div className="container mx-auto max-w-4xl">
            <PomodoroTimer />
          </div>
        ) : (
          renderPage()
        )}
      </main>
    </div>
  );
}
