"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RotateCw, ArrowLeft, Beaker } from "lucide-react"

interface ElementMatchGameProps {
  onComplete: (score: number) => void;
  onBack?: () => void;
}

const ELEMENTS = [
  { symbol: 'H', name: 'Hydrogen', number: 1, category: 'Nonmetal' },
  { symbol: 'He', name: 'Helium', number: 2, category: 'Noble Gas' },
  { symbol: 'Li', name: 'Lithium', number: 3, category: 'Alkali Metal' },
  { symbol: 'C', name: 'Carbon', number: 6, category: 'Nonmetal' },
  { symbol: 'N', name: 'Nitrogen', number: 7, category: 'Nonmetal' },
  { symbol: 'O', name: 'Oxygen', number: 8, category: 'Nonmetal' },
  { symbol: 'Na', name: 'Sodium', number: 11, category: 'Alkali Metal' },
  { symbol: 'Mg', name: 'Magnesium', number: 12, category: 'Alkaline Earth' },
  { symbol: 'Al', name: 'Aluminum', number: 13, category: 'Metal' },
  { symbol: 'Si', name: 'Silicon', number: 14, category: 'Metalloid' },
  { symbol: 'Cl', name: 'Chlorine', number: 17, category: 'Halogen' },
  { symbol: 'Ar', name: 'Argon', number: 18, category: 'Noble Gas' },
  { symbol: 'K', name: 'Potassium', number: 19, category: 'Alkali Metal' },
  { symbol: 'Ca', name: 'Calcium', number: 20, category: 'Alkaline Earth' },
  { symbol: 'Fe', name: 'Iron', number: 26, category: 'Transition Metal' },
  { symbol: 'Cu', name: 'Copper', number: 29, category: 'Transition Metal' },
  { symbol: 'Zn', name: 'Zinc', number: 30, category: 'Transition Metal' },
  { symbol: 'Ag', name: 'Silver', number: 47, category: 'Transition Metal' },
  { symbol: 'Au', name: 'Gold', number: 79, category: 'Transition Metal' },
  { symbol: 'Pb', name: 'Lead', number: 82, category: 'Metal' },
]

interface ElementQuestion {
  element: typeof ELEMENTS[0]
  questionType: 'symbol-to-name' | 'name-to-symbol' | 'symbol-to-number'
  options: string[]
  correctAnswer: string
}

