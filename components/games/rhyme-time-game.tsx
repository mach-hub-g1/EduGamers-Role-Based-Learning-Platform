"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RotateCw, ArrowLeft, Volume2 } from "lucide-react"

interface RhymeTimeGameProps {
  onComplete: (score: number) => void;
  onBack?: () => void;
}

const RHYME_PAIRS = [
  { word: 'Cat', rhymes: ['Hat', 'Bat', 'Mat'], nonRhymes: ['Dog', 'Car', 'Sun'] },
  { word: 'Tree', rhymes: ['Bee', 'Sea', 'Key'], nonRhymes: ['Rock', 'Fish', 'Book'] },
  { word: 'Ball', rhymes: ['Call', 'Fall', 'Wall'], nonRhymes: ['Cup', 'Pen', 'Sky'] },
  { word: 'Light', rhymes: ['Night', 'Bright', 'Right'], nonRhymes: ['Dark', 'Heavy', 'Cold'] },
  { word: 'Rain', rhymes: ['Train', 'Brain', 'Main'], nonRhymes: ['Snow', 'Wind', 'Cloud'] },
  { word: 'Star', rhymes: ['Car', 'Far', 'Jar'], nonRhymes: ['Moon', 'Planet', 'Space'] },
  { word: 'House', rhymes: ['Mouse', 'Blouse'], nonRhymes: ['Building', 'Tree', 'Road', 'Garden'] },
  { word: 'Blue', rhymes: ['New', 'True', 'You'], nonRhymes: ['Red', 'Green', 'Color'] },
]

interface RhymeQuestion {
  targetWord: string
  options: string[]
  correctRhymes: string[]
}

