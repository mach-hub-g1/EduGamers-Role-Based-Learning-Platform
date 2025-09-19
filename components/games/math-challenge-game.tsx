"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RotateCw, ArrowLeft, Check, X, Target } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { GoalTracker, type GoalTrackerRef } from "@/components/goals/goal-tracker-fixed"

type Operator = '+' | '-' | '×' | '÷'

interface MathOption {
  id: string
  value: number
  isCorrect: boolean
  position: number
}

interface MathProblem {
  num1: number
  num2: number
  operator: Operator
  answer: number
  options: MathOption[]
}

const generateProblem = (difficulty: number): MathProblem => {
  let maxNum = 10
  let operators: Operator[] = ['+', '-']
  
  if (difficulty > 1) {
    operators = ['+', '-', '×']
    maxNum = 15
  }
  
  if (difficulty > 2) {
    operators = ['+', '-', '×', '÷']
    maxNum = 20
  }
  
  const operator = operators[Math.floor(Math.random() * operators.length)]
  let num1 = Math.floor(Math.random() * maxNum) + 1
  let num2 = Math.floor(Math.random() * maxNum) + 1
  let answer: number = 0;
  
  switch (operator) {
    case '+':
      answer = num1 + num2;
      break;
    case '-':
      if (num2 > num1) [num1, num2] = [num2, num1];
      answer = num1 - num2;
      break;
    case '×':
      answer = num1 * num2;
      break;
    case '÷':
      num1 = num1 * num2;
      answer = num1 / num2;
      break;
    default:
      answer = num1 + num2;
      break;
  }
  
  const wrongAnswers = new Set<number>();
  const offsets = [-4, -3, -2, -1, 1, 2, 3, 4];
  
  for (const offset of offsets) {
    const wrongAnswer = answer + offset;
    if (wrongAnswer > 0 && wrongAnswer !== answer) {
      wrongAnswers.add(wrongAnswer);
      if (wrongAnswers.size >= 3) break;
    }
  }
  
  let attempts = 0;
  const maxAttempts = 100;
  while (wrongAnswers.size < 3 && attempts < maxAttempts) {
    attempts++;
    const wrongAnswer = answer + (Math.floor(Math.random() * 10) - 5);
    if (wrongAnswer > 0 && wrongAnswer !== answer) {
      wrongAnswers.add(wrongAnswer);
    }
  }
  
  if (wrongAnswers.size < 3) {
    [1, 2, 3].forEach(n => {
      if (n !== answer) wrongAnswers.add(n);
    });
  }
  
  const wrongAnswersArray = Array.from(wrongAnswers);
  
  const options: MathOption[] = [
    { id: 'a', value: answer, isCorrect: true, position: 0 },
    { id: 'b', value: wrongAnswersArray[0], isCorrect: false, position: 1 },
    { id: 'c', value: wrongAnswersArray[1], isCorrect: false, position: 2 },
    { id: 'd', value: wrongAnswersArray[2], isCorrect: false, position: 3 }
  ];
  
  options.sort((a, b) => a.position - b.position);
  
  return { num1, num2, operator, answer, options }
}

interface MathChallengeGameProps {
  onComplete: (score: number) => void;
  onBack?: () => void;
}

const DEFAULT_PROBLEM: MathProblem = {
  num1: 2,
  num2: 2,
  operator: '+',
  answer: 4,
  options: [
    { id: 'a', value: 4, isCorrect: true, position: 0 },
    { id: 'b', value: 3, isCorrect: false, position: 1 },
    { id: 'c', value: 5, isCorrect: false, position: 2 },
    { id: 'd', value: 6, isCorrect: false, position: 3 }
  ]
};

