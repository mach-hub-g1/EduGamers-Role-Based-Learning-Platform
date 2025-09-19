"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RotateCw, ArrowLeft, Shuffle } from "lucide-react"

interface ColorMatchGameProps {
  onComplete: (score: number) => void;
  onBack?: () => void;
}

const COLORS = [
  { name: 'Red', color: 'bg-red-500', textColor: 'text-red-500' },
  { name: 'Blue', color: 'bg-blue-500', textColor: 'text-blue-500' },
  { name: 'Green', color: 'bg-green-500', textColor: 'text-green-500' },
  { name: 'Yellow', color: 'bg-yellow-500', textColor: 'text-yellow-500' },
  { name: 'Purple', color: 'bg-purple-500', textColor: 'text-purple-500' },
  { name: 'Orange', color: 'bg-orange-500', textColor: 'text-orange-500' },
]

interface ColorChallenge {
  word: string
  wordColor: string
  correctAnswer: string
}

export function ColorMatchGame({ onComplete, onBack }: ColorMatchGameProps) {
  const [currentChallenge, setCurrentChallenge] = useState<ColorChallenge | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isGameOver, setIsGameOver] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [challengeCount, setChallengeCount] = useState(0)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    generateNewChallenge()
  }, [])

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setIsGameOver(true)
      onComplete(score)
    }
  }, [timeLeft, isGameOver, score, onComplete])

  const generateNewChallenge = () => {
    // Pick a random word and a random color for the text
    const wordColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    const textColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    
    const challenge: ColorChallenge = {
      word: wordColor.name,
      wordColor: textColor.textColor,
      correctAnswer: textColor.name // The correct answer is the COLOR of the text, not the word itself
    }
    
    setCurrentChallenge(challenge)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const handleAnswer = (colorName: string) => {
    if (!currentChallenge || showResult) return
    
    setSelectedAnswer(colorName)
    setShowResult(true)
    
    const isCorrect = colorName === currentChallenge.correctAnswer
    
    if (isCorrect) {
      const streakBonus = streak >= 5 ? 5 : Math.floor(streak / 2)
      const points = 10 + streakBonus
      setScore(score + points)
      setStreak(streak + 1)
    } else {
      setStreak(0)
    }
    
    setChallengeCount(challengeCount + 1)
    
    setTimeout(() => {
      if (challengeCount >= 20 || timeLeft <= 5) {
        setIsGameOver(true)
        onComplete(isCorrect ? score + 10 : score)
      } else {
        generateNewChallenge()
      }
    }, 1200)
  }

  const restartGame = () => {
    setScore(0)
    setTimeLeft(60)
    setSelectedAnswer(null)
    setShowResult(false)
    setChallengeCount(0)
    setStreak(0)
    setIsGameOver(false)
    generateNewChallenge()
  }

  if (isGameOver) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-4 top-4"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-2xl font-bold text-center">Game Over!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-4xl font-bold mb-2">{score}</p>
            <p className="text-muted-foreground">Final Score</p>
            <p className="text-sm text-muted-foreground mt-2">
              Challenges completed: {challengeCount}
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              onClick={restartGame}
              className="w-full"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
            <Button 
              onClick={() => onComplete(score)}
              className="w-full"
            >
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentChallenge) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Shuffle className="h-5 w-5" />
            Color Match
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="font-medium">Score: {score}</div>
            <div className="w-20">
              <Progress value={(timeLeft / 60) * 100} className="h-2" />
              <div className="text-xs text-right">{timeLeft}s</div>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          What COLOR is this word displayed in? (Not what the word says!)
        </div>
        {streak >= 3 && (
          <div className="text-sm font-medium text-orange-600">
            🔥 Streak: {streak} (+{Math.floor(streak / 2)} bonus points)
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-8 bg-muted/50 rounded-lg">
          <div className={`text-6xl font-bold ${currentChallenge.wordColor} transition-all duration-300`}>
            {currentChallenge.word}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {COLORS.map((color) => {
            const isSelected = selectedAnswer === color.name
            const isCorrect = color.name === currentChallenge.correctAnswer
            
            let buttonVariant: "default" | "secondary" | "destructive" | "outline" = "outline"
            let buttonClass = "h-16 text-lg font-medium transition-all duration-300"
            
            if (showResult) {
              if (isSelected) {
                buttonVariant = isCorrect ? "default" : "destructive"
                buttonClass += isCorrect ? " ring-2 ring-green-500" : " ring-2 ring-red-500"
              } else if (isCorrect) {
                buttonVariant = "default"
                buttonClass += " ring-2 ring-green-500"
              }
            }
            
            return (
              <Button
                key={color.name}
                variant={buttonVariant}
                className={buttonClass}
                onClick={() => handleAnswer(color.name)}
                disabled={showResult}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${color.color}`}></div>
                  {color.name}
                </div>
              </Button>
            )
          })}
        </div>
        
        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            Challenge {challengeCount + 1} of 20
          </div>
          <Progress value={(challengeCount / 20) * 100} className="mt-2" />
        </div>
      </CardContent>
    </Card>
  )
}