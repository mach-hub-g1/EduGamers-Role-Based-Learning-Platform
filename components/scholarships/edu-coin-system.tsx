"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Coins, 
  Wallet, 
  Trophy, 
  Heart, 
  School, 
  BookOpen, 
  GraduationCap,
  TrendingUp,
  Users,
  Building,
  Gift,
  Target,
  Star,
  Award,
  DollarSign,
  Sparkles
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  eduCoinService, 
  StudentEduCoinWallet, 
  ScholarshipOpportunity, 
  CommunityProject,
  EduCoin 
} from '@/lib/edu-coin-service'
import { useLanguage } from '@/lib/language-context'

interface EduCoinSystemProps {
  studentId: string
  studentName: string
  currentGrade: number
  district?: string
  state?: string
  onCoinUpdate?: (newBalance: number) => void
}

export function EduCoinSystem({ 
  studentId, 
  studentName, 
  currentGrade, 
  district, 
  state,
  onCoinUpdate 
}: EduCoinSystemProps) {
  const [wallet, setWallet] = useState<StudentEduCoinWallet | null>(null)
  const [coinHistory, setCoinHistory] = useState<EduCoin[]>([])
  const [scholarships, setScholarships] = useState<ScholarshipOpportunity[]>([])
  const [communityProjects, setCommunityProjects] = useState<CommunityProject[]>([])
  const [selectedScholarship, setSelectedScholarship] = useState<ScholarshipOpportunity | null>(null)
  const [loading, setLoading] = useState(true)
  const [converting, setConverting] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    loadData()
  }, [studentId])

  const loadData = async () => {
    try {
      const [walletData, history, availableScholarships, projects] = await Promise.all([
        eduCoinService.getWallet(studentId),
        eduCoinService.getCoinHistory(studentId),
        eduCoinService.getAvailableScholarships(currentGrade, state),
        eduCoinService.getCommunityProjects(district, state)
      ])

      setWallet(walletData)
      setCoinHistory(history)
      setScholarships(availableScholarships)
      setCommunityProjects(projects)
    } catch (error) {
      console.error('Error loading EduCoin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const convertStreakToCoins = async (streakDays: number) => {
    setConverting(true)
    try {
      const coinsEarned = await eduCoinService.convertStreakToCoins(studentId, streakDays)
      await loadData()
      onCoinUpdate?.(wallet ? wallet.currentBalance + coinsEarned : coinsEarned)
    } catch (error) {
      console.error('Error converting streak:', error)
    } finally {
      setConverting(false)
    }
  }

  const applyForScholarship = async (scholarship: ScholarshipOpportunity) => {
    try {
      const applicationData = {
        reason: `I would like to apply for ${scholarship.title} to support my education.`,
        academicPerformance: {
          currentGrade,
          avgScore: 85, // Would come from actual performance data
          xpEarned: wallet?.totalEarned || 0,
          streakDays: wallet?.statistics.longestStreak || 0
        },
        familyInfo: {
          income: 'below_2_lakh',
          members: 4,
          parentOccupation: 'Farmer'
        }
      }

      await eduCoinService.applyForScholarship(scholarship.id, studentId, applicationData)
      await loadData()
      setSelectedScholarship(null)
    } catch (error) {
      console.error('Error applying for scholarship:', error)
    }
  }

  const contributeToProject = async (project: CommunityProject, amount: number) => {
    try {
      await eduCoinService.contributeToProject(project.id, studentId, studentName, amount)
      await loadData()
    } catch (error) {
      console.error('Error contributing to project:', error)
    }
  }

  const WalletCard = () => (
    <Card className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          EduCoin Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold">{wallet?.currentBalance || 0}</div>
          <div className="text-amber-100">EduCoins Available</div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl font-semibold">{wallet?.totalEarned || 0}</div>
            <div className="text-xs text-amber-100">Total Earned</div>
          </div>
          <div>
            <div className="text-xl font-semibold">{wallet?.totalSpent || 0}</div>
            <div className="text-xs text-amber-100">Total Spent</div>
          </div>
          <div>
            <div className="text-xl font-semibold">{wallet?.statistics.scholarshipsWon || 0}</div>
            <div className="text-xs text-amber-100">Scholarships Won</div>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={() => convertStreakToCoins(7)}
            disabled={converting}
          >
            <Coins className="h-4 w-4 mr-2" />
            Convert 7-day Streak (≈ 20 Coins)
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const ScholarshipCard = ({ scholarship }: { scholarship: ScholarshipOpportunity }) => (
    <Card className="cursor-pointer hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{scholarship.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{scholarship.description}</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {scholarship.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-amber-500" />
            <span className="font-medium">{scholarship.costInCoins} EduCoins</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">₹{scholarship.realWorldValue.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Real Value</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Available Slots</span>
            <span>{scholarship.availableSlots}/{scholarship.totalSlots}</span>
          </div>
          <Progress 
            value={(scholarship.availableSlots / scholarship.totalSlots) * 100} 
            className="h-2"
          />
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Building className="h-3 w-3" />
          {scholarship.fundingSource}
          <span>•</span>
          <span>Deadline: {scholarship.applicationDeadline.toLocaleDateString()}</span>
        </div>
        
        <Button 
          className="w-full" 
          size="sm"
          onClick={() => setSelectedScholarship(scholarship)}
          disabled={!wallet || wallet.currentBalance < scholarship.costInCoins}
        >
          <GraduationCap className="h-4 w-4 mr-2" />
          Apply Now
        </Button>
      </CardContent>
    </Card>
  )

  const CommunityProjectCard = ({ project }: { project: CommunityProject }) => {
    const [contributionAmount, setContributionAmount] = useState(10)
    const progress = (project.currentCoins / project.targetCoins) * 100

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5" />
            {project.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{project.currentCoins}/{project.targetCoins} EduCoins</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="text-center text-xs text-muted-foreground">
              ₹{project.currentAmount.toLocaleString()} / ₹{project.targetAmount.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-muted p-3 rounded">
            <div className="text-sm font-medium mb-1">{project.school.name}</div>
            <div className="text-xs text-muted-foreground">
              {project.school.district}, {project.school.state} • {project.school.type}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Contribute EduCoins</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(Number(e.target.value))}
                min="1"
                max={wallet?.currentBalance || 0}
                className="flex-1"
              />
              <Button 
                onClick={() => contributeToProject(project, contributionAmount)}
                disabled={!wallet || wallet.currentBalance < contributionAmount}
              >
                <Heart className="h-4 w-4 mr-1" />
                Contribute
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {project.contributors.length} students have contributed • {project.contributors.length > 0 && 
              `Latest: ${project.contributors[project.contributors.length - 1]?.studentName}`
            }
          </div>
        </CardContent>
      </Card>
    )
  }

  const CoinHistoryItem = ({ coin }: { coin: EduCoin }) => (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded">
      <div className={`p-2 rounded-full ${
        coin.source === 'streak' ? 'bg-blue-100' :
        coin.source === 'quest' ? 'bg-purple-100' :
        coin.source === 'achievement' ? 'bg-green-100' :
        'bg-orange-100'
      }`}>
        {coin.source === 'streak' && <TrendingUp className="h-4 w-4" />}
        {coin.source === 'quest' && <Target className="h-4 w-4" />}
        {coin.source === 'achievement' && <Trophy className="h-4 w-4" />}
        {coin.source === 'challenge' && <Star className="h-4 w-4" />}
      </div>
      
      <div className="flex-1">
        <div className="font-medium">{coin.description}</div>
        <div className="text-xs text-muted-foreground">
          {coin.earnedAt.toLocaleDateString()} • {coin.source}
        </div>
      </div>
      
      <div className="text-right">
        <div className="font-semibold text-green-600">+{coin.amount}</div>
        <div className="text-xs text-muted-foreground">EduCoins</div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Sparkles className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading your EduCoin wallet...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">💰 EduCoin System</h2>
        <p className="text-muted-foreground">
          Earn coins through learning, contribute to community projects, and apply for scholarships!
        </p>
      </div>

      <WalletCard />

      <Tabs defaultValue="scholarships" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scholarships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Available Scholarships
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Use your EduCoins to apply for scholarships and educational support
              </p>
            </CardHeader>
          </Card>
          
          <div className="grid gap-4">
            {scholarships.length > 0 ? (
              scholarships.map(scholarship => (
                <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
              ))
            ) : (
              <Card className="text-center p-8">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Scholarships Available</h3>
                <p className="text-muted-foreground">
                  Check back later for new scholarship opportunities!
                </p>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="community" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Community Projects
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Help improve schools and educational infrastructure in your region
              </p>
            </CardHeader>
          </Card>
          
          <div className="grid gap-4">
            {communityProjects.length > 0 ? (
              communityProjects.map(project => (
                <CommunityProjectCard key={project.id} project={project} />
              ))
            ) : (
              <Card className="text-center p-8">
                <School className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Active Projects</h3>
                <p className="text-muted-foreground">
                  Community projects will appear here when available in your region.
                </p>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                EduCoin History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {coinHistory.length > 0 ? (
                    coinHistory.map(coin => (
                      <CoinHistoryItem key={coin.id} coin={coin} />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Coins className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Start earning EduCoins by completing quests and maintaining streaks!
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Community Leaderboard
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Top contributors making a difference in education
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Leaderboard will show the most active community contributors
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Scholarship Application Modal */}
      {selectedScholarship && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedScholarship(null)}
        >
          <Card className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Apply for Scholarship</CardTitle>
              <p className="text-sm text-muted-foreground">{selectedScholarship.title}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-3 rounded">
                <div className="flex justify-between text-sm">
                  <span>Cost:</span>
                  <span className="font-medium">{selectedScholarship.costInCoins} EduCoins</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Your Balance:</span>
                  <span className="font-medium">{wallet?.currentBalance || 0} EduCoins</span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                By applying, you'll spend {selectedScholarship.costInCoins} EduCoins. 
                This scholarship has a real-world value of ₹{selectedScholarship.realWorldValue.toLocaleString()}.
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedScholarship(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => applyForScholarship(selectedScholarship)}
                  className="flex-1"
                  disabled={!wallet || wallet.currentBalance < selectedScholarship.costInCoins}
                >
                  Apply Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}