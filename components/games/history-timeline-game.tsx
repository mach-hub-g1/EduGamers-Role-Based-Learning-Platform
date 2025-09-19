"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RotateCw, ArrowLeft, Crown, Sword } from "lucide-react"

interface HistoryTimelineGameProps {
  onComplete: (score: number) => void;
  onBack?: () => void;
}

const HISTORICAL_EVENTS = [
  { event: 'American Declaration of Independence', year: 1776, century: '18th', region: 'North America' },
  { event: 'French Revolution begins', year: 1789, century: '18th', region: 'Europe' },
  { event: 'Napoleon becomes Emperor', year: 1804, century: '19th', region: 'Europe' },
  { event: 'American Civil War begins', year: 1861, century: '19th', region: 'North America' },
  { event: 'Unification of Germany', year: 1871, century: '19th', region: 'Europe' },
  { event: 'World War I begins', year: 1914, century: '20th', region: 'Global' },
  { event: 'Russian Revolution', year: 1917, century: '20th', region: 'Europe' },
  { event: 'World War II begins', year: 1939, century: '20th', region: 'Global' },
  { event: 'India gains independence', year: 1947, century: '20th', region: 'Asia' },
  { event: 'Berlin Wall falls', year: 1989, century: '20th', region: 'Europe' },
  { event: 'Columbus reaches Americas', year: 1492, century: '15th', region: 'Global' },
  { event: 'Printing press invented', year: 1440, century: '15th', region: 'Europe' },
  { event: 'Renaissance begins in Italy', year: 1350, century: '14th', region: 'Europe' },
  { event: 'Black Death peaks in Europe', year: 1348, century: '14th', region: 'Europe' },
  { event: 'Magna Carta signed', year: 1215, century: '13th', region: 'Europe' },
  { event: 'Crusades begin', year: 1095, century: '11th', region: 'Global' },
  { event: 'Viking raids peak', year: 800, century: '9th', region: 'Europe' },
  { event: 'Fall of Western Roman Empire', year: 476, century: '5th', region: 'Europe' },
]

interface TimelineQuestion {
  events: typeof HISTORICAL_EVENTS
  correctOrder: number[]
  questionType: 'chronological' | 'era-match' | 'before-after'
}

