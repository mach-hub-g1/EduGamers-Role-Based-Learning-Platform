"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Zap, 
  Star, 
  Map, 
  BookOpen, 
  Trophy, 
  Play, 
  Lock, 
  CheckCircle,
  Sparkles,
  Timer,
  Target,
  Brain,
  Rocket
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiQuestService, LearningQuest, QuestStep } from '@/lib/ai-quest-service'
import { useLanguage } from '@/lib/language-context'

interface AIQuestInterfaceProps {
  studentId: string
  studentName: string
  currentGrade: number
  onXPGained?: (amount: number) => void
}

export function AIQuestInterface({ 
  studentId, 
  studentName, 
  currentGrade, 
  onXPGained 
}: AIQuestInterfaceProps) {
  const [quests, setQuests] = useState<LearningQuest[]>([])
  const [activeQuest, setActiveQuest] = useState<LearningQuest | null>(null)
  const [currentStep, setCurrentStep] = useState<QuestStep | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingQuest, setGeneratingQuest] = useState(false)
  const [showStepContent, setShowStepContent] = useState(false)
  const { t, currentLanguage } = useLanguage()

  useEffect(() => {
    loadQuests()
  }, [studentId])

  const loadQuests = async () => {
    try {
      const studentQuests = await aiQuestService.getStudentQuests(studentId)
      setQuests(studentQuests)
      
      // Find active quest
      const active = studentQuests.find(q => q.isActive)
      if (active) {
        setActiveQuest(active)
        const currentStepData = active.steps[active.currentStep]
        setCurrentStep(currentStepData)
      }
    } catch (error) {
      console.error('Error loading quests:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateNewQuest = async (subject: string, difficulty: 'easy' | 'medium' | 'hard') => {
    setGeneratingQuest(true)
    try {
      const newQuest = await aiQuestService.generatePersonalizedQuest(
        studentId,
        subject,
        currentGrade,
        difficulty,
        currentLanguage.code,
        studentName
      )
      
      setQuests(prev => [newQuest, ...prev])
      
      // Auto-activate if no active quest
      if (!activeQuest) {
        await startQuest(newQuest)
      }
    } catch (error) {
      console.error('Error generating quest:', error)
    } finally {
      setGeneratingQuest(false)
    }
  }

  const startQuest = async (quest: LearningQuest) => {
    try {
      await aiQuestService.activateQuest(quest.id)
      setActiveQuest(quest)
      setCurrentStep(quest.steps[0])
      setShowStepContent(true)
      
      // Update local state
      setQuests(prev => prev.map(q => 
        q.id === quest.id ? { ...q, isActive: true } : { ...q, isActive: false }
      ))
    } catch (error) {
      console.error('Error starting quest:', error)
    }
  }

  const completeStep = async (success: boolean) => {
    if (!activeQuest || !currentStep) return

    const xpGained = success ? currentStep.xpReward : Math.floor(currentStep.xpReward * 0.3)
    
    try {
      await aiQuestService.updateQuestProgress(
        activeQuest.id,
        currentStep.id,
        success,
        xpGained
      )
      
      onXPGained?.(xpGained)
      
      // Load updated quest data
      await loadQuests()
      
      // Move to next step or complete quest
      const updatedQuest = quests.find(q => q.id === activeQuest.id)
      if (updatedQuest) {
        if (updatedQuest.currentStep < updatedQuest.totalSteps) {
          setCurrentStep(updatedQuest.steps[updatedQuest.currentStep])
        } else {
          // Quest completed
          setActiveQuest(null)
          setCurrentStep(null)
          setShowStepContent(false)
        }
      }
    } catch (error) {
      console.error('Error completing step:', error)
    }
  }

  const QuestCard = ({ quest }: { quest: LearningQuest }) => (
    <Card className={`cursor-pointer transition-all hover:shadow-lg ${
      quest.isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white">
                {quest.theme.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {quest.title}
          </CardTitle>
          <Badge variant={quest.isActive ? 'default' : 'secondary'}>
            {quest.isActive ? t('active') : quest.completedAt ? t('completed') : t('pending')}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{quest.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {quest.subject}
          </span>
          <span className="flex items-center gap-1">
            <Timer className="h-4 w-4" />
            {quest.estimatedDuration}min
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            {quest.xpTotal} XP
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{quest.currentStep}/{quest.totalSteps}</span>
          </div>
          <Progress 
            value={(quest.currentStep / quest.totalSteps) * 100} 
            className="h-2"
          />
        </div>
        
        <div className="flex gap-2">
          {quest.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        {!quest.isActive && !quest.completedAt && (
          <Button 
            onClick={() => startQuest(quest)}
            className="w-full"
            size="sm"
          >
            <Play className="h-4 w-4 mr-1" />
            Start Quest
          </Button>
        )}
      </CardContent>
    </Card>
  )

  const StepInterface = ({ step }: { step: QuestStep }) => (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {step.title}
        </CardTitle>
        <p className="text-muted-foreground">{step.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="prose prose-sm max-w-none">
          <p>{step.content}</p>
        </div>
        
        {step.type === 'story' && step.storyData && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Story</h4>
            <p className="text-sm mb-3">{step.storyData.narrative}</p>
            <blockquote className="border-l-4 border-purple-400 pl-3 italic text-sm">
              {step.storyData.characterDialogue}
            </blockquote>
          </div>
        )}
        
        {step.type === 'problem' && step.problemData && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Challenge</h4>
            <p className="mb-4">{step.problemData.question}</p>
            
            {step.problemData.options && (
              <div className="grid grid-cols-2 gap-2">
                {step.problemData.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left justify-start"
                    onClick={() => {
                      const isCorrect = option === step.problemData?.correctAnswer
                      completeStep(isCorrect)
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
            
            {step.problemData.hints && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium">
                  Need a hint?
                </summary>
                <div className="mt-2 text-sm text-muted-foreground">
                  {step.problemData.hints.map((hint, index) => (
                    <p key={index}>💡 {hint}</p>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
        
        {step.type === 'choice' && step.choiceData && (
          <div className="space-y-3">
            <h4 className="font-semibold">Make Your Choice</h4>
            {step.choiceData.choices.map((choice, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start h-auto p-4"
                onClick={() => completeStep(true)}
              >
                <div>
                  <div className="font-medium">{choice.text}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {choice.consequence}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4" />
            {step.xpReward} XP Reward
          </div>
          
          <Button onClick={() => completeStep(true)}>
            Continue Adventure
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Sparkles className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading your quests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">🚀 AI Learning Quests</h2>
        <p className="text-muted-foreground">
          Embark on personalized story-driven adventures while mastering your subjects!
        </p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Quest</TabsTrigger>
          <TabsTrigger value="available">Available Quests</TabsTrigger>
          <TabsTrigger value="generate">Generate New</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-6">
          {activeQuest && currentStep ? (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <StepInterface step={currentStep} />
              </motion.div>
            </AnimatePresence>
          ) : (
            <Card className="text-center p-8">
              <Rocket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Active Quest</h3>
              <p className="text-muted-foreground mb-4">
                Start a quest from your available quests or generate a new one!
              </p>
              <Button onClick={() => {
                const generateTab = document.querySelector('[value="generate"]') as HTMLButtonElement
                generateTab?.click()
              }}>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Your First Quest
              </Button>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="available">
          <ScrollArea className="h-96">
            <div className="grid gap-4">
              {quests.length > 0 ? (
                quests.map(quest => (
                  <QuestCard key={quest.id} quest={quest} />
                ))
              ) : (
                <Card className="text-center p-8">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Quests Yet</h3>
                  <p className="text-muted-foreground">
                    Generate your first AI-powered learning quest to get started!
                  </p>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Generate New Quest
              </CardTitle>
              <p className="text-muted-foreground">
                Stella AI will create a personalized learning adventure just for you!
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-3">Choose Subject</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['mathematics', 'science', 'english', 'history', 'geography'].map(subject => (
                      <Button
                        key={subject}
                        variant="outline"
                        onClick={() => generateNewQuest(subject, 'medium')}
                        disabled={generatingQuest}
                        className="capitalize"
                      >
                        {subject}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Choose Difficulty</h4>
                  <div className="space-y-2">
                    {[
                      { level: 'easy', label: 'Explorer', color: 'bg-green-500' },
                      { level: 'medium', label: 'Adventurer', color: 'bg-yellow-500' },
                      { level: 'hard', label: 'Champion', color: 'bg-red-500' }
                    ].map(({ level, label, color }) => (
                      <Button
                        key={level}
                        variant="outline"
                        onClick={() => generateNewQuest('mathematics', level as any)}
                        disabled={generatingQuest}
                        className="w-full justify-start"
                      >
                        <div className={`w-3 h-3 rounded-full ${color} mr-2`} />
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              {generatingQuest && (
                <div className="text-center p-6">
                  <Sparkles className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Stella is crafting your personalized quest...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}