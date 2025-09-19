"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RotateCw, ArrowLeft, MapPin, Flag } from "lucide-react"

interface CountryCapitalGameProps {
  onComplete: (score: number) => void;
  onBack?: () => void;
}

const COUNTRIES_AND_CAPITALS = [
  { country: 'France', capital: 'Paris', region: 'Europe' },
  { country: 'Japan', capital: 'Tokyo', region: 'Asia' },
  { country: 'Australia', capital: 'Canberra', region: 'Oceania' },
  { country: 'Brazil', capital: 'Brasília', region: 'South America' },
  { country: 'Egypt', capital: 'Cairo', region: 'Africa' },
  { country: 'Canada', capital: 'Ottawa', region: 'North America' },
  { country: 'Germany', capital: 'Berlin', region: 'Europe' },
  { country: 'India', capital: 'New Delhi', region: 'Asia' },
  { country: 'Mexico', capital: 'Mexico City', region: 'North America' },
  { country: 'South Africa', capital: 'Cape Town', region: 'Africa' },
  { country: 'Russia', capital: 'Moscow', region: 'Europe/Asia' },
  { country: 'Thailand', capital: 'Bangkok', region: 'Asia' },
  { country: 'Argentina', capital: 'Buenos Aires', region: 'South America' },
  { country: 'Italy', capital: 'Rome', region: 'Europe' },
  { country: 'Kenya', capital: 'Nairobi', region: 'Africa' },
  { country: 'Spain', capital: 'Madrid', region: 'Europe' },
  { country: 'China', capital: 'Beijing', region: 'Asia' },
  { country: 'United Kingdom', capital: 'London', region: 'Europe' },
  { country: 'Chile', capital: 'Santiago', region: 'South America' },
  { country: 'Nigeria', capital: 'Abuja', region: 'Africa' },
]

interface Question {
  country: string
  correctCapital: string
  options: string[]
  region: string
}

export function CountryCapitalGame({ onComplete, onBack }: CountryCapitalGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes
  const [isGameOver, setIsGameOver] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [usedCountries, setUsedCountries] = useState<Set<string>>(new Set())

  useEffect(() => {
    generateNewQuestion()
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

  const generateNewQuestion = () => {
    // Filter out already used countries
    const availableCountries = COUNTRIES_AND_CAPITALS.filter(
      item => !usedCountries.has(item.country)
    )
    
    if (availableCountries.length === 0) {
      // All countries used, end game
      setIsGameOver(true)
      onComplete(score)
      return
    }
    
    const correctAnswer = availableCountries[Math.floor(Math.random() * availableCountries.length)]
    
    // Generate wrong options
    const wrongOptions = COUNTRIES_AND_CAPITALS
      .filter(item => item.capital !== correctAnswer.capital)
      .map(item => item.capital)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
    
    // Combine and shuffle all options
    const allOptions = [correctAnswer.capital, ...wrongOptions]
      .sort(() => Math.random() - 0.5)
    
    const question: Question = {
      country: correctAnswer.country,
      correctCapital: correctAnswer.capital,
      options: allOptions,
      region: correctAnswer.region
    }
    
    setCurrentQuestion(question)
    setSelectedAnswer(null)
    setShowResult(false)
    setUsedCountries(prev => new Set([...prev, correctAnswer.country]))
  }

  const handleAnswer = (capital: string) => {
    if (!currentQuestion || showResult) return
    
    setSelectedAnswer(capital)
    setShowResult(true)
    
    const isCorrect = capital === currentQuestion.correctCapital
    
    if (isCorrect) {
      setScore(score + 15)
      setCorrectAnswers(correctAnswers + 1)
    }
    
    setQuestionCount(questionCount + 1)
    
    setTimeout(() => {
      if (questionCount >= 15 || timeLeft <= 10 || usedCountries.size >= COUNTRIES_AND_CAPITALS.length) {
        setIsGameOver(true)
        onComplete(isCorrect ? score + 15 : score)
      } else {
        generateNewQuestion()
      }
    }, 2000)
  }

  const restartGame = () => {
    setScore(0)
    setTimeLeft(120)
    setSelectedAnswer(null)
    setShowResult(false)
    setQuestionCount(0)
    setCorrectAnswers(0)
    setUsedCountries(new Set())
    setIsGameOver(false)
    generateNewQuestion()
  }

  if (isGameOver) {
    const accuracy = questionCount > 0 ? Math.round((correctAnswers / questionCount) * 100) : 0
    
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
          <CardTitle className="text-2xl font-bold text-center">Journey Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-4xl font-bold mb-2">{score}</p>
            <p className="text-muted-foreground">Final Score</p>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <div className="font-medium">{correctAnswers}/{questionCount}</div>
                <div className="text-muted-foreground">Correct</div>
              </div>
              <div>
                <div className="font-medium">{accuracy}%</div>
                <div className="text-muted-foreground">Accuracy</div>
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
              Explore Again
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

  if (!currentQuestion) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            World Explorer
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="font-medium">Score: {score}</div>
            <div className="w-20">
              <Progress value={(timeLeft / 120) * 100} className="h-2" />
              <div className="text-xs text-right">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          What is the capital city of this country?
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-8 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flag className="h-6 w-6 text-primary" />
            <div className="text-3xl font-bold">{currentQuestion.country}</div>
          </div>
          <div className="text-sm text-muted-foreground">
            {currentQuestion.region}
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === currentQuestion.correctCapital
            
            let buttonVariant: "default" | "secondary" | "destructive" | "outline" = "outline"
            let buttonClass = "h-auto min-h-[60px] py-3 px-4 text-left justify-start transition-all duration-300"
            
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
                key={option}
                variant={buttonVariant}
                className={buttonClass}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
              >
                <div className="flex items-center w-full">
                  <span className="text-sm font-medium mr-3 text-muted-foreground">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span>{option}</span>
                </div>
              </Button>
            )
          })}
        </div>
        
        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            Question {questionCount + 1} • {correctAnswers} correct
          </div>
          <Progress value={(questionCount / 15) * 100} className="mt-2" />
        </div>
      </CardContent>
    </Card>
  )
}