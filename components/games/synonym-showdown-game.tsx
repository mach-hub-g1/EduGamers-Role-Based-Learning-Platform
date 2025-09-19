"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, RotateCw, ArrowLeft } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

const SYNONYMS = [
  { word: "Happy", options: ["Joyful", "Content", "Sad", "Angry"], correct: ["Joyful", "Content"] },
  { word: "Big", options: ["Large", "Huge", "Small", "Tiny"], correct: ["Large", "Huge"] },
  { word: "Fast", options: ["Quick", "Speedy", "Slow", "Lazy"], correct: ["Quick", "Speedy"] },
  { word: "Smart", options: ["Intelligent", "Clever", "Dull", "Stupid"], correct: ["Intelligent", "Clever"] },
  { word: "Beautiful", options: ["Gorgeous", "Lovely", "Ugly", "Plain"], correct: ["Gorgeous", "Lovely"] },
]

interface SynonymShowdownGameProps {
  onComplete: (score: number) => void;
  onBack?: () => void;
}

export function SynonymShowdownGame({ onComplete, onBack }: SynonymShowdownGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(90)
  const [isGameOver, setIsGameOver] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [currentOptions, setCurrentOptions] = useState<string[]>([])
  const router = useRouter()
  
  const currentWord = SYNONYMS[currentIndex % SYNONYMS.length]
  
  // Generate stable options for the current question
  useEffect(() => {
    const generateOptions = () => {
      return [...currentWord.options].sort(() => Math.random() - 0.5)
    }
    
    setCurrentOptions(generateOptions())
  }, [currentIndex, currentWord.options])
  
  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setIsGameOver(true)
      onComplete(score)
    }
  }, [timeLeft, isGameOver, score, onComplete])

  const handleSelect = (option: string) => {
    if (showResult) return
    
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option))
    } else if (selectedOptions.length < 2) {
      setSelectedOptions([...selectedOptions, option])
    }
  }

  const checkAnswer = () => {
    if (selectedOptions.length === 0) return
    
    const isCorrect = selectedOptions.every(option => 
      currentWord.correct.includes(option)
    ) && selectedOptions.length === currentWord.correct.length
    
    if (isCorrect) {
      setScore(score + 20)
    }
    
    setShowResult(true)
    
    setTimeout(() => {
      setSelectedOptions([])
      setShowResult(false)
      
      if (currentIndex < SYNONYMS.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        setIsGameOver(true)
        onComplete(isCorrect ? score + 20 : score)
      }
    }, 2000)
  }

  const restartGame = () => {
    setCurrentIndex(0)
    setSelectedOptions([])
    setScore(0)
    setTimeLeft(90)
    setIsGameOver(false)
    setShowResult(false)
    setCurrentOptions([])
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
            <p className="text-muted-foreground">Your Score, User</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Synonym Showdown</CardTitle>
          <div className="flex items-center gap-2">
            <div className="font-medium">Score: {score}</div>
            <div className="w-20">
              <Progress value={(timeLeft / 90) * 100} className="h-2" />
              <div className="text-xs text-right">{timeLeft}s</div>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Select all the synonyms for the given word
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-2xl font-bold text-center py-8 bg-muted/50 rounded-lg">
          {currentWord.word}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {currentOptions.map((option: string) => {
            const isSelected = selectedOptions.includes(option)
            const isCorrect = currentWord.correct.includes(option)
            
            let buttonVariant: "default" | "secondary" | "destructive" | "outline" = "outline"
            
            if (showResult) {
              if (isSelected) {
                buttonVariant = isCorrect ? "default" : "destructive"
              } else if (isCorrect) {
                buttonVariant = "default"
              }
            } else if (isSelected) {
              buttonVariant = "secondary"
            }
            
            return (
              <Button
                key={option}
                variant={buttonVariant}
                className={`h-auto min-h-[80px] py-3 px-4 justify-center text-center ${showResult ? 'cursor-default' : 'hover:bg-secondary/50'}`}
                onClick={() => handleSelect(option)}
                disabled={showResult}
              >
                <div className="flex items-center justify-center">
                  {option}
                </div>
              </Button>
            )
          })}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Question {currentIndex + 1} of {SYNONYMS.length}
          </div>
          <Button 
            onClick={checkAnswer} 
            disabled={selectedOptions.length === 0 || showResult}
          >
            Check Answer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
