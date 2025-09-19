"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft,
  BookOpen, 
  Calculator, 
  Clock, 
  Search, 
  Star, 
  TrendingUp,
  Activity,
  Award,
  HelpCircle,
  SpellCheck,
  Play,
  BarChart3,
  Calendar,
  Globe,
  Cloud,
  MapPin,
  Brain,
  Grid3X3,
  Crown,
  Languages
} from "lucide-react";
import { WordMatchGame } from "./word-match-game";
import { SynonymShowdownGame } from "./synonym-showdown-game";
import { MathChallengeGame } from "./math-challenge-game";
import { QuickMemoryGame } from "./quick-memory-game";
import { ColorMatchGame } from "./color-match-game";
import { CountryCapitalGame } from "./country-capital-game";
import { QuickMathGame } from "./quick-math-game";
import { RhymeTimeGame } from "./rhyme-time-game";
import { ElementMatchGame } from "./element-match-game";
import { FractionMasterGame } from "./fraction-master-game";
import { HistoryTimelineGame } from "./history-timeline-game";
import { LogicPuzzleGame } from "./logic-pattern-game";

// Types
type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

interface GameCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  games: Game[];
  totalLevels: number;
  completedLevels: number;
}

interface Game {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  timeLimit?: number;
  multiplayer?: boolean;
  collaborative?: boolean;
  xpReward: number;
  unlocked?: boolean;
  completed?: boolean;
  bestScore?: number;
  icon: React.ReactNode;
  features: string[];
  emoji: string;
  category: string;
  playable?: boolean;
}

interface Player {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  bestScores?: Record<string, number>;
  completedGames?: string[];
}

interface GameSession {
  gameId: string;
  players: Player[];
  startTime: Date;
  isActive: boolean;
}

interface GameProps {
  onComplete: (score: number) => void;
  onBack: () => void;
  startTime: Date;
  isActive: boolean;
}

