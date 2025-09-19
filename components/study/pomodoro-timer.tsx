"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, RotateCcw } from "lucide-react"

function PomodoroTimer() {
  console.log('PomodoroTimer component rendered')
  
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Toggle timer
  const toggleTimer = () => {
    console.log('Toggling timer. Current state:', { isRunning, timeLeft });
    setIsRunning(!isRunning)
  }

  // Reset timer
  const resetTimer = () => {
    console.log('Resetting timer');
    setIsRunning(false)
    setTimeLeft(25 * 60)
  }

  // Timer effect
  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsRunning(false)
          // Notify when timer completes
          if (typeof window !== 'undefined' && 'Notification' in window) {
            new Notification('Pomodoro Timer', {
              body: 'Focus session completed! Time for a break.'
            })
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning])

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission()
    }
  }, [])

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Pomodoro Timer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer display */}
          <div className="text-center">
            <div className="text-6xl font-bold my-6">
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button 
              size="lg" 
              onClick={toggleTimer}
              className="gap-2"
            >
              {isRunning ? (
                <>
                  <Pause className="h-5 w-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  Start
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={resetTimer}
              className="gap-2"
            >
              <RotateCcw className="h-5 w-5" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PomodoroTimer
