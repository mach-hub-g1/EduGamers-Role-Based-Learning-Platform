"use client"

import { useState, useEffect } from "react"
import {
  getUserProgress,
  subscribeToUserProgress,
  createUserProgress,
  updateUserXP,
  completeLesson,
  completeQuiz,
  updateStreak,
  unlockAchievement,
  type UserProgress,
} from "@/lib/firestore-services"

export const useFirestoreProgress = (userId?: string) => {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) {
      console.log('useFirestoreProgress: No user ID provided')
      setLoading(false)
      return
    }

    console.log(`useFirestoreProgress: Initializing for user ${userId}`)
    
    let isMounted = true
    let unsubscribe = () => {}

    const initializeProgress = async () => {
      try {
        console.log('useFirestoreProgress: Fetching user progress...')
        setLoading(true)
        setError(null)
        
        const [userProgress] = await Promise.all([
          getUserProgress(userId),
          // Small delay to prevent flash of loading state
          new Promise(resolve => setTimeout(resolve, 300))
        ])

        if (!isMounted) return

        if (!userProgress) {
          console.log('useFirestoreProgress: No progress found, creating new...')
          const newProgress = await createUserProgress(userId, {})
          if (isMounted) {
            setProgress(newProgress)
          }
        } else {
          console.log('useFirestoreProgress: Found existing progress:', userProgress)
          if (isMounted) {
            setProgress(userProgress)
          }
        }

        // Update streak on login
        console.log('useFirestoreProgress: Updating login streak...')
        await updateStreak(userId)
        
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        console.error("useFirestoreProgress: Error initializing user progress:", error)
        if (isMounted) {
          setError(error)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    initializeProgress().catch((error: unknown) => {
      console.error('useFirestoreProgress: Unhandled error in initializeProgress:', error)
      if (isMounted) {
        setError(error instanceof Error ? error : new Error(String(error)))
        setLoading(false)
      }
    })

    // Set up real-time subscription
    try {
      console.log('useFirestoreProgress: Setting up real-time subscription...')
      unsubscribe = subscribeToUserProgress(userId, (updatedProgress) => {
        console.log('useFirestoreProgress: Received real-time update:', updatedProgress)
        if (isMounted) {
          setProgress(updatedProgress)
          setLoading(false)
        }
      })
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Subscription error')
      console.error('useFirestoreProgress: Error setting up subscription:', error)
      if (isMounted) {
        setError(error)
      }
    }

    return () => {
      console.log('useFirestoreProgress: Cleaning up...')
      isMounted = false
      try {
        unsubscribe()
      } catch (err) {
        console.error('Error unsubscribing:', err)
      }
    }
  }, [userId])

  const addXP = async (amount: number) => {
    if (!userId) return
    await updateUserXP(userId, amount)
  }

  const finishLesson = async (subject: string, xp: number) => {
    if (!userId) return
    await completeLesson(userId, subject, xp)
  }

  const finishQuiz = async (quizData: any) => {
    if (!userId) return
    await completeQuiz(userId, quizData)
  }

  const earnAchievement = async (achievementId: string) => {
    if (!userId) return
    await unlockAchievement(userId, achievementId)
  }

  // Log state changes
  useEffect(() => {
    console.log('useFirestoreProgress: State updated', { 
      hasProgress: !!progress, 
      loading, 
      error: error?.message 
    })
  }, [progress, loading, error])

  return {
    progress,
    loading,
    error,
    addXP,
    finishLesson,
    finishQuiz,
    earnAchievement,
  }
}
