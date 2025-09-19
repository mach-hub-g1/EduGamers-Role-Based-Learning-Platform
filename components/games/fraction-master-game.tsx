"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RotateCw, ArrowLeft, Calculator } from "lucide-react"

interface FractionMasterGameProps {
  onComplete: (score: number) => void;
  onBack?: () => void;
}

interface Fraction {
  numerator: number
  denominator: number
}

interface FractionProblem {
  fraction1: Fraction
  fraction2: Fraction
  operation: '+' | '-' | '×' | '÷'
  correctAnswer: Fraction
  options: Fraction[]
  questionText: string
}

export function FractionMasterGame({ onComplete, onBack }: FractionMasterGameProps) {
  const [currentProblem, setCurrentProblem] = useState<FractionProblem | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes for fraction problems
  const [isGameOver, setIsGameOver] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<Fraction | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [problemCount, setProblemCount] = useState(0)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [operationsUsed, setOperationsUsed] = useState<Set<string>>(new Set())
  const [difficultyProgression, setDifficultyProgression] = useState<string[]>(['easy'])
  const [startTime, setStartTime] = useState<number>(Date.now())

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

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b)
  }

  const simplifyFraction = (fraction: Fraction): Fraction => {
    const divisor = gcd(Math.abs(fraction.numerator), Math.abs(fraction.denominator))
    return {
      numerator: fraction.numerator / divisor,
      denominator: fraction.denominator / divisor
    }
  }

  const addFractions = (f1: Fraction, f2: Fraction): Fraction => {
    const numerator = f1.numerator * f2.denominator + f2.numerator * f1.denominator
    const denominator = f1.denominator * f2.denominator
    return simplifyFraction({ numerator, denominator })
  }

  const subtractFractions = (f1: Fraction, f2: Fraction): Fraction => {
    const numerator = f1.numerator * f2.denominator - f2.numerator * f1.denominator
    const denominator = f1.denominator * f2.denominator
    return simplifyFraction({ numerator, denominator })
  }

  const multiplyFractions = (f1: Fraction, f2: Fraction): Fraction => {
    return simplifyFraction({
      numerator: f1.numerator * f2.numerator,
      denominator: f1.denominator * f2.denominator
    })
  }

  const divideFractions = (f1: Fraction, f2: Fraction): Fraction => {
    return simplifyFraction({
      numerator: f1.numerator * f2.denominator,
      denominator: f1.denominator * f2.numerator
    })
  }

  const generateFraction = (difficulty: 'easy' | 'medium' | 'hard'): Fraction => {
    let numerator, denominator
    
    if (difficulty === 'easy') {
      numerator = Math.floor(Math.random() * 8) + 1
      denominator = Math.floor(Math.random() * 8) + 2
    } else if (difficulty === 'medium') {
      numerator = Math.floor(Math.random() * 12) + 1
      denominator = Math.floor(Math.random() * 12) + 2
    } else {
      numerator = Math.floor(Math.random() * 20) + 1
      denominator = Math.floor(Math.random() * 15) + 2
    }
    
    return { numerator, denominator }
  }

  const generateNewProblem = () => {
    const operations: Array<'+' | '-' | '×' | '÷'> = difficulty === 'easy' ? ['+', '-'] : 
                                                     difficulty === 'medium' ? ['+', '-', '×'] : 
                                                     ['+', '-', '×', '÷']
    
    const operation = operations[Math.floor(Math.random() * operations.length)]
    let fraction1 = generateFraction(difficulty)
    let fraction2 = generateFraction(difficulty)
    
    // Ensure we don't divide by zero
    if (operation === '÷' && fraction2.numerator === 0) {
      fraction2.numerator = 1
    }
    
    // For subtraction, ensure positive result in easy mode
    if (operation === '-' && difficulty === 'easy') {
      if (fraction1.numerator * fraction2.denominator < fraction2.numerator * fraction1.denominator) {
        [fraction1, fraction2] = [fraction2, fraction1]
      }
    }
    
    let correctAnswer: Fraction
    
    switch (operation) {
      case '+':
        correctAnswer = addFractions(fraction1, fraction2)
        break
      case '-':
        correctAnswer = subtractFractions(fraction1, fraction2)
        break
      case '×':
        correctAnswer = multiplyFractions(fraction1, fraction2)
        break
      case '÷':
        correctAnswer = divideFractions(fraction1, fraction2)
        break
    }
    
    // Generate wrong options
    const wrongOptions: Fraction[] = []
    
    // Add some common wrong answers
    if (operation === '+' || operation === '-') {
      // Common mistake: adding/subtracting numerators and denominators separately
      wrongOptions.push(simplifyFraction({
        numerator: operation === '+' ? fraction1.numerator + fraction2.numerator : fraction1.numerator - fraction2.numerator,
        denominator: fraction1.denominator + fraction2.denominator
      }))
    }
    
    // Generate random wrong answers
    while (wrongOptions.length < 3) {
      const wrongFraction = generateFraction(difficulty)
      const simplified = simplifyFraction(wrongFraction)
      
      if (!wrongOptions.some(f => f.numerator === simplified.numerator && f.denominator === simplified.denominator) &&
          !(simplified.numerator === correctAnswer.numerator && simplified.denominator === correctAnswer.denominator)) {
        wrongOptions.push(simplified)
      }
    }
    
    const allOptions = [correctAnswer, ...wrongOptions.slice(0, 3)]
      .sort(() => Math.random() - 0.5)
    
    const problem: FractionProblem = {
      fraction1,
      fraction2,
      operation,
      correctAnswer,
      options: allOptions,
      questionText: `${fraction1.numerator}/${fraction1.denominator} ${operation} ${fraction2.numerator}/${fraction2.denominator}`
    }
    
    setCurrentProblem(problem)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const handleAnswer = (answer: Fraction) => {
    if (!currentProblem || showResult) return
    
    setSelectedAnswer(answer)
    setShowResult(true)
    
    const isCorrect = answer.numerator === currentProblem.correctAnswer.numerator && 
                     answer.denominator === currentProblem.correctAnswer.denominator
    
    if (isCorrect) {
      let points = 20
      if (difficulty === 'medium') points = 30
      if (difficulty === 'hard') points = 40
      
      setScore(score + points)
      setCorrectAnswers(prev => prev + 1)
      setOperationsUsed(prev => new Set([...prev, currentProblem.operation]))
      
      // Increase difficulty based on success
      if (problemCount >= 3 && difficulty === 'easy') {
        setDifficulty('medium')
        setDifficultyProgression(prev => [...prev, 'medium'])
      } else if (problemCount >= 7 && difficulty === 'medium') {
        setDifficulty('hard')
        setDifficultyProgression(prev => [...prev, 'hard'])
      }
    } else {
      // Decrease difficulty on failure
      if (difficulty === 'hard') {
        setDifficulty('medium')
        setDifficultyProgression(prev => [...prev, 'medium'])
      } else if (difficulty === 'medium' && problemCount > 5) {
        setDifficulty('easy')
        setDifficultyProgression(prev => [...prev, 'easy'])
      }
    }
    
    setProblemCount(problemCount + 1)
    
    setTimeout(() => {
      if (problemCount >= 12 || timeLeft <= 15) {
        setIsGameOver(true)
        onComplete(isCorrect ? score + (difficulty === 'easy' ? 20 : difficulty === 'medium' ? 30 : 40) : score)
      } else {
        generateNewProblem()
      }
    }, 2500)
  }

  const restartGame = () => {
    setScore(0)
    setTimeLeft(180)
    setSelectedAnswer(null)
    setShowResult(false)
    setProblemCount(0)
    setDifficulty('easy')
    setIsGameOver(false)
    setCorrectAnswers(0)
    setOperationsUsed(new Set())
    setDifficultyProgression(['easy'])
    setStartTime(Date.now())
    generateNewProblem()
  }

  const fractionToString = (fraction: Fraction) => {
    if (fraction.denominator === 1) {
      return fraction.numerator.toString()
    }
    return `${fraction.numerator}/${fraction.denominator}`
  }

  if (isGameOver) {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
    const accuracy = problemCount > 0 ? Math.round((correctAnswers / problemCount) * 100) : 0
    const avgTimePerProblem = problemCount > 0 ? Math.round(timeElapsed / problemCount) : 0
    const highestDifficulty = difficultyProgression.includes('hard') ? 'hard' : 
                             difficultyProgression.includes('medium') ? 'medium' : 'easy'
    
    const getMathGrade = () => {
      if (accuracy >= 90 && highestDifficulty === 'hard') return { grade: 'A+', color: 'text-purple-600', message: 'Fraction master! Outstanding mathematical skills!' }
      if (accuracy >= 85) return { grade: 'A', color: 'text-green-600', message: 'Excellent fraction mastery!' }
      if (accuracy >= 70) return { grade: 'B', color: 'text-blue-500', message: 'Good mathematical understanding!' }
      if (accuracy >= 55) return { grade: 'C', color: 'text-yellow-500', message: 'Practice more fraction operations!' }
      return { grade: 'D', color: 'text-red-500', message: 'More mathematical practice needed!' }
    }
    
    const performance = getMathGrade()
    
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
          <CardTitle className="text-2xl font-bold text-center">Math Master Results!</CardTitle>
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
              <div className="font-bold text-lg text-purple-600 capitalize">{highestDifficulty}</div>
              <div className="text-xs text-muted-foreground">Peak Level</div>
            </div>
            <div>
              <div className="font-bold text-lg text-orange-600">{operationsUsed.size}</div>
              <div className="text-xs text-muted-foreground">Operations</div>
            </div>
            <div>
              <div className="font-bold text-lg text-cyan-600">{avgTimePerProblem}s</div>
              <div className="text-xs text-muted-foreground">Avg/Problem</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium mb-2">🧮 Mathematical Analysis</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Problems solved: {problemCount}/12</div>
              <div>• Operations mastered: {Array.from(operationsUsed).join(', ') || 'None'}</div>
              <div>• Skill progression: {difficultyProgression.join(' → ')}</div>
              <div>• Study time: {Math.floor(timeElapsed / 60)}m {timeElapsed % 60}s</div>
              <div>• Focus area: {accuracy < 70 ? 'Review basic operations' : 'Advanced fraction concepts'}</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              onClick={restartGame}
              className="w-full"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Practice More
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

  if (!currentProblem) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Fraction Master
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="font-medium">Score: {score}</div>
            <div className="w-24">
              <Progress value={(timeLeft / 180) * 100} className="h-2" />
              <div className="text-xs text-right">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Solve fraction problems step by step
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {difficulty}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-8 bg-muted/50 rounded-lg">
          <div className="text-3xl font-bold mb-2">{currentProblem.questionText}</div>
          <div className="text-lg text-muted-foreground">= ?</div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {currentProblem.options.map((option, index) => {
            const isSelected = selectedAnswer?.numerator === option.numerator && selectedAnswer?.denominator === option.denominator
            const isCorrect = option.numerator === currentProblem.correctAnswer.numerator && 
                            option.denominator === currentProblem.correctAnswer.denominator
            
            let buttonVariant: "default" | "secondary" | "destructive" | "outline" = "outline"
            let buttonClass = "h-20 text-xl font-bold transition-all duration-300"
            
            if (showResult) {
              if (isSelected) {
                buttonVariant = isCorrect ? "default" : "destructive"
              } else if (isCorrect) {
                buttonVariant = "default"
              }
            }
            
            return (
              <Button
                key={`${option.numerator}-${option.denominator}`}
                variant={buttonVariant}
                className={buttonClass}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
              >
                {fractionToString(option)}
              </Button>
            )
          })}
        </div>
        
        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            Problem {problemCount + 1} of 12
          </div>
          <Progress value={(problemCount / 12) * 100} className="mt-2" />
        </div>
      </CardContent>
    </Card>
  )
}