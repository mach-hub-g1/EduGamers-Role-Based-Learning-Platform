"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, Star, Zap, Trophy, Target, Brain, Flame } from "lucide-react"

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  difficulty: "easy" | "medium" | "hard"
  subject: string
  explanation?: string
}

interface QuizResult {
  score: number
  totalQuestions: number
  timeSpent: number
  xpEarned: number
  achievements: string[]
}

const sampleQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the capital of India?",
    options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
    correctAnswer: 1,
    difficulty: "easy",
    subject: "Geography",
    explanation: "New Delhi is the capital and seat of government of India.",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    difficulty: "easy",
    subject: "Science",
    explanation: "Mars appears red due to iron oxide (rust) on its surface.",
  },
  {
    id: 3,
    question: "What is 15 × 12?",
    options: ["170", "180", "190", "200"],
    correctAnswer: 1,
    difficulty: "medium",
    subject: "Mathematics",
    explanation: "15 × 12 = 180. You can calculate this as (15 × 10) + (15 × 2) = 150 + 30 = 180.",
  },
  {
    id: 4,
    question: "Who wrote the Indian national anthem?",
    options: ["Mahatma Gandhi", "Rabindranath Tagore", "Subhas Chandra Bose", "Jawaharlal Nehru"],
    correctAnswer: 1,
    difficulty: "medium",
    subject: "History",
    explanation: "Rabindranath Tagore wrote 'Jana Gana Mana', which became India's national anthem.",
  },
  {
    id: 5,
    question: "What is the chemical formula for water?",
    options: ["CO2", "H2O", "NaCl", "O2"],
    correctAnswer: 1,
    difficulty: "easy",
    subject: "Science",
    explanation: "Water consists of two hydrogen atoms and one oxygen atom, hence H2O.",
  },
]

