"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Camera, 
  CameraOff, 
  Zap, 
  Eye, 
  Target, 
  BookOpen, 
  Play, 
  Pause,
  RotateCcw,
  Maximize,
  Minimize,
  HelpCircle,
  Settings,
  Award,
  Smartphone,
  Cpu,
  Wifi
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { arService, ARContent, ARMarker, ARSession } from '@/lib/ar-service'
import { useLanguage } from '@/lib/language-context'

interface ARClassroomProps {
  studentId: string
  currentSubject?: string
  onXPEarned?: (amount: number) => void
}

export function ARClassroom({ studentId, currentSubject, onXPEarned }: ARClassroomProps) {
  const [isARActive, setIsARActive] = useState(false)
  const [detectedMarkers, setDetectedMarkers] = useState<ARMarker[]>([])
  const [currentSession, setCurrentSession] = useState<ARSession | null>(null)
  const [availableContent, setAvailableContent] = useState<ARContent[]>([])
  const [activeContent, setActiveContent] = useState<ARContent | null>(null)
  const [deviceSupport, setDeviceSupport] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    // Check device AR support
    const support = {
      camera: !!navigator.mediaDevices?.getUserMedia,
      webgl: !!document.createElement('canvas').getContext('webgl'),
      deviceMotion: 'DeviceMotionEvent' in window,
      webxr: 'xr' in navigator
    }
    setDeviceSupport(support)
    
    // Load available AR content
    if (currentSubject) {
      setAvailableContent(arService.getARContentBySubject(currentSubject))
    } else {
      setAvailableContent(arService.getAllARContent())
    }

    // Set up AR service event handlers
    arService.onMarkersDetected = (markers: ARMarker[]) => {
      setDetectedMarkers(markers)
      
      // Auto-start content if marker detected
      if (markers.length > 0 && !activeContent) {
        startARContent(markers[0].arContent)
      }
    }

    arService.onSessionUpdate = (session: ARSession) => {
      setCurrentSession(session)
    }

    return () => {
      stopAR()
    }
  }, [currentSubject])

  const startAR = async () => {
    if (!deviceSupport?.camera) {
      setError('Camera access is required for AR features')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Initialize camera
      await arService.initializeCamera()
      
      // Set video and canvas elements
      if (videoRef.current && canvasRef.current) {
        arService.setVideoElement(videoRef.current)
        arService.setCanvasElement(canvasRef.current)
        
        // Start tracking
        await arService.startTracking()
        setIsARActive(true)
      }
    } catch (error) {
      console.error('Error starting AR:', error)
      setError('Failed to start AR camera. Please check permissions.')
    } finally {
      setLoading(false)
    }
  }

  const stopAR = () => {
    arService.stopTracking()
    setIsARActive(false)
    setDetectedMarkers([])
    setActiveContent(null)
    
    if (currentSession) {
      const session = arService.endARSession()
      if (session) {
        onXPEarned?.(session.xpEarned)
      }
    }
    setCurrentSession(null)
  }

  const startARContent = async (content: ARContent) => {
    setActiveContent(content)
    const session = await arService.startARSession(studentId, content.id)
    setCurrentSession(session)
  }

  const handleInteraction = () => {
    arService.updateSessionProgress(1, 0, 0)
  }

  const handleQuizAnswer = (correct: boolean) => {
    arService.updateSessionProgress(0, 1, correct ? 1 : 0)
  }

  const DeviceCompatibilityCheck = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Device Compatibility
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className={`flex items-center gap-2 ${deviceSupport?.camera ? 'text-green-600' : 'text-red-600'}`}>
            <Camera className="h-4 w-4" />
            <span className="text-sm">Camera</span>
            {deviceSupport?.camera ? '✓' : '✗'}
          </div>
          
          <div className={`flex items-center gap-2 ${deviceSupport?.webgl ? 'text-green-600' : 'text-red-600'}`}>
            <Cpu className="h-4 w-4" />
            <span className="text-sm">3D Graphics</span>
            {deviceSupport?.webgl ? '✓' : '✗'}
          </div>
          
          <div className={`flex items-center gap-2 ${deviceSupport?.deviceMotion ? 'text-green-600' : 'text-red-600'}`}>
            <RotateCcw className="h-4 w-4" />
            <span className="text-sm">Motion Sensors</span>
            {deviceSupport?.deviceMotion ? '✓' : '✗'}
          </div>
          
          <div className={`flex items-center gap-2 ${deviceSupport?.webxr ? 'text-green-600' : 'text-orange-600'}`}>
            <Eye className="h-4 w-4" />
            <span className="text-sm">WebXR</span>
            {deviceSupport?.webxr ? '✓' : '○'}
          </div>
        </div>
        
        {!deviceSupport?.camera && (
          <Alert>
            <AlertDescription>
              Camera access is required for AR features. Please ensure your device has a camera and grant permission.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )

  const ARContentCard = ({ content }: { content: ARContent }) => (
    <Card className="cursor-pointer hover:shadow-lg transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{content.title}</CardTitle>
          <Badge variant="outline">{content.type.replace('_', ' ')}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{content.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {content.subject}
          </span>
          <span className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            {content.xpReward} XP
          </span>
        </div>
        
        <Button 
          onClick={() => startARContent(content)}
          disabled={!isARActive}
          className="w-full"
          size="sm"
        >
          <Play className="h-4 w-4 mr-2" />
          Start AR Experience
        </Button>
      </CardContent>
    </Card>
  )

  const MarkerDetectionOverlay = () => (
    <AnimatePresence>
      {detectedMarkers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute top-4 left-4 right-4 z-10"
        >
          <Card className="bg-green-500 text-white border-green-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <div>
                  <div className="font-medium">AR Marker Detected!</div>
                  <div className="text-sm text-green-100">
                    {detectedMarkers[0]?.arContent.title}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const ARSessionOverlay = () => {
    if (!currentSession || !activeContent) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 left-4 right-4 z-10"
      >
        <Card className="bg-blue-500 text-white border-blue-600">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{activeContent.title}</h3>
                <Badge className="bg-white text-blue-500">
                  {Math.round(currentSession.completionPercentage)}%
                </Badge>
              </div>
              
              <Progress 
                value={currentSession.completionPercentage} 
                className="h-2 bg-blue-400"
              />
              
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="font-medium">{currentSession.interactionsCount}</div>
                  <div className="text-blue-200">Interactions</div>
                </div>
                <div>
                  <div className="font-medium">{currentSession.questionsAnswered}</div>
                  <div className="text-blue-200">Questions</div>
                </div>
                <div>
                  <div className="font-medium">{currentSession.xpEarned}</div>
                  <div className="text-blue-200">XP Earned</div>
                </div>
              </div>
              
              {activeContent.type === 'interactive_quiz' && activeContent.quizData && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Quick Quiz:</div>
                  {activeContent.quizData.questions.slice(0, 1).map((question, index) => (
                    <div key={index} className="space-y-2">
                      <div className="text-sm">{question.question}</div>
                      <div className="grid grid-cols-2 gap-2">
                        {question.options.map((option, optionIndex) => (
                          <Button
                            key={optionIndex}
                            variant="outline"
                            size="sm"
                            className="text-blue-500 border-white hover:bg-white"
                            onClick={() => {
                              handleQuizAnswer(optionIndex === question.correct)
                              handleInteraction()
                            }}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">🥽 AR Classrooms</h2>
        <p className="text-muted-foreground">
          Point your camera at diagrams, maps, or text to bring them alive with augmented reality!
        </p>
      </div>

      <DeviceCompatibilityCheck />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="camera" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="camera">AR Camera</TabsTrigger>
          <TabsTrigger value="content">AR Content</TabsTrigger>
          <TabsTrigger value="help">How to Use</TabsTrigger>
        </TabsList>
        
        <TabsContent value="camera" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  AR Camera View
                </CardTitle>
                <div className="flex gap-2">
                  {!isARActive ? (
                    <Button 
                      onClick={startAR}
                      disabled={loading || !deviceSupport?.camera}
                    >
                      {loading ? (
                        <>Loading...</>
                      ) : (
                        <>
                          <Camera className="h-4 w-4 mr-2" />
                          Start AR
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button onClick={stopAR} variant="destructive">
                      <CameraOff className="h-4 w-4 mr-2" />
                      Stop AR
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                {isARActive ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <canvas
                      ref={canvasRef}
                      className="absolute inset-0 pointer-events-none"
                      width={1280}
                      height={720}
                    />
                    
                    <MarkerDetectionOverlay />
                    <ARSessionOverlay />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    <div className="text-center">
                      <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Start AR to begin camera tracking</p>
                      <p className="text-sm opacity-75 mt-2">
                        Point your camera at educational diagrams, maps, or text
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {isARActive && (
                <div className="mt-4 p-3 bg-muted rounded">
                  <div className="text-sm">
                    <strong>Instructions:</strong> Point your camera at any of these items:
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Science diagrams (heart, solar system)</li>
                      <li>Maps (India map, world map)</li>
                      <li>Mathematical shapes and formulas</li>
                      <li>Textbook illustrations</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content">
          <div className="grid gap-4">
            {availableContent.length > 0 ? (
              availableContent.map(content => (
                <ARContentCard key={content.id} content={content} />
              ))
            ) : (
              <Card className="text-center p-8">
                <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No AR Content Available</h3>
                <p className="text-muted-foreground">
                  AR content will be available based on your current subject and grade level.
                </p>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="help">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                How to Use AR Classrooms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">🎯 Getting Started</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Ensure your device has a camera and grant camera permissions</li>
                    <li>Click "Start AR" to activate the camera</li>
                    <li>Point your camera at educational content</li>
                    <li>Watch as AR content appears on your screen!</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">📚 What Can You Scan?</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Science:</strong> Human heart diagrams, solar system images</li>
                    <li><strong>Geography:</strong> Maps of India, world maps</li>
                    <li><strong>Mathematics:</strong> 3D shapes, geometric diagrams</li>
                    <li><strong>General:</strong> Any educational textbook illustrations</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">🏆 Earning XP</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Interact with AR content to earn XP points</li>
                    <li>Answer quiz questions correctly for bonus XP</li>
                    <li>Complete AR sessions to maximize your rewards</li>
                    <li>XP earned can be converted to EduCoins</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">💡 Tips for Best Experience</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Ensure good lighting when using AR</li>
                    <li>Hold your device steady for better tracking</li>
                    <li>Keep the camera focused on the target content</li>
                    <li>Use the back camera for better performance</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}