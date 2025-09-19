"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RotateCw, ArrowLeft, Lightbulb, Zap } from "lucide-react"

interface QuickMathGameProps {
  onComplete: (score: number) => void;
  onBack?: () => void;
}

interface MathProblem {
  question: string
  answer: number
  options: number[]
  difficulty: 'easy' | 'medium' | 'hard'
}

export function QuickMathGame({ onComplete, onBack }: QuickMathGameProps) {
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(45) // Shorter time for quick math
  const [isGameOver, setIsGameOver] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [problemCount, setProblemCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')

  useEffect(() => {
    generateNewProblem()
  }, [difficulty])

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setIsGameOver(true)
      onComplete(score)
    }
  }, [timeLeft, isGameOver, score, onComplete])

  const generateNewProblem = () => {
    let problem: MathProblem
    
    if (difficulty === 'easy') {
      const a = Math.floor(Math.random() * 10) + 1
      const b = Math.floor(Math.random() * 10) + 1
      const operation = Math.random() < 0.5 ? '+' : '-'
      
      if (operation === '+') {
        problem = {
          question: `${a} + ${b}`,
          answer: a + b,
          options: [],
          difficulty: 'easy'
        }
      } else {
        // Ensure no negative results
        const larger = Math.max(a, b)
        const smaller = Math.min(a, b)
        problem = {
          question: `${larger} - ${smaller}`,
          answer: larger - smaller,
          options: [],
          difficulty: 'easy'
        }
      }
    } else if (difficulty === 'medium') {
      const a = Math.floor(Math.random() * 12) + 2
      const b = Math.floor(Math.random() * 12) + 2
      const operations = ['+', '-', '×']
      const operation = operations[Math.floor(Math.random() * operations.length)]
      
      if (operation === '+') {
        problem = {
          question: `${a} + ${b}`,
          answer: a + b,
          options: [],
          difficulty: 'medium'
        }
      } else if (operation === '-') {
        const larger = Math.max(a, b)
        const smaller = Math.min(a, b)
        problem = {
          question: `${larger} - ${smaller}`,
          answer: larger - smaller,
          options: [],
          difficulty: 'medium'
        }
      } else {
        problem = {
          question: `${a} × ${b}`,
          answer: a * b,
          options: [],
          difficulty: 'medium'
        }
      }
    } else {
      // Hard difficulty
      const a = Math.floor(Math.random() * 15) + 5
      const b = Math.floor(Math.random() * 12) + 2
      const operations = ['+', '-', '×', '÷']
      const operation = operations[Math.floor(Math.random() * operations.length)]
      
      if (operation === '÷') {
        // Ensure clean division
        const dividend = a * b
        problem = {
          question: `${dividend} ÷ ${b}`,
          answer: a,
          options: [],
          difficulty: 'hard'
        }
      } else if (operation === '×') {
        problem = {
          question: `${a} × ${b}`,
          answer: a * b,
          options: [],
          difficulty: 'hard'
        }
      } else if (operation === '-') {
        const larger = Math.max(a, b + 10)
        const smaller = Math.min(a, b)
        problem = {
          question: `${larger} - ${smaller}`,
          answer: larger - smaller,
          options: [],
          difficulty: 'hard'
        }
      } else {
        problem = {
          question: `${a} + ${b}`,
          answer: a + b,
          options: [],
          difficulty: 'hard'
        }
      }
    }
    
    // Generate wrong options
    const wrongOptions = []
    const correct = problem.answer
    
    // Add close wrong answers
    wrongOptions.push(correct + 1, correct - 1)
    
    // Add more wrong answers
    for (let i = 0; i < 2; i++) {
      let wrongAnswer
      do {
        wrongAnswer = correct + (Math.floor(Math.random() * 10) - 5)
      } while (wrongAnswer === correct || wrongAnswer < 0 || wrongOptions.includes(wrongAnswer))
      
      wrongOptions.push(wrongAnswer)
    }
    
    // Combine and shuffle
    problem.options = [correct, ...wrongOptions.slice(0, 3)]
      .sort(() => Math.random() - 0.5)
    
    setCurrentProblem(problem)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const handleAnswer = (answer: number) => {
    if (!currentProblem || showResult) return
    
    setSelectedAnswer(answer)
    setShowResult(true)
    
    const isCorrect = answer === currentProblem.answer
    
    if (isCorrect) {
      let points = 5
      if (difficulty === 'medium') points = 8
      if (difficulty === 'hard') points = 12
      
      // Streak bonus
      const streakBonus = Math.floor(streak / 3)
      points += streakBonus
      
      setScore(score + points)
      setStreak(streak + 1)
      
      // Increase difficulty based on streak
      if (streak >= 5 && difficulty === 'easy') {
        setDifficulty('medium')
      } else if (streak >= 10 && difficulty === 'medium') {
        setDifficulty('hard')
      }
    } else {
      setStreak(0)
      // Decrease difficulty on wrong answer
      if (difficulty === 'hard') {
        setDifficulty('medium')
      } else if (difficulty === 'medium' && streak === 0) {
        setDifficulty('easy')
      }
    }
    
    setProblemCount(problemCount + 1)
    
    setTimeout(() => {
      if (problemCount >= 25 || timeLeft <= 5) {
        setIsGameOver(true)
        onComplete(isCorrect ? score + (difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 12) : score)
      } else {
        generateNewProblem()
      }
    }, 1000)
  }

  const restartGame = () => {
    setScore(0)
    setTimeLeft(45)
    setSelectedAnswer(null)
    setShowResult(false)
    setProblemCount(0)
    setStreak(0)
    setDifficulty('easy')
    setIsGameOver(false)
    generateNewProblem()
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
          <CardTitle className="text-2xl font-bold text-center">Time's Up!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-4xl font-bold mb-2">{score}</p>
            <p className="text-muted-foreground">Final Score</p>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <div className="font-medium">{problemCount}</div>
                <div className="text-muted-foreground">Problems Solved</div>
              </div>
              <div>
                <div className="font-medium capitalize">{difficulty}</div>
                <div className="text-muted-foreground">Final Level</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              onClick={restartGame}
              className="w-full"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Try Again
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

  if (!currentProblem) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Math
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="font-medium">Score: {score}</div>
            <div className="w-20">
              <Progress value={(timeLeft / 45) * 100} className="h-2" />
              <div className="text-xs text-right">{timeLeft}s</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Solve as many as you can!
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {difficulty}
            </span>
            {streak >= 3 && (
              <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                🔥 {streak}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-8 bg-muted/50 rounded-lg">
          <div className="text-4xl font-bold mb-2">{currentProblem.question}</div>
          <div className="text-sm text-muted-foreground">= ?</div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {currentProblem.options.map((option, index) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === currentProblem.answer
            
            let buttonVariant: "default" | "secondary" | "destructive" | "outline" = "outline"
            let buttonClass = "h-16 text-xl font-bold transition-all duration-300"
            
            if (showResult) {
              if (isSelected) {
                buttonVariant = isCorrect ? "default" : "destructive"
              } else if (isCorrect) {
                buttonVariant = "default"
              }
            }
            
            return (
              <Button
                key={option}
                variant={buttonVariant}
                className={buttonClass}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
              >
                {option}
              </Button>
            )
          })}
        </div>
        
        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            Problem {problemCount + 1} of 25
          </div>
          <Progress value={(problemCount / 25) * 100} className="mt-2" />
        </div>
      </CardContent>
    </Card>
  )
}