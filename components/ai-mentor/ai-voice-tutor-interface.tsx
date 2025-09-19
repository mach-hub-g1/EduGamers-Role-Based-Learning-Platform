"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Brain, 
  Globe, 
  Heart,
  Sparkles,
  BookOpen,
  Users,
  Target
} from 'lucide-react'
import { 
  AIVoiceTutorService, 
  VoiceTutor, 
  StudentProfile, 
  AdaptiveLearningPath,
  Language 
} from '@/lib/ai-voice-tutor-service'

interface AIVoiceTutorInterfaceProps {
  studentId: string
  subject: string
  onLearningProgress?: (progress: any) => void
  onCulturalDiscovery?: (content: any) => void
}

const AIVoiceTutorInterface: React.FC<AIVoiceTutorInterfaceProps> = ({
  studentId,
  subject,
  onLearningProgress,
  onCulturalDiscovery
}) => {
  const { toast } = useToast()
  const [currentTutor, setCurrentTutor] = useState<VoiceTutor | null>(null)
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null)
  const [learningPath, setLearningPath] = useState<AdaptiveLearningPath | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentConversation, setCurrentConversation] = useState<string[]>([])
  const [sessionProgress, setSessionProgress] = useState(0)
  const [culturalInsights, setCulturalInsights] = useState<string[]>([])
  
  const recognitionRef = useRef<any>(null)
  const synthesisRef = useRef<any>(null)

  useEffect(() => {
    initializeAITutor()
    setupSpeechServices()
  }, [studentId, subject])

  const initializeAITutor = async () => {
    try {
      // Mock student profile - in real app, load from Firebase
      const mockProfile: StudentProfile = {
        id: studentId,
        preferredLanguages: [
          {
            code: 'hi',
            name: 'Hindi',
            nativeName: 'हिन्दी',
            region: 'India',
            isIndigenous: false,
            culturalContext: {
              traditionalGreeting: 'Namaste',
              learningStyle: 'mixed',
              storytellingTradition: true,
              oralHistoryImportance: 'high'
            },
            ttsSupport: true,
            sttSupport: true
          }
        ],
        learningStyle: { visual: 0.3, auditory: 0.4, kinesthetic: 0.2, reading: 0.1 },
        culturalBackground: ['Indian', 'Traditional'],
        currentLevel: { [subject]: 5 },
        strengths: ['cultural_awareness', 'storytelling'],
        challenges: ['written_expression'],
        interests: ['traditional_stories', 'nature'],
        motivationalFactors: ['family_pride', 'cultural_preservation'],
        attentionSpan: 15,
        bestLearningTimes: ['morning'],
        accessibilityNeeds: ['audio_primary']
      }

      setStudentProfile(mockProfile)

      // Select optimal tutor
      const tutor = AIVoiceTutorService.selectOptimalTutor(mockProfile, subject)
      setCurrentTutor(tutor)

      // Generate adaptive learning path
      const path = await AIVoiceTutorService.generateAdaptiveLearningPath(
        mockProfile,
        subject,
        6
      )
      setLearningPath(path)

      toast({
        title: `Welcome! ${tutor.name} is ready to help`,
        description: `Learning ${subject} with cultural context from ${tutor.culturalBackground}`,
      })

    } catch (error) {
      console.error('Error initializing AI tutor:', error)
      toast({
        title: "Setup Error",
        description: "Failed to initialize AI tutor. Please try again.",
        variant: "destructive"
      })
    }
  }

  const setupSpeechServices = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = studentProfile?.preferredLanguages[0]?.code || 'en'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        handleStudentInput(transcript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const handleStudentInput = async (input: string) => {
    if (!currentTutor || !studentProfile) return

    try {
      // Add student input to conversation
      setCurrentConversation(prev => [...prev, `Student: ${input}`])

      // Process input and generate response
      const response = await AIVoiceTutorService.generateVoiceResponse(
        currentTutor,
        input,
        'neutral', // Would detect emotion in real implementation
        studentProfile.culturalBackground[0],
        learningPath?.currentModule || subject
      )

      // Add tutor response to conversation
      setCurrentConversation(prev => [...prev, `${currentTutor.name}: ${response.text}`])

      // Update cultural insights
      if (response.culturalReferences.length > 0) {
        setCulturalInsights(prev => [...prev, ...response.culturalReferences])
        if (onCulturalDiscovery) {
          onCulturalDiscovery(response.culturalReferences)
        }
      }

      // Speak the response
      speakText(response.text)

      // Update session progress
      setSessionProgress(prev => Math.min(100, prev + 10))

      if (onLearningProgress) {
        onLearningProgress({
          progress: sessionProgress,
          adaptationsMade: response.adaptationsMade,
          encouragementLevel: response.encouragementLevel
        })
      }

    } catch (error) {
      console.error('Error processing student input:', error)
      toast({
        title: "Processing Error",
        description: "Failed to process your input. Please try again.",
        variant: "destructive"
      })
    }
  }

  const speakText = (text: string) => {
    if (synthesisRef.current && currentTutor) {
      setIsSpeaking(true)
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = currentTutor.language.code
      utterance.rate = 0.9
      utterance.pitch = currentTutor.voiceCharacteristics.gender === 'female' ? 1.2 : 0.8
      
      utterance.onend = () => {
        setIsSpeaking(false)
      }
      
      utterance.onerror = () => {
        setIsSpeaking(false)
      }
      
      synthesisRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  if (!currentTutor || !studentProfile || !learningPath) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Tutor Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={`/tutors/${currentTutor.id}.jpg`} />
              <AvatarFallback>
                <Brain className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                {currentTutor.name}
              </CardTitle>
              <p className="text-muted-foreground">
                {currentTutor.culturalBackground} • Speaking {currentTutor.language.nativeName}
              </p>
              <div className="flex gap-2 mt-2">
                {currentTutor.specialization.map(spec => (
                  <Badge key={spec} variant="secondary">
                    {spec.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Session Progress</div>
              <Progress value={sessionProgress} className="w-32 mt-1" />
              <div className="text-xs text-muted-foreground mt-1">{sessionProgress}%</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Voice Interaction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Voice Conversation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Conversation Display */}
              <div className="h-48 overflow-y-auto border rounded-lg p-4 bg-muted/20">
                {currentConversation.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    <Heart className="h-8 w-8 mx-auto mb-2" />
                    <p>Start your conversation with {currentTutor.name}</p>
                    <p className="text-xs">Say "{currentTutor.language.culturalContext.traditionalGreeting}" to begin!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentConversation.map((message, index) => (
                      <div 
                        key={index} 
                        className={`p-2 rounded-lg ${
                          message.startsWith('Student:') 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-secondary/10 text-secondary-foreground'
                        }`}
                      >
                        {message}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Voice Controls */}
              <div className="flex gap-2">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isSpeaking}
                  className={`flex-1 ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-4 w-4 mr-2" />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Start Speaking
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={isSpeaking ? stopSpeaking : () => speakText("Hello, how can I help you today?")}
                  variant="outline"
                  className="flex-1"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="h-4 w-4 mr-2" />
                      Stop Speaking
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4 mr-2" />
                      Test Voice
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cultural Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Cultural Discoveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {culturalInsights.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  <BookOpen className="h-8 w-8 mx-auto mb-2" />
                  <p>Cultural insights will appear here</p>
                  <p className="text-xs">As you learn, discover connections to your heritage!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {culturalInsights.map((insight, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5">
                      <div className="font-medium text-sm capitalize">
                        {insight.replace('_', ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Learning Path Info */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Current Learning Focus</h4>
                <div className="text-sm text-muted-foreground">
                  <p>📚 Module: {learningPath.currentModule}</p>
                  <p>🎯 Next: {learningPath.nextRecommendedModule}</p>
                  <p>⏱️ Est. Time: {learningPath.estimatedCompletionTime} min</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Learning Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <BookOpen className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">Cultural Story</div>
                <div className="text-xs text-muted-foreground">Learn through traditional tales</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">Peer Discussion</div>
                <div className="text-xs text-muted-foreground">Connect with global classmates</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Sparkles className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">Create Project</div>
                <div className="text-xs text-muted-foreground">Apply learning to real impact</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AIVoiceTutorInterface