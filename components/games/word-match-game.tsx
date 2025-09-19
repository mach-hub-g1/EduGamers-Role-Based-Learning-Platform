"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, RotateCw, ArrowLeft } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

const WORDS = [
  { word: "Ephemeral", meaning: "Lasting for a very short time" },
  { word: "Ubiquitous", meaning: "Present everywhere" },
  { word: "Eloquent", meaning: "Fluent or persuasive in speaking or writing" },
  { word: "Meticulous", meaning: "Showing great attention to detail" },
  { word: "Resilient", meaning: "Able to recover quickly from difficulties" },
]

const OPTIONS = [
  "Present everywhere",
  "Lasting for a very short time",
  "Fluent or persuasive in speaking or writing",
  "Able to recover quickly from difficulties",
  "Showing great attention to detail",
  "Extremely happy",
  "Very large in size",
  "Moving quickly"
]

interface WordMatchGameProps {
  onComplete: (score: number) => void;
  onBack?: () => void;
}

export function WordMatchGame({ onComplete, onBack }: WordMatchGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isGameOver, setIsGameOver] = useState(false)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [currentOptions, setCurrentOptions] = useState<string[]>([])
  const router = useRouter()
  
  const currentWord = WORDS[currentIndex]
  
  // Generate stable options for the current question
  useEffect(() => {
    const generateOptions = () => {
      const shuffledOptions = [...OPTIONS].sort(() => Math.random() - 0.5).slice(0, 3)
      
      // Ensure the correct answer is included
      if (!shuffledOptions.includes(currentWord.meaning)) {
        shuffledOptions[2] = currentWord.meaning
      }
      
      // Add the correct answer and shuffle once
      const finalOptions = [...new Set([...shuffledOptions, currentWord.meaning])]
      return finalOptions.sort(() => Math.random() - 0.5)
    }
    
    setCurrentOptions(generateOptions())
  }, [currentIndex, currentWord.meaning])

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setIsGameOver(true)
      onComplete(score)
    }
  }, [timeLeft, isGameOver, score, onComplete])

  const handleAnswer = (option: string) => {
    if (selectedOption) return // Prevent multiple selections
    
    setSelectedOption(option)
    setTotalQuestions(prev => prev + 1)
    
    if (option === currentWord.meaning) {
      setScore(score + 10)
      setCorrectAnswers(prev => prev + 1)
    }
    
    setTimeout(() => {
      if (currentIndex < WORDS.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setSelectedOption(null)
      } else {
        setIsGameOver(true)
        onComplete(option === currentWord.meaning ? score + 10 : score)
      }
    }, 1000)
  }

  const restartGame = () => {
    setCurrentIndex(0)
    setSelectedOption(null)
    setScore(0)
    setTimeLeft(60)
    setIsGameOver(false)
    setCurrentOptions([])
    setTotalQuestions(0)
    setCorrectAnswers(0)
    setStartTime(Date.now())
  }

  if (isGameOver) {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
    const wordsPerMinute = timeElapsed > 0 ? Math.round((totalQuestions * 60) / timeElapsed) : 0
    
    const getPerformanceGrade = () => {
      if (accuracy >= 90) return { grade: 'A+', color: 'text-green-600', message: 'Outstanding vocabulary mastery!' }
      if (accuracy >= 80) return { grade: 'A', color: 'text-green-500', message: 'Excellent word knowledge!' }
      if (accuracy >= 70) return { grade: 'B', color: 'text-blue-500', message: 'Good vocabulary skills!' }
      if (accuracy >= 60) return { grade: 'C', color: 'text-yellow-500', message: 'Keep practicing!' }
      return { grade: 'D', color: 'text-red-500', message: 'More study needed!' }
    }
    
    const performance = getPerformanceGrade()
    
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
          <CardTitle className="text-2xl font-bold text-center">Vocabulary Results!</CardTitle>
          <div className="text-center mt-2">
            <span className={`text-6xl font-bold ${performance.color}`}>{performance.grade}</span>
            <p className="text-sm text-muted-foreground mt-1">{performance.message}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-muted-foreground">Final Score</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="font-bold text-lg">{correctAnswers}</div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            <div>
              <div className="font-bold text-lg">{totalQuestions - correctAnswers}</div>
              <div className="text-xs text-muted-foreground">Incorrect</div>
            </div>
            <div>
              <div className="font-bold text-lg">{wordsPerMinute}</div>
              <div className="text-xs text-muted-foreground">Words/Min</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium mb-2">📊 Performance Summary</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Time taken: {Math.floor(timeElapsed / 60)}m {timeElapsed % 60}s</div>
              <div>• Questions answered: {totalQuestions} of {WORDS.length}</div>
              <div>• Learning focus: {accuracy < 70 ? 'Review word meanings' : 'Expand vocabulary'}</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              onClick={restartGame}
              className="w-full"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Practice Again
            </Button>
            <Button 
              onClick={() => onComplete(score)}
              className="w-full"
            >
              Continue Learning
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Word Match</CardTitle>
          <div className="flex items-center gap-2">
            <div className="font-medium">Score: {score}</div>
            <div className="w-20">
              <Progress value={(timeLeft / 60) * 100} className="h-2" />
              <div className="text-xs text-right">{timeLeft}s</div>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Match the word with its correct meaning
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-2xl font-bold text-center py-8 bg-muted/50 rounded-lg">
          {currentWord.word}
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {currentOptions.map((option: string) => {
            const isSelected = selectedOption === option
            const isCorrect = option === currentWord.meaning
            const showResult = selectedOption !== null
            
            let buttonVariant: "default" | "secondary" | "destructive" | "outline" = "outline"
            
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
                className={`h-auto min-h-[60px] py-3 px-4 justify-start text-left whitespace-normal ${showResult ? 'cursor-default' : 'hover:bg-secondary/50'}`}
                onClick={() => handleAnswer(option)}
                disabled={selectedOption !== null}
              >
                <div className="flex items-center w-full">
                  {showResult && (
                    <div className="mr-3">
                      {isSelected ? (
                        isCorrect ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )
                      ) : isCorrect ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : null}
                    </div>
                  )}
                  <span>{option}</span>
                </div>
              </Button>
            )
          })}
        </div>
        
        <div className="text-sm text-muted-foreground text-center">
          Question {currentIndex + 1} of {WORDS.length}
        </div>
      </CardContent>
    </Card>
  )
}
