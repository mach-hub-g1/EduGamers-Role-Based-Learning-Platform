"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Target, Award, Crown, Flame, BookOpen, Users } from "lucide-react"

interface BadgeData {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  rarity: "common" | "rare" | "epic" | "legendary"
  earned: boolean
  earnedDate?: string
  progress?: number
  maxProgress?: number
}

interface BadgeSystemProps {
  badges: BadgeData[]
  onBadgeClick?: (badge: BadgeData) => void
}

export function BadgeSystem({ badges, onBadgeClick }: BadgeSystemProps) {
  const rarityColors = {
    common: "bg-gray-100 text-gray-800 border-gray-300",
    rare: "bg-blue-100 text-blue-800 border-blue-300",
    epic: "bg-purple-100 text-purple-800 border-purple-300",
    legendary: "bg-amber-100 text-amber-800 border-amber-300",
  }

  const earnedBadges = badges.filter((badge) => badge.earned)
  const availableBadges = badges.filter((badge) => !badge.earned)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-600" />
            Achievement Badges ({earnedBadges.length}/{badges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {earnedBadges.map((badge) => (
              <Button
                key={badge.id}
                variant="outline"
                className={`h-auto p-4 flex flex-col items-center gap-2 ${rarityColors[badge.rarity]} hover:scale-105 transition-transform`}
                onClick={() => onBadgeClick?.(badge)}
              >
                <div className="text-2xl">{badge.icon}</div>
                <div className="text-center">
                  <div className="font-medium text-xs">{badge.name}</div>
                  <div className="text-xs opacity-70">{badge.earnedDate}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-slate-600" />
            Available Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {availableBadges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-3 p-3 rounded-lg border bg-slate-50">
                <div className="text-xl opacity-50">{badge.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{badge.name}</div>
                  <div className="text-xs text-slate-600">{badge.description}</div>
                  {badge.progress !== undefined && badge.maxProgress && (
                    <div className="mt-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>
                          {badge.progress}/{badge.maxProgress}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-amber-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <Badge variant="outline" className={rarityColors[badge.rarity]}>
                  {badge.rarity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const sampleBadges: BadgeData[] = [
  {
    id: "first-lesson",
    name: "First Steps",
    description: "Complete your first lesson",
    icon: <BookOpen className="h-5 w-5" />,
    rarity: "common",
    earned: true,
    earnedDate: "2024-01-15",
  },
  {
    id: "week-streak",
    name: "Week Warrior",
    description: "Maintain a 7-day learning streak",
    icon: <Flame className="h-5 w-5" />,
    rarity: "rare",
    earned: true,
    earnedDate: "2024-01-22",
  },
  {
    id: "quiz-master",
    name: "Quiz Master",
    description: "Score 100% on 10 quizzes",
    icon: <Star className="h-5 w-5" />,
    rarity: "epic",
    earned: false,
    progress: 7,
    maxProgress: 10,
  },
  {
    id: "top-student",
    name: "Class Champion",
    description: "Reach #1 on the class leaderboard",
    icon: <Crown className="h-5 w-5" />,
    rarity: "legendary",
    earned: false,
  },
  {
    id: "helper",
    name: "Helpful Friend",
    description: "Help 5 classmates with their studies",
    icon: <Users className="h-5 w-5" />,
    rarity: "rare",
    earned: false,
    progress: 2,
    maxProgress: 5,
  },
]
