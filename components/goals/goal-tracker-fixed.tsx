"use client"

import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Plus, Target, Trophy, Award, CheckCircle } from "lucide-react"

type Goal = {
  id: string
  title: string
  target: number
  current: number
  unit: 'problems' | 'minutes' | 'days'
  dailyTarget: number
  dailyProgress: number
  lastUpdated: string // ISO date string
  streak: number
  completed: boolean
  createdAt: string | Date
}

export interface GoalTrackerRef {
  updateProgress: (increment?: number) => boolean
  getProgress: () => number
  getActiveGoal: () => (Goal & { title: string; current: number; target: number }) | null
}

interface GoalTrackerProps {
  onGoalUpdate?: (goal: (Goal & { title: string; current: number; target: number }) | null) => void
}

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

const resetDailyProgress = (goals: Goal[]): Goal[] => {
  const today = new Date().toISOString().split('T')[0]
  return goals.map(goal => {
    if (goal.lastUpdated !== today) {
      return {
        ...goal,
        dailyProgress: 0,
        lastUpdated: today,
        streak: goal.dailyProgress >= goal.dailyTarget ? goal.streak + 1 : 0
      }
    }
    return goal
  })
}

export const GoalTracker = forwardRef<GoalTrackerRef, GoalTrackerProps>(({ onGoalUpdate }, ref) => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('math-goals')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          // Add default values for new fields if they don't exist
          const goalsWithDefaults = parsed.map((goal: any) => ({
            ...goal,
            dailyTarget: goal.dailyTarget || goal.target,
            dailyProgress: goal.dailyProgress || 0,
            lastUpdated: goal.lastUpdated || new Date().toISOString().split('T')[0],
            streak: goal.streak || 0,
            completed: goal.completed || false,
            createdAt: goal.createdAt || new Date().toISOString()
          }))
          return resetDailyProgress(goalsWithDefaults)
        } catch (e) {
          console.error('Error parsing saved goals:', e)
          return []
        }
      }
    }
    return []
  })

  type GoalUnit = 'problems' | 'minutes' | 'days';
  
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: 10,
    dailyTarget: 10,
    unit: 'problems' as GoalUnit
  })

  const [activeGoalId, setActiveGoalId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('active-goal')
    }
    return null
  })

  const activeGoal = goals.find(g => g.id === activeGoalId) || null

  // Save goals and active goal to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('math-goals', JSON.stringify(goals))
      if (activeGoalId) {
        localStorage.setItem('active-goal', activeGoalId)
      }
      
      // Notify parent component about goal updates
      if (onGoalUpdate) {
        const currentGoal = activeGoalId ? goals.find(g => g.id === activeGoalId) || null : null
        onGoalUpdate(currentGoal)
      }
    }
  }, [goals, activeGoalId, onGoalUpdate])

  const addGoal = useCallback(() => {
    if (!newGoal.title.trim()) return

    const today = new Date().toISOString().split('T')[0]
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      target: Math.max(1, newGoal.target),
      current: 0,
      unit: newGoal.unit,
      dailyTarget: Math.max(1, newGoal.dailyTarget),
      dailyProgress: 0,
      lastUpdated: today,
      streak: 0,
      completed: false,
      createdAt: new Date().toISOString()
    }

    setGoals(prevGoals => [...prevGoals, goal])
    setNewGoal({ 
      title: '', 
      target: 10, 
      dailyTarget: 10,
      unit: 'problems' 
    })
    
    // Set as active if it's the first goal
    setActiveGoalId(prevId => prevId || goal.id)
  }, [newGoal])

  const updateProgress = useCallback((increment = 1): boolean => {
    if (!activeGoalId) return false;
    
    const today = new Date().toISOString().split('T')[0]
    let goalUpdated = false
    
    setGoals(prevGoals => {
      return prevGoals.map(goal => {
        if (goal.id === activeGoalId) {
          const lastUpdated = new Date(goal.lastUpdated)
          const todayDate = new Date()
          const isNewDay = !isSameDay(lastUpdated, todayDate)
          
          let newStreak = goal.streak
          let newDailyProgress = isNewDay ? 0 : goal.dailyProgress
          let newCurrent = goal.current
          let newCompleted = goal.completed
          
          // Update daily progress
          newDailyProgress = Math.min(newDailyProgress + increment, goal.dailyTarget)
          
          // Update overall progress if not already completed
          if (!newCompleted) {
            newCurrent = Math.min(goal.current + increment, goal.target)
            newCompleted = newCurrent >= goal.target
          }
          
          // Update streak
          if (isNewDay) {
            if (goal.dailyProgress >= goal.dailyTarget) {
              newStreak = goal.streak + 1
            } else if (goal.streak > 0) {
              newStreak = 0 // Reset streak if daily target not met
            }
          }
          
          goalUpdated = true
          return {
            ...goal,
            current: newCurrent,
            dailyProgress: newDailyProgress,
            lastUpdated: today,
            streak: newStreak,
            completed: newCompleted
          }
        }
        return goal
      })
    })
    
    return goalUpdated
  }, [activeGoalId])

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    updateProgress: (increment = 1) => {
      const updated = updateProgress(increment)
      if (updated && onGoalUpdate) {
        const currentGoal = activeGoalId ? goals.find(g => g.id === activeGoalId) || null : null
        onGoalUpdate(currentGoal)
      }
      return updated
    },
    getProgress: () => {
      if (!activeGoalId) return 0
      const goal = goals.find(g => g.id === activeGoalId)
      if (!goal) return 0
      return Math.round((goal.current / goal.target) * 100)
    },
    getActiveGoal: () => {
      if (!activeGoalId) return null
      const goal = goals.find(g => g.id === activeGoalId)
      return goal ? { ...goal } : null
    }
  }), [goals, activeGoalId, updateProgress, onGoalUpdate])

  const progress = activeGoal 
    ? (activeGoal.current / activeGoal.target) * 100 
    : 0
  
  const dailyProgress = activeGoal 
    ? (activeGoal.dailyProgress / activeGoal.dailyTarget) * 100 
    : 0

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Set Your Learning Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Goal name (e.g., Daily Practice)"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                className="flex-1"
              />
              <select
                value={newGoal.unit}
                onChange={(e) => setNewGoal({...newGoal, unit: e.target.value as GoalUnit})}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="problems">problems</option>
                <option value="minutes">minutes</option>
                <option value="days">days</option>
              </select>
              <Button onClick={addGoal}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Daily Target</label>
                <Input
                  type="number"
                  min="1"
                  value={newGoal.dailyTarget}
                  onChange={(e) => setNewGoal({...newGoal, dailyTarget: parseInt(e.target.value) || 1})}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Overall Target</label>
                <Input
                  type="number"
                  min="1"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({...newGoal, target: parseInt(e.target.value) || 1})}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {goals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              My Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Select Goal:</span>
                <select
                  value={activeGoalId || ''}
                  onChange={(e) => setActiveGoalId(e.target.value)}
                  className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                >
                  {goals.map(goal => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title} ({goal.current}/{goal.target} {goal.unit})
                    </option>
                  ))}
                </select>
              </div>

              {activeGoal && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{activeGoal.title}</h4>
                      {activeGoal.completed && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" /> Completed
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Daily Progress</span>
                        <span>
                          {activeGoal.dailyProgress} / {activeGoal.dailyTarget} {activeGoal.unit}
                        </span>
                      </div>
                      <Progress value={dailyProgress} className="h-2" />
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>Today's progress</span>
                        <span>{Math.round(dailyProgress)}%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Overall Progress</span>
                        <span>
                          {activeGoal.current} / {activeGoal.target} {activeGoal.unit}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>Total progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                    </div>
                    
                    {activeGoal.streak > 0 && (
                      <div className="flex items-center text-sm text-amber-600 dark:text-amber-400 mt-2">
                        <Award className="h-4 w-4 mr-1" />
                        {activeGoal.streak} day{activeGoal.streak !== 1 ? 's' : ''} streak!
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
})

GoalTracker.displayName = 'GoalTracker'
