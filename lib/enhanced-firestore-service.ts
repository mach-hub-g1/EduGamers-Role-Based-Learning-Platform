import { db } from "./firebase"
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  arrayUnion,
  type Timestamp,
} from "firebase/firestore"
import { fcmService } from "./fcm-service"

export interface UserProgress {
  userId: string
  xp: number
  level: number
  streak: number
  lastActive: Timestamp
  subjects: Record<string, number>
  achievements: string[]
  dailyChallenges: {
    date: string
    completed: string[]
    total: number
  }
  notifications: {
    id: string
    title: string
    message: string
    type: "achievement" | "challenge" | "reminder"
    read: boolean
    timestamp: Timestamp
  }[]
}

export class EnhancedFirestoreService {
  private static instance: EnhancedFirestoreService

  static getInstance(): EnhancedFirestoreService {
    if (!EnhancedFirestoreService.instance) {
      EnhancedFirestoreService.instance = new EnhancedFirestoreService()
    }
    return EnhancedFirestoreService.instance
  }

  // Real-time user progress subscription
  subscribeToUserProgress(userId: string, callback: (progress: UserProgress | null) => void) {
    const userRef = doc(db, "userProgress", userId)

    return onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data() as UserProgress)
      } else {
        // Create initial user progress
        this.createInitialProgress(userId)
        callback(null)
      }
    })
  }

  // Create initial user progress
  async createInitialProgress(userId: string): Promise<void> {
    const initialProgress: UserProgress = {
      userId,
      xp: 0,
      level: 1,
      streak: 0,
      lastActive: serverTimestamp() as Timestamp,
      subjects: {
        math: 0,
        science: 0,
        english: 0,
        history: 0,
      },
      achievements: [],
      dailyChallenges: {
        date: new Date().toDateString(),
        completed: [],
        total: 3,
      },
      notifications: [],
    }

    await setDoc(doc(db, "userProgress", userId), initialProgress)
  }

  // Update XP and check for level up
  async updateXP(userId: string, xpGain: number): Promise<void> {
    const userRef = doc(db, "userProgress", userId)

    await updateDoc(userRef, {
      xp: increment(xpGain),
      lastActive: serverTimestamp(),
    })

    // Check for level up and send notification
    const userDoc = await getDoc(userRef)
    if (userDoc.exists()) {
      const data = userDoc.data() as UserProgress
      const newLevel = Math.floor(data.xp / 1000) + 1

      if (newLevel > data.level) {
        await updateDoc(userRef, { level: newLevel })

        // Send level up notification
        await this.addNotification(userId, {
          title: "🎉 Level Up!",
          message: `Congratulations! You've reached level ${newLevel}!`,
          type: "achievement",
        })

        fcmService.sendNotification("🎉 Level Up!", `Congratulations! You've reached level ${newLevel}!`)
      }
    }
  }

  // Complete daily challenge
  async completeDailyChallenge(userId: string, challengeId: string): Promise<void> {
    const userRef = doc(db, "userProgress", userId)
    const today = new Date().toDateString()

    await updateDoc(userRef, {
      [`dailyChallenges.completed`]: arrayUnion(challengeId),
      [`dailyChallenges.date`]: today,
      lastActive: serverTimestamp(),
    })

    // Award XP for challenge completion
    await this.updateXP(userId, 50)

    // Send completion notification
    await this.addNotification(userId, {
      title: "✅ Challenge Complete!",
      message: "Great job! You earned 50 XP for completing a daily challenge.",
      type: "challenge",
    })
  }

  // Add achievement
  async addAchievement(userId: string, achievementId: string): Promise<void> {
    const userRef = doc(db, "userProgress", userId)

    await updateDoc(userRef, {
      achievements: arrayUnion(achievementId),
      lastActive: serverTimestamp(),
    })

    // Send achievement notification
    await this.addNotification(userId, {
      title: "🏆 New Achievement!",
      message: `You've unlocked the "${achievementId}" achievement!`,
      type: "achievement",
    })

    fcmService.sendNotification("🏆 New Achievement!", `You've unlocked the "${achievementId}" achievement!`)
  }

  // Add notification
  async addNotification(
    userId: string,
    notification: Omit<UserProgress["notifications"][0], "id" | "read" | "timestamp">,
  ): Promise<void> {
    const userRef = doc(db, "userProgress", userId)
    const newNotification = {
      id: Date.now().toString(),
      ...notification,
      read: false,
      timestamp: serverTimestamp() as Timestamp,
    }

    await updateDoc(userRef, {
      notifications: arrayUnion(newNotification),
    })
  }

  // Update subject progress
  async updateSubjectProgress(userId: string, subject: string, progress: number): Promise<void> {
    const userRef = doc(db, "userProgress", userId)

    await updateDoc(userRef, {
      [`subjects.${subject}`]: progress,
      lastActive: serverTimestamp(),
    })
  }

  // Get leaderboard
  async getLeaderboard(limit_count = 10) {
    const q = query(collection(db, "userProgress"), orderBy("xp", "desc"), limit(limit_count))

    return onSnapshot(q, (snapshot) => {
      const leaderboard = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      return leaderboard
    })
  }
}

export const enhancedFirestoreService = EnhancedFirestoreService.getInstance()
