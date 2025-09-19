"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RotateCw, ArrowLeft, Puzzle } from "lucide-react"

interface LogicPuzzleGameProps {
  onComplete: (score: number) => void;
  onBack?: () => void;
}

interface Pattern {
  sequence: string[]
  missing: number
  options: string[]
  correctAnswer: string
  type: 'number' | 'letter' | 'shape' | 'color'
  rule: string
}

export function LogicPuzzleGame({ onComplete, onBack }: LogicPuzzleGameProps) {
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(120)
  const [isGameOver, setIsGameOver] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [patternCount, setPatternCount] = useState(0)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [patternTypes, setPatternTypes] = useState<Set<string>>(new Set())
  const [perfectStreak, setPerfectStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [startTime, setStartTime] = useState<number>(Date.now())

  useEffect(() => {
    generateNewPattern()
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

  const generateNumberPattern = (): { sequence: string[], rule: string } => {
    const patterns = [
      // Arithmetic sequences
      () => {
        const start = Math.floor(Math.random() * 10) + 1
        const diff = Math.floor(Math.random() * 5) + 1
        const sequence = Array.from({ length: 5 }, (_, i) => (start + i * diff).toString())
        return { sequence, rule: `Add ${diff} each time` }
      },
      // Geometric sequences
      () => {
        const start = Math.floor(Math.random() * 3) + 2
        const ratio = 2
        const sequence = Array.from({ length: 4 }, (_, i) => (start * Math.pow(ratio, i)).toString())
        return { sequence, rule: `Multiply by ${ratio} each time` }
      },
      // Square numbers
      () => {
        const start = Math.floor(Math.random() * 3) + 1
        const sequence = Array.from({ length: 4 }, (_, i) => Math.pow(start + i, 2).toString())
        return { sequence, rule: 'Square numbers' }
      },
      // Fibonacci-like
      () => {
        const a = Math.floor(Math.random() * 3) + 1
        const b = Math.floor(Math.random() * 3) + 1
        const sequence = [a.toString(), b.toString()]
        for (let i = 2; i < 5; i++) {
          sequence.push((parseInt(sequence[i-1]) + parseInt(sequence[i-2])).toString())
        }
        return { sequence, rule: 'Each number is sum of previous two' }
      }
    ]
    
    const patternGenerator = patterns[Math.floor(Math.random() * patterns.length)]
    return patternGenerator()
  }

  const generateLetterPattern = (): { sequence: string[], rule: string } => {
    const patterns = [
      // Alphabet sequence
      () => {
        const start = Math.floor(Math.random() * 20)
        const step = Math.floor(Math.random() * 3) + 1
        const sequence = Array.from({ length: 5 }, (_, i) => 
          String.fromCharCode(65 + (start + i * step) % 26)
        )
        return { sequence, rule: `Skip ${step - 1} letter(s)` }
      },
      // Reverse alphabet
      () => {
        const start = Math.floor(Math.random() * 20) + 5
        const sequence = Array.from({ length: 4 }, (_, i) => 
          String.fromCharCode(65 + start - i)
        )
        return { sequence, rule: 'Going backwards in alphabet' }
      }
    ]
    
    const patternGenerator = patterns[Math.floor(Math.random() * patterns.length)]
    return patternGenerator()
  }

  const generateShapePattern = (): { sequence: string[], rule: string } => {
    const shapes = ['●', '■', '▲', '♦', '★', '♠', '♥', '♣']
    const patterns = [
      // Repeating pattern
      () => {
        const patternLength = 3
        const basePattern = shapes.slice(0, patternLength)
        const sequence = []
        for (let i = 0; i < 6; i++) {
          sequence.push(basePattern[i % patternLength])
        }
        return { sequence, rule: `Repeating pattern of ${patternLength}` }
      },
      // Alternating pattern
      () => {
        const shape1 = shapes[0]
        const shape2 = shapes[1]
        const sequence = Array.from({ length: 6 }, (_, i) => 
          i % 2 === 0 ? shape1 : shape2
        )
        return { sequence, rule: 'Alternating pattern' }
      }
    ]
    
    const patternGenerator = patterns[Math.floor(Math.random() * patterns.length)]
    return patternGenerator()
  }

  const generateColorPattern = (): { sequence: string[], rule: string } => {
    const colors = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '⚫', '⚪']
    const patterns = [
      // RGB pattern
      () => {
        const sequence = ['🔴', '🟢', '🔵', '🔴', '🟢', '🔵']
        return { sequence, rule: 'Red-Green-Blue repeating' }
      },
      // Traffic light pattern
      () => {
        const sequence = ['🔴', '🟡', '🟢', '🔴', '🟡']
        return { sequence, rule: 'Traffic light sequence' }
      }
    ]
    
    const patternGenerator = patterns[Math.floor(Math.random() * patterns.length)]
    return patternGenerator()
  }

  const generateNewPattern = () => {
    const types: Pattern['type'][] = ['number', 'letter', 'shape', 'color']
    const type = types[Math.floor(Math.random() * types.length)]
    
    let patternData: { sequence: string[], rule: string }
    
    switch (type) {
      case 'number':
        patternData = generateNumberPattern()
        break
      case 'letter':
        patternData = generateLetterPattern()
        break
      case 'shape':
        patternData = generateShapePattern()
        break
      case 'color':
        patternData = generateColorPattern()
        break
      default:
        patternData = generateNumberPattern()
    }
    
    // Remove one element to create the missing piece
    const missing = Math.floor(Math.random() * patternData.sequence.length)
    const correctAnswer = patternData.sequence[missing]
    const sequenceWithMissing = [...patternData.sequence]
    sequenceWithMissing[missing] = '?'
    
    // Generate wrong options
    const wrongOptions: string[] = []
    
    if (type === 'number') {
      const correct = parseInt(correctAnswer)
      wrongOptions.push((correct + 1).toString(), (correct - 1).toString(), (correct + 2).toString())
    } else if (type === 'letter') {
      const correctCode = correctAnswer.charCodeAt(0)
      wrongOptions.push(
        String.fromCharCode((correctCode + 1 - 65) % 26 + 65),
        String.fromCharCode((correctCode - 1 - 65 + 26) % 26 + 65),
        String.fromCharCode((correctCode + 2 - 65) % 26 + 65)
      )
    } else {
      // For shapes and colors, use other available options
      const allOptions = type === 'shape' ? ['●', '■', '▲', '♦', '★', '♠'] : ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠']
      const filteredOptions = allOptions.filter(opt => opt !== correctAnswer)
      wrongOptions.push(...filteredOptions.slice(0, 3))
    }
    
    const allOptions = [correctAnswer, ...wrongOptions.slice(0, 3)]
      .sort(() => Math.random() - 0.5)
    
    const pattern: Pattern = {
      sequence: sequenceWithMissing,
      missing,
      options: allOptions,
      correctAnswer,
      type,
      rule: patternData.rule
    }
    
    setCurrentPattern(pattern)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const handleAnswer = (answer: string) => {
    if (!currentPattern || showResult) return
    
    setSelectedAnswer(answer)
    setShowResult(true)
    
    const isCorrect = answer === currentPattern.correctAnswer
    
    if (isCorrect) {
      let points = 15
      if (difficulty === 'medium') points = 20
      if (difficulty === 'hard') points = 25
      
      setScore(score + points)
      setCorrectAnswers(prev => prev + 1)
      setPerfectStreak(prev => prev + 1)
      setMaxStreak(prev => Math.max(prev, perfectStreak + 1))
      setPatternTypes(prev => new Set([...prev, currentPattern.type]))
      
      // Increase difficulty
      if (patternCount >= 3 && difficulty === 'easy') {
        setDifficulty('medium')
      } else if (patternCount >= 7 && difficulty === 'medium') {
        setDifficulty('hard')
      }
    } else {
      setPerfectStreak(0)
    }
    
    setPatternCount(patternCount + 1)
    
    setTimeout(() => {
      if (patternCount >= 10 || timeLeft <= 15) {
        setIsGameOver(true)
        onComplete(isCorrect ? score + (difficulty === 'easy' ? 15 : difficulty === 'medium' ? 20 : 25) : score)
      } else {
        generateNewPattern()
      }
    }, 2000)
  }

  const restartGame = () => {
    setScore(0)
    setTimeLeft(120)
    setSelectedAnswer(null)
    setShowResult(false)
    setPatternCount(0)
    setDifficulty('easy')
    setIsGameOver(false)
    setCorrectAnswers(0)
    setPatternTypes(new Set())
    setPerfectStreak(0)
    setMaxStreak(0)
    setStartTime(Date.now())
    generateNewPattern()
  }

  if (isGameOver) {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
    const accuracy = patternCount > 0 ? Math.round((correctAnswers / patternCount) * 100) : 0
    const avgTimePerPattern = patternCount > 0 ? Math.round(timeElapsed / patternCount) : 0
    
    const getLogicGrade = () => {
      if (accuracy >= 90 && maxStreak >= 8) return { grade: 'A+', color: 'text-purple-600', message: 'Logic genius! Pattern recognition master!' }
      if (accuracy >= 85) return { grade: 'A', color: 'text-green-600', message: 'Excellent logical thinking!' }
      if (accuracy >= 70) return { grade: 'B', color: 'text-blue-500', message: 'Good pattern recognition skills!' }
      if (accuracy >= 55) return { grade: 'C', color: 'text-yellow-500', message: 'Keep practicing logical patterns!' }
      return { grade: 'D', color: 'text-red-500', message: 'More logic practice needed!' }
    }
    
    const performance = getLogicGrade()
    
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
          <CardTitle className="text-2xl font-bold text-center">Logic Master Results!</CardTitle>
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
              <div className="font-bold text-lg text-purple-600">{maxStreak}</div>
              <div className="text-xs text-muted-foreground">Max Streak</div>
            </div>
            <div>
              <div className="font-bold text-lg text-orange-600">{patternTypes.size}</div>
              <div className="text-xs text-muted-foreground">Pattern Types</div>
            </div>
            <div>
              <div className="font-bold text-lg text-cyan-600">{avgTimePerPattern}s</div>
              <div className="text-xs text-muted-foreground">Avg/Pattern</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium mb-2">🧩 Logic Analysis</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Patterns completed: {patternCount}/10</div>
              <div>• Pattern types mastered: {Array.from(patternTypes).join(', ') || 'None'}</div>
              <div>• Logical reasoning: {accuracy >= 80 ? 'Advanced' : accuracy >= 60 ? 'Intermediate' : 'Developing'}</div>
              <div>• Peak difficulty: {difficulty}</div>
              <div>• Thinking time: {Math.floor(timeElapsed / 60)}m {timeElapsed % 60}s</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              onClick={restartGame}
              className="w-full"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              New Puzzles
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

  if (!currentPattern) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Puzzle className="h-5 w-5" />
            Logic Patterns
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="font-medium">Score: {score}</div>
            <div className="w-20">
              <Progress value={(timeLeft / 120) * 100} className="h-2" />
              <div className="text-xs text-right">{timeLeft}s</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Find the missing element in the pattern
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
        <div className="text-center py-6 bg-muted/50 rounded-lg">
          <div className="text-3xl font-mono mb-4 tracking-wider">
            {currentPattern.sequence.join('  ')}
          </div>
          {showResult && (
            <div className="text-sm text-blue-600 font-medium">
              Rule: {currentPattern.rule}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {currentPattern.options.map((option, index) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === currentPattern.correctAnswer
            
            let buttonVariant: "default" | "secondary" | "destructive" | "outline" = "outline"
            let buttonClass = "h-16 text-2xl font-bold transition-all duration-300"
            
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
            Pattern {patternCount + 1} of 10 • Type: {currentPattern.type}
          </div>
          <Progress value={(patternCount / 10) * 100} className="mt-2" />
        </div>
      </CardContent>
    </Card>
  )
}