export function ElementMatchGame({ onComplete, onBack }: ElementMatchGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<ElementQuestion | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(120)
  const [isGameOver, setIsGameOver] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [categoriesAnswered, setCategoriesAnswered] = useState<Set<string>>(new Set())
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
    const element = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)]
    const questionTypes: ElementQuestion['questionType'][] = [
      'symbol-to-name', 'name-to-symbol', 'symbol-to-number'
    ]
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)]
    
    let correctAnswer: string
    let wrongOptions: string[] = []
    
    if (questionType === 'symbol-to-name') {
      correctAnswer = element.name
      wrongOptions = ELEMENTS
        .filter(e => e.name !== element.name)
        .map(e => e.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
    } else if (questionType === 'name-to-symbol') {
      correctAnswer = element.symbol
      wrongOptions = ELEMENTS
        .filter(e => e.symbol !== element.symbol)
        .map(e => e.symbol)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
    } else {
      correctAnswer = element.number.toString()
      const usedNumbers = new Set([element.number])
      while (wrongOptions.length < 3) {
        const randomNum = Math.floor(Math.random() * 100) + 1
        if (!usedNumbers.has(randomNum)) {
          wrongOptions.push(randomNum.toString())
          usedNumbers.add(randomNum)
        }
      }
    }
    
    const allOptions = [correctAnswer, ...wrongOptions]
      .sort(() => Math.random() - 0.5)
    
    const question: ElementQuestion = {
      element,
      questionType,
      options: allOptions,
      correctAnswer
    }
    
    setCurrentQuestion(question)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const getQuestionText = () => {
    if (!currentQuestion) return ''
    
    const { element, questionType } = currentQuestion
    
    switch (questionType) {
      case 'symbol-to-name':
        return `What element has the symbol "${element.symbol}"?`
      case 'name-to-symbol':
        return `What is the chemical symbol for ${element.name}?`
      case 'symbol-to-number':
        return `What is the atomic number of "${element.symbol}"?`
      default:
        return ''
    }
  }

  const handleAnswer = (answer: string) => {
    if (!currentQuestion || showResult) return
    
    setSelectedAnswer(answer)
    setShowResult(true)
    
    const isCorrect = answer === currentQuestion.correctAnswer
    
    if (isCorrect) {
      const basePoints = 15
      const streakBonus = Math.floor(streak / 3) * 5
      const points = basePoints + streakBonus
      setScore(score + points)
      setStreak(streak + 1)
      setCorrectAnswers(prev => prev + 1)
      setBestStreak(prev => Math.max(prev, streak + 1))
      setCategoriesAnswered(prev => new Set([...prev, currentQuestion.element.category]))
    } else {
      setStreak(0)
    }
    
    setQuestionCount(questionCount + 1)
    
    setTimeout(() => {
      if (questionCount >= 15 || timeLeft <= 10) {
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
    setStreak(0)
    setIsGameOver(false)
    setCorrectAnswers(0)
    setBestStreak(0)
    setCategoriesAnswered(new Set())
    setStartTime(Date.now())
    generateNewQuestion()
  }

  if (isGameOver) {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
    const accuracy = questionCount > 0 ? Math.round((correctAnswers / questionCount) * 100) : 0
    const avgTimePerQuestion = questionCount > 0 ? Math.round(timeElapsed / questionCount) : 0
    
    const getChemistryGrade = () => {
      if (accuracy >= 90 && bestStreak >= 8) return { grade: 'A+', color: 'text-purple-600', message: 'Master Chemist! Periodic table expert!' }
      if (accuracy >= 85) return { grade: 'A', color: 'text-green-600', message: 'Excellent chemistry knowledge!' }
      if (accuracy >= 70) return { grade: 'B', color: 'text-blue-500', message: 'Good understanding of elements!' }
      if (accuracy >= 55) return { grade: 'C', color: 'text-yellow-500', message: 'Keep studying the periodic table!' }
      return { grade: 'D', color: 'text-red-500', message: 'More chemistry study needed!' }
    }
    
    const performance = getChemistryGrade()
    
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
          <CardTitle className="text-2xl font-bold text-center">Chemistry Lab Results!</CardTitle>
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
              <div className="font-bold text-lg text-purple-600">{bestStreak}</div>
              <div className="text-xs text-muted-foreground">Best Streak</div>
            </div>
            <div>
              <div className="font-bold text-lg text-orange-600">{categoriesAnswered.size}</div>
              <div className="text-xs text-muted-foreground">Categories</div>
            </div>
            <div>
              <div className="font-bold text-lg text-cyan-600">{avgTimePerQuestion}s</div>
              <div className="text-xs text-muted-foreground">Avg/Question</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium mb-2">🧪 Lab Analysis</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Experiments completed: {questionCount}/15</div>
              <div>• Element categories explored: {Array.from(categoriesAnswered).join(', ') || 'None'}</div>
              <div>• Chemistry mastery: {accuracy >= 80 ? 'Advanced' : accuracy >= 60 ? 'Intermediate' : 'Beginner'}</div>
              <div>• Lab time: {Math.floor(timeElapsed / 60)}m {timeElapsed % 60}s</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              onClick={restartGame}
              className="w-full"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              New Experiment
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
            <Beaker className="h-5 w-5" />
            Element Lab
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
          Master the periodic table elements
        </div>
        {streak >= 3 && (
          <div className="text-sm font-medium text-blue-600">
            🧪 Streak: {streak} experiments!
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-6 bg-muted/50 rounded-lg">
          <div className="text-lg font-medium mb-4">{getQuestionText()}</div>
          <div className="text-sm text-muted-foreground">
            Category: {currentQuestion.element.category}
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === currentQuestion.correctAnswer
            
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
                  <span className="text-lg">{option}</span>
                </div>
              </Button>
            )
          })}
        </div>
        
        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            Experiment {questionCount + 1} of 15
          </div>
          <Progress value={(questionCount / 15) * 100} className="mt-2" />
        </div>
      </CardContent>
    </Card>
  )
}