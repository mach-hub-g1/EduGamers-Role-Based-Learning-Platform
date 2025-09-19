"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RotateCw, ArrowLeft, Eye, EyeOff } from "lucide-react"

interface QuickMemoryGameProps {
  onComplete: (score: number) => void;
  onBack?: () => void;
}

const SEQUENCES = [
  [1, 4, 2],
  [3, 1, 4, 2],
  [2, 4, 1, 3, 5],
  [1, 3, 5, 2, 4, 6],
  [2, 5, 1, 4, 3, 6, 7],
  [3, 1, 6, 2, 5, 8, 4, 7],
]

export function QuickMemoryGame({ onComplete, onBack }: QuickMemoryGameProps) {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [sequence, setSequence] = useState<number[]>([])
  const [userInput, setUserInput] = useState<number[]>([])
  const [showingSequence, setShowingSequence] = useState(true)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const [score, setScore] = useState(0)
  const [gamePhase, setGamePhase] = useState<'showing' | 'input' | 'result'>('showing')
  const [isGameOver, setIsGameOver] = useState(false)
  const [timeLeft, setTimeLeft] = useState(3)

  useEffect(() => {
    if (currentLevel < SEQUENCES.length) {
      startLevel()
    } else {
      setIsGameOver(true)
      onComplete(score)
    }
  }, [currentLevel])

  useEffect(() => {
    if (gamePhase === 'showing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (gamePhase === 'showing' && timeLeft === 0) {
      showSequence()
    }
  }, [gamePhase, timeLeft])

  const startLevel = () => {
    const newSequence = SEQUENCES[currentLevel]
    setSequence(newSequence)
    setUserInput([])
    setGamePhase('showing')
    setTimeLeft(3)
    setHighlightIndex(-1)
  }

  const showSequence = () => {
    setGamePhase('showing')
    let index = 0
    
    const showNext = () => {
      if (index < sequence.length) {
        setHighlightIndex(index)
        setTimeout(() => {
          setHighlightIndex(-1)
          index++
          if (index < sequence.length) {
            setTimeout(showNext, 300)
          } else {
            setTimeout(() => {
              setGamePhase('input')
            }, 500)
          }
        }, 600)
      }
    }
    
    showNext()
  }

  const handleNumberClick = (number: number) => {
    if (gamePhase !== 'input') return
    
    const newInput = [...userInput, number]
    setUserInput(newInput)
    
    // Check if current input is correct
    if (sequence[newInput.length - 1] !== number) {
      // Wrong answer
      setGamePhase('result')
      setTimeout(() => {
        setIsGameOver(true)
        onComplete(score)
      }, 1500)
      return
    }
    
    // Check if sequence is complete
    if (newInput.length === sequence.length) {
      // Correct sequence completed
      const newScore = score + (10 * (currentLevel + 1))
      setScore(newScore)
      setGamePhase('result')
      
      setTimeout(() => {
        setCurrentLevel(currentLevel + 1)
      }, 1500)
    }
  }

  const restartGame = () => {
    setCurrentLevel(0)
    setScore(0)
    setUserInput([])
    setGamePhase('showing')
    setIsGameOver(false)
    setTimeLeft(3)
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
            <p className="text-muted-foreground">Final Score</p>
            <p className="text-sm text-muted-foreground mt-2">
              You completed {currentLevel} levels!
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              onClick={restartGame}
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
          <CardTitle>Quick Memory</CardTitle>
          <div className="flex items-center gap-2">
            <div className="font-medium">Score: {score}</div>
            <div className="text-sm text-muted-foreground">
              Level: {currentLevel + 1}
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {gamePhase === 'showing' && timeLeft > 0 && `Get ready... ${timeLeft}`}
          {gamePhase === 'showing' && timeLeft === 0 && 'Watch the sequence!'}
          {gamePhase === 'input' && 'Click the numbers in the same order'}
          {gamePhase === 'result' && (userInput.length === sequence.length ? 'Correct!' : 'Wrong sequence!')}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <Progress value={(currentLevel / SEQUENCES.length) * 100} className="mb-4" />
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => {
            const isInSequence = sequence.includes(number)
            const isHighlighted = gamePhase === 'showing' && sequence[highlightIndex] === number
            const isClicked = userInput.includes(number)
            
            return (
              <Button
                key={number}
                variant={isHighlighted ? "default" : isClicked ? "secondary" : "outline"}
                className={`h-16 text-xl font-bold transition-all duration-300 ${
                  isHighlighted ? 'ring-4 ring-primary ring-opacity-50 scale-110' : ''
                } ${
                  !isInSequence && gamePhase === 'input' ? 'opacity-50' : ''
                }`}
                onClick={() => handleNumberClick(number)}
                disabled={gamePhase !== 'input' || !isInSequence}
              >
                {number}
              </Button>
            )
          })}
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          {gamePhase === 'input' && (
            <div className="flex items-center justify-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Your input: {userInput.join(', ') || 'None yet'}</span>
            </div>
          )}
          {gamePhase === 'showing' && timeLeft === 0 && (
            <div className="flex items-center justify-center gap-2">
              <EyeOff className="h-4 w-4" />
              <span>Memorize the sequence: {sequence.length} numbers</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}