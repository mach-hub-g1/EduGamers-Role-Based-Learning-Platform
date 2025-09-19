import { db } from './firebase'
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  updateDoc,
  doc,
  getDoc,
  increment,
  runTransaction,
  serverTimestamp
} from 'firebase/firestore'

export interface EduCoin {
  id: string
  amount: number
  source: 'streak' | 'achievement' | 'quest' | 'challenge' | 'bonus' | 'scholarship_return'
  description: string
  earnedAt: Date
  studentId: string
  metadata?: {
    streakDays?: number
    questId?: string
    achievementId?: string
    challengeId?: string
  }
}

export interface ScholarshipOpportunity {
  id: string
  title: string
  description: string
  category: 'education' | 'books' | 'technology' | 'infrastructure' | 'special_needs'
  costInCoins: number
  realWorldValue: number // in INR
  availableSlots: number
  totalSlots: number
  eligibilityCriteria: {
    minimumGrade?: number
    minimumXP?: number
    minimumStreak?: number
    subjects?: string[]
    region?: string
    familyIncome?: 'below_1_lakh' | 'below_2_lakh' | 'below_3_lakh' | 'any'
  }
  fundingSource: 'government' | 'private' | 'community' | 'corporate'
  isActive: boolean
  applicationDeadline: Date
  createdAt: Date
  updatedAt: Date
  governmentSchemeId?: string // Link to actual government schemes
  trackingData: {
    applicants: number
    approved: number
    distributed: number
    transparency_hash?: string
  }
}

export interface ScholarshipApplication {
  id: string
  scholarshipId: string
  studentId: string
  coinsSpent: number
  status: 'pending' | 'approved' | 'rejected' | 'distributed' | 'completed'
  applicationData: {
    reason: string
    academicPerformance: {
      currentGrade: number
      avgScore: number
      xpEarned: number
      streakDays: number
    }
    familyInfo: {
      income: string
      members: number
      parentOccupation: string
    }
    documents?: string[] // File URLs
  }
  submittedAt: Date
  reviewedAt?: Date
  distributedAt?: Date
  reviewNotes?: string
  governmentOfficerNotes?: string
  transparencyHash?: string
}

export interface CommunityProject {
  id: string
  title: string
  description: string
  type: 'school_infrastructure' | 'digital_equipment' | 'library_books' | 'lab_equipment' | 'accessibility'
  targetCoins: number
  currentCoins: number
  targetAmount: number // Real money equivalent
  currentAmount: number
  school: {
    id: string
    name: string
    district: string
    state: string
    type: 'government' | 'private' | 'aided'
  }
  contributors: Array<{
    studentId: string
    studentName: string
    coinsContributed: number
    contributedAt: Date
  }>
  milestones: Array<{
    description: string
    targetCoins: number
    achieved: boolean
    achievedAt?: Date
  }>
  status: 'active' | 'funded' | 'in_progress' | 'completed' | 'paused'
  createdAt: Date
  expectedCompletion?: Date
  actualCompletion?: Date
  governmentApproval: {
    status: 'pending' | 'approved' | 'rejected'
    officerId?: string
    notes?: string
    approvedAt?: Date
  }
  transparencyReports: Array<{
    reportDate: Date
    description: string
    photosUrls?: string[]
    expenditure: number
    remainingFunds: number
  }>
}

export interface StudentEduCoinWallet {
  studentId: string
  totalEarned: number
  totalSpent: number
  currentBalance: number
  streakCoins: number
  questCoins: number
  achievementCoins: number
  lastUpdated: Date
  statistics: {
    longestStreak: number
    totalQuestsCompleted: number
    scholarshipsWon: number
    communityContributions: number
  }
}

class EduCoinService {
  // Earn EduCoins for various activities
  async earnCoins(
    studentId: string, 
    amount: number, 
    source: EduCoin['source'], 
    description: string,
    metadata?: EduCoin['metadata']
  ): Promise<void> {
    try {
      await runTransaction(db, async (transaction) => {
        // Add coin earning record
        const coinRecord: Omit<EduCoin, 'id'> = {
          amount,
          source,
          description,
          earnedAt: new Date(),
          studentId,
          metadata
        }
        
        const coinRef = await addDoc(collection(db, 'edu_coins'), coinRecord)
        
        // Update student wallet
        const walletRef = doc(db, 'edu_coin_wallets', studentId)
        const walletDoc = await transaction.get(walletRef)
        
        if (walletDoc.exists()) {
          transaction.update(walletRef, {
            totalEarned: increment(amount),
            currentBalance: increment(amount),
            [`${source}Coins`]: increment(amount),
            lastUpdated: serverTimestamp()
          })
        } else {
          // Create new wallet
          const newWallet: StudentEduCoinWallet = {
            studentId,
            totalEarned: amount,
            totalSpent: 0,
            currentBalance: amount,
            streakCoins: source === 'streak' ? amount : 0,
            questCoins: source === 'quest' ? amount : 0,
            achievementCoins: source === 'achievement' ? amount : 0,
            lastUpdated: new Date(),
            statistics: {
              longestStreak: 0,
              totalQuestsCompleted: 0,
              scholarshipsWon: 0,
              communityContributions: 0
            }
          }
          transaction.set(walletRef, newWallet)
        }
      })
    } catch (error) {
      console.error('Error earning coins:', error)
      throw error
    }
  }

