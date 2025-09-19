"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Star, Flame, Target, BookOpen, Brain, Award, Users, Clock } from "lucide-react"

interface UserProgress {
  currentXP: number
  currentLevel: number
  nextLevelThreshold: number
  streakCount: number
  totalLessonsCompleted: number
  totalQuizzesPassed: number
  coursesCompleted: number
  achievements: Achievement[]
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: string
  xpReward: number
}

const levelThresholds = [
  { level: 1, name: "Beginner", threshold: 0, color: "bg-green-500", icon: "🌱" },
  { level: 2, name: "Learner", threshold: 200, color: "bg-blue-500", icon: "📚" },
  { level: 3, name: "Explorer", threshold: 500, color: "bg-purple-500", icon: "🔍" },
  { level: 4, name: "Scholar", threshold: 1000, color: "bg-yellow-500", icon: "🎓" },
  { level: 5, name: "Master", threshold: 2000, color: "bg-pink-500", icon: "💎" },
]

const achievementTemplates: Achievement[] = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Complete your first lesson",
    icon: "🎯",
    earned: false,
    xpReward: 25,
  },
  {
    id: "bookworm",
    name: "Bookworm",
    description: "Complete 10 lessons",
    icon: "📚",
    earned: false,
    xpReward: 100,
  },
  {
    id: "on-fire",
    name: "On Fire",
    description: "Maintain a 7-day learning streak",
    icon: "🔥",
    earned: false,
    xpReward: 150,
  },
  {
    id: "quiz-master",
    name: "Quiz Master",
    description: "Score 100% on 5 quizzes",
    icon: "🏆",
    earned: false,
    xpReward: 200,
  },
  {
    id: "course-champion",
    name: "Course Champion",
    description: "Complete your first full course",
    icon: "🌟",
    earned: false,
    xpReward: 300,
  },
  {
    id: "speed-learner",
    name: "Speed Learner",
    description: "Complete a lesson in under 10 minutes",
    icon: "⚡",
    earned: false,
    xpReward: 75,
  },
  {
    id: "perfect-score",
    name: "Perfect Score",
    description: "Get 100% on a difficult quiz",
    icon: "🧠",
    earned: false,
    xpReward: 125,
  },
  {
    id: "consistent",
    name: "Consistent Learner",
    description: "Learn for 30 consecutive days",
    icon: "📅",
    earned: false,
    xpReward: 500,
  },
]

export default function ComprehensiveProgressSystem() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    currentXP: 750,
    currentLevel: 3,
    nextLevelThreshold: 1000,
    streakCount: 12,
    totalLessonsCompleted: 28,
    totalQuizzesPassed: 15,
    coursesCompleted: 2,
    achievements: achievementTemplates.map((achievement) => ({
      ...achievement,
      earned: Math.random() > 0.6,
      earnedDate: Math.random() > 0.6 ? new Date().toISOString().split("T")[0] : undefined,
    })),
  })

  const [dailyChallenges] = useState([
    { id: 1, title: "Complete 3 lessons today", progress: 2, target: 3, xpReward: 50, icon: BookOpen },
    { id: 2, title: "Score 90%+ on next 3 quizzes", progress: 1, target: 3, xpReward: 100, icon: Target },
    { id: 3, title: "Learn for 30 minutes without breaks", progress: 18, target: 30, xpReward: 75, icon: Clock },
  ])

  const getCurrentLevel = () => {
    return (
      levelThresholds.find(
        (level) =>
          userProgress.currentXP >= level.threshold &&
          (levelThresholds[level.level] ? userProgress.currentXP < levelThresholds[level.level].threshold : true),
      ) || levelThresholds[0]
    )
  }

  const getNextLevel = () => {
    const currentLevel = getCurrentLevel()
    return levelThresholds[currentLevel.level] || levelThresholds[levelThresholds.length - 1]
  }

  const calculateProgress = () => {
    const currentLevel = getCurrentLevel()
    const nextLevel = getNextLevel()
    if (currentLevel.level === 5) return 100

    const progressInLevel = userProgress.currentXP - currentLevel.threshold
    const levelRange = nextLevel.threshold - currentLevel.threshold
    return (progressInLevel / levelRange) * 100
  }

  const earnedAchievements = userProgress.achievements.filter((a) => a.earned)
  const availableAchievements = userProgress.achievements.filter((a) => !a.earned)

  return (
    <div className="space-y-6">
      {/* Level and XP Overview */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">{getCurrentLevel().icon}</div>
              <Badge className={`${getCurrentLevel().color} text-white mb-2`}>{getCurrentLevel().name}</Badge>
              <p className="text-2xl font-bold">{userProgress.currentXP} XP</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to {getNextLevel().name}</span>
                <span>{Math.round(calculateProgress())}%</span>
              </div>
              <Progress value={calculateProgress()} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {getNextLevel().threshold - userProgress.currentXP} XP to next level
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <Flame className="h-6 w-6 mx-auto mb-1 text-orange-500" />
                <p className="text-lg font-semibold">{userProgress.streakCount}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
              <div>
                <Star className="h-6 w-6 mx-auto mb-1 text-yellow-500" />
                <p className="text-lg font-semibold">{earnedAchievements.length}</p>
                <p className="text-xs text-muted-foreground">Achievements</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="challenges">Daily Challenges</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Earned Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {earnedAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-800">{achievement.name}</h4>
                      <p className="text-sm text-green-600">{achievement.description}</p>
                      <p className="text-xs text-green-500">+{achievement.xpReward} XP</p>
                    </div>
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {availableAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl grayscale">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-700">{achievement.name}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500">Reward: +{achievement.xpReward} XP</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Today's Challenges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dailyChallenges.map((challenge) => {
                const Icon = challenge.icon
                const progress = (challenge.progress / challenge.target) * 100
                return (
                  <div key={challenge.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <h4 className="font-semibold">{challenge.title}</h4>
                        <p className="text-sm text-muted-foreground">Reward: +{challenge.xpReward} XP</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {challenge.progress}/{challenge.target}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{userProgress.totalLessonsCompleted}</p>
                <p className="text-sm text-muted-foreground">Lessons Completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Brain className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">{userProgress.totalQuizzesPassed}</p>
                <p className="text-sm text-muted-foreground">Quizzes Passed</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold">{userProgress.coursesCompleted}</p>
                <p className="text-sm text-muted-foreground">Courses Completed</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Weekly Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rank: 1, name: "Priya Sharma", xp: 1250, streak: 15, avatar: "👩‍🎓" },
                  { rank: 2, name: "Rahul Kumar", xp: 1180, streak: 12, avatar: "👨‍🎓" },
                  { rank: 3, name: "You", xp: 750, streak: 12, avatar: "🧑‍🎓" },
                  { rank: 4, name: "Anita Patel", xp: 680, streak: 8, avatar: "👩‍🎓" },
                  { rank: 5, name: "Vikram Singh", xp: 620, streak: 10, avatar: "👨‍🎓" },
                ].map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      user.name === "You" ? "bg-primary/10 border-2 border-primary" : "bg-gray-50"
                    }`}
                  >
                    <div className="text-lg font-bold w-8 text-center">#{user.rank}</div>
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="flex-1">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.xp} XP • {user.streak} day streak
                      </p>
                    </div>
                    {user.rank <= 3 && (
                      <Trophy
                        className={`h-5 w-5 ${
                          user.rank === 1 ? "text-yellow-500" : user.rank === 2 ? "text-gray-400" : "text-orange-500"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
