"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { 
  Calculator, 
  Map, 
  Sword, 
  Shield, 
  Heart, 
  Star, 
  Trophy, 
  BookOpen,
  Gamepad2,
  Zap,
  Crown,
  Target,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw
} from "lucide-react"

interface StoryChapter {
  id: string
  title: string
  description: string
  story: string
  mathProblem: MathProblem
  rewards: {
    xp: number
    items?: string[]
    unlockNext?: boolean
  }
  unlocked: boolean
  completed: boolean
}

interface MathProblem {
  id: string
  question: string
  type: "addition" | "subtraction" | "multiplication" | "division" | "algebra" | "geometry" | "word"
  difficulty: "beginner" | "intermediate" | "advanced"
  correctAnswer: number | string
  options?: number[]
  explanation: string
  hints: string[]
  realWorldContext?: string
}

interface PlayerStats {
  level: number
  xp: number
  health: number
  maxHealth: number
  inventory: string[]
  currentChapter: number
  achievements: string[]
}

interface Adventure {
  id: string
  name: string
  description: string
  theme: string
  icon: React.ReactNode
  color: string
  chapters: StoryChapter[]
  totalChapters: number
  completedChapters: number
}

export function MathAdventureGames() {
  const [selectedAdventure, setSelectedAdventure] = useState<Adventure | null>(null)
  const [currentChapter, setCurrentChapter] = useState<StoryChapter | null>(null)
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    level: 1,
    xp: 0,
    health: 100,
    maxHealth: 100,
    inventory: ["Basic Sword", "Health Potion"],
    currentChapter: 1,
    achievements: []
  })
  const [gameState, setGameState] = useState<"menu" | "story" | "problem" | "result">("menu")
  const [userAnswer, setUserAnswer] = useState<string>("")
  const [showHint, setShowHint] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const [showResult, setShowResult] = useState<"correct" | "incorrect" | null>(null)

  const adventures: Adventure[] = [
    {
      id: "dragon-quest",
      name: "Dragon Quest Adventure",
      description: "Embark on a magical journey to save the kingdom from an ancient dragon",
      theme: "Fantasy",
      icon: <Sword className="h-6 w-6" />,
      color: "bg-red-500",
      totalChapters: 10,
      completedChapters: 3,
      chapters: [
        {
          id: "1",
          title: "The Beginning",
          description: "Start your adventure in the village",
          story: "You are a brave young adventurer living in the peaceful village of Mathville. One day, an ancient dragon awakens and threatens to destroy your home. The village elder gives you a magical sword and asks you to embark on a quest to save the kingdom. Your first challenge awaits at the village gate...",
          mathProblem: {
            id: "1",
            question: "You need to buy supplies for your journey. A sword costs 15 gold coins, a shield costs 12 gold coins, and a health potion costs 8 gold coins. How much gold do you need in total?",
            type: "addition",
            difficulty: "beginner",
            correctAnswer: 35,
            options: [30, 35, 40, 45],
            explanation: "15 + 12 + 8 = 35 gold coins total",
            hints: [
              "Add the cost of each item together",
              "15 + 12 = 27, then add 8 more",
              "The total should be 35"
            ],
            realWorldContext: "This is like calculating the total cost when shopping for multiple items"
          },
          rewards: {
            xp: 50,
            items: ["Basic Sword", "Wooden Shield"],
            unlockNext: true
          },
          unlocked: true,
          completed: true
        },
        {
          id: "2",
          title: "The Forest Path",
          description: "Navigate through the mysterious forest",
          story: "As you leave the village, you enter the Dark Forest. The path is overgrown and you need to calculate the correct route. The forest guardian gives you a riddle: 'To find the right path, solve this puzzle and you shall pass.'",
          mathProblem: {
            id: "2",
            question: "You find 3 treasure chests. The first has 24 gold coins, the second has 18 gold coins, and the third has 12 gold coins. If you can only carry 2 chests, which combination gives you the most gold?",
            type: "addition",
            difficulty: "beginner",
            correctAnswer: 42,
            options: [36, 42, 30, 40],
            explanation: "The two largest amounts are 24 and 18, which equals 42 gold coins",
            hints: [
              "Find the two largest numbers",
              "24 and 18 are the biggest amounts",
              "24 + 18 = 42"
            ],
            realWorldContext: "This is like choosing the best combination when you have limited capacity"
          },
          rewards: {
            xp: 75,
            items: ["Forest Map"],
            unlockNext: true
          },
          unlocked: true,
          completed: false
        },
        {
          id: "3",
          title: "The Mountain Pass",
          description: "Climb the treacherous mountain",
          story: "You reach the base of Mount Mathmore. The path up is steep and dangerous. A wise mountain guide tells you: 'To safely climb this mountain, you must understand the patterns of the ancient stones.'",
          mathProblem: {
            id: "3",
            question: "The mountain has 5 levels. Each level is 12 meters high. How tall is the entire mountain?",
            type: "multiplication",
            difficulty: "intermediate",
            correctAnswer: 60,
            options: [50, 55, 60, 65],
            explanation: "5 levels × 12 meters per level = 60 meters total",
            hints: [
              "Multiply the number of levels by the height of each level",
              "5 × 12 = ?",
              "Think of it as 5 groups of 12"
            ],
            realWorldContext: "This is like calculating total distance when you know the number of segments and length of each"
          },
          rewards: {
            xp: 100,
            items: ["Climbing Gear"],
            unlockNext: true
          },
          unlocked: true,
          completed: false
        }
      ]
    },
    {
      id: "space-explorer",
      name: "Space Explorer Mission",
      description: "Journey through the galaxy solving math problems to reach distant planets",
      theme: "Sci-Fi",
      icon: <Target className="h-6 w-6" />,
      color: "bg-blue-500",
      totalChapters: 8,
      completedChapters: 1,
      chapters: [
        {
          id: "1",
          title: "Launch Sequence",
          description: "Prepare for space travel",
          story: "You are a space explorer preparing for a mission to explore distant planets. Your spaceship needs fuel calculations to reach the first planet. The mission control gives you the launch sequence...",
          mathProblem: {
            id: "1",
            question: "Your spaceship needs 150 liters of fuel to reach Planet Alpha. You currently have 85 liters. How much more fuel do you need?",
            type: "subtraction",
            difficulty: "beginner",
            correctAnswer: 65,
            options: [60, 65, 70, 75],
            explanation: "150 - 85 = 65 liters of fuel needed",
            hints: [
              "Subtract what you have from what you need",
              "150 - 85 = ?",
              "You need 65 more liters"
            ],
            realWorldContext: "This is like calculating how much more you need to reach a goal"
          },
          rewards: {
            xp: 60,
            items: ["Space Suit"],
            unlockNext: true
          },
          unlocked: true,
          completed: true
        }
      ]
    },
    {
      id: "pirate-treasure",
      name: "Pirate Treasure Hunt",
      description: "Sail the seven seas in search of buried treasure using math skills",
      theme: "Pirate",
      icon: <Crown className="h-6 w-6" />,
      color: "bg-yellow-500",
      totalChapters: 12,
      completedChapters: 0,
      chapters: [
        {
          id: "1",
          title: "Setting Sail",
          description: "Begin your pirate adventure",
          story: "You are a young pirate setting sail on your first treasure hunt. The old sea captain gives you a treasure map with mathematical clues. Your first challenge is to navigate to the first island...",
          mathProblem: {
            id: "1",
            question: "Your ship sails at 15 knots per hour. How far will you travel in 4 hours?",
            type: "multiplication",
            difficulty: "beginner",
            correctAnswer: 60,
            options: [50, 55, 60, 65],
            explanation: "15 knots/hour × 4 hours = 60 nautical miles",
            hints: [
              "Multiply speed by time",
              "15 × 4 = ?",
              "Think of it as 4 groups of 15"
            ],
            realWorldContext: "This is like calculating distance when you know speed and time"
          },
          rewards: {
            xp: 55,
            items: ["Compass"],
            unlockNext: true
          },
          unlocked: true,
          completed: false
        }
      ]
    }
  ]

  const startAdventure = (adventure: Adventure) => {
    setSelectedAdventure(adventure)
    const firstChapter = adventure.chapters.find(ch => ch.unlocked && !ch.completed) || adventure.chapters[0]
    setCurrentChapter(firstChapter)
    setGameState("story")
  }

  const startProblem = () => {
    setGameState("problem")
    setUserAnswer("")
    setShowHint(false)
    setHintIndex(0)
    setShowResult(null)
  }

  const submitAnswer = () => {
    if (!userAnswer || !currentChapter) return

    const isCorrect = userAnswer === currentChapter.mathProblem.correctAnswer.toString()
    setShowResult(isCorrect ? "correct" : "incorrect")

    if (isCorrect) {
      setPlayerStats(prev => ({
        ...prev,
        xp: prev.xp + currentChapter.rewards.xp,
        level: Math.floor((prev.xp + currentChapter.rewards.xp) / 100) + 1,
        inventory: [...prev.inventory, ...(currentChapter.rewards.items || [])]
      }))
    }

    setTimeout(() => {
      setGameState("result")
    }, 2000)
  }

  const nextChapter = () => {
    if (!selectedAdventure || !currentChapter) return

    const currentIndex = selectedAdventure.chapters.findIndex(ch => ch.id === currentChapter.id)
    const nextChapter = selectedAdventure.chapters[currentIndex + 1]
    
    if (nextChapter && nextChapter.unlocked) {
      setCurrentChapter(nextChapter)
      setGameState("story")
    } else {
      setGameState("menu")
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800"
      case "intermediate": return "bg-yellow-100 text-yellow-800"
      case "advanced": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-full">
                <Gamepad2 className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                🎮 Math Adventure Games
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Embark on epic adventures where math problems unlock story chapters and magical rewards
            </p>
          </div>

          {/* Player Stats */}
          <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">🧙‍♂️</div>
                  <div>
                    <h3 className="text-xl font-bold">Adventure Hero</h3>
                    <p className="text-green-100">Level {playerStats.level} Explorer</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold">{playerStats.xp}</div>
                    <div className="text-sm text-green-100">XP</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{playerStats.health}</div>
                    <div className="text-sm text-green-100">Health</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{playerStats.inventory.length}</div>
                    <div className="text-sm text-green-100">Items</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adventures */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {adventures.map((adventure) => (
              <Card key={adventure.id} className="cursor-pointer hover:shadow-lg transition-all" onClick={() => startAdventure(adventure)}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${adventure.color} text-white`}>
                      {adventure.icon}
                    </div>
                    <div>
                      <CardTitle>{adventure.name}</CardTitle>
                      <CardDescription>{adventure.theme} Adventure</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{adventure.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{adventure.totalChapters} Chapters</Badge>
                    <div className="text-sm text-muted-foreground">
                      {adventure.completedChapters}/{adventure.totalChapters} completed
                    </div>
                  </div>
                  
                  <Progress 
                    value={(adventure.completedChapters / adventure.totalChapters) * 100} 
                    className="w-full"
                  />
                  
                  <Button className="w-full" variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Start Adventure
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (gameState === "story" && currentChapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{currentChapter.title}</CardTitle>
              <CardDescription>{currentChapter.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <p className="text-lg leading-relaxed">{currentChapter.story}</p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={startProblem} size="lg" className="bg-gradient-to-r from-green-500 to-blue-500">
                  <Calculator className="h-5 w-5 mr-2" />
                  Solve the Problem
                </Button>
                <Button onClick={() => setGameState("menu")} variant="outline">
                  Back to Adventures
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (gameState === "problem" && currentChapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Math Challenge</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(currentChapter.mathProblem.difficulty)}>
                  {currentChapter.mathProblem.difficulty}
                </Badge>
                <Badge variant="outline">{currentChapter.mathProblem.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-medium mb-4">{currentChapter.mathProblem.question}</h3>
                
                {currentChapter.mathProblem.options && (
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {currentChapter.mathProblem.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={userAnswer === option.toString() ? "default" : "outline"}
                        className="h-12"
                        onClick={() => setUserAnswer(option.toString())}
                        disabled={showResult !== null}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}

                {!currentChapter.mathProblem.options && (
                  <div className="mb-6">
                    <Input
                      type="number"
                      placeholder="Enter your answer"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="text-lg"
                      disabled={showResult !== null}
                    />
                  </div>
                )}

                {showHint && currentChapter.mathProblem.hints[hintIndex] && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Hint {hintIndex + 1}</span>
                    </div>
                    <p className="text-yellow-700">{currentChapter.mathProblem.hints[hintIndex]}</p>
                  </div>
                )}

                {showResult && (
                  <div className={`p-4 rounded-lg mb-4 ${
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
                      {currentChapter.mathProblem.explanation}
                    </p>
                    {currentChapter.mathProblem.realWorldContext && (
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Real-world context:</strong> {currentChapter.mathProblem.realWorldContext}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={submitAnswer}
                    disabled={!userAnswer || showResult !== null}
                    className="bg-gradient-to-r from-green-500 to-blue-500"
                  >
                    Submit Answer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (hintIndex < currentChapter.mathProblem.hints.length - 1) {
                        setHintIndex(hintIndex + 1)
                      }
                      setShowHint(true)
                    }}
                    disabled={hintIndex >= currentChapter.mathProblem.hints.length - 1}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Get Hint
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (gameState === "result" && currentChapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="p-6 text-center">
              <Trophy className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Chapter Complete!</h2>
              <p className="text-lg">You earned {currentChapter.rewards.xp} XP!</p>
            </CardContent>
          </Card>

          {currentChapter.rewards.items && currentChapter.rewards.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Items Found!</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {currentChapter.rewards.items.map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4 justify-center">
            <Button onClick={nextChapter} className="bg-gradient-to-r from-green-500 to-blue-500">
              <Play className="h-4 w-4 mr-2" />
              Next Chapter
            </Button>
            <Button onClick={() => setGameState("menu")} variant="outline">
              Back to Adventures
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
