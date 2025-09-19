"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { 
  Globe, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Users, 
  Award, 
  Clock,
  MapPin,
  Languages,
  Camera,
  Share2,
  QrCode,
  Download
} from 'lucide-react'
import { 
  GlobalConnectivityService, 
  GlobalClassroom, 
  GlobalParticipant, 
  BlockchainCredential 
} from '@/lib/global-connectivity-service'

interface GlobalClassroomInterfaceProps {
  studentId: string
  studentData: {
    displayName: string
    school: string
    country: string
    culturalBackground: string[]
    preferredLanguage: string
  }
  onCredentialEarned?: (credential: BlockchainCredential) => void
}

const GlobalClassroomInterface: React.FC<GlobalClassroomInterfaceProps> = ({
  studentId,
  studentData,
  onCredentialEarned
}) => {
  const { toast } = useToast()
  const [availableClassrooms, setAvailableClassrooms] = useState<GlobalClassroom[]>([])
  const [currentClassroom, setCurrentClassroom] = useState<GlobalClassroom | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [participants, setParticipants] = useState<GlobalParticipant[]>([])
  const [myContributions, setMyContributions] = useState<any[]>([])
  const [earnedCredentials, setEarnedCredentials] = useState<BlockchainCredential[]>([])
  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAvailableClassrooms()
  }, [])

  const loadAvailableClassrooms = async () => {
    try {
      const classrooms = await GlobalConnectivityService.getAvailableGlobalClassrooms(
        studentData.country,
        studentData.preferredLanguage,
        ['cultural_exchange', 'global_collaboration']
      )
      setAvailableClassrooms(classrooms)
      setLoading(false)
    } catch (error) {
      console.error('Error loading classrooms:', error)
      toast({
        title: "Loading Error",
        description: "Failed to load available classrooms. Please try again.",
        variant: "destructive"
      })
      setLoading(false)
    }
  }

  const joinClassroom = async (classroom: GlobalClassroom) => {
    try {
      const participant = await GlobalConnectivityService.joinGlobalClassroom(
        classroom.id,
        {
          studentId,
          ...studentData
        }
      )
      
      setCurrentClassroom(classroom)
      setParticipants([participant])
      setIsConnected(true)
      
      toast({
        title: "🌍 Joined Global Classroom!",
        description: `Welcome to ${classroom.name}. You're now connected with students worldwide!`,
      })
      
      // Simulate adding other participants
      setTimeout(() => {
        setParticipants(prev => [
          ...prev,
          {
            studentId: 'student_japan',
            displayName: 'Yuki Tanaka',
            school: 'Tokyo International School',
            country: 'Japan',
            culturalBackground: ['Japanese'],
            preferredLanguage: 'Japanese',
            isVRCapable: true,
            isARCapable: true,
            connectionQuality: 'high',
            joinedAt: new Date(),
            contributions: []
          },
          {
            studentId: 'student_germany',
            displayName: 'Max Mueller',
            school: 'Berlin Science Academy',
            country: 'Germany',
            culturalBackground: ['German'],
            preferredLanguage: 'German',
            isVRCapable: false,
            isARCapable: true,
            connectionQuality: 'medium',
            joinedAt: new Date(),
            contributions: []
          }
        ])
      }, 2000)
      
    } catch (error) {
      console.error('Error joining classroom:', error)
      toast({
        title: "Connection Error",
        description: "Failed to join the classroom. Please check your connection.",
        variant: "destructive"
      })
    }
  }

  const leaveClassroom = async () => {
    if (currentClassroom && myContributions.length > 0) {
      // Generate credential for participation
      const credential = await GlobalConnectivityService.generateGlobalCredential(
        studentId,
        {
          classroom: currentClassroom,
          contributions: myContributions,
          peerRatings: [4.5, 4.8, 4.2], // Mock peer ratings
          culturalSharing: myContributions.filter(c => c.type === 'cultural_share').length
        }
      )
      
      setEarnedCredentials(prev => [...prev, credential])
      
      if (onCredentialEarned) {
        onCredentialEarned(credential)
      }
      
      toast({
        title: "🏆 Credential Earned!",
        description: `You've earned a blockchain credential for your global participation!`,
      })
    }
    
    setCurrentClassroom(null)
    setIsConnected(false)
    setParticipants([])
    setMyContributions([])
  }

  const shareCultural = async () => {
    const culturalShare = {
      type: 'cultural_share',
      content: `Traditional greeting from ${studentData.country}: "${getTraditionalGreeting()}"`,
      timestamp: new Date(),
      culturalContext: studentData.culturalBackground[0]
    }
    
    setMyContributions(prev => [...prev, culturalShare])
    
    toast({
      title: "Cultural Sharing",
      description: "Your cultural contribution has been shared with the global classroom!",
    })
  }

  const getTraditionalGreeting = (): string => {
    const greetings: { [key: string]: string } = {
      'India': 'Namaste 🙏',
      'Japan': 'Konnichiwa 🙇',
      'Germany': 'Guten Tag 👋',
      'USA': 'Hello! 😊',
      'China': 'Nǐ hǎo 👋',
      'Brazil': 'Olá! 🤙'
    }
    return greetings[studentData.country] || 'Hello! 👋'
  }

  const downloadCredential = async (credential: BlockchainCredential) => {
    // Create downloadable credential
    const credentialData = {
      id: credential.id,
      achievement: credential.achievement,
      level: credential.level,
      issueDate: credential.issueDate.toISOString(),
      verificationUrl: credential.verificationUrl,
      qrCode: credential.qrCode
    }
    
    const blob = new Blob([JSON.stringify(credentialData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `credential_${credential.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Credential Downloaded",
      description: "Your blockchain credential has been downloaded successfully!",
    })
  }

  const getCountryFlag = (country: string): string => {
    const flags: { [key: string]: string } = {
      'India': '🇮🇳',
      'Japan': '🇯🇵',
      'Germany': '🇩🇪',
      'USA': '🇺🇸',
      'China': '🇨🇳',
      'Brazil': '🇧🇷'
    }
    return flags[country] || '🌍'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">🌍 Global Classroom Network</h1>
        <p className="text-muted-foreground">
          Connect with students worldwide for cultural exchange and collaborative learning
        </p>
      </div>

      {!currentClassroom ? (
        // Available Classrooms View
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Available Global Classrooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              {availableClassrooms.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No global classrooms available at the moment</p>
                  <p className="text-sm">Check back later for new cultural exchange opportunities!</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {availableClassrooms.map((classroom) => (
                    <Card key={classroom.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{classroom.name}</h3>
                              <p className="text-sm text-muted-foreground">{classroom.subject}</p>
                            </div>
                            <Badge variant="outline">{classroom.culturalTheme}</Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {getCountryFlag(classroom.hostTeacher.country)} {classroom.hostTeacher.country}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {classroom.sessionDuration} min
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {classroom.participants.length}/{classroom.maxParticipants}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Languages className="h-4 w-4" />
                            <span className="text-sm">{classroom.language}</span>
                            {classroom.isAREnabled && <Badge variant="secondary">AR</Badge>}
                            {classroom.isVREnabled && <Badge variant="secondary">VR</Badge>}
                          </div>
                          
                          <div className="border-t pt-4">
                            <p className="text-sm mb-3">{classroom.currentActivity.description}</p>
                            <Button 
                              onClick={() => joinClassroom(classroom)}
                              className="w-full"
                            >
                              Join Global Classroom
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Earned Credentials */}
          {earnedCredentials.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Your Global Credentials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {earnedCredentials.map((credential) => (
                    <Card key={credential.id} className="border-2 border-primary/20">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{credential.achievement}</h4>
                              <p className="text-sm text-muted-foreground">{credential.level}</p>
                            </div>
                            <QrCode className="h-8 w-8 text-muted-foreground" />
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            <p>Issued: {credential.issueDate.toLocaleDateString()}</p>
                            <p>Cultural Context: {credential.culturalContext}</p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => downloadCredential(credential)}
                              className="flex-1"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => window.open(credential.verificationUrl, '_blank')}
                              className="flex-1"
                            >
                              Verify
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        // Active Classroom View
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    {currentClassroom.name}
                  </CardTitle>
                  <p className="text-muted-foreground">{currentClassroom.culturalTheme}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  >
                    {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  >
                    {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={leaveClassroom}>
                    Leave
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Current Activity */}
                <div className="border rounded-lg p-4 bg-primary/5">
                  <h3 className="font-medium mb-2">{currentClassroom.currentActivity.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {currentClassroom.currentActivity.description}
                  </p>
                  <div className="space-y-2">
                    {currentClassroom.currentActivity.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                        {instruction}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Participants */}
                <div>
                  <h3 className="font-medium mb-3">Global Participants ({participants.length})</h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    {participants.map((participant) => (
                      <Card key={participant.studentId} className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{participant.displayName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{participant.displayName}</p>
                            <p className="text-xs text-muted-foreground">
                              {getCountryFlag(participant.country)} {participant.country}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <div className={`w-2 h-2 rounded-full ${
                                participant.connectionQuality === 'high' ? 'bg-green-500' :
                                participant.connectionQuality === 'medium' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`} />
                              <span className="text-xs text-muted-foreground">
                                {participant.connectionQuality}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Collaboration Tools */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={shareCultural}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share Culture
                  </Button>
                  <Button 
                    variant="outline" 
                    disabled={!currentClassroom.isAREnabled}
                    className="flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    AR Collaborate
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                  >
                    <Languages className="h-4 w-4" />
                    Translate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default GlobalClassroomInterface