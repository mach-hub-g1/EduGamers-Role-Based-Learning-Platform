"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  BookOpen, 
  Calculator, 
  FlaskConical, 
  History, 
  Users, 
  SpellCheck, 
  Theater, 
  PenTool, 
  Briefcase, 
  Puzzle, 
  Presentation, 
  MessageSquare, 
  Brain, 
  Trophy,
  Star,
  Clock,
  Target,
  Gamepad2,
  Crown,
  Sparkles,
  Flame,
  Home,
  Settings,
  Award
} from "lucide-react"
import { GameSwiper } from "./game-swiper"

interface GameCategory {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  games: Game[]
  totalLevels: number
  completedLevels: number
}

export interface Game {
  id: string
  name: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced" | "expert"
  timeLimit?: number
  multiplayer: boolean
  collaborative: boolean
  xpReward: number
  unlocked: boolean
  completed: boolean
  bestScore?: number
  icon: React.ReactNode
  features: string[]
  emoji: string
}

interface Player {
  id: string
  name: string
  avatar: string
  level: number
  xp: number
  streak: number
}

interface GameSession {
  gameId: string
  players: Player[]
  startTime: Date
  isActive: boolean
}

export function ComprehensiveGameHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>("vocabulary")
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [activeSession, setActiveSession] = useState<GameSession | null>(null)
  const [gameScore, setGameScore] = useState(0)
  const [gameTime, setGameTime] = useState(0)
  const [clickedElements, setClickedElements] = useState<Set<number>>(new Set())
  const [playerStats, setPlayerStats] = useState({
    level: 12,
    xp: 2450,
    streak: 7,
    totalGamesPlayed: 89,
    achievements: 23,
    name: 'Player', // Will be loaded from user profile
    avatar: '/placeholder-user.jpg' // Default avatar
  })
  
  // Load user profile on component mount
  useEffect(() => {
    // In a real app, this would come from your auth context or user profile
    const loadUserProfile = async () => {
      try {
        // Example: const user = await getUserProfile();
        // setPlayerStats(prev => ({
        //   ...prev,
        //   name: user.displayName || 'Player',
        //   avatar: user.photoURL || '/placeholder-user.jpg'
        // }));
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };
    
    loadUserProfile();
  }, []);

  const gameCategories: GameCategory[] = [
    {
      id: "vocabulary",
      name: "Vocabulary Master",
      description: "Word challenges and language games",
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-blue-500",
      totalLevels: 25,
      completedLevels: 18,
      games: [
        {
          id: "word-match",
          name: "Word Definition Match",
          description: "Match words to their definitions under time pressure",
          difficulty: "beginner",
          timeLimit: 60,
          multiplayer: true,
          collaborative: false,
          xpReward: 50,
          unlocked: true,
          completed: true,
          bestScore: 95,
          icon: <Target className="h-5 w-5" />,
          features: ["Time Challenge", "Progressive Difficulty", "Hint System"],
          emoji: "🎯"
        },
        {
          id: "spelling-bee",
          name: "Spelling Bee Championship",
          description: "Spell words correctly with hints and power-ups",
          difficulty: "intermediate",
          timeLimit: 90,
          multiplayer: true,
          collaborative: false,
          xpReward: 75,
          unlocked: true,
          completed: false,
          bestScore: 78,
          icon: <SpellCheck className="h-5 w-5" />,
          features: ["Power-ups", "Hint System", "Championship Mode"],
          emoji: "🔤"
        },
        {
          id: "word-chain",
          name: "Word Chain Challenge",
          description: "Create chains of related words and limericks",
          difficulty: "advanced",
          multiplayer: true,
          collaborative: true,
          xpReward: 100,
          unlocked: true,
          completed: false,
          icon: <MessageSquare className="h-5 w-5" />,
          features: ["Creative Writing", "Collaborative", "Poetry Mode"],
          emoji: "📝"
        }
      ]
    },
    {
      id: "mathematics",
      name: "Math Adventure",
      description: "Story-driven math problems and puzzles",
      icon: <Calculator className="h-6 w-6" />,
      color: "bg-green-500",
      totalLevels: 30,
      completedLevels: 22,
      games: [
        {
          id: "math-story",
          name: "Math Quest Adventure",
          description: "Solve math problems to unlock story chapters",
          difficulty: "beginner",
          timeLimit: 120,
          multiplayer: false,
          collaborative: false,
          xpReward: 60,
          unlocked: true,
          completed: true,
          bestScore: 88,
          icon: <Gamepad2 className="h-5 w-5" />,
          features: ["Story Mode", "Progressive Levels", "Achievement System"],
          emoji: "📖"
        },
        {
          id: "budget-simulator",
          name: "Budget Master",
          description: "Learn real-world budgeting and financial skills",
          difficulty: "intermediate",
          timeLimit: 180,
          multiplayer: true,
          collaborative: true,
          xpReward: 80,
          unlocked: true,
          completed: false,
          icon: <Briefcase className="h-5 w-5" />,
          features: ["Real-world Skills", "Collaborative", "Simulation"],
          emoji: "💰"
        }
      ]
    },
    {
      id: "science",
      name: "Science Lab",
      description: "Interactive experiments and simulations",
      icon: <FlaskConical className="h-6 w-6" />,
      color: "bg-purple-500",
      totalLevels: 20,
      completedLevels: 15,
      games: [
        {
          id: "element-combiner",
          name: "Element Combination Lab",
          description: "Combine elements and see chemical reactions",
          difficulty: "intermediate",
          timeLimit: 300,
          multiplayer: true,
          collaborative: true,
          xpReward: 90,
          unlocked: true,
          completed: true,
          bestScore: 92,
          icon: <FlaskConical className="h-5 w-5" />,
          features: ["Interactive Lab", "Real Chemistry", "Collaborative"],
          emoji: "🧪"
        },
        {
          id: "measurement-master",
          name: "Measurement Challenge",
          description: "Practice real-world measurement skills",
          difficulty: "beginner",
          timeLimit: 90,
          multiplayer: false,
          collaborative: false,
          xpReward: 45,
          unlocked: true,
          completed: false,
          icon: <Target className="h-5 w-5" />,
          features: ["Real-world Skills", "Precision Training", "Visual Learning"],
          emoji: "📏"
        }
      ]
    },
    {
      id: "history",
      name: "History Detective",
      description: "Mystery-solving through historical clues",
      icon: <History className="h-6 w-6" />,
      color: "bg-orange-500",
      totalLevels: 18,
      completedLevels: 12,
      games: [
        {
          id: "mystery-solver",
          name: "Historical Mystery",
          description: "Gather clues to solve historical mysteries",
          difficulty: "advanced",
          timeLimit: 240,
          multiplayer: true,
          collaborative: true,
          xpReward: 120,
          unlocked: true,
          completed: true,
          bestScore: 85,
          icon: <History className="h-5 w-5" />,
          features: ["Mystery Solving", "Research Skills", "Collaborative"],
          emoji: "🔍"
        }
      ]
    },
    {
      id: "collaborative",
      name: "Team Challenges",
      description: "Multiplayer and collaborative learning games",
      icon: <Users className="h-6 w-6" />,
      color: "bg-pink-500",
      totalLevels: 15,
      completedLevels: 8,
      games: [
        {
          id: "scavenger-hunt",
          name: "Knowledge Scavenger Hunt",
          description: "Team-based riddles and clue hunting",
          difficulty: "intermediate",
          timeLimit: 600,
          multiplayer: true,
          collaborative: true,
          xpReward: 150,
          unlocked: true,
          completed: false,
          icon: <Users className="h-5 w-5" />,
          features: ["Team Play", "Riddles", "Time Challenge"],
          emoji: "🔎"
        },
        {
          id: "roleplay-scenarios",
          name: "Role-Playing Scenarios",
          description: "Answer questions as different characters",
          difficulty: "advanced",
          timeLimit: 300,
          multiplayer: true,
          collaborative: true,
          xpReward: 100,
          unlocked: true,
          completed: false,
          icon: <Theater className="h-5 w-5" />,
          features: ["Character Play", "Critical Thinking", "Collaborative"],
          emoji: "🎭"
        }
      ]
    },
    {
      id: "creative",
      name: "Creative Corner",
      description: "Storytelling and creative expression games",
      icon: <PenTool className="h-6 w-6" />,
      color: "bg-indigo-500",
      totalLevels: 12,
      completedLevels: 6,
      games: [
        {
          id: "storytelling",
          name: "Creative Storytelling",
          description: "Create stories using prompts, words, or images",
          difficulty: "intermediate",
          timeLimit: 180,
          multiplayer: true,
          collaborative: true,
          xpReward: 80,
          unlocked: true,
          completed: false,
          icon: <PenTool className="h-5 w-5" />,
          features: ["Creative Writing", "Visual Prompts", "Collaborative"],
          emoji: "✏️"
        },
        {
          id: "show-tell",
          name: "Show and Tell Research",
          description: "Research and present facts on various topics",
          difficulty: "advanced",
          timeLimit: 300,
          multiplayer: true,
          collaborative: true,
          xpReward: 100,
          unlocked: true,
          completed: false,
          icon: <Presentation className="h-5 w-5" />,
          features: ["Research Skills", "Presentation", "Knowledge Sharing"],
          emoji: "📚"
        }
      ]
    },
    {
      id: "brain-training",
      name: "Brain Training",
      description: "Logic puzzles and critical thinking challenges",
      icon: <Brain className="h-6 w-6" />,
      color: "bg-teal-500",
      totalLevels: 20,
      completedLevels: 14,
      games: [
        {
          id: "would-you-rather",
          name: "Would You Rather?",
          description: "Critical thinking based on lesson content",
          difficulty: "intermediate",
          timeLimit: 120,
          multiplayer: true,
          collaborative: true,
          xpReward: 70,
          unlocked: true,
          completed: true,
          bestScore: 90,
          icon: <Brain className="h-5 w-5" />,
          features: ["Critical Thinking", "Discussion", "Collaborative"],
          emoji: "🤔"
        },
        {
          id: "puzzle-master",
          name: "Progressive Puzzles",
          description: "Gradually increasing difficulty puzzles",
          difficulty: "expert",
          timeLimit: 300,
          multiplayer: false,
          collaborative: false,
          xpReward: 150,
          unlocked: true,
          completed: false,
          icon: <Puzzle className="h-5 w-5" />,
          features: ["Progressive Difficulty", "Logic Training", "Achievement System"],
          emoji: "🧩"
        }
      ]
    },
    {
      id: "history-detective",
      name: "History Detective",
      description: "Mystery-solving through historical clues",
      icon: <History className="h-6 w-6" />,
      color: "bg-orange-500",
      totalLevels: 18,
      completedLevels: 12,
      games: [
        {
          id: "mystery-solver",
          name: "Historical Mystery",
          description: "Gather clues to solve historical mysteries",
          difficulty: "advanced",
          timeLimit: 240,
          multiplayer: true,
          collaborative: true,
          xpReward: 120,
          unlocked: true,
          completed: true,
          bestScore: 85,
          icon: <History className="h-5 w-5" />,
          features: ["Mystery Solving", "Research Skills", "Collaborative"],
          emoji: "🔍"
        },
        {
          id: "time-travel",
          name: "Time Travel Adventure",
          description: "Navigate through different historical periods",
          difficulty: "intermediate",
          timeLimit: 180,
          multiplayer: false,
          collaborative: false,
          xpReward: 90,
          unlocked: true,
          completed: false,
          icon: <Clock className="h-5 w-5" />,
          features: ["Historical Context", "Timeline Navigation", "Cultural Learning"],
          emoji: "🕰️"
        }
      ]
    },
    {
      id: "spelling-bee",
      name: "Spelling Championship",
      description: "Spelling competitions with hints and power-ups",
      icon: <SpellCheck className="h-6 w-6" />,
      color: "bg-indigo-500",
      totalLevels: 15,
      completedLevels: 8,
      games: [
        {
          id: "spelling-challenge",
          name: "Spelling Bee Challenge",
          description: "Spell words correctly with hints and power-ups",
          difficulty: "intermediate",
          timeLimit: 90,
          multiplayer: true,
          collaborative: false,
          xpReward: 75,
          unlocked: true,
          completed: false,
          bestScore: 78,
          icon: <SpellCheck className="h-5 w-5" />,
          features: ["Power-ups", "Hint System", "Championship Mode"],
          emoji: "🔤"
        },
        {
          id: "word-master",
          name: "Word Master Tournament",
          description: "Advanced spelling with complex words",
          difficulty: "expert",
          timeLimit: 120,
          multiplayer: true,
          collaborative: false,
          xpReward: 100,
          unlocked: false,
          completed: false,
          icon: <Trophy className="h-5 w-5" />,
          features: ["Tournament Mode", "Advanced Words", "Competitive"],
          emoji: "🏆"
        }
      ]
    },
    {
      id: "roleplay",
      name: "Role-Playing Scenarios",
      description: "Answer questions as different characters",
      icon: <Theater className="h-6 w-6" />,
      color: "bg-pink-500",
      totalLevels: 12,
      completedLevels: 5,
      games: [
        {
          id: "ambassador-roleplay",
          name: "Diplomatic Ambassador",
          description: "Solve problems as a diplomatic ambassador",
          difficulty: "advanced",
          timeLimit: 300,
          multiplayer: true,
          collaborative: true,
          xpReward: 100,
          unlocked: true,
          completed: false,
          icon: <Theater className="h-5 w-5" />,
          features: ["Character Play", "Critical Thinking", "Collaborative"],
          emoji: "🎭"
        },
        {
          id: "scientist-roleplay",
          name: "Research Scientist",
          description: "Conduct experiments and solve scientific problems",
          difficulty: "intermediate",
          timeLimit: 240,
          multiplayer: false,
          collaborative: false,
          xpReward: 80,
          unlocked: true,
          completed: false,
          icon: <FlaskConical className="h-5 w-5" />,
          features: ["Scientific Method", "Problem Solving", "Research Skills"],
          emoji: "🔬"
        }
      ]
    },
    {
      id: "real-world-skills",
      name: "Real-World Skills",
      description: "Practical life skills and applications",
      icon: <Briefcase className="h-6 w-6" />,
      color: "bg-emerald-500",
      totalLevels: 10,
      completedLevels: 3,
      games: [
        {
          id: "budget-master",
          name: "Budget Master",
          description: "Learn real-world budgeting and financial skills",
          difficulty: "intermediate",
          timeLimit: 180,
          multiplayer: true,
          collaborative: true,
          xpReward: 80,
          unlocked: true,
          completed: false,
          icon: <Briefcase className="h-5 w-5" />,
          features: ["Real-world Skills", "Collaborative", "Simulation"],
          emoji: "💰"
        },
        {
          id: "measurement-challenge",
          name: "Measurement Challenge",
          description: "Practice real-world measurement skills",
          difficulty: "beginner",
          timeLimit: 90,
          multiplayer: false,
          collaborative: false,
          xpReward: 45,
          unlocked: true,
          completed: false,
          icon: <Target className="h-5 w-5" />,
          features: ["Real-world Skills", "Precision Training", "Visual Learning"],
          emoji: "📏"
        }
      ]
    }
  ]

  // Helper function to get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get difficulty icon
  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '🌱';
      case 'intermediate': return '📘';
      case 'advanced': return '🏆';
      case 'expert': return '🔥';
      default: return '❓';
    }
  };

  // Start a new game
            </div>
            <div>
              <CardTitle>{selectedGame.name}</CardTitle>
              <CardDescription>{selectedGame.description}</CardDescription>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setSelectedGame(null)
              setActiveSession(null)
              setGameScore(0)
              setGameTime(0)
            }}
          >
            ✕
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Game Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Difficulty:</span>
                  <Badge className={getDifficultyColor(selectedGame.difficulty)}>
                    {getDifficultyIcon(selectedGame.difficulty)} {selectedGame.difficulty}
                  </Badge>
                </div>
                {selectedGame.timeLimit && (
                  <div className="flex justify-between">
                    <span>Time Remaining:</span>
                    <span className={gameTime >= selectedGame.timeLimit * 0.8 ? "text-red-500 font-bold" : ""}>
                      {selectedGame.timeLimit - gameTime}s
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Game Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Best Score:</span>
                  <span className="font-medium">{selectedGame.bestScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span>XP Reward:</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">{selectedGame.xpReward}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              className="w-full"
              onClick={() => {
                // Start the game session
                setActiveSession({
                  gameId: selectedGame.id,
                  players: [{
                    id: 'player-1',
                    name: playerStats.name,
                    avatar: playerStats.avatar,
                    level: playerStats.level,
                    xp: playerStats.xp,
                    streak: playerStats.streak
                  }],
                  startTime: new Date(),
                  isActive: true
                });
              }}
            >
              Start Game
            </Button>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => setSelectedGame(null)}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )}
/* ... */