export function RhymeTimeGame({ onComplete, onBack }: RhymeTimeGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<RhymeQuestion | null>(null)
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(90)
  const [isGameOver, setIsGameOver] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set())
  const [totalCorrectSelections, setTotalCorrectSelections] = useState(0)
  const [totalIncorrectSelections, setTotalIncorrectSelections] = useState(0)
  const [perfectRounds, setPerfectRounds] = useState(0)
  const [startTime, setStartTime] = useState<number>(Date.now())

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
    const availableWords = RHYME_PAIRS.filter(pair => !usedWords.has(pair.word))
    
    if (availableWords.length === 0 || questionCount >= 8) {
      setIsGameOver(true)
      onComplete(score)
      return
    }

    const selectedPair = availableWords[Math.floor(Math.random() * availableWords.length)]
    
    // Mix rhymes and non-rhymes
    const allOptions = [...selectedPair.rhymes, ...selectedPair.nonRhymes]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6)

    const question: RhymeQuestion = {
      targetWord: selectedPair.word,
      options: allOptions,
      correctRhymes: selectedPair.rhymes.filter(rhyme => allOptions.includes(rhyme))
    }

    setCurrentQuestion(question)
    setSelectedWords([])
    setShowResult(false)
    setUsedWords(prev => new Set([...prev, selectedPair.word]))
  }

  const handleWordSelect = (word: string) => {
    if (showResult) return

    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word))
    } else {
      setSelectedWords([...selectedWords, word])
    }
  }

  const checkAnswer = () => {
    if (!currentQuestion || selectedWords.length === 0) return

    setShowResult(true)
    
    const correctlySelected = selectedWords.filter(word => 
      currentQuestion.correctRhymes.includes(word)
    ).length
    
    const incorrectlySelected = selectedWords.length - correctlySelected
    const missedCorrect = currentQuestion.correctRhymes.length - correctlySelected

    // Track performance statistics
    setTotalCorrectSelections(prev => prev + correctlySelected)
    setTotalIncorrectSelections(prev => prev + incorrectlySelected)
    
    // Check for perfect round (all correct rhymes found, no incorrect ones)
    if (correctlySelected === currentQuestion.correctRhymes.length && incorrectlySelected === 0) {
      setPerfectRounds(prev => prev + 1)
    }

    // Scoring: +10 for each correct, -5 for each incorrect
    const points = Math.max(0, (correctlySelected * 10) - (incorrectlySelected * 5))
    setScore(score + points)
    setQuestionCount(questionCount + 1)

    setTimeout(() => {
      if (questionCount >= 7 || timeLeft <= 10) {
        setIsGameOver(true)
        onComplete(score + points)
      } else {
        generateNewQuestion()
      }
    }, 2500)
  }

  const restartGame = () => {
    setScore(0)
    setTimeLeft(90)
    setSelectedWords([])
    setShowResult(false)
    setQuestionCount(0)
    setUsedWords(new Set())
    setIsGameOver(false)
    setTotalCorrectSelections(0)
    setTotalIncorrectSelections(0)
    setPerfectRounds(0)
    setStartTime(Date.now())
    generateNewQuestion()
  }

  if (isGameOver) {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
    const totalSelections = totalCorrectSelections + totalIncorrectSelections
    const accuracy = totalSelections > 0 ? Math.round((totalCorrectSelections / totalSelections) * 100) : 0
    const avgTimePerQuestion = questionCount > 0 ? Math.round(timeElapsed / questionCount) : 0
    
    const getPhoneticGrade = () => {
      if (perfectRounds >= 6) return { grade: 'A+', color: 'text-purple-600', message: 'Phonetic genius! Outstanding rhyme mastery!' }
      if (accuracy >= 85) return { grade: 'A', color: 'text-green-600', message: 'Excellent rhyming skills!' }
      if (accuracy >= 70) return { grade: 'B', color: 'text-blue-500', message: 'Good phonetic awareness!' }
      if (accuracy >= 55) return { grade: 'C', color: 'text-yellow-500', message: 'Practice makes perfect!' }
      return { grade: 'D', color: 'text-red-500', message: 'Keep working on sound patterns!' }
    }
    
    const performance = getPhoneticGrade()
    
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
          <CardTitle className="text-2xl font-bold text-center">Rhyme Master Results!</CardTitle>
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
              <div className="font-bold text-lg text-purple-600">{perfectRounds}</div>
              <div className="text-xs text-muted-foreground">Perfect Rounds</div>
            </div>
            <div>
              <div className="font-bold text-lg text-green-600">{totalCorrectSelections}</div>
              <div className="text-xs text-muted-foreground">Correct Rhymes</div>
            </div>
            <div>
              <div className="font-bold text-lg text-orange-600">{avgTimePerQuestion}s</div>
              <div className="text-xs text-muted-foreground">Avg/Question</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium mb-2">🎥 Phonetic Analysis</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Rhymes completed: {questionCount} challenges</div>
              <div>• Sound pattern mastery: {accuracy >= 70 ? 'Strong' : 'Developing'}</div>
              <div>• Focus area: {perfectRounds < 3 ? 'Practice identifying rhyme patterns' : 'Expand to complex phonetics'}</div>
              <div>• Total time: {Math.floor(timeElapsed / 60)}m {timeElapsed % 60}s</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              onClick={restartGame}
              className="w-full"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Rhyme Again
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

  if (!currentQuestion) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Rhyme Time
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="font-medium">Score: {score}</div>
            <div className="w-20">
              <Progress value={(timeLeft / 90) * 100} className="h-2" />
              <div className="text-xs text-right">{timeLeft}s</div>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Select all words that rhyme with the target word
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-8 bg-muted/50 rounded-lg">
          <div className="text-4xl font-bold mb-2">{currentQuestion.targetWord}</div>
          <div className="text-sm text-muted-foreground">Find words that rhyme!</div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {currentQuestion.options.map((word) => {
            const isSelected = selectedWords.includes(word)
            const isCorrectRhyme = currentQuestion.correctRhymes.includes(word)
            
            let buttonVariant: "default" | "secondary" | "destructive" | "outline" = "outline"
            let buttonClass = "h-16 text-lg font-medium transition-all duration-300"
            
            if (showResult) {
              if (isSelected) {
                buttonVariant = isCorrectRhyme ? "default" : "destructive"
                buttonClass += isCorrectRhyme ? " ring-2 ring-green-500" : " ring-2 ring-red-500"
              } else if (isCorrectRhyme) {
                buttonVariant = "default"
                buttonClass += " ring-2 ring-green-500 opacity-70"
              }
            } else if (isSelected) {
              buttonVariant = "secondary"
            }
            
            return (
              <Button
                key={word}
                variant={buttonVariant}
                className={buttonClass}
                onClick={() => handleWordSelect(word)}
                disabled={showResult}
              >
                {word}
              </Button>
            )
          })}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Question {questionCount + 1} of 8 • Selected: {selectedWords.length}
          </div>
          <Button 
            onClick={checkAnswer} 
            disabled={selectedWords.length === 0 || showResult}
          >
            Check Rhymes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}