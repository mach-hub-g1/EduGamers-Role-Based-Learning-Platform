import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  orderBy,
  limit,
  increment,
  arrayUnion,
  serverTimestamp,
  where,
} from "firebase/firestore"
import { db } from "./firebase"

export interface UserProgress {
  userId: string
  xp: number
  level: number
  streak: number
  lastLoginDate: string
  totalLessonsCompleted: number
  totalQuizzesCompleted: number
  achievements: string[]
  subjects: {
    [key: string]: {
      progress: number
      xp: number
      lessonsCompleted: number
    }
  }
  dailyChallenges: {
    date: string
    completed: string[]
    xpEarned: number
  }[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  xpReward: number
  unlockedAt?: Date
}

export interface QuizResult {
  userId: string
  quizId: string
  subject: string
  score: number
  totalQuestions: number
  timeSpent: number
  xpEarned: number
  completedAt: Date
}

// User Progress Services
export const createUserProgress = async (userId: string, initialData: Partial<UserProgress>) => {
  const userProgressRef = doc(db, "userProgress", userId)
  const defaultProgress: UserProgress = {
    userId,
    xp: 0,
    level: 1,
    streak: 0,
    lastLoginDate: new Date().toISOString().split("T")[0],
    totalLessonsCompleted: 0,
    totalQuizzesCompleted: 0,
    achievements: [],
    subjects: {
      mathematics: { progress: 0, xp: 0, lessonsCompleted: 0 },
      science: { progress: 0, xp: 0, lessonsCompleted: 0 },
      english: { progress: 0, xp: 0, lessonsCompleted: 0 },
      history: { progress: 0, xp: 0, lessonsCompleted: 0 },
    },
    dailyChallenges: [],
    ...initialData,
  }

  await setDoc(userProgressRef, defaultProgress)
  return defaultProgress
}

export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  const userProgressRef = doc(db, "userProgress", userId)
  const docSnap = await getDoc(userProgressRef)

  if (docSnap.exists()) {
    return docSnap.data() as UserProgress
  }
  return null
}

export const subscribeToUserProgress = (userId: string, callback: (progress: UserProgress | null) => void) => {
  const userProgressRef = doc(db, "userProgress", userId)
  return onSnapshot(userProgressRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as UserProgress)
    } else {
      callback(null)
    }
  })
}

export const updateUserXP = async (userId: string, xpGained: number) => {
  const userProgressRef = doc(db, "userProgress", userId)
  await updateDoc(userProgressRef, {
    xp: increment(xpGained),
    level: increment(Math.floor(xpGained / 100)), // Level up every 100 XP
  })
}

export const completeLesson = async (userId: string, subject: string, xpGained: number) => {
  const userProgressRef = doc(db, "userProgress", userId)
  await updateDoc(userProgressRef, {
    [`subjects.${subject}.progress`]: increment(10),
    [`subjects.${subject}.xp`]: increment(xpGained),
    [`subjects.${subject}.lessonsCompleted`]: increment(1),
    totalLessonsCompleted: increment(1),
    xp: increment(xpGained),
  })
}

export const completeQuiz = async (userId: string, quizResult: Omit<QuizResult, "userId">) => {
  // Save quiz result
  const quizResultRef = doc(collection(db, "quizResults"))
  await setDoc(quizResultRef, {
    ...quizResult,
    userId,
    completedAt: serverTimestamp(),
  })

  // Update user progress
  const userProgressRef = doc(db, "userProgress", userId)
  await updateDoc(userProgressRef, {
    [`subjects.${quizResult.subject}.xp`]: increment(quizResult.xpEarned),
    totalQuizzesCompleted: increment(1),
    xp: increment(quizResult.xpEarned),
  })
}

export const updateStreak = async (userId: string) => {
  const today = new Date().toISOString().split("T")[0]
  const userProgressRef = doc(db, "userProgress", userId)
  const userProgress = await getUserProgress(userId)

  if (userProgress) {
    const lastLogin = userProgress.lastLoginDate
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

    let newStreak = userProgress.streak
    if (lastLogin === yesterday) {
      newStreak += 1
    } else if (lastLogin !== today) {
      newStreak = 1
    }

    await updateDoc(userProgressRef, {
      streak: newStreak,
      lastLoginDate: today,
    })
  }
}

export const unlockAchievement = async (userId: string, achievementId: string) => {
  const userProgressRef = doc(db, "userProgress", userId)
  await updateDoc(userProgressRef, {
    achievements: arrayUnion(achievementId),
  })
}

// Leaderboard Services
export const getLeaderboard = (callback: (users: any[]) => void) => {
  const q = query(collection(db, "userProgress"), orderBy("xp", "desc"), limit(10))

  return onSnapshot(q, (querySnapshot) => {
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(users)
  })
}

// Class/School Analytics
export const getClassAnalytics = async (classId: string) => {
  const q = query(collection(db, "userProgress"), where("classId", "==", classId))

  return onSnapshot(q, (querySnapshot) => {
    const students = querySnapshot.docs.map((doc) => doc.data())
    return {
      totalStudents: students.length,
      averageXP: students.reduce((sum, student) => sum + student.xp, 0) / students.length,
      totalLessonsCompleted: students.reduce((sum, student) => sum + student.totalLessonsCompleted, 0),
      activeStreaks: students.filter((student) => student.streak > 0).length,
    }
  })
}
