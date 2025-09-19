"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, CheckCircle, Clock, Star, Zap, BookOpen, Users, Trophy } from "lucide-react"

interface Challenge {
  id: string
  title: string
  description: string
  type: "daily" | "weekly" | "special"
  difficulty: "easy" | "medium" | "hard"
  xpReward: number
  progress: number
  maxProgress: number
  completed: boolean
  timeLeft?: string
  icon: React.ReactNode
}

interface DailyChallengesProps {
  challenges: Challenge[]
  onChallengeComplete: (challengeId: string) => void
}

export function DailyChallenges({ challenges, onChallengeComplete }: DailyChallengesProps) {
  const difficultyColors = {
    easy: "bg-green-100 text-green-800 border-green-300",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    hard: "bg-red-100 text-red-800 border-red-300",
  }

  const typeColors = {
    daily: "bg-blue-100 text-blue-800",
    weekly: "bg-purple-100 text-purple-800",
    special: "bg-amber-100 text-amber-800",
  }

  const completedChallenges = challenges.filter((c) => c.completed).length
  const totalChallenges = challenges.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-amber-600" />
          Daily Challenges ({completedChallenges}/{totalChallenges})
        </CardTitle>
        <div className="space-y-2">
          <Progress value={(completedChallenges / totalChallenges) * 100} className="h-2" />
          <div className="text-xs text-slate-600">Complete all challenges for bonus 100 XP!</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <Card
              key={challenge.id}
              className={`${challenge.completed ? "bg-green-50 border-green-200" : "bg-slate-50"} transition-all`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`text-xl ${challenge.completed ? "text-green-600" : "text-slate-600"}`}>
                    {challenge.completed ? <CheckCircle className="h-5 w-5" /> : challenge.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4
                        className={`font-medium text-sm ${challenge.completed ? "text-green-800" : "text-slate-800"}`}
                      >
                        {challenge.title}
                      </h4>
                      <Badge variant="outline" className={typeColors[challenge.type]}>
                        {challenge.type}
                      </Badge>
                      <Badge variant="outline" className={difficultyColors[challenge.difficulty]}>
                        {challenge.difficulty}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 mb-3">{challenge.description}</p>

                    {!challenge.completed && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>
                            {challenge.progress}/{challenge.maxProgress}
                          </span>
                        </div>
                        <Progress value={(challenge.progress / challenge.maxProgress) * 100} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-600" />
                          <span className="text-xs font-medium text-amber-800">+{challenge.xpReward} XP</span>
                        </div>
                        {challenge.timeLeft && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-500" />
                            <span className="text-xs text-slate-600">{challenge.timeLeft}</span>
                          </div>
                        )}
                      </div>

                      {challenge.completed ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      ) : challenge.progress >= challenge.maxProgress ? (
                        <Button size="sm" onClick={() => onChallengeComplete(challenge.id)} className="text-xs">
                          Claim Reward
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="text-xs bg-transparent">
                          In Progress
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export const sampleChallenges: Challenge[] = [
  {
    id: "daily-quiz",
    title: "Quiz Master",
    description: "Complete 3 quizzes with 80% or higher score",
    type: "daily",
    difficulty: "easy",
    xpReward: 50,
    progress: 2,
    maxProgress: 3,
    completed: false,
    timeLeft: "18h 32m",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    id: "study-streak",
    title: "Consistency Champion",
    description: "Study for 30 minutes without breaks",
    type: "daily",
    difficulty: "medium",
    xpReward: 75,
    progress: 25,
    maxProgress: 30,
    completed: false,
    timeLeft: "18h 32m",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    id: "help-friend",
    title: "Helpful Student",
    description: "Help a classmate with their studies",
    type: "weekly",
    difficulty: "medium",
    xpReward: 100,
    progress: 1,
    maxProgress: 1,
    completed: true,
    timeLeft: "5d 12h",
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: "perfect-score",
    title: "Perfectionist",
    description: "Get 100% on any quiz",
    type: "special",
    difficulty: "hard",
    xpReward: 200,
    progress: 0,
    maxProgress: 1,
    completed: false,
    icon: <Trophy className="h-5 w-5" />,
  },
]