  // Convert streak days to EduCoins
  async convertStreakToCoins(studentId: string, streakDays: number): Promise<number> {
    // Formula: Base 10 coins + (streakDays * multiplier)
    // Bonus multipliers for milestones
    let coinsEarned = 10
    let multiplier = 1
    
    if (streakDays >= 30) multiplier = 3 // Monthly streak bonus
    else if (streakDays >= 14) multiplier = 2 // Bi-weekly bonus
    else if (streakDays >= 7) multiplier = 1.5 // Weekly bonus
    
    coinsEarned = Math.floor(10 + (streakDays * multiplier))
    
    // Milestone bonuses
    if (streakDays === 30) coinsEarned += 100 // Month milestone
    if (streakDays === 100) coinsEarned += 500 // 100-day milestone
    if (streakDays === 365) coinsEarned += 2000 // Year milestone
    
    await this.earnCoins(
      studentId,
      coinsEarned,
      'streak',
      `Converted ${streakDays}-day streak to EduCoins`,
      { streakDays }
    )
    
    return coinsEarned
  }

  // Get student's EduCoin wallet
  async getWallet(studentId: string): Promise<StudentEduCoinWallet | null> {
    try {
      const walletDoc = await getDoc(doc(db, 'edu_coin_wallets', studentId))
      return walletDoc.exists() ? walletDoc.data() as StudentEduCoinWallet : null
    } catch (error) {
      console.error('Error fetching wallet:', error)
      return null
    }
  }

