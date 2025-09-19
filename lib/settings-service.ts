import { userService } from "./user-service"

export interface AppSettings {
  // Notifications
  pushNotifications: boolean
  emailNotifications: boolean
  achievementAlerts: boolean
  dailyReminders: boolean

  // Audio
  soundEffects: boolean
  backgroundMusic: boolean
  volume: number

  // Learning
  language: string
  difficultyLevel: "easy" | "medium" | "hard"
  studyReminders: boolean
  pomodoroLength: number

  // Privacy
  profileVisibility: "public" | "friends" | "private"
  shareProgress: boolean
  dataCollection: boolean
}

export const defaultSettings: AppSettings = {
  pushNotifications: true,
  emailNotifications: false,
  achievementAlerts: true,
  dailyReminders: true,
  soundEffects: true,
  backgroundMusic: false,
  volume: 70,
  language: "english",
  difficultyLevel: "medium",
  studyReminders: true,
  pomodoroLength: 25,
  profileVisibility: "friends",
  shareProgress: true,
  dataCollection: true,
}

class SettingsService {
  private static instance: SettingsService
  private currentSettings: AppSettings = defaultSettings
  private listeners: Array<(settings: AppSettings) => void> = []

  static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService()
    }
    return SettingsService.instance
  }

  // Subscribe to settings changes
  subscribe(callback: (settings: AppSettings) => void): () => void {
    this.listeners.push(callback)
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  // Notify all listeners of settings changes
  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.currentSettings))
  }

  // Get current settings
  getSettings(): AppSettings {
    return { ...this.currentSettings }
  }

  // Update settings
  updateSettings(newSettings: Partial<AppSettings>): void {
    this.currentSettings = { ...this.currentSettings, ...newSettings }
    this.notifyListeners()
    
    // Apply settings to DOM/browser
    this.applySettings()
  }

  // Load settings from user profile
  async loadUserSettings(userId: string): Promise<AppSettings> {
    try {
      const userProfile = await userService.getUserProfile(userId)
      if (userProfile.settings) {
        this.currentSettings = { ...defaultSettings, ...userProfile.settings }
        this.applySettings()
        this.notifyListeners()
      }
      return this.currentSettings
    } catch (error) {
      console.error('Error loading user settings:', error)
      return this.currentSettings
    }
  }

  // Save settings to user profile
  async saveUserSettings(userId: string, settings: Partial<AppSettings>): Promise<void> {
    try {
      const userProfile = await userService.getUserProfile(userId)
      const updatedProfile = {
        ...userProfile,
        settings: { ...this.currentSettings, ...settings }
      }
      
      await userService.saveUserProfile(userId, updatedProfile)
      this.updateSettings(settings)
    } catch (error) {
      console.error('Error saving user settings:', error)
      throw error
    }
  }

  // Apply settings to the browser/DOM
  private applySettings(): void {
    if (typeof window === 'undefined') return

    try {
      // Apply volume to all audio/video elements
      const mediaElements = document.querySelectorAll('audio, video')
      mediaElements.forEach((element: any) => {
        if (element.volume !== undefined) {
          element.volume = this.currentSettings.volume / 100
        }
      })

      // Store in localStorage for quick access
      localStorage.setItem('appSettings', JSON.stringify(this.currentSettings))

      // Apply to document attributes for CSS/JS access
      document.body.setAttribute('data-sound-effects', this.currentSettings.soundEffects.toString())
      document.body.setAttribute('data-background-music', this.currentSettings.backgroundMusic.toString())
      document.body.setAttribute('data-difficulty', this.currentSettings.difficultyLevel)
      document.body.setAttribute('data-language', this.currentSettings.language)

      // Apply language to HTML element
      document.documentElement.lang = this.getLanguageCode(this.currentSettings.language)

      console.log('Settings applied to DOM:', this.currentSettings)
    } catch (error) {
      console.error('Error applying settings:', error)
    }
  }

  // Convert language name to language code
  private getLanguageCode(language: string): string {
    const languageMap: Record<string, string> = {
      'english': 'en',
      'hindi': 'hi',
      'odia': 'or',
      'bengali': 'bn',
      'telugu': 'te',
      'tamil': 'ta',
      'gujarati': 'gu',
      'marathi': 'mr',
      'kannada': 'kn',
      'malayalam': 'ml'
    }
    return languageMap[language] || 'en'
  }

  // Play sound effect if enabled
  playSound(soundType: 'click' | 'success' | 'error' | 'notification'): void {
    if (!this.currentSettings.soundEffects) return

    try {
      const audio = new Audio()
      const soundFiles = {
        click: '/sounds/click.mp3',
        success: '/sounds/success.mp3',
        error: '/sounds/error.mp3',
        notification: '/sounds/notification.mp3'
      }
      
      audio.src = soundFiles[soundType] || soundFiles.click
      audio.volume = this.currentSettings.volume / 100
      audio.play().catch(error => {
        console.log('Could not play sound:', error)
      })
    } catch (error) {
      console.log('Sound playback not available:', error)
    }
  }

  // Check if feature is enabled
  isFeatureEnabled(feature: keyof AppSettings): boolean {
    return Boolean(this.currentSettings[feature])
  }

  // Get setting value
  getSetting<K extends keyof AppSettings>(key: K): AppSettings[K] {
    return this.currentSettings[key]
  }
}

export const settingsService = SettingsService.getInstance()