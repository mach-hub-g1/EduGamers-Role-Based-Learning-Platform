"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Clock, Target, Zap, Award } from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  subject: string
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "What is the capital of India?",
    options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
    correct: 1,
    explanation: "New Delhi is the capital and seat of government of India.",
    difficulty: "easy",
    subject: "Geography",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1,
    explanation: "Mars is called the Red Planet due to iron oxide on its surface.",
    difficulty: "easy",
    subject: "Science",
  },
  {
    id: 3,
    question: "What is 15 × 8?",
    options: ["110", "120", "130", "140"],
    correct: 1,
    explanation: "15 × 8 = 120. You can solve this by (10 × 8) + (5 × 8) = 80 + 40 = 120.",
    difficulty: "medium",
    subject: "Mathematics",
  },
  {
    id: 4,
    question: "Who wrote the Indian National Anthem?",
    options: ["Mahatma Gandhi", "Rabindranath Tagore", "Subhas Chandra Bose", "Jawaharlal Nehru"],
    correct: 1,
    explanation: "Rabindranath Tagore wrote 'Jana Gana Mana', India's National Anthem.",
    difficulty: "medium",
    subject: "History",
  },
  {
    id: 5,
    question: "What is the process by which plants make their food?",
    options: ["Respiration", "Photosynthesis", "Digestion", "Absorption"],
    correct: 1,
    explanation: "Photosynthesis is the process where plants use sunlight, water, and CO2 to make glucose.",
    difficulty: "easy",
    subject: "Science",
  },
]

export function InteractiveQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isActive, setIsActive] = useState(false)
  const [streak, setStreak] = useState(0)
  const [totalXP, setTotalXP] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isActive && timeLeft > 0 && !showResult) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimeUp()
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, showResult])

  const startQuiz = () => {
    setIsActive(true)
    setTimeLeft(30)
  }

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      setStreak(0)
      nextQuestion()
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(answerIndex)
    setIsActive(false)

    const isCorrect = answerIndex === sampleQuestions[currentQuestion].correct
    if (isCorrect) {
      const baseXP =
        sampleQuestions[currentQuestion].difficulty === "easy"
          ? 10
          : sampleQuestions[currentQuestion].difficulty === "medium"
            ? 15
            : 20
      const timeBonus = Math.floor(timeLeft / 3)
      const streakBonus = streak >= 3 ? 5 : 0
      const earnedXP = baseXP + timeBonus + streakBonus

      setScore(score + 1)
      setStreak(streak + 1)
      setTotalXP(totalXP + earnedXP)
    } else {
      setStreak(0)
    }

    setShowExplanation(true)
  }

  const nextQuestion = () => {
    setShowExplanation(false)
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setTimeLeft(30)
      setIsActive(true)
    } else {
      setShowResult(true)
      setIsActive(false)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
    setTimeLeft(30)
    setIsActive(false)
    setStreak(0)
    setTotalXP(0)
    setShowExplanation(false)
  }

  const getScoreMessage = () => {
    const percentage = (score / sampleQuestions.length) * 100
    if (percentage >= 80) return "Excellent! 🌟"
    if (percentage >= 60) return "Good job! 👍"
    if (percentage >= 40) return "Keep practicing! 📚"
    return "Don't give up! 💪"
  }

  if (showResult) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-accent-foreground" />
          </div>
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
          <p className="text-muted-foreground">{getScoreMessage()}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-card rounded-lg border">
              <div className="text-2xl font-bold text-primary">{score}</div>
              <div className="text-sm text-muted-foreground">Correct Answers</div>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border">
              <div className="text-2xl font-bold text-secondary">
                {Math.round((score / sampleQuestions.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-accent/10 rounded-lg border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-lg font-bold text-accent">{totalXP}</span>
              </div>
              <div className="text-sm text-muted-foreground">XP Earned</div>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-lg font-bold text-primary">{streak}</span>
              </div>
              <div className="text-sm text-muted-foreground">Best Streak</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={resetQuiz} className="flex-1">
              Try Again
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              View Leaderboard
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Interactive Quiz
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {sampleQuestions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {totalXP} XP
            </Badge>
            {streak > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {streak} streak
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={(currentQuestion / sampleQuestions.length) * 100} className="h-2" />
          <div className="flex items-center justify-between text-sm">
            <Badge
              variant={
                sampleQuestions[currentQuestion].difficulty === "easy"
                  ? "secondary"
                  : sampleQuestions[currentQuestion].difficulty === "medium"
                    ? "default"
                    : "destructive"
              }
            >
              {sampleQuestions[currentQuestion].difficulty}
            </Badge>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className={timeLeft <= 10 ? "text-destructive font-bold" : ""}>{timeLeft}s</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!isActive && currentQuestion === 0 && selectedAnswer === null ? (
          <div className="text-center space-y-4">
            <div className="text-lg font-medium">Ready to start the quiz?</div>
            <Button onClick={startQuiz} size="lg" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Start Quiz
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="text-lg font-medium leading-relaxed">{sampleQuestions[currentQuestion].question}</div>

              <div className="grid gap-3">
                {sampleQuestions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      selectedAnswer === null
                        ? "outline"
                        : selectedAnswer === index
                          ? index === sampleQuestions[currentQuestion].correct
                            ? "default"
                            : "destructive"
                          : index === sampleQuestions[currentQuestion].correct
                            ? "default"
                            : "outline"
                    }
                    className="justify-start text-left h-auto p-4 whitespace-normal"
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                  >
                    <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            {showExplanation && (
              <div className="p-4 bg-muted rounded-lg border">
                <div className="font-medium mb-2">Explanation:</div>
                <p className="text-sm text-muted-foreground">{sampleQuestions[currentQuestion].explanation}</p>
                <Button onClick={nextQuestion} className="mt-3">
                  {currentQuestion < sampleQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
