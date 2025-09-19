"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, RotateCcw, Trophy, Clock, Zap } from "lucide-react"

interface MemoryCard {
  id: number
  content: string
  isFlipped: boolean
  isMatched: boolean
}

const cardContents = ["🍎", "🍌", "🍊", "🍇", "🍓", "🥝", "🍑", "🍒", "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"]

export function MemoryGame() {
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStarted, gameCompleted])

  useEffect(() => {
    if (matches === 8) {
      setGameCompleted(true)
      calculateXP()
    }
  }, [matches])

  const calculateXP = () => {
    const baseXP = 50
    const timeBonus = Math.max(0, 120 - timeElapsed) // Bonus for completing under 2 minutes
    const moveBonus = Math.max(0, (32 - moves) * 2) // Bonus for fewer moves
    const totalXP = baseXP + timeBonus + moveBonus
    setXpEarned(totalXP)
  }

  const initializeGame = () => {
    const selectedCards = cardContents.slice(0, 8)
    const gameCards = [...selectedCards, ...selectedCards]
      .sort(() => Math.random() - 0.5)
      .map((content, index) => ({
        id: index,
        content,
        isFlipped: false,
        isMatched: false,
      }))

    setCards(gameCards)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setGameStarted(true)
    setGameCompleted(false)
    setTimeElapsed(0)
    setXpEarned(0)
  }

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2 || cards[cardId].isFlipped || cards[cardId].isMatched) {
      return
    }

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    setCards((prev) => prev.map((card) => (card.id === cardId ? { ...card, isFlipped: true } : card)))

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1)

      setTimeout(() => {
        const [firstId, secondId] = newFlippedCards
        const firstCard = cards[firstId]
        const secondCard = cards[secondId]

        if (firstCard.content === secondCard.content) {
          setCards((prev) =>
            prev.map((card) => (card.id === firstId || card.id === secondId ? { ...card, isMatched: true } : card)),
          )
          setMatches((prev) => prev + 1)
        } else {
          setCards((prev) =>
            prev.map((card) => (card.id === firstId || card.id === secondId ? { ...card, isFlipped: false } : card)),
          )
        }
        setFlippedCards([])
      }, 1000)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (gameCompleted) {
    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-accent-foreground" />
          </div>
          <CardTitle className="text-2xl">Congratulations! 🎉</CardTitle>
          <p className="text-muted-foreground">You completed the memory game!</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-card rounded-lg border">
              <div className="text-xl font-bold text-primary">{moves}</div>
              <div className="text-xs text-muted-foreground">Moves</div>
            </div>
            <div className="text-center p-3 bg-card rounded-lg border">
              <div className="text-xl font-bold text-secondary">{formatTime(timeElapsed)}</div>
              <div className="text-xs text-muted-foreground">Time</div>
            </div>
          </div>

          <div className="text-center p-4 bg-accent/10 rounded-lg border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-accent" />
              <span className="text-2xl font-bold text-accent">{xpEarned}</span>
            </div>
            <div className="text-sm text-muted-foreground">XP Earned</div>
          </div>

          <Button onClick={initializeGame} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Memory Game
        </CardTitle>
        {gameStarted && (
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(timeElapsed)}
            </Badge>
            <div className="flex gap-2">
              <Badge variant="secondary">Moves: {moves}</Badge>
              <Badge variant="default">Matches: {matches}/8</Badge>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {!gameStarted ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Match pairs of cards to test your memory!</p>
            <Button onClick={initializeGame} size="lg">
              Start Game
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {cards.map((card) => (
              <Button
                key={card.id}
                variant={card.isFlipped || card.isMatched ? "default" : "outline"}
                className="aspect-square text-2xl p-0 h-16"
                onClick={() => handleCardClick(card.id)}
                disabled={card.isFlipped || card.isMatched}
              >
                {card.isFlipped || card.isMatched ? card.content : "?"}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
