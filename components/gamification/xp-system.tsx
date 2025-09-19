"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Target } from "lucide-react"

interface XPSystemProps {
  currentXP: number
  level: number
  streak: number
  onXPGain?: (amount: number) => void
}

export function XPSystem({ currentXP, level, streak, onXPGain }: XPSystemProps) {
  const [showXPGain, setShowXPGain] = useState(false)
  const [gainAmount, setGainAmount] = useState(0)

  // Calculate level based on XP: level = floor(√(xp/100)) + 1
  const calculatedLevel = Math.floor(Math.sqrt(currentXP / 100)) + 1
  const effectiveLevel = Math.min(calculatedLevel, 100) // Cap at level 100
  
  // Calculate progress to next level (0-100%)
  const currentLevelFloor = Math.pow(effectiveLevel - 1, 2) * 100
  const nextLevelFloor = Math.pow(effectiveLevel, 2) * 100
  const xpProgress = ((currentXP - currentLevelFloor) / (nextLevelFloor - currentLevelFloor)) * 100

  const handleXPGain = (amount: number) => {
    setGainAmount(amount)
    setShowXPGain(true)
    onXPGain?.(amount)
    setTimeout(() => setShowXPGain(false), 2000)
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <Trophy className="h-5 w-5" />
            Level {effectiveLevel} Explorer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-amber-700">XP Progress</span>
              <span className="text-amber-800 font-medium">
                {currentXP % 1000}/{1000}
              </span>
            </div>
            <Progress value={xpProgress} className="h-3 bg-amber-100" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-800">{currentXP.toLocaleString()}</div>
              <div className="text-xs text-amber-600">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-800">{effectiveLevel}</div>
              <div className="text-xs text-orange-600">Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-800">{streak}</div>
              <div className="text-xs text-red-600">Day Streak</div>
            </div>
          </div>

          {showXPGain && (
            <div className="text-center animate-bounce">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                +{gainAmount} XP!
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleXPGain(50)}
          className="text-amber-700 border-amber-200 hover:bg-amber-50"
        >
          <Star className="h-4 w-4 mr-1" />
          Complete Quiz (+50 XP)
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleXPGain(25)}
          className="text-orange-700 border-orange-200 hover:bg-orange-50"
        >
          <Target className="h-4 w-4 mr-1" />
          Daily Challenge (+25 XP)
        </Button>
      </div>
    </div>
  )
}