export default function EnhancedQuizSystem() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [quizStarted, setQuizStarted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [streak, setStreak] = useState(0)
  const [totalTimeSpent, setTotalTimeSpent] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (quizStarted && timeLeft > 0 && !showResult && !showExplanation) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
        setTotalTimeSpent((prev) => prev + 1)
      }, 1000)
    } else if (timeLeft === 0 && !showExplanation) {
      handleTimeUp()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, quizStarted, showResult, showExplanation])

  const handleTimeUp = () => {
    setAnswers((prev) => [...prev, -1]) // -1 indicates no answer
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setTimeLeft(30)
      setSelectedAnswer(null)
    } else {
      setShowResult(true)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === sampleQuestions[currentQuestion].correctAnswer
    setAnswers((prev) => [...prev, selectedAnswer])

    if (isCorrect) {
      setStreak((prev) => prev + 1)
    } else {
      setStreak(0)
    }

    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    setShowExplanation(false)
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setTimeLeft(30)
      setSelectedAnswer(null)
    } else {
      setShowResult(true)
    }
  }

  const calculateResults = (): QuizResult => {
    const correctAnswers = answers.filter((answer, index) => answer === sampleQuestions[index].correctAnswer).length

    const score = Math.round((correctAnswers / sampleQuestions.length) * 100)
    let xpEarned = correctAnswers * 25 // Base XP per correct answer

    // Bonus XP for performance
    if (score === 100) xpEarned += 100 // Perfect score bonus
    if (score >= 80) xpEarned += 50 // High score bonus
    if (streak >= 3) xpEarned += streak * 10 // Streak bonus

    const achievements = []
    if (score === 100) achievements.push("Perfect Score!")
    if (streak >= 5) achievements.push("Answer Streak Master!")
    if (totalTimeSpent < 120) achievements.push("Speed Demon!")

    return {
      score,
      totalQuestions: sampleQuestions.length,
      timeSpent: totalTimeSpent,
      xpEarned,
      achievements,
    }
  }

  const startQuiz = () => {
    setQuizStarted(true)
    setCurrentQuestion(0)
    setAnswers([])
    setTimeLeft(30)
    setShowResult(false)
    setStreak(0)
    setTotalTimeSpent(0)
  }

  const resetQuiz = () => {
    setQuizStarted(false)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setAnswers([])
    setShowResult(false)
    setShowExplanation(false)
    setTimeLeft(30)
    setStreak(0)
    setTotalTimeSpent(0)
  }

  if (!quizStarted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Brain className="h-8 w-8 text-primary" />
            Interactive Quiz Challenge
          </CardTitle>
          <p className="text-muted-foreground">Test your knowledge across multiple subjects and earn XP!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Target className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="font-semibold text-blue-800">{sampleQuestions.length}</p>
              <p className="text-xs text-blue-600">Questions</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="font-semibold text-green-800">30s</p>
              <p className="text-xs text-green-600">Per Question</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <Star className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="font-semibold text-purple-800">25 XP</p>
              <p className="text-xs text-purple-600">Per Correct</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <Flame className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <p className="font-semibold text-orange-800">Bonus</p>
              <p className="text-xs text-orange-600">For Streaks</p>
            </div>
          </div>

          <Button onClick={startQuiz} className="w-full" size="lg">
            <Zap className="h-5 w-5 mr-2" />
            Start Quiz Challenge
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (showResult) {
    const results = calculateResults()
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-primary mb-2">{results.score}%</div>
            <p className="text-lg text-muted-foreground">
              {results.score === 100
                ? "Perfect Score!"
                : results.score >= 80
                  ? "Excellent Work!"
                  : results.score >= 60
                    ? "Good Job!"
                    : "Keep Practicing!"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="font-semibold text-green-800">
                {answers.filter((answer, index) => answer === sampleQuestions[index].correctAnswer).length}
              </p>
              <p className="text-xs text-green-600">Correct Answers</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Star className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="font-semibold text-blue-800">+{results.xpEarned}</p>
              <p className="text-xs text-blue-600">XP Earned</p>
            </div>
          </div>

          {results.achievements.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-center">Achievements Unlocked!</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {results.achievements.map((achievement, index) => (
                  <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-800">
                    🏆 {achievement}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={resetQuiz} variant="outline" className="flex-1 bg-transparent">
              Try Again
            </Button>
            <Button onClick={() => window.location.reload()} className="flex-1">
              New Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const question = sampleQuestions[currentQuestion]
  const isCorrect = selectedAnswer === question.correctAnswer

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Badge variant="outline">{question.subject}</Badge>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className={`font-mono ${timeLeft <= 10 ? "text-red-500" : ""}`}>{timeLeft}s</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              Question {currentQuestion + 1} of {sampleQuestions.length}
            </span>
            {streak > 0 && (
              <span className="flex items-center gap-1 text-orange-600">
                <Flame className="h-4 w-4" />
                {streak} streak
              </span>
            )}
          </div>
          <Progress value={((currentQuestion + 1) / sampleQuestions.length) * 100} />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className={`w-full text-left justify-start h-auto p-4 ${
                  showExplanation
                    ? index === question.correctAnswer
                      ? "bg-green-100 border-green-500 text-green-800"
                      : selectedAnswer === index && index !== question.correctAnswer
                        ? "bg-red-100 border-red-500 text-red-800"
                        : "opacity-50"
                    : ""
                }`}
                onClick={() => !showExplanation && handleAnswerSelect(index)}
                disabled={showExplanation}
              >
                <span className="mr-3 font-semibold">{String.fromCharCode(65 + index)}.</span>
                {option}
                {showExplanation && index === question.correctAnswer && (
                  <CheckCircle className="h-5 w-5 ml-auto text-green-600" />
                )}
                {showExplanation && selectedAnswer === index && index !== question.correctAnswer && (
                  <XCircle className="h-5 w-5 ml-auto text-red-600" />
                )}
              </Button>
            ))}
          </div>
        </div>

        {showExplanation && question.explanation && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
            <p className="text-blue-700">{question.explanation}</p>
          </div>
        )}

        <div className="flex justify-between">
          {!showExplanation ? (
            <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null} className="ml-auto">
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} className="ml-auto">
              {currentQuestion < sampleQuestions.length - 1 ? "Next Question" : "View Results"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
