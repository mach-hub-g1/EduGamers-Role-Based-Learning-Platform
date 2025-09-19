"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Game } from "./comprehensive-game-hub"

// Extend the Game interface to include the emoji property
interface GameWithEmoji extends Game {
  emoji: string
}

interface GameSwiperProps {
  games: GameWithEmoji[]
  onGameSelect: (game: GameWithEmoji) => void
  playerName?: string
  playerAvatar?: string
}

export function GameSwiper({ 
  games, 
  onGameSelect, 
  playerName = 'Player',
  playerAvatar = ''
}: GameSwiperProps) {
  // Ensure all games have an emoji property
  const gamesWithEmoji = games.map(game => ({
    ...game,
    emoji: game.emoji || '🎮' // Default emoji if not provided
  }))
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const nextGame = () => {
    handleInteraction()
    setCurrentIndex((prev) => (prev === games.length - 1 ? 0 : prev + 1))
  }

  const prevGame = () => {
    handleInteraction()
    setCurrentIndex((prev) => (prev === 0 ? games.length - 1 : prev - 1))
  }
  
  const goToGame = (index: number) => {
    handleInteraction()
    setCurrentIndex(index)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextGame()
    }

    if (touchStart - touchEnd < -50) {
      prevGame()
    }
  }

  // Auto-advance to next game every 5 seconds when isPlaying is true
  useEffect(() => {
    if (!isPlaying) return
    
    const timer = setInterval(() => {
      nextGame()
    }, 5000)
    
    return () => clearInterval(timer)
  }, [currentIndex, isPlaying])
  
  // Pause auto-play when user interacts
  const handleInteraction = () => {
    setIsPlaying(false)
    // Optional: Resume auto-play after 30 seconds of inactivity
    setTimeout(() => setIsPlaying(true), 30000)
  }

  if (games.length === 0) {
    return <div className="text-center py-8">No games available</div>
  }

  const currentGame = gamesWithEmoji[currentIndex]

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Player Profile Header */}
      <div className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 border-2 border-primary">
            <AvatarImage src={playerAvatar} alt={playerName} />
            <AvatarFallback className="bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Welcome back,</p>
            <p className="font-semibold">{playerName}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={prevGame} 
            aria-label="Previous game"
            className="rounded-full h-9 w-9"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex space-x-1.5">
            {games.map((_, index) => (
              <button
                key={index}
                onClick={() => goToGame(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-primary w-6 scale-110' 
                    : 'bg-muted hover:bg-primary/50'
                }`}
                aria-label={`Go to game ${index + 1}`}
              />
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={nextGame} 
            aria-label="Next game"
            className="rounded-full h-9 w-9"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative overflow-hidden rounded-xl shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Card className="transition-all duration-300 hover:shadow-xl border-0">
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
              <div className="text-7xl transform hover:scale-110 transition-transform duration-300">
                {currentGame.emoji}
              </div>
            </div>
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-background/90 backdrop-blur-sm shadow-sm">
                {currentIndex + 1} / {games.length}
              </span>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{currentGame.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{currentGame.description}</p>
                </div>
                <Button 
                  onClick={() => onGameSelect(currentGame)}
                  className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  Play Now
                </Button>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  currentGame.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  currentGame.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                  currentGame.difficulty === 'advanced' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {currentGame.difficulty.charAt(0).toUpperCase() + currentGame.difficulty.slice(1)}
                </span>
                
                {currentGame.timeLimit && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    ⏱️ {currentGame.timeLimit} min
                  </span>
                )}
                
                {currentGame.multiplayer && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                    👥 Multiplayer
                  </span>
                )}
                
                {currentGame.collaborative && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-50 text-purple-700">
                    🤝 Collaborative
                  </span>
                )}
              </div>
              
              {currentGame.features && currentGame.features.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">FEATURES</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentGame.features.map((feature, index) => (
                      <span key={index} className="px-2.5 py-1 text-xs rounded-full bg-gray-50 text-gray-700">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