export function HistoryTimelineGame({ onComplete, onBack }: HistoryTimelineGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<TimelineQuestion | null>(null)
  const [userOrder, setUserOrder] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(150)
  const [isGameOver, setIsGameOver] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [perfectTimelines, setPerfectTimelines] = useState(0)
  const [regionsExplored, setRegionsExplored] = useState<Set<string>>(new Set())
  const [centuriesSpanned, setCenturiesSpanned] = useState<Set<string>>(new Set())
  const [startTime, setStartTime] = useState<number>(Date.now())

  useEffect(() => {
    generateNewQuestion()
  }, [])

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setIsGameOver(true)
      onComplete(score)
    }
  }, [timeLeft, isGameOver, score, onComplete])

  const generateNewQuestion = () => {
    // Select 4 random events
    const shuffledEvents = [...HISTORICAL_EVENTS].sort(() => Math.random() - 0.5)
    const selectedEvents = shuffledEvents.slice(0, 4)
    
    // Sort by year to get correct order
    const sortedEvents = [...selectedEvents].sort((a, b) => a.year - b.year)
    const correctOrder = sortedEvents.map(event => 
      selectedEvents.findIndex(e => e.event === event.event)
    )
    
    // Shuffle the events for display
    const displayEvents = [...selectedEvents].sort(() => Math.random() - 0.5)
    
    const question: TimelineQuestion = {
      events: displayEvents,
      correctOrder: correctOrder.map(index => 
        displayEvents.findIndex(e => e.event === selectedEvents[index].event)
      ),
      questionType: 'chronological'
    }
    
    setCurrentQuestion(question)
    setUserOrder([])
    setShowResult(false)
  }

  const handleEventClick = (index: number) => {
    if (showResult) return
    
    if (userOrder.includes(index)) {
      // Remove from order
      setUserOrder(userOrder.filter(i => i !== index))
    } else if (userOrder.length < 4) {
      // Add to order
      setUserOrder([...userOrder, index])
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null) return
    
    const newOrder = [...userOrder]
    const draggedPosition = newOrder.indexOf(draggedIndex)
    const dropPosition = newOrder.indexOf(dropIndex)
    
    if (draggedPosition !== -1 && dropPosition !== -1) {
      // Swap positions
      [newOrder[draggedPosition], newOrder[dropPosition]] = [newOrder[dropPosition], newOrder[draggedPosition]]
      setUserOrder(newOrder)
    }
    
    setDraggedIndex(null)
  }

  const checkAnswer = () => {
    if (!currentQuestion || userOrder.length !== 4) return
    
    setShowResult(true)
    
    // Check if the order matches the correct chronological order
    const isCorrect = JSON.stringify(userOrder) === JSON.stringify(currentQuestion.correctOrder)
    
    if (isCorrect) {
      const points = 25
      setScore(score + points)
      setCorrectAnswers(prev => prev + 1)
      setPerfectTimelines(prev => prev + 1)
    }
    
    // Track regions and centuries
    currentQuestion.events.forEach(event => {
      setRegionsExplored(prev => new Set([...prev, event.region]))
      setCenturiesSpanned(prev => new Set([...prev, event.century]))
    })
    
    setQuestionCount(questionCount + 1)
    
    setTimeout(() => {
      if (questionCount >= 8 || timeLeft <= 20) {
        setIsGameOver(true)
        onComplete(isCorrect ? score + 25 : score)
      } else {
        generateNewQuestion()
      }
    }, 3000)
  }

  const restartGame = () => {
    setScore(0)
    setTimeLeft(150)
    setUserOrder([])
    setShowResult(false)
    setQuestionCount(0)
    setIsGameOver(false)
    setCorrectAnswers(0)
    setPerfectTimelines(0)
    setRegionsExplored(new Set())
    setCenturiesSpanned(new Set())
    setStartTime(Date.now())
    generateNewQuestion()
  }

  const getEventPosition = (index: number) => {
    const position = userOrder.indexOf(index)
    return position === -1 ? null : position + 1
  }

  if (isGameOver) {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000)
    const accuracy = questionCount > 0 ? Math.round((correctAnswers / questionCount) * 100) : 0
    const avgTimePerTimeline = questionCount > 0 ? Math.round(timeElapsed / questionCount) : 0
    
    const getHistoryGrade = () => {
      if (accuracy >= 90 && perfectTimelines >= 7) return { grade: 'A+', color: 'text-purple-600', message: 'Master Historian! Exceptional chronological knowledge!' }
      if (accuracy >= 85) return { grade: 'A', color: 'text-green-600', message: 'Excellent historical understanding!' }
      if (accuracy >= 70) return { grade: 'B', color: 'text-blue-500', message: 'Good grasp of historical sequences!' }
      if (accuracy >= 55) return { grade: 'C', color: 'text-yellow-500', message: 'Study more historical timelines!' }
      return { grade: 'D', color: 'text-red-500', message: 'More historical study needed!' }
    }
    
    const performance = getHistoryGrade()
    
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
          <CardTitle className="text-2xl font-bold text-center">Time Master Results!</CardTitle>
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
              <div className="font-bold text-lg text-purple-600">{perfectTimelines}</div>
              <div className="text-xs text-muted-foreground">Perfect Orders</div>
            </div>
            <div>
              <div className="font-bold text-lg text-orange-600">{regionsExplored.size}</div>
              <div className="text-xs text-muted-foreground">Regions</div>
            </div>
            <div>
              <div className="font-bold text-lg text-cyan-600">{centuriesSpanned.size}</div>
              <div className="text-xs text-muted-foreground">Centuries</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm font-medium mb-2">🏰 Historical Journey</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Timelines explored: {questionCount}/8</div>
              <div>• Regions visited: {Array.from(regionsExplored).slice(0, 3).join(', ')}{regionsExplored.size > 3 ? '...' : ''}</div>
              <div>• Time periods: {Array.from(centuriesSpanned).slice(0, 3).join(', ')}{centuriesSpanned.size > 3 ? '...' : ''}</div>
              <div>• Chronological mastery: {accuracy >= 80 ? 'Expert' : accuracy >= 60 ? 'Proficient' : 'Developing'}</div>
              <div>• Study time: {Math.floor(timeElapsed / 60)}m {timeElapsed % 60}s</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              onClick={restartGame}
              className="w-full"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Travel Again
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

  if (!currentQuestion) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            History Timeline
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="font-medium">Score: {score}</div>
            <div className="w-20">
              <Progress value={(timeLeft / 150) * 100} className="h-2" />
              <div className="text-xs text-right">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Arrange these historical events in chronological order (earliest to latest)
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {currentQuestion.events.map((event, index) => {
            const position = getEventPosition(index)
            const isSelected = userOrder.includes(index)
            const isCorrectPosition = showResult && currentQuestion.correctOrder[userOrder.indexOf(index)] === index
            
            return (
              <div
                key={event.event}
                draggable={isSelected && !showResult}
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? showResult 
                      ? isCorrectPosition 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-red-500 bg-red-50'
                      : 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${draggedIndex === index ? 'opacity-50' : ''}`}
                onClick={() => handleEventClick(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{event.event}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.region} • {event.century} century
                    </div>
                    {showResult && (
                      <div className="text-xs font-medium mt-1 text-blue-600">
                        {event.year}
                      </div>
                    )}
                  </div>
                  {position && (
                    <div className="ml-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        showResult 
                          ? isCorrectPosition 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}>
                        {position}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Timeline {questionCount + 1} of 8 • Selected: {userOrder.length}/4
          </div>
          <Button 
            onClick={checkAnswer} 
            disabled={userOrder.length !== 4 || showResult}
          >
            <Sword className="mr-2 h-4 w-4" />
            Check Order
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}