"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, RotateCcw, Trophy, Clock, Zap, BookOpen } from "lucide-react"

interface WordPuzzle {
  word: string
  hint: string
  category: string
  difficulty: "easy" | "medium" | "hard"
}

const puzzles: WordPuzzle[] = [
  { word: "EDUCATION", hint: "The process of learning and teaching", category: "General", difficulty: "medium" },
  { word: "COMPUTER", hint: "Electronic device for processing data", category: "Technology", difficulty: "easy" },
  { word: "MATHEMATICS", hint: "The study of numbers and shapes", category: "Subject", difficulty: "hard" },
  { word: "SCIENCE", hint: "Study of the natural world", category: "Subject", difficulty: "easy" },
  { word: "GOVERNMENT", hint: "System that rules a country", category: "Civics", difficulty: "medium" },
  { word: "DEMOCRACY", hint: "Government by the people", category: "Civics", difficulty: "hard" },
  { word: "GEOGRAPHY", hint: "Study of Earth and its features", category: "Subject", difficulty: "medium" },
  { word: "HISTORY", hint: "Study of past events", category: "Subject", difficulty: "easy" },
]

export function WordPuzzle() {
  const [currentPuzzle, setCurrentPuzzle] = useState<WordPuzzle | null>(null)
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([])
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost" | "not-started">("not-started")
  const [inputValue, setInputValue] = useState("")
  const [score, setScore] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const maxWrongGuesses = 6

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameStatus === "playing") {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStatus])

  useEffect(() => {
    if (currentPuzzle && gameStatus === "playing") {
      const wordLetters = currentPuzzle.word.split("")
      const isComplete = wordLetters.every((letter) => guessedLetters.includes(letter))

      if (isComplete) {
        setGameStatus("won")
        calculateScore()
      } else if (wrongGuesses.length >= maxWrongGuesses) {
        setGameStatus("lost")
      }
    }
  }, [guessedLetters, wrongGuesses, currentPuzzle, gameStatus])

  const calculateScore = () => {
    if (!currentPuzzle) return

    const baseScore = currentPuzzle.difficulty === "easy" ? 10 : currentPuzzle.difficulty === "medium" ? 15 : 20
    const timeBonus = Math.max(0, 60 - timeElapsed)
    const hintPenalty = hintsUsed * 5
    const wrongGuessPenalty = wrongGuesses.length * 2

    const finalScore = Math.max(0, baseScore + timeBonus - hintPenalty - wrongGuessPenalty)
    setScore(finalScore)
  }

  const startNewGame = () => {
    const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)]
    setCurrentPuzzle(randomPuzzle)
    setGuessedLetters([])
    setWrongGuesses([])
    setGameStatus("playing")
    setInputValue("")
    setTimeElapsed(0)
    setHintsUsed(0)
    setShowHint(false)
    setScore(0)
  }

  const makeGuess = () => {
    if (!inputValue.trim() || !currentPuzzle) return

    const letter = inputValue.toUpperCase()
    setInputValue("")

    if (guessedLetters.includes(letter) || wrongGuesses.includes(letter)) {
      return // Already guessed
    }

    if (currentPuzzle.word.includes(letter)) {
      setGuessedLetters([...guessedLetters, letter])
    } else {
      setWrongGuesses([...wrongGuesses, letter])
    }
  }

  const useHint = () => {
    setShowHint(true)
    setHintsUsed(hintsUsed + 1)
  }

  const renderWord = () => {
    if (!currentPuzzle) return ""

    return currentPuzzle.word
      .split("")
      .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
      .join(" ")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getHangmanDisplay = () => {
    const stages = [
      "  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========",
      "  +---+\n  |   |\n  |   |\n      |\n      |\n      |\n=========",
      "  +---+\n  |   |\n  |   |\n  O   |\n      |\n      |\n=========",
      "  +---+\n  |   |\n  |   |\n  O   |\n  |   |\n      |\n=========",
      "  +---+\n  |   |\n  |   |\n  O   |\n /|   |\n      |\n=========",
      "  +---+\n  |   |\n  |   |\n  O   |\n /|\\  |\n      |\n=========",
      "  +---+\n  |   |\n  |   |\n  O   |\n /|\\  |\n /    |\n=========",
      "  +---+\n  |   |\n  |   |\n  O   |\n /|\\  |\n / \\  |\n=========",
    ]
    return stages[wrongGuesses.length] || stages[0]
  }

  if (gameStatus === "won" || gameStatus === "lost") {
    return (
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader className="text-center">
          <div
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              gameStatus === "won" ? "bg-accent" : "bg-destructive"
            }`}
          >
            <Trophy
              className={`w-8 h-8 ${gameStatus === "won" ? "text-accent-foreground" : "text-destructive-foreground"}`}
            />
          </div>
          <CardTitle className="text-2xl">{gameStatus === "won" ? "Congratulations! 🎉" : "Game Over 😔"}</CardTitle>
          <p className="text-muted-foreground">
            {gameStatus === "won"
              ? `You solved "${currentPuzzle?.word}" correctly!`
              : `The word was "${currentPuzzle?.word}"`}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {gameStatus === "won" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-card rounded-lg border">
                  <div className="text-xl font-bold text-primary">{formatTime(timeElapsed)}</div>
                  <div className="text-xs text-muted-foreground">Time</div>
                </div>
                <div className="text-center p-3 bg-card rounded-lg border">
                  <div className="text-xl font-bold text-secondary">
                    {wrongGuesses.length}/{maxWrongGuesses}
                  </div>
                  <div className="text-xs text-muted-foreground">Wrong Guesses</div>
                </div>
              </div>

              <div className="text-center p-4 bg-accent/10 rounded-lg border">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-accent" />
                  <span className="text-2xl font-bold text-accent">{score}</span>
                </div>
                <div className="text-sm text-muted-foreground">XP Earned</div>
              </div>
            </>
          )}

          <Button onClick={startNewGame} className="w-full">
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
          <BookOpen className="w-5 h-5 text-primary" />
          Word Puzzle
        </CardTitle>
        {gameStatus === "playing" && currentPuzzle && (
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(timeElapsed)}
            </Badge>
            <div className="flex gap-2">
              <Badge
                variant={
                  currentPuzzle.difficulty === "easy"
                    ? "secondary"
                    : currentPuzzle.difficulty === "medium"
                      ? "default"
                      : "destructive"
                }
              >
                {currentPuzzle.difficulty}
              </Badge>
              <Badge variant="outline">{currentPuzzle.category}</Badge>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {gameStatus === "not-started" ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Guess the word letter by letter!</p>
            <Button onClick={startNewGame} size="lg">
              Start Game
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <pre className="text-xs font-mono text-muted-foreground mb-4 whitespace-pre">{getHangmanDisplay()}</pre>
              <div className="text-2xl font-mono font-bold tracking-wider mb-2">{renderWord()}</div>
              <div className="text-sm text-muted-foreground">
                Wrong guesses: {wrongGuesses.length}/{maxWrongGuesses}
              </div>
            </div>

            {showHint && (
              <div className="p-3 bg-accent/10 rounded-lg border">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  <span className="font-medium text-sm">Hint:</span>
                </div>
                <p className="text-sm text-muted-foreground">{currentPuzzle?.hint}</p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.slice(0, 1))}
                  onKeyPress={(e) => e.key === "Enter" && makeGuess()}
                  placeholder="Enter a letter"
                  className="text-center uppercase"
                  maxLength={1}
                />
                <Button onClick={makeGuess} disabled={!inputValue.trim()}>
                  Guess
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={useHint}
                  disabled={showHint}
                  className="flex-1 bg-transparent"
                >
                  <Lightbulb className="w-4 h-4 mr-1" />
                  {showHint ? "Hint Used" : "Use Hint"}
                </Button>
                <Button variant="outline" size="sm" onClick={startNewGame} className="flex-1 bg-transparent">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  New Game
                </Button>
              </div>
            </div>

            {(guessedLetters.length > 0 || wrongGuesses.length > 0) && (
              <div className="space-y-2">
                {guessedLetters.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-primary mb-1">Correct letters:</div>
                    <div className="flex flex-wrap gap-1">
                      {guessedLetters.map((letter) => (
                        <Badge key={letter} variant="default" className="text-xs">
                          {letter}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {wrongGuesses.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-destructive mb-1">Wrong letters:</div>
                    <div className="flex flex-wrap gap-1">
                      {wrongGuesses.map((letter) => (
                        <Badge key={letter} variant="destructive" className="text-xs">
                          {letter}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