  // Get student's coin earning history
  async getCoinHistory(studentId: string, limit_count: number = 50): Promise<EduCoin[]> {
    try {
      const q = query(
        collection(db, 'edu_coins'),
        where('studentId', '==', studentId),
        orderBy('earnedAt', 'desc'),
        limit(limit_count)
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EduCoin))
    } catch (error) {
      console.error('Error fetching coin history:', error)
      return []
    }
  }

  // Get available scholarships
  async getAvailableScholarships(
    studentGrade?: number,
    studentRegion?: string
  ): Promise<ScholarshipOpportunity[]> {
    try {
      let q = query(
        collection(db, 'scholarship_opportunities'),
        where('isActive', '==', true),
        where('availableSlots', '>', 0),
        orderBy('costInCoins', 'asc')
      )
      
      const snapshot = await getDocs(q)
      let scholarships = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as ScholarshipOpportunity))
      
      // Filter by eligibility criteria
      if (studentGrade) {
        scholarships = scholarships.filter(s => 
          !s.eligibilityCriteria.minimumGrade || 
          studentGrade >= s.eligibilityCriteria.minimumGrade
        )
      }
      
      if (studentRegion) {
        scholarships = scholarships.filter(s => 
          !s.eligibilityCriteria.region || 
          s.eligibilityCriteria.region === studentRegion ||
          s.eligibilityCriteria.region === 'any'
        )
      }
      
      return scholarships
    } catch (error) {
      console.error('Error fetching scholarships:', error)
      return []
    }
  }

  // Apply for scholarship
  async applyForScholarship(
    scholarshipId: string,
    studentId: string,
    applicationData: ScholarshipApplication['applicationData']
  ): Promise<string> {
    try {
      return await runTransaction(db, async (transaction) => {
        // Get scholarship details
        const scholarshipRef = doc(db, 'scholarship_opportunities', scholarshipId)
        const scholarshipDoc = await transaction.get(scholarshipRef)
        
        if (!scholarshipDoc.exists()) {
          throw new Error('Scholarship not found')
        }
        
        const scholarship = scholarshipDoc.data() as ScholarshipOpportunity
        
        // Check availability
        if (scholarship.availableSlots <= 0) {
          throw new Error('No slots available')
        }
        
        // Check student's wallet
        const walletRef = doc(db, 'edu_coin_wallets', studentId)
        const walletDoc = await transaction.get(walletRef)
        
        if (!walletDoc.exists()) {
          throw new Error('Student wallet not found')
        }
        
        const wallet = walletDoc.data() as StudentEduCoinWallet
        
        if (wallet.currentBalance < scholarship.costInCoins) {
          throw new Error('Insufficient EduCoins')
        }
        
        // Create application
        const application: Omit<ScholarshipApplication, 'id'> = {
          scholarshipId,
          studentId,
          coinsSpent: scholarship.costInCoins,
          status: 'pending',
          applicationData,
          submittedAt: new Date()
        }
        
        const applicationRef = await addDoc(collection(db, 'scholarship_applications'), application)
        
        // Deduct coins from wallet
        transaction.update(walletRef, {
          totalSpent: increment(scholarship.costInCoins),
          currentBalance: increment(-scholarship.costInCoins),
          lastUpdated: serverTimestamp()
        })
        
        // Update scholarship slot count
        transaction.update(scholarshipRef, {
          availableSlots: increment(-1),
          'trackingData.applicants': increment(1)
        })
        
        return applicationRef.id
      })
    } catch (error) {
      console.error('Error applying for scholarship:', error)
      throw error
    }
  }

  // Get community projects
  async getCommunityProjects(district?: string, state?: string): Promise<CommunityProject[]> {
    try {
      let q = query(
        collection(db, 'community_projects'),
        where('status', 'in', ['active', 'funded']),
        orderBy('currentCoins', 'desc')
      )
      
      const snapshot = await getDocs(q)
      let projects = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as CommunityProject))
      
      // Filter by location if specified
      if (district) {
        projects = projects.filter(p => p.school.district === district)
      }
      
      if (state) {
        projects = projects.filter(p => p.school.state === state)
      }
      
      return projects
    } catch (error) {
      console.error('Error fetching community projects:', error)
      return []
    }
  }

  // Contribute to community project
  async contributeToProject(
    projectId: string,
    studentId: string,
    studentName: string,
    coinAmount: number
  ): Promise<void> {
    try {
      await runTransaction(db, async (transaction) => {
        // Check student's wallet
        const walletRef = doc(db, 'edu_coin_wallets', studentId)
        const walletDoc = await transaction.get(walletRef)
        
        if (!walletDoc.exists()) {
          throw new Error('Student wallet not found')
        }
        
        const wallet = walletDoc.data() as StudentEduCoinWallet
        
        if (wallet.currentBalance < coinAmount) {
          throw new Error('Insufficient EduCoins')
        }
        
        // Update project
        const projectRef = doc(db, 'community_projects', projectId)
        const projectDoc = await transaction.get(projectRef)
        
        if (!projectDoc.exists()) {
          throw new Error('Project not found')
        }
        
        const project = projectDoc.data() as CommunityProject
        
        // Add contribution
        const newContributor = {
          studentId,
          studentName,
          coinsContributed: coinAmount,
          contributedAt: new Date()
        }
        
        transaction.update(projectRef, {
          currentCoins: increment(coinAmount),
          contributors: [...project.contributors, newContributor]
        })
        
        // Deduct coins from wallet
        transaction.update(walletRef, {
          totalSpent: increment(coinAmount),
          currentBalance: increment(-coinAmount),
          'statistics.communityContributions': increment(1),
          lastUpdated: serverTimestamp()
        })
      })
    } catch (error) {
      console.error('Error contributing to project:', error)
      throw error
    }
  }

  // Create government scholarship opportunity
  async createGovernmentScholarship(
    scholarship: Omit<ScholarshipOpportunity, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const scholarshipData = {
        ...scholarship,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const docRef = await addDoc(collection(db, 'scholarship_opportunities'), scholarshipData)
      return docRef.id
    } catch (error) {
      console.error('Error creating scholarship:', error)
      throw error
    }
  }

  // Get scholarship leaderboard (top contributors)
  async getScholarshipLeaderboard(limit_count: number = 20): Promise<Array<{
    studentId: string
    studentName: string
    totalContributed: number
    scholarshipsWon: number
    communityProjects: number
  }>> {
    try {
      // This would require aggregation - simplified version
      const walletsQuery = query(
        collection(db, 'edu_coin_wallets'),
        orderBy('totalSpent', 'desc'),
        limit(limit_count)
      )
      
      const snapshot = await getDocs(walletsQuery)
      return snapshot.docs.map(doc => {
        const wallet = doc.data() as StudentEduCoinWallet
        return {
          studentId: wallet.studentId,
          studentName: 'Student', // Would get from user profile
          totalContributed: wallet.totalSpent,
          scholarshipsWon: wallet.statistics.scholarshipsWon,
          communityProjects: wallet.statistics.communityContributions
        }
      })
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }
  }
}

export const eduCoinService = new EduCoinService()