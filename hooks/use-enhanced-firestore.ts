"use client"

import { useState, useEffect } from "react"
import { enhancedFirestoreService, type UserProgress } from "@/lib/enhanced-firestore-service"
import { fcmService } from "@/lib/fcm-service"

export function useEnhancedFirestore(userId = "demo-student-123") {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<UserProgress["notifications"]>([])

  useEffect(() => {
    // Initialize FCM
    fcmService.requestPermission()

    // Setup FCM message listener
    fcmService.setupMessageListener((payload) => {
      console.log("[v0] FCM Message received in hook:", payload)
      // Handle incoming messages
    })

    // Subscribe to user progress
    const unsubscribe = enhancedFirestoreService.subscribeToUserProgress(userId, (userProgress) => {
      setProgress(userProgress)
      if (userProgress) {
        setNotifications(userProgress.notifications || [])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userId])

  const updateXP = async (xpGain: number) => {
    await enhancedFirestoreService.updateXP(userId, xpGain)
  }

  const completeDailyChallenge = async (challengeId: string) => {
    await enhancedFirestoreService.completeDailyChallenge(userId, challengeId)
  }

  const addAchievement = async (achievementId: string) => {
    await enhancedFirestoreService.addAchievement(userId, achievementId)
  }

  const updateSubjectProgress = async (subject: string, progressValue: number) => {
    await enhancedFirestoreService.updateSubjectProgress(userId, subject, progressValue)
  }

  return {
    progress,
    loading,
    notifications,
    updateXP,
    completeDailyChallenge,
    addAchievement,
    updateSubjectProgress,
  }
}
