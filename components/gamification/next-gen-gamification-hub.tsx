"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { 
  Trophy, 
  Crown, 
  Medal, 
  Star, 
  Globe, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Award,
  Target,
  Zap,
  Heart,
  Brain,
  HandHeart,
  Sparkles,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import { 
  NextGenXPSystem, 
  Achievement, 
  LeaderboardLevel, 
  LeaderboardEntry, 
  StudentAvatar,
  DEFAULT_ACHIEVEMENTS 
} from '@/lib/next-gen-xp-system'

interface NextGenGamificationHubProps {
  studentId: string
  studentData: {
    totalXP: number
    level: number
    consecutiveDays: number
    skillMasteries: any[]
    culturalContributions: number
    peerTeachingSessions: number
    sdgContributions: any[]
    avatar: StudentAvatar
    unlockedAchievements: Achievement[]
    country: string
    region: string
    displayName: string
  }
  onXPUpdate?: (newXP: number) => void
  onAchievementUnlocked?: (achievement: Achievement) => void
}

const NextGenGamificationHub: React.FC<NextGenGamificationHubProps> = ({
  studentId,
  studentData,
  onXPUpdate,
  onAchievementUnlocked
}) => {
  const { toast } = useToast()
  const [selectedTab, setSelectedTab] = useState('overview')
  const [leaderboards, setLeaderboards] = useState<LeaderboardLevel[]>([])
  const [availableAchievements, setAvailableAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeGamificationData()
  }, [studentId])

  const initializeGamificationData = async () => {
    try {
      // Mock leaderboard data - in real app, this would come from Firebase
      const mockLeaderboardEntries: LeaderboardEntry[] = [
        {
          studentId: studentId,
          displayName: studentData.displayName,
          avatar: studentData.avatar,
          totalXP: studentData.totalXP,
          level: studentData.level,
          achievements: studentData.unlockedAchievements,
          culturalContributions: studentData.culturalContributions,
          globalCollaborations: studentData.peerTeachingSessions,
          position: 1,
          trend: 'up',
          country: studentData.country,
          region: studentData.region
        },
        // Add more mock entries...
        ...Array.from({ length: 20 }, (_, i) => ({
          studentId: `student_${i + 2}`,
          displayName: `Student ${i + 2}`,
          avatar: {
            id: `avatar_${i + 2}`,
            baseModel: 'default',
            culturalElements: { clothing: [], accessories: [], backgroundTheme: {} as any },
            animations: ['idle'],
            level: Math.floor(Math.random() * 30) + 1,
            prestigeLevel: 0
          },
          totalXP: Math.floor(Math.random() * 10000),
          level: Math.floor(Math.random() * 30) + 1,
          achievements: [],
          culturalContributions: Math.floor(Math.random() * 50),
          globalCollaborations: Math.floor(Math.random() * 20),
          position: i + 2,
          trend: (Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable') as 'up' | 'down' | 'stable',
          country: ['India', 'USA', 'Germany', 'Japan', 'Brazil'][Math.floor(Math.random() * 5)],
          region: 'Sample Region'
        }))
      ]

      const schoolLeaderboard = NextGenXPSystem.generateLeaderboard(
        mockLeaderboardEntries,
        'school',
        'weekly'
      )

      const nationalLeaderboard = NextGenXPSystem.generateLeaderboard(
        mockLeaderboardEntries,
        'national',
        'monthly'
      )

      const globalLeaderboard = NextGenXPSystem.generateLeaderboard(
        mockLeaderboardEntries,
        'global',
        'all_time'
      )

      setLeaderboards([schoolLeaderboard, nationalLeaderboard, globalLeaderboard])
      setLoading(false)
    } catch (error) {
      console.error('Error initializing gamification data:', error)
      setLoading(false)
    }
  }

  const getAchievementIcon = (category: Achievement['category']) => {
    const iconMap = {
      academic: Brain,
      cultural: Globe,
      collaboration: Users,
      leadership: Crown,
      innovation: Sparkles,
      community_impact: HandHeart
    }
    return iconMap[category] || Award
  }

  const getRarityColor = (rarity: Achievement['rarity']) => {
    const colorMap = {
      common: 'bg-gray-100 border-gray-300 text-gray-700',
      uncommon: 'bg-green-100 border-green-300 text-green-700',
      rare: 'bg-blue-100 border-blue-300 text-blue-700',
      epic: 'bg-purple-100 border-purple-300 text-purple-700',
      legendary: 'bg-yellow-100 border-yellow-300 text-yellow-700'
    }
    return colorMap[rarity] || colorMap.common
  }

  const getTrendIcon = (trend: LeaderboardEntry['trend']) => {
    switch (trend) {
      case 'up':
        return <ChevronUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <ChevronDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const checkNewAchievements = () => {
    const newAchievements = NextGenXPSystem.checkAchievements(
      {
        totalXP: studentData.totalXP,
        consecutiveDays: studentData.consecutiveDays,
        skillMasteries: studentData.skillMasteries,
        culturalContributions: studentData.culturalContributions,
        peerTeachingSessions: studentData.peerTeachingSessions,
        sdgContributions: studentData.sdgContributions
      },
      availableAchievements.filter(a => !studentData.unlockedAchievements.find(ua => ua.id === a.id))
    )

    newAchievements.forEach(achievement => {
      if (onAchievementUnlocked) {
        onAchievementUnlocked(achievement)
      }
      
      toast({
        title: `🎉 Achievement Unlocked!`,
        description: `${achievement.name} - ${achievement.description}`,
      })
    })
  }

  const globalImpactScore = NextGenXPSystem.calculateGlobalImpactScore(
    studentData.culturalContributions,
    studentData.peerTeachingSessions,
    studentData.sdgContributions,
    studentData.peerTeachingSessions
  )

  const xpToNextLevel = NextGenXPSystem.getXPToNextLevel(studentData.totalXP)
  const progressToNextLevel = xpToNextLevel > 0 ? 
    ((NextGenXPSystem.calculateLevel(studentData.totalXP + xpToNextLevel) - NextGenXPSystem.calculateLevel(studentData.totalXP)) / NextGenXPSystem.calculateLevel(studentData.totalXP + xpToNextLevel)) * 100 : 100

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
        <h1 className="text-3xl font-bold mb-2">🌟 Next-Gen Learning Hub</h1>
        <p className="text-muted-foreground">
          Your journey through global knowledge and cultural discovery
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboards">Global Rankings</TabsTrigger>
          <TabsTrigger value="avatar">Cultural Avatar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Student Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Level</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentData.level}</div>
                <p className="text-xs text-muted-foreground">
                  {xpToNextLevel > 0 ? `${xpToNextLevel} XP to next level` : 'Max level!'}
                </p>
                {xpToNextLevel > 0 && (
                  <Progress value={progressToNextLevel} className="mt-2" />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total XP</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentData.totalXP.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Experience Points</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cultural Impact</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentData.culturalContributions}</div>
                <p className="text-xs text-muted-foreground">Contributions Made</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Global Impact</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{globalImpactScore}</div>
                <p className="text-xs text-muted-foreground">Impact Score</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>🚀 Quick Actions</CardTitle>
              <CardDescription>Continue your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button className="h-auto p-4" onClick={checkNewAchievements}>
                  <div className="text-center">
                    <Award className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Check Achievements</div>
                    <div className="text-xs text-muted-foreground">See if you've unlocked any new achievements</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Join Global Classroom</div>
                    <div className="text-xs text-muted-foreground">Connect with students worldwide</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-center">
                    <Target className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Contribute to SDGs</div>
                    <div className="text-xs text-muted-foreground">Make a real-world impact</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Unlocked Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Unlocked Achievements ({studentData.unlockedAchievements.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {studentData.unlockedAchievements.map((achievement) => {
                  const IconComponent = getAchievementIcon(achievement.category)
                  return (
                    <div key={achievement.id} className={`p-4 rounded-lg border-2 ${getRarityColor(achievement.rarity)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div>
                            <h4 className="font-medium">{achievement.name}</h4>
                            <p className="text-sm opacity-75">{achievement.description}</p>
                            {achievement.culturalContext && (
                              <Badge variant="outline" className="mt-1">
                                {achievement.culturalContext.region}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <IconComponent className="h-4 w-4" />
                      </div>
                    </div>
                  )
                })}
                
                {studentData.unlockedAchievements.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No achievements unlocked yet</p>
                    <p className="text-xs">Complete activities to earn your first achievement!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Available Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Available Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableAchievements
                  .filter(achievement => !studentData.unlockedAchievements.find(ua => ua.id === achievement.id))
                  .slice(0, 5)
                  .map((achievement) => {
                    const IconComponent = getAchievementIcon(achievement.category)
                    return (
                      <div key={achievement.id} className="p-4 rounded-lg border border-dashed border-gray-300 opacity-75">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl grayscale">{achievement.icon}</div>
                            <div>
                              <h4 className="font-medium">{achievement.name}</h4>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              <Badge variant="secondary" className="mt-1">
                                {achievement.category.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                          <IconComponent className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    )
                  })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboards" className="space-y-6">
          <div className="grid gap-6">
            {leaderboards.map((leaderboard) => (
              <Card key={leaderboard.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    {leaderboard.name}
                  </CardTitle>
                  <CardDescription>
                    {leaderboard.scope} • {leaderboard.timeframe} • {leaderboard.participants.length} participants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboard.participants.slice(0, 10).map((entry, index) => (
                      <div 
                        key={entry.studentId} 
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          entry.studentId === studentId ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {index < 3 ? ['🥇', '🥈', '🥉'][index] : entry.position}
                          </div>
                          
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{entry.displayName[0]}</AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="font-medium">{entry.displayName}</div>
                            <div className="text-xs text-muted-foreground">
                              {entry.country} • Level {entry.level}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="font-medium">{entry.totalXP.toLocaleString()} XP</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              {getTrendIcon(entry.trend)}
                              {entry.achievements.length} achievements
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="avatar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Cultural Avatar Customization
              </CardTitle>
              <CardDescription>
                Celebrate your heritage and global connections through your avatar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                  <Users className="h-16 w-16 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Avatar Level {studentData.avatar.level}</h3>
                <p className="text-muted-foreground mb-4">
                  Unlock cultural elements by engaging with diverse traditions and collaborating globally
                </p>
                
                <div className="grid gap-4 md:grid-cols-3 text-left">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">🎨 Cultural Clothing</h4>
                    <p className="text-sm text-muted-foreground">
                      {studentData.avatar.culturalElements.clothing.length} items unlocked
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">✨ Accessories</h4>
                    <p className="text-sm text-muted-foreground">
                      {studentData.avatar.culturalElements.accessories.length} items unlocked
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">🌍 Background Themes</h4>
                    <p className="text-sm text-muted-foreground">
                      {studentData.avatar.culturalElements.backgroundTheme ? 'Current: Global Unity' : 'None selected'}
                    </p>
                  </div>
                </div>
                
                <Button className="mt-4">
                  Customize Avatar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default NextGenGamificationHub