// Helper function to get difficulty color
const getDifficultyColor = (difficulty: Difficulty): string => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-blue-100 text-blue-800';
    case 'advanced':
      return 'bg-purple-100 text-purple-800';
    case 'expert':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function ComprehensiveGameHub() {
  // Game state
  const [selectedCategory, setSelectedCategory] = useState<string>("vocabulary");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [activeGameSession, setActiveGameSession] = useState<GameSession | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameTime, setGameTime] = useState<number>(0);
  
  // Mock player data - in a real app, this would come from your auth/user context
  const [player, setPlayer] = useState<Player>({
    id: 'player-1',
    name: 'Student',
    avatar: '/default-avatar.png',
    level: 1,
    xp: 0,
    xpToNextLevel: 1000,
    bestScores: {},
    completedGames: []
  });

  // Handle game completion and back button click
  const handleGameComplete = (score: number) => {
    if (!selectedGame) return;
    
    // Update player's best score if current score is higher
    const currentBest = player.bestScores?.[selectedGame.id] || 0;
    const newBestScore = Math.max(score, currentBest);
    
    // Update player state
    setPlayer(prev => ({
      ...prev,
      xp: prev.xp + selectedGame.xpReward,
      bestScores: {
        ...(prev.bestScores || {}),
        [selectedGame.id]: newBestScore
      },
      completedGames: [
        ...(prev.completedGames || []),
        ...((prev.completedGames || []).includes(selectedGame.id) ? [] : [selectedGame.id])
      ]
    }));
    
    setGameScore(score);
    setSelectedGame(null);
    setActiveGameSession(null);
  };

  const handleBack = () => {
    setSelectedGame(null);
    setActiveGameSession(null);
    setGameScore(0);
    setGameTime(0);
  };

  // Start a new game session
  const startGame = (game: Game) => {
    setSelectedGame(game);
    setActiveGameSession({
      gameId: game.id,
      players: [{
        id: 'player1',
        name: player.name,
        avatar: player.avatar,
        level: player.level,
        xp: player.xp,
        xpToNextLevel: player.xpToNextLevel
      }],
      startTime: new Date(),
      isActive: true
    });
    setGameScore(0);
    setGameTime(0);
  };

  // Render the appropriate game component based on selection
  const renderGame = () => {
    if (!selectedGame) return null;

    const gameProps: GameProps = {
      onComplete: handleGameComplete,
      onBack: handleBack,
      startTime: activeGameSession?.startTime || new Date(),
      isActive: activeGameSession?.isActive || false
    };

    switch (selectedGame.id) {
      case 'word-match':
        return <WordMatchGame {...gameProps} />;
      case 'synonym-showdown':
        return <SynonymShowdownGame {...gameProps} />;
      case 'rhyme-time':
        return <RhymeTimeGame {...gameProps} />;
      case 'math-challenge':
        return <MathChallengeGame {...gameProps} />;
      case 'quick-math':
        return <QuickMathGame {...gameProps} />;
      case 'fraction-master':
        return <FractionMasterGame {...gameProps} />;
      case 'element-match':
        return <ElementMatchGame {...gameProps} />;
      case 'color-match':
        return <ColorMatchGame {...gameProps} />;
      case 'history-timeline':
        return <HistoryTimelineGame {...gameProps} />;
      case 'country-capital':
        return <CountryCapitalGame {...gameProps} />;
      case 'quick-memory':
        return <QuickMemoryGame {...gameProps} />;
      case 'logic-puzzle':
        return <LogicPuzzleGame {...gameProps} />;
      default:
        return (
          <div className="text-center p-8">
            <div className="text-4xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold mb-2">Game Coming Soon!</h2>
            <p className="text-muted-foreground mb-6">
              This game is still in development. Check back later!
            </p>
            <Button onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
          </div>
        );
    }
  };

  // Render game grid for category view
  const renderGameGrid = () => {
    const category = gameCategories.find(cat => cat.id === selectedCategory);
    if (!category) return null;

    // Filter games based on search query
    const filteredGames = category.games.filter(game => 
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredGames.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No games found matching your search.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGames.map((game) => (
          <Card 
            key={game.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => startGame(game)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center space-x-2">
                <div className="text-2xl">{game.emoji}</div>
                <CardTitle className="text-lg">{game.name}</CardTitle>
              </div>
              <Badge 
                variant="outline" 
                className={getDifficultyColor(game.difficulty as Difficulty)}
              >
                {game.difficulty}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{game.description}</p>
              <div className="mt-3 flex items-center text-sm text-muted-foreground">
                <div className="flex items-center mr-4">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  <span>XP: {game.xpReward}</span>
                </div>
                {game.timeLimit && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{game.timeLimit}s</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Game categories data
  const gameCategories: GameCategory[] = [
    {
      id: 'vocabulary',
      name: 'Vocabulary',
      description: 'Enhance your word power and language skills',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'bg-blue-500',
      totalLevels: 25,
      completedLevels: 8,
      games: [
        {
          id: 'word-match',
          name: 'Word Match',
          description: 'Match words with their meanings',
          difficulty: 'beginner',
          timeLimit: 60,
          multiplayer: false,
          collaborative: false,
          xpReward: 50,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <SpellCheck className="h-5 w-5" />,
          features: ['Timed challenge', 'Multiple difficulty levels', 'Educational'],
          emoji: '📝',
          category: 'vocabulary',
          playable: true
        },
        {
          id: 'synonym-showdown',
          name: 'Synonym Showdown',
          description: 'Find synonyms and expand your vocabulary',
          difficulty: 'intermediate',
          timeLimit: 90,
          multiplayer: true,
          collaborative: false,
          xpReward: 150,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <BookOpen className="h-5 w-5" />,
          features: ['Multiplayer', 'Timed challenge', 'Vocabulary building'],
          emoji: '📚',
          category: 'vocabulary',
          playable: true
        },
        {
          id: 'antonym-adventure',
          name: 'Antonym Adventure',
          description: 'Master opposite words through exciting challenges',
          difficulty: 'intermediate',
          timeLimit: 75,
          multiplayer: false,
          collaborative: false,
          xpReward: 120,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <BookOpen className="h-5 w-5" />,
          features: ['Progressive difficulty', 'Visual learning', 'Achievement system'],
          emoji: '↔️',
          category: 'vocabulary',
          playable: false
        },
        {
          id: 'word-builder',
          name: 'Word Builder',
          description: 'Create words from letter combinations',
          difficulty: 'beginner',
          timeLimit: 120,
          multiplayer: false,
          collaborative: false,
          xpReward: 80,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <SpellCheck className="h-5 w-5" />,
          features: ['Creative thinking', 'Letter manipulation', 'Scoring system'],
          emoji: '🏭',
          category: 'vocabulary',
          playable: false
        },
        {
          id: 'etymology-explorer',
          name: 'Etymology Explorer',
          description: 'Discover the origins and history of words',
          difficulty: 'advanced',
          timeLimit: 100,
          multiplayer: false,
          collaborative: false,
          xpReward: 200,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <BookOpen className="h-5 w-5" />,
          features: ['Historical context', 'Language families', 'Cultural insights'],
          emoji: '🔍',
          category: 'vocabulary',
          playable: false
        },
        {
          id: 'rhyme-time',
          name: 'Rhyme Time',
          description: 'Find words that rhyme and enhance phonetic awareness',
          difficulty: 'beginner',
          timeLimit: 90,
          multiplayer: false,
          collaborative: false,
          xpReward: 90,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <BookOpen className="h-5 w-5" />,
          features: ['Phonetic learning', 'Sound recognition', 'Poetry foundation'],
          emoji: '🎵',
          category: 'vocabulary',
          playable: true
        }
      ]
    },
    {
      id: 'math',
      name: 'Mathematics',
      description: 'Sharpen your math skills with fun challenges',
      icon: <Calculator className="h-6 w-6" />,
      color: 'bg-green-500',
      totalLevels: 35,
      completedLevels: 15,
      games: [
        {
          id: 'math-challenge',
          name: 'Math Challenge',
          description: 'Solve arithmetic problems with increasing difficulty',
          difficulty: 'beginner',
          timeLimit: 60,
          multiplayer: false,
          collaborative: false,
          xpReward: 100,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Calculator className="h-5 w-5" />,
          features: ['Progressive difficulty', 'Timed challenge', 'Multiple operations'],
          emoji: '➕',
          category: 'mathematics',
          playable: true
        },
        {
          id: 'geometry-quest',
          name: 'Geometry Quest',
          description: 'Explore shapes, angles, and spatial relationships',
          difficulty: 'intermediate',
          timeLimit: 90,
          multiplayer: false,
          collaborative: false,
          xpReward: 150,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Calculator className="h-5 w-5" />,
          features: ['Visual learning', 'Shape recognition', '3D visualization'],
          emoji: '🔺',
          category: 'mathematics',
          playable: false
        },
        {
          id: 'fraction-frenzy',
          name: 'Fraction Frenzy',
          description: 'Master fractions through interactive gameplay',
          difficulty: 'intermediate',
          timeLimit: 80,
          multiplayer: true,
          collaborative: false,
          xpReward: 130,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Calculator className="h-5 w-5" />,
          features: ['Fraction operations', 'Visual representations', 'Competitive mode'],
          emoji: '½',
          category: 'mathematics',
          playable: false
        },
        {
          id: 'algebra-adventure',
          name: 'Algebra Adventure',
          description: 'Solve equations and unlock mathematical mysteries',
          difficulty: 'advanced',
          timeLimit: 120,
          multiplayer: false,
          collaborative: false,
          xpReward: 180,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Calculator className="h-5 w-5" />,
          features: ['Equation solving', 'Variable manipulation', 'Story-based learning'],
          emoji: '🔢',
          category: 'mathematics',
          playable: false
        },
        {
          id: 'statistics-showdown',
          name: 'Statistics Showdown',
          description: 'Analyze data and master statistical concepts',
          difficulty: 'advanced',
          timeLimit: 100,
          multiplayer: true,
          collaborative: true,
          xpReward: 200,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <BarChart3 className="h-5 w-5" />,
          features: ['Data analysis', 'Chart interpretation', 'Team collaboration'],
          emoji: '📊',
          category: 'mathematics',
          playable: false
        },
        {
          id: 'quick-math',
          name: 'Quick Math',
          description: 'Fast-paced arithmetic challenges with adaptive difficulty',
          difficulty: 'beginner',
          timeLimit: 45,
          multiplayer: false,
          collaborative: false,
          xpReward: 120,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Calculator className="h-5 w-5" />,
          features: ['Adaptive difficulty', 'Speed challenge', 'Progressive levels'],
          emoji: '⚡',
          category: 'mathematics',
          playable: true
        },
        {
          id: 'fraction-master',
          name: 'Fraction Master',
          description: 'Master fraction operations with step-by-step learning',
          difficulty: 'intermediate',
          timeLimit: 180,
          multiplayer: false,
          collaborative: false,
          xpReward: 160,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Calculator className="h-5 w-5" />,
          features: ['Fraction operations', 'Adaptive difficulty', 'Step-by-step solving'],
          emoji: '½',
          category: 'mathematics',
          playable: true
        }
      ]
    },
    {
      id: 'science',
      name: 'Science',
      description: 'Discover the wonders of science through experiments',
      icon: <Activity className="h-6 w-6" />,
      color: 'bg-purple-500',
      totalLevels: 25,
      completedLevels: 9,
      games: [
        {
          id: 'chemistry-lab',
          name: 'Virtual Chemistry Lab',
          description: 'Conduct safe virtual chemistry experiments',
          difficulty: 'intermediate',
          timeLimit: 120,
          multiplayer: false,
          collaborative: true,
          xpReward: 160,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Activity className="h-5 w-5" />,
          features: ['Virtual experiments', 'Safety protocols', 'Chemical reactions'],
          emoji: '⚗️',
          category: 'science',
          playable: false
        },
        {
          id: 'physics-playground',
          name: 'Physics Playground',
          description: 'Explore forces, motion, and energy in interactive simulations',
          difficulty: 'intermediate',
          timeLimit: 100,
          multiplayer: false,
          collaborative: false,
          xpReward: 140,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Activity className="h-5 w-5" />,
          features: ['Physics simulations', 'Force calculations', 'Motion analysis'],
          emoji: '⚛️',
          category: 'science',
          playable: false
        },
        {
          id: 'biology-explorer',
          name: 'Biology Explorer',
          description: 'Journey through cells, organs, and ecosystems',
          difficulty: 'beginner',
          timeLimit: 90,
          multiplayer: false,
          collaborative: false,
          xpReward: 110,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Activity className="h-5 w-5" />,
          features: ['Cell exploration', 'Ecosystem simulation', 'Life cycles'],
          emoji: '🧬',
          category: 'science',
          playable: false
        },
        {
          id: 'space-mission',
          name: 'Space Mission',
          description: 'Navigate through space and learn about celestial bodies',
          difficulty: 'intermediate',
          timeLimit: 110,
          multiplayer: true,
          collaborative: true,
          xpReward: 170,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Activity className="h-5 w-5" />,
          features: ['Space navigation', 'Planetary science', 'Team missions'],
          emoji: '🚀',
          category: 'science',
          playable: false
        },
        {
          id: 'color-match',
          name: 'Color Challenge',
          description: 'Test your attention and reaction time with color matching',
          difficulty: 'intermediate',
          timeLimit: 60,
          multiplayer: false,
          collaborative: false,
          xpReward: 110,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Activity className="h-5 w-5" />,
          features: ['Attention training', 'Reaction time', 'Cognitive challenge'],
          emoji: '🎨',
          category: 'science',
          playable: true
        },
        {
          id: 'element-match',
          name: 'Element Lab',
          description: 'Learn periodic table elements through interactive challenges',
          difficulty: 'intermediate',
          timeLimit: 120,
          multiplayer: false,
          collaborative: false,
          xpReward: 140,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Activity className="h-5 w-5" />,
          features: ['Periodic table', 'Element properties', 'Chemical knowledge'],
          emoji: '⚗️',
          category: 'science',
          playable: true
        }
      ]
    },
    {
      id: 'history',
      name: 'History',
      description: 'Travel through time and experience historical events',
      icon: <Calendar className="h-6 w-6" />,
      color: 'bg-amber-500',
      totalLevels: 18,
      completedLevels: 4,
      games: [
        {
          id: 'time-travel-quest',
          name: 'Time Travel Quest',
          description: 'Visit different historical periods and solve challenges',
          difficulty: 'intermediate',
          timeLimit: 150,
          multiplayer: false,
          collaborative: false,
          xpReward: 180,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Calendar className="h-5 w-5" />,
          features: ['Historical immersion', 'Timeline navigation', 'Cultural learning'],
          emoji: '⏰',
          category: 'history',
          playable: false
        },
        {
          id: 'civilization-builder',
          name: 'Civilization Builder',
          description: 'Build and manage ancient civilizations',
          difficulty: 'advanced',
          timeLimit: 200,
          multiplayer: true,
          collaborative: true,
          xpReward: 250,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Calendar className="h-5 w-5" />,
          features: ['Strategy gameplay', 'Resource management', 'Historical accuracy'],
          emoji: '🏛️',
          category: 'history',
          playable: false
        },
        {
          id: 'war-strategies',
          name: 'Historical War Strategies',
          description: 'Learn about famous battles and military tactics',
          difficulty: 'advanced',
          timeLimit: 120,
          multiplayer: true,
          collaborative: false,
          xpReward: 190,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Calendar className="h-5 w-5" />,
          features: ['Tactical thinking', 'Historical battles', 'Strategic planning'],
          emoji: '⚔️',
          category: 'history',
          playable: false
        }
      ]
    },
    {
      id: 'geography',
      name: 'Geography',
      description: 'Explore the world and master geographical knowledge',
      icon: <Globe className="h-6 w-6" />,
      color: 'bg-emerald-500',
      totalLevels: 20,
      completedLevels: 8,
      games: [
        {
          id: 'world-explorer',
          name: 'World Explorer',
          description: 'Navigate continents and learn about countries',
          difficulty: 'beginner',
          timeLimit: 80,
          multiplayer: false,
          collaborative: false,
          xpReward: 90,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Globe className="h-5 w-5" />,
          features: ['Interactive maps', 'Country facts', 'Capital cities'],
          emoji: '🌍',
          category: 'geography',
          playable: false
        },
        {
          id: 'climate-challenge',
          name: 'Climate Challenge',
          description: 'Understand weather patterns and climate zones',
          difficulty: 'intermediate',
          timeLimit: 100,
          multiplayer: false,
          collaborative: false,
          xpReward: 130,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Cloud className="h-5 w-5" />,
          features: ['Weather simulation', 'Climate analysis', 'Environmental science'],
          emoji: '⛅',
          category: 'geography',
          playable: false
        },
        {
          id: 'landmark-hunt',
          name: 'Landmark Hunt',
          description: 'Find and learn about famous world landmarks',
          difficulty: 'beginner',
          timeLimit: 70,
          multiplayer: true,
          collaborative: false,
          xpReward: 100,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <MapPin className="h-5 w-5" />,
          features: ['Photo recognition', 'Cultural knowledge', 'Competitive mode'],
          emoji: '🗼',
          category: 'geography',
          playable: false
        },
        {
          id: 'country-capital',
          name: 'Country Capital Quiz',
          description: 'Test your knowledge of world capitals and geography',
          difficulty: 'intermediate',
          timeLimit: 120,
          multiplayer: false,
          collaborative: false,
          xpReward: 140,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Globe className="h-5 w-5" />,
          features: ['World knowledge', 'Educational facts', 'Regional learning'],
          emoji: '🌏',
          category: 'geography',
          playable: true
        }
      ]
    },
    {
      id: 'logic',
      name: 'Logic & Puzzles',
      description: 'Challenge your mind with brain teasers and puzzles',
      icon: <Brain className="h-6 w-6" />,
      color: 'bg-pink-500',
      totalLevels: 28,
      completedLevels: 12,
      games: [
        {
          id: 'pattern-master',
          name: 'Pattern Master',
          description: 'Identify and complete complex patterns',
          difficulty: 'intermediate',
          timeLimit: 90,
          multiplayer: false,
          collaborative: false,
          xpReward: 120,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Brain className="h-5 w-5" />,
          features: ['Pattern recognition', 'Logical thinking', 'Progressive difficulty'],
          emoji: '🧩',
          category: 'logic',
          playable: false
        },
        {
          id: 'sudoku-solver',
          name: 'Sudoku Solver',
          description: 'Master the classic number puzzle game',
          difficulty: 'intermediate',
          timeLimit: 300,
          multiplayer: false,
          collaborative: false,
          xpReward: 150,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Grid3X3 className="h-5 w-5" />,
          features: ['Number logic', 'Multiple difficulty levels', 'Hint system'],
          emoji: '🔢',
          category: 'logic',
          playable: false
        },
        {
          id: 'chess-tactics',
          name: 'Chess Tactics',
          description: 'Learn chess strategies and tactical patterns',
          difficulty: 'advanced',
          timeLimit: 180,
          multiplayer: true,
          collaborative: false,
          xpReward: 200,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Crown className="h-5 w-5" />,
          features: ['Strategic thinking', 'Tactical patterns', 'Multiplayer matches'],
          emoji: '♟️',
          category: 'logic',
          playable: false
        }
      ]
    },
    {
      id: 'history',
      name: 'History',
      description: 'Travel through time and experience historical events',
      icon: <Calendar className="h-6 w-6" />,
      color: 'bg-amber-500',
      totalLevels: 20,
      completedLevels: 6,
      games: [
        {
          id: 'history-timeline',
          name: 'History Timeline',
          description: 'Arrange historical events in chronological order',
          difficulty: 'intermediate',
          timeLimit: 150,
          multiplayer: false,
          collaborative: false,
          xpReward: 150,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Calendar className="h-5 w-5" />,
          features: ['Historical chronology', 'Event sequencing', 'World history'],
          emoji: '📅',
          category: 'history',
          playable: true
        },
        {
          id: 'time-travel-quest',
          name: 'Time Travel Quest',
          description: 'Visit different historical periods and solve challenges',
          difficulty: 'intermediate',
          timeLimit: 150,
          multiplayer: false,
          collaborative: false,
          xpReward: 180,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Calendar className="h-5 w-5" />,
          features: ['Historical immersion', 'Timeline navigation', 'Cultural learning'],
          emoji: '⏰',
          category: 'history',
          playable: false
        },
        {
          id: 'civilization-builder',
          name: 'Civilization Builder',
          description: 'Build and manage ancient civilizations',
          difficulty: 'advanced',
          timeLimit: 200,
          multiplayer: true,
          collaborative: true,
          xpReward: 250,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Calendar className="h-5 w-5" />,
          features: ['Strategy gameplay', 'Resource management', 'Historical accuracy'],
          emoji: '🏛️',
          category: 'history',
          playable: false
        },
        {
          id: 'war-strategies',
          name: 'Historical War Strategies',
          description: 'Learn about famous battles and military tactics',
          difficulty: 'advanced',
          timeLimit: 120,
          multiplayer: true,
          collaborative: false,
          xpReward: 190,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Calendar className="h-5 w-5" />,
          features: ['Tactical thinking', 'Historical battles', 'Strategic planning'],
          emoji: '⚔️',
          category: 'history',
          playable: false
        },
        {
          id: 'memory-palace',
          name: 'Memory Palace',
          description: 'Train your memory with various techniques',
          difficulty: 'beginner',
          timeLimit: 60,
          multiplayer: false,
          collaborative: false,
          xpReward: 80,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Brain className="h-5 w-5" />,
          features: ['Memory training', 'Visualization techniques', 'Progressive challenges'],
          emoji: '🧠',
          category: 'logic',
          playable: false
        },
        {
          id: 'quick-memory',
          name: 'Quick Memory',
          description: 'Test and improve your short-term memory with number sequences',
          difficulty: 'beginner',
          timeLimit: 180,
          multiplayer: false,
          collaborative: false,
          xpReward: 130,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Brain className="h-5 w-5" />,
          features: ['Memory enhancement', 'Sequential learning', 'Cognitive training'],
          emoji: '💡',
          category: 'logic',
          playable: true
        },
        {
          id: 'logic-puzzle',
          name: 'Logic Patterns',
          description: 'Solve complex patterns and sequences using logical thinking',
          difficulty: 'intermediate',
          timeLimit: 120,
          multiplayer: false,
          collaborative: false,
          xpReward: 140,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Brain className="h-5 w-5" />,
          features: ['Pattern recognition', 'Logical reasoning', 'Adaptive difficulty'],
          emoji: '🧩',
          category: 'logic',
          playable: true
        }
      ]
    },
    {
      id: 'language',
      name: 'Language Learning',
      description: 'Master new languages through interactive games',
      icon: <Languages className="h-6 w-6" />,
      color: 'bg-rose-500',
      totalLevels: 28,
      completedLevels: 9,
      games: [
        {
          id: 'spanish-fiesta',
          name: 'Spanish Fiesta',
          description: 'Learn Spanish through cultural immersion',
          difficulty: 'beginner',
          timeLimit: 90,
          multiplayer: false,
          collaborative: false,
          xpReward: 110,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Languages className="h-5 w-5" />,
          features: ['Cultural context', 'Pronunciation guide', 'Interactive dialogues'],
          emoji: '🇪🇸',
          category: 'language',
          playable: false
        },
        {
          id: 'french-cafe',
          name: 'French Café',
          description: 'Experience French language in everyday situations',
          difficulty: 'beginner',
          timeLimit: 85,
          multiplayer: false,
          collaborative: false,
          xpReward: 105,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Languages className="h-5 w-5" />,
          features: ['Conversational French', 'Cultural scenarios', 'Audio pronunciation'],
          emoji: '🇫🇷',
          category: 'language',
          playable: false
        },
        {
          id: 'mandarin-adventure',
          name: 'Mandarin Adventure',
          description: 'Explore Chinese characters and tones',
          difficulty: 'intermediate',
          timeLimit: 120,
          multiplayer: false,
          collaborative: false,
          xpReward: 160,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Languages className="h-5 w-5" />,
          features: ['Character writing', 'Tone practice', 'Cultural insights'],
          emoji: '🇨🇳',
          category: 'language',
          playable: false
        },
        {
          id: 'polyglot-challenge',
          name: 'Polyglot Challenge',
          description: 'Test your knowledge across multiple languages',
          difficulty: 'expert',
          timeLimit: 150,
          multiplayer: true,
          collaborative: false,
          xpReward: 250,
          unlocked: true,
          completed: false,
          bestScore: 0,
          icon: <Languages className="h-5 w-5" />,
          features: ['Multi-language', 'Translation challenges', 'Cultural trivia'],
          emoji: '🌍',
          category: 'language',
          playable: false
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto p-4">
      {selectedGame ? (
        // Game view
        <div className="game-container">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Games
            </Button>
            {activeGameSession?.isActive && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Time: {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>Score: {gameScore}</span>
                </div>
              </div>
            )}
          </div>
          {renderGame()}
        </div>
      ) : (
        // Game library view
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Game Library</h1>
              <p className="text-muted-foreground">
                Select a game to start playing and learning!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search games..."
                  className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Tabs 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <TabsList className="w-full justify-start overflow-x-auto">
              {gameCategories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center gap-2"
                >
                  {category.icon}
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {gameCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-4">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold">{category.name}</h2>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>
                  {renderGameGrid()}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default ComprehensiveGameHub;