export function MathChallengeGame({ onComplete, onBack }: MathChallengeGameProps) {
  const [problem, setProblem] = useState<MathProblem>(DEFAULT_PROBLEM)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isGameOver, setIsGameOver] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [difficulty] = useState(1)
  const [problemCount, setProblemCount] = useState(0)
  const [showGoalTracker, setShowGoalTracker] = useState(false)
  
  interface ActiveGoal {
    title: string;
    progress: number;
    current: number;
    target: number;
    unit?: string;
  }
  
  const [activeGoal, setActiveGoal] = useState<ActiveGoal | null>(null)
  const totalProblems = 10
  const goalTrackerRef = useRef<GoalTrackerRef>(null)
  const router = useRouter()

  useEffect(() => {
    const initializeGame = async () => {
      try {
        const newProblem = generateProblem(1);
        setProblem(newProblem);
      } catch (error) {
        console.error('Error generating initial problem:', error);
        setProblem(DEFAULT_PROBLEM);
      }
    };
    
    initializeGame();
  }, []);
  
  const nextProblem = useCallback(() => {
    try {
      const newProblem = generateProblem(1);
      setProblem(newProblem);
      setSelectedAnswer(null);
      setShowResult(false);
      setProblemCount(prev => prev + 1);
    } catch (error) {
      console.error('Error generating problem:', error);
      setProblem(DEFAULT_PROBLEM);
    }
  }, []);
  
  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setIsGameOver(true)
      onComplete(score)
    }
  }, [timeLeft, isGameOver, onComplete, score])
  
  useEffect(() => {
    if (problemCount >= totalProblems) {
      setIsGameOver(true)
      onComplete(score)
    }
  }, [problemCount, onComplete, score, totalProblems])

  // Update active goal info when goals change
  useEffect(() => {
    const updateActiveGoal = () => {
      if (goalTrackerRef.current) {
        const goal = goalTrackerRef.current.getActiveGoal()
        if (goal) {
          setActiveGoal({
            title: goal.title,
            progress: Math.round((goal.current / goal.target) * 100),
            current: goal.current,
            target: goal.target,
            unit: goal.unit
          })
        } else {
          setActiveGoal(null)
        }
      }
    }
    
    updateActiveGoal()
    // Check for updates every 5 seconds
    const timer = setInterval(updateActiveGoal, 5000)
    return () => clearInterval(timer)
  }, [])

  const handleAnswer = useCallback((option: MathOption) => {
    if (showResult) return;
    
    setSelectedAnswer(option.id);
    const isCorrect = option.value === problem.answer;
    
    if (isCorrect) {
      // Update progress in the goal tracker
      if (goalTrackerRef.current?.updateProgress) {
        const updated = goalTrackerRef.current.updateProgress(1);
        if (updated) {
          // Force UI update by getting the latest goal state
          const goal = goalTrackerRef.current.getActiveGoal();
          if (goal) {
            setActiveGoal({
              title: goal.title,
              progress: Math.round((goal.current / goal.target) * 100),
              current: goal.current,
              target: goal.target,
              unit: goal.unit
            });
          }
        }
      }
      
      // Update score
      setScore(prevScore => prevScore + (10 * difficulty));
    }
    
    setShowResult(true);
    
    const timer = setTimeout(() => {
      if (timeLeft > 10) {
        nextProblem();
      } else {
        const finalScore = score + (isCorrect ? 10 * difficulty : 0);
        setIsGameOver(true);
        onComplete(finalScore);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [problem.answer, showResult, timeLeft, nextProblem, onComplete, score, difficulty]);

  const restartGame = useCallback(() => {
    setScore(0);
    setTimeLeft(60);
    setSelectedAnswer(null);
    setShowResult(false);
    setProblemCount(0);
    setIsGameOver(false);
    try {
      const newProblem = generateProblem(1);
      setProblem(newProblem);
    } catch (error) {
      console.error('Error generating problem:', error);
      setProblem(DEFAULT_PROBLEM);
    }
  }, []);

  if (isGameOver) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Game Over!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-2xl font-bold">Your Score: {score}</div>
          <div className="flex justify-center gap-2">
            <Button onClick={restartGame} className="gap-2">
              <RotateCw className="h-4 w-4" />
              Play Again
            </Button>
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Menu
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowGoalTracker(!showGoalTracker)}
              className="gap-2 relative"
            >
              <Target className="h-4 w-4" />
              {showGoalTracker ? 'Hide Goals' : 'My Goals'}
              {activeGoal && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeGoal.progress}%
                </span>
              )}
            </Button>
            {activeGoal && !showGoalTracker && (
              <div className="text-sm text-muted-foreground hidden sm:flex items-center gap-1">
                <span className="truncate max-w-[120px]">{activeGoal.title}:</span>
                <span className="font-medium">{activeGoal.current}/{activeGoal.target} {activeGoal.unit}</span>
                <span className="text-muted-foreground/70">({activeGoal.progress}%)</span>
              </div>
            )}
          </div>
          <div className="font-medium">Score: {score}</div>
          <div className="text-sm text-muted-foreground">
            Time: <span className="font-medium">{timeLeft}s</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Problem: {problemCount + 1}/{totalProblems}
        </div>
      </div>
      
      {showGoalTracker && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <GoalTracker 
              ref={goalTrackerRef}
              onGoalUpdate={(goal) => {
                if (goal) {
                  setActiveGoal({
                    title: goal.title,
                    progress: Math.round((goal.current / goal.target) * 100),
                    current: goal.current,
                    target: goal.target,
                    unit: goal.unit
                  });
                } else {
                  setActiveGoal(null);
                }
              }}
            />
          </CardContent>
        </Card>
      )}
      
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
          <CardTitle>Math Challenge</CardTitle>
          <div className="flex items-center gap-2">
            <div className="font-medium">Score: {score}</div>
            <div className="h-8 w-px bg-border mx-2"></div>
            <div className="text-sm text-muted-foreground">
              Time: <span className="font-medium">{timeLeft}s</span>
            </div>
          </div>
        </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold">
              {problem.num1} {problem.operator} {problem.num2} = ?
            </div>
            <div className="text-sm text-muted-foreground">
              Select the correct answer
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            {problem.options.map((option) => (
              <Button
                key={option.id}
                variant={selectedAnswer === option.id 
                  ? option.isCorrect ? 'default' : 'destructive'
                  : 'outline'}
                size="lg"
                className="h-16 text-lg relative"
                onClick={() => handleAnswer(option)}
                disabled={showResult && !option.isCorrect}
              >
                {option.value}
                {showResult && option.isCorrect && (
                  <Check className="h-5 w-5 ml-2 text-green-500" />
                )}
                {showResult && selectedAnswer === option.id && !option.isCorrect && (
                  <X className="h-5 w-5 ml-2 text-red-500" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
