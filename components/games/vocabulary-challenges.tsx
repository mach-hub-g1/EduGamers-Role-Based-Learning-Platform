"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { 
  Clock, 
  Target, 
  Zap, 
  Star, 
  Trophy, 
  BookOpen, 
  CheckCircle, 
  XCircle,
  Lightbulb,
  Timer,
  Award,
  TrendingUp
} from "lucide-react"

interface WordChallenge {
  id: string
  word: string
  definition: string
  options: string[]
  correctAnswer: string
  difficulty: "beginner" | "intermediate" | "advanced" | "expert"
  category: string
  hint?: string
  etymology?: string
  example?: string
}

interface GameStats {
  score: number
  streak: number
  timeRemaining: number
  questionsAnswered: number
  correctAnswers: number
  hintsUsed: number
  powerUpsUsed: number
}

interface PowerUp {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  cost: number
  effect: string
  available: boolean
}

export function VocabularyChallenges() {
  const [currentChallenge, setCurrentChallenge] = useState<WordChallenge | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    streak: 0,
    timeRemaining: 60,
    questionsAnswered: 0,
    correctAnswers: 0,
    hintsUsed: 0,
    powerUpsUsed: 0
  })
  const [gameState, setGameState] = useState<"menu" | "playing" | "paused" | "finished">("menu")
  const [showHint, setShowHint] = useState(false)
  const [showResult, setShowResult] = useState<"correct" | "incorrect" | null>(null)
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced" | "expert">("beginner")
  const [timeBonus, setTimeBonus] = useState(0)

  const powerUps: PowerUp[] = [
    {
      id: "hint",
      name: "Hint",
      description: "Reveal a helpful hint",
      icon: <Lightbulb className="h-4 w-4" />,
      cost: 10,
      effect: "Show hint",
      available: true
    },
    {
      id: "time",
      name: "Time Boost",
      description: "Add 15 seconds to timer",
      icon: <Timer className="h-4 w-4" />,
      cost: 20,
      effect: "Add time",
      available: true
    },
    {
      id: "skip",
      name: "Skip Question",
      description: "Skip current question",
      icon: <Zap className="h-4 w-4" />,
      cost: 30,
      effect: "Skip",
      available: true
    },
    {
      id: "double",
      name: "Double Points",
      description: "Double points for next correct answer",
      icon: <Star className="h-4 w-4" />,
      cost: 50,
      effect: "Double points",
      available: true
    }
  ]

  const wordChallenges: WordChallenge[] = [
    // Beginner
    {
      id: "1",
      word: "Serendipity",
      definition: "The occurrence of events by chance in a happy or beneficial way",
      options: [
        "The occurrence of events by chance in a happy or beneficial way",
        "A feeling of deep sadness",
        "A type of musical instrument",
        "A scientific experiment"
      ],
      correctAnswer: "The occurrence of events by chance in a happy or beneficial way",
      difficulty: "beginner",
      category: "General",
      hint: "Think of finding something good by accident",
      etymology: "From Persian fairy tale 'The Three Princes of Serendip'",
      example: "Finding a $20 bill on the street was pure serendipity."
    },
    {
      id: "2",
      word: "Ephemeral",
      definition: "Lasting for a very short time",
      options: [
        "Lasting for a very short time",
        "Extremely large",
        "Very expensive",
        "Completely silent"
      ],
      correctAnswer: "Lasting for a very short time",
      difficulty: "beginner",
      category: "General",
      hint: "Like a butterfly's life",
      etymology: "From Greek 'ephemeros' meaning 'lasting only a day'",
      example: "The beauty of cherry blossoms is ephemeral."
    },
    // Intermediate
    {
      id: "3",
      word: "Ubiquitous",
      definition: "Present, appearing, or found everywhere",
      options: [
        "Present, appearing, or found everywhere",
        "Extremely rare",
        "Very expensive",
        "Completely invisible"
      ],
      correctAnswer: "Present, appearing, or found everywhere",
      difficulty: "intermediate",
      category: "General",
      hint: "Think of something you see everywhere",
      etymology: "From Latin 'ubique' meaning 'everywhere'",
      example: "Smartphones have become ubiquitous in modern society."
    },
    {
      id: "4",
      word: "Perspicacious",
      definition: "Having a ready insight into and understanding of things",
      options: [
        "Having a ready insight into and understanding of things",
        "Being very talkative",
        "Having a good memory",
        "Being physically strong"
      ],
      correctAnswer: "Having a ready insight into and understanding of things",
      difficulty: "intermediate",
      category: "General",
      hint: "Someone who sees through things clearly",
      etymology: "From Latin 'perspicax' meaning 'sharp-sighted'",
      example: "Her perspicacious analysis of the situation impressed everyone."
    },
    // Advanced
    {
      id: "5",
      word: "Obfuscate",
      definition: "Render obscure, unclear, or unintelligible",
      options: [
        "Render obscure, unclear, or unintelligible",
        "Make something very clear",
        "Speed up a process",
        "Make something beautiful"
      ],
      correctAnswer: "Render obscure, unclear, or unintelligible",
      difficulty: "advanced",
      category: "General",
      hint: "To deliberately make something confusing",
      etymology: "From Latin 'obfuscare' meaning 'to darken'",
      example: "The politician tried to obfuscate the real issues."
    },
    // Expert
    {
      id: "6",
      word: "Pulchritudinous",
      definition: "Beautiful",
      options: [
        "Beautiful",
        "Very intelligent",
        "Extremely fast",
        "Completely silent"
      ],
      correctAnswer: "Beautiful",
      difficulty: "expert",
      category: "General",
      hint: "A very fancy way to say something is beautiful",
      etymology: "From Latin 'pulcher' meaning 'beautiful'",
      example: "The pulchritudinous sunset took everyone's breath away."
    }
  ]

  const getFilteredChallenges = () => {
    return wordChallenges.filter(challenge => challenge.difficulty === difficulty)
  }

  const getRandomChallenge = useCallback(() => {
    const filtered = getFilteredChallenges()
    if (filtered.length === 0) return null
    return filtered[Math.floor(Math.random() * filtered.length)]
  }, [difficulty])

  const startGame = () => {
    setGameState("playing")
    setGameStats({
      score: 0,
      streak: 0,
      timeRemaining: difficulty === "beginner" ? 60 : difficulty === "intermediate" ? 45 : difficulty === "advanced" ? 30 : 20,
      questionsAnswered: 0,
      correctAnswers: 0,
      hintsUsed: 0,
      powerUpsUsed: 0
    })
    setCurrentChallenge(getRandomChallenge())
    setSelectedAnswer("")
    setShowHint(false)
    setShowResult(null)
  }

  const usePowerUp = (powerUp: PowerUp) => {
    if (gameStats.score < powerUp.cost) return

    setGameStats(prev => ({
      ...prev,
      score: prev.score - powerUp.cost,
      powerUpsUsed: prev.powerUpsUsed + 1
    }))

    switch (powerUp.id) {
      case "hint":
        setShowHint(true)
        setGameStats(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }))
        break
      case "time":
        setGameStats(prev => ({ ...prev, timeRemaining: prev.timeRemaining + 15 }))
        break
      case "skip":
        nextQuestion()
        break
      case "double":
        setTimeBonus(2)
        break
    }
  }

  const nextQuestion = () => {
    const newChallenge = getRandomChallenge()
    setCurrentChallenge(newChallenge)
    setSelectedAnswer("")
    setShowHint(false)
    setShowResult(null)
    setTimeBonus(1)
  }

  const submitAnswer = () => {
    if (!selectedAnswer || !currentChallenge) return

    const isCorrect = selectedAnswer === currentChallenge.correctAnswer
    const baseScore = difficulty === "beginner" ? 10 : difficulty === "intermediate" ? 15 : difficulty === "advanced" ? 20 : 25
    const streakBonus = Math.min(gameStats.streak * 2, 20)
    const timeBonus = Math.max(0, Math.floor(gameStats.timeRemaining / 5))
    const totalScore = (baseScore + streakBonus + timeBonus) * timeBonus

    setShowResult(isCorrect ? "correct" : "incorrect")
    
    setGameStats(prev => ({
      ...prev,
      score: prev.score + (isCorrect ? totalScore : 0),
      streak: isCorrect ? prev.streak + 1 : 0,
      questionsAnswered: prev.questionsAnswered + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0)
    }))

    setTimeout(() => {
      nextQuestion()
    }, 2000)
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "beginner": return "bg-green-100 text-green-800"
      case "intermediate": return "bg-yellow-100 text-yellow-800"
      case "advanced": return "bg-orange-100 text-orange-800"
      case "expert": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyIcon = (diff: string) => {
    switch (diff) {
      case "beginner": return "🟢"
      case "intermediate": return "🟡"
      case "advanced": return "🟠"
      case "expert": return "🔴"
      default: return "⚪"
    }
  }

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && gameStats.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setGameStats(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }))
      }, 1000)
      return () => clearTimeout(timer)
    } else if (gameState === "playing" && gameStats.timeRemaining === 0) {
      setGameState("finished")
    }
  }, [gameState, gameStats.timeRemaining])

  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                📚 Vocabulary Challenges
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Test your vocabulary knowledge with timed challenges and progressive difficulty levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["beginner", "intermediate", "advanced", "expert"].map((diff) => (
              <Card key={diff} className="cursor-pointer hover:shadow-lg transition-all" onClick={() => setDifficulty(diff as any)}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-2">{getDifficultyIcon(diff)}</div>
                  <h3 className="font-bold capitalize">{diff}</h3>
                  <p className="text-sm text-muted-foreground">
                    {diff === "beginner" && "60s per question"}
                    {diff === "intermediate" && "45s per question"}
                    {diff === "advanced" && "30s per question"}
                    {diff === "expert" && "20s per question"}
                  </p>
                  <Badge className={`mt-2 ${getDifficultyColor(diff)}`}>
                    {getFilteredChallenges().length} words
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Game Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Time-based challenges</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span>Progressive difficulty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>Power-ups and hints</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span>Streak bonuses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    <span>Achievement system</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Performance tracking</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button onClick={startGame} size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <Play className="h-5 w-5 mr-2" />
              Start Challenge
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === "finished") {
    const accuracy = gameStats.questionsAnswered > 0 ? (gameStats.correctAnswers / gameStats.questionsAnswered) * 100 : 0
    const finalScore = gameStats.score + (gameStats.streak * 10)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="p-6 text-center">
              <Trophy className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Challenge Complete!</h2>
              <p className="text-lg">Great job on your vocabulary challenge!</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{finalScore}</div>
                <div className="text-sm text-muted-foreground">Final Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{accuracy.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{gameStats.streak}</div>
                <div className="text-sm text-muted-foreground">Best Streak</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{gameStats.questionsAnswered}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={() => setGameState("menu")} variant="outline">
              Back to Menu
            </Button>
            <Button onClick={startGame} className="bg-gradient-to-r from-blue-500 to-purple-500">
              Play Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Game Header */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge className={getDifficultyColor(difficulty)}>
                  {getDifficultyIcon(difficulty)} {difficulty}
                </Badge>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-bold">{gameStats.score}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="font-bold">{gameStats.streak} streak</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-red-500" />
                  <span className="font-bold text-red-500">{gameStats.timeRemaining}s</span>
                </div>
                <Progress value={(gameStats.timeRemaining / 60) * 100} className="w-20" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Power-ups */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Power-ups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {powerUps.map((powerUp) => (
                <Button
                  key={powerUp.id}
                  variant="outline"
                  size="sm"
                  onClick={() => usePowerUp(powerUp)}
                  disabled={gameStats.score < powerUp.cost}
                  className="flex items-center gap-2"
                >
                  {powerUp.icon}
                  {powerUp.name}
                  <Badge variant="secondary" className="ml-1">
                    {powerUp.cost}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Challenge */}
        {currentChallenge && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {currentChallenge.word}
              </CardTitle>
              <CardDescription className="text-center">
                {currentChallenge.category} • {currentChallenge.difficulty}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-lg font-medium mb-4">
                  What does "{currentChallenge.word}" mean?
                </p>
                
                {showHint && currentChallenge.hint && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Hint</span>
                    </div>
                    <p className="text-yellow-700">{currentChallenge.hint}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {currentChallenge.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === option ? "default" : "outline"}
                      className="w-full justify-start h-auto p-4 text-left"
                      onClick={() => setSelectedAnswer(option)}
                      disabled={showResult !== null}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                      </div>
                    </Button>
                  ))}
                </div>

                {showResult && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    showResult === "correct" 
                      ? "bg-green-50 border border-green-200" 
                      : "bg-red-50 border border-red-200"
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {showResult === "correct" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`font-medium ${
                        showResult === "correct" ? "text-green-800" : "text-red-800"
                      }`}>
                        {showResult === "correct" ? "Correct!" : "Incorrect"}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      showResult === "correct" ? "text-green-700" : "text-red-700"
                    }`}>
                      {showResult === "correct" 
                        ? `Great job! +${timeBonus} points`
                        : `The correct answer is: ${currentChallenge.correctAnswer}`
                      }
                    </p>
                    {currentChallenge.example && (
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Example:</strong> {currentChallenge.example}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-4 justify-center mt-6">
                  <Button
                    onClick={submitAnswer}
                    disabled={!selectedAnswer || showResult !== null}
                    className="bg-gradient-to-r from-blue-500 to-purple-500"
                  >
                    Submit Answer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setGameState("paused")}
                  >
                    Pause
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
