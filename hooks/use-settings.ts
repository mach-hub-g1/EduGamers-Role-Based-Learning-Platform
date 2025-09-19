"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { settingsService, AppSettings, defaultSettings } from "@/lib/settings-service"

export function useSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user settings when user changes
    const loadSettings = async () => {
      if (user?.uid) {
        try {
          setIsLoading(true)
          const userSettings = await settingsService.loadUserSettings(user.uid)
          setSettings(userSettings)
        } catch (error) {
          console.error('Error loading settings:', error)
        } finally {
          setIsLoading(false)
        }
      } else {
        // Load from localStorage for anonymous users
        try {
          const stored = localStorage.getItem('appSettings')
          if (stored) {
            const parsedSettings = JSON.parse(stored)
            setSettings({ ...defaultSettings, ...parsedSettings })
          }
        } catch (error) {
          console.error('Error loading stored settings:', error)
        }
        setIsLoading(false)
      }
    }

    loadSettings()

    // Subscribe to settings changes
    const unsubscribe = settingsService.subscribe((newSettings) => {
      setSettings(newSettings)
    })

    return unsubscribe
  }, [user?.uid])

  const updateSetting = async <K extends keyof AppSettings>(
    key: K, 
    value: AppSettings[K]
  ): Promise<void> => {
    try {
      const updates = { [key]: value } as Partial<AppSettings>
      
      if (user?.uid) {
        await settingsService.saveUserSettings(user.uid, updates)
      } else {
        // For anonymous users, just update locally
        settingsService.updateSettings(updates)
      }
    } catch (error) {
      console.error('Error updating setting:', error)
      throw error
    }
  }

  const resetToDefaults = async (): Promise<void> => {
    try {
      if (user?.uid) {
        await settingsService.saveUserSettings(user.uid, defaultSettings)
      } else {
        settingsService.updateSettings(defaultSettings)
      }
    } catch (error) {
      console.error('Error resetting settings:', error)
      throw error
    }
  }

  const playSound = (soundType: 'click' | 'success' | 'error' | 'notification') => {
    settingsService.playSound(soundType)
  }

  const isFeatureEnabled = (feature: keyof AppSettings): boolean => {
    return settingsService.isFeatureEnabled(feature)
  }

  return {
    settings,
    isLoading,
    updateSetting,
    resetToDefaults,
    playSound,
    isFeatureEnabled,
    // Helper getters
    soundEffectsEnabled: settings.soundEffects,
    backgroundMusicEnabled: settings.backgroundMusic,
    volume: settings.volume,
    language: settings.language,
    difficultyLevel: settings.difficultyLevel,
    pomodoroLength: settings.pomodoroLength,
  }
}