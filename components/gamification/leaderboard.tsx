"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Award, Crown, Star, TrendingUp } from "lucide-react"

interface LeaderboardEntry {
  id: string
  name: string
  avatar?: string
  xp: number
  level: number
  streak: number
  rank: number
  change: number // +1, -1, 0 for rank change
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  currentUserId?: string
  timeframe?: "daily" | "weekly" | "monthly" | "all-time"
}

export function Leaderboard({ entries, currentUserId, timeframe = "weekly" }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-amber-500" />
      case 2:
        return <Medal className="h-5 w-5 text-slate-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-slate-600">#{rank}</span>
    }
  }

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-600" />
    if (change < 0) return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
    return <div className="w-3 h-3" />
  }

  const timeframeLabels = {
    daily: "Today",
    weekly: "This Week",
    monthly: "This Month",
    "all-time": "All Time",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-600" />
          Class Leaderboard - {timeframeLabels[timeframe]}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                entry.id === currentUserId ? "bg-amber-50 border-amber-200" : "bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2 w-12">
                {getRankIcon(entry.rank)}
                {getRankChangeIcon(entry.change)}
              </div>

              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-br from-amber-100 to-orange-100 text-amber-800">
                  {entry.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="font-medium text-sm">{entry.name}</div>
                <div className="text-xs text-slate-600">Level {entry.level}</div>
              </div>

              <div className="text-right">
                <div className="font-bold text-sm text-amber-800">{entry.xp.toLocaleString()} XP</div>
                <div className="flex items-center gap-1 text-xs text-orange-600">
                  <Star className="h-3 w-3" />
                  {entry.streak} day streak
                </div>
              </div>

              {entry.id === currentUserId && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  You
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export const sampleLeaderboardData: LeaderboardEntry[] = [
  {
    id: "user1",
    name: "Priya Sharma",
    xp: 15420,
    level: Math.min(Math.floor(Math.sqrt(15420 / 100)) + 1, 100),
    streak: 28,
    rank: 1,
    change: 0,
  },
  {
    id: "user2",
    name: "Arjun Patel",
    xp: 14890,
    level: Math.min(Math.floor(Math.sqrt(14890 / 100)) + 1, 100),
    streak: 21,
    rank: 2,
    change: 1,
  },
  {
    id: "current-user",
    name: "Rahul Kumar",
    xp: 14250,
    level: Math.min(Math.floor(Math.sqrt(14250 / 100)) + 1, 100),
    streak: 15,
    rank: 3,
    change: -1,
  },
  {
    id: "user4",
    name: "Anita Singh",
    xp: 13680,
    level: Math.min(Math.floor(Math.sqrt(13680 / 100)) + 1, 100),
    streak: 12,
    rank: 4,
    change: 2,
  },
  {
    id: "user5",
    name: "Vikram Gupta",
    xp: 13200,
    level: Math.min(Math.floor(Math.sqrt(13200 / 100)) + 1, 100),
    streak: 8,
    rank: 5,
    change: -1,
  },
]
