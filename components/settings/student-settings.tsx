"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { useSettings } from "@/hooks/use-settings"
import { Settings, Bell, Volume2, Shield, Zap, Loader2 } from "lucide-react"

interface SettingsState {
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

export function StudentSettings() {
  const { toast } = useToast()
  const { user } = useAuth()
  const {
    settings,
    isLoading,
    updateSetting,
    resetToDefaults: resetSettings,
    playSound
  } = useSettings()
  const [isSaving, setIsSaving] = useState(false)

  // Handle individual setting updates with sound feedback
  const handleUpdateSetting = async <K extends keyof SettingsState>(
    key: K, 
    value: SettingsState[K]
  ) => {
    try {
      await updateSetting(key, value)
      playSound('click')
    } catch (error) {
      console.error('Error updating setting:', error)
      toast({
        title: "Error",
        description: "Failed to update setting. Please try again.",
        variant: "destructive",
      })
    }
  }

  const saveSettings = async () => {
    try {
      setIsSaving(true)
      playSound('success')
      toast({
        title: "Settings Saved! ✅",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      playSound('error')
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const resetToDefaults = async () => {
    try {
      setIsSaving(true)
      await resetSettings()
      playSound('success')
      toast({
        title: "Settings Reset",
        description: "All settings have been reset to default values.",
      })
    } catch (error) {
      console.error('Error resetting settings:', error)
      playSound('error')
      toast({
        title: "Error",
        description: "Failed to reset settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={resetToDefaults}
            disabled={isSaving}
          >
            Reset to Defaults
          </Button>
          <Button 
            onClick={saveSettings}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="audio">
            <Volume2 className="mr-2 h-4 w-4" />
            Audio
          </TabsTrigger>
          <TabsTrigger value="learning">
            <Zap className="mr-2 h-4 w-4" />
            Learning
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="mr-2 h-4 w-4" />
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications on this device
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleUpdateSetting("pushNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleUpdateSetting("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="achievement-alerts">Achievement Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you earn achievements
                    </p>
                  </div>
                  <Switch
                    id="achievement-alerts"
                    checked={settings.achievementAlerts}
                    onCheckedChange={(checked) => handleUpdateSetting("achievementAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="daily-reminders">Daily Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive daily study reminders
                    </p>
                  </div>
                  <Switch
                    id="daily-reminders"
                    checked={settings.dailyReminders}
                    onCheckedChange={(checked) => handleUpdateSetting("dailyReminders", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Audio Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Current Audio Settings</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Sound Effects: </span>
                    <span className={settings.soundEffects ? 'text-green-600' : 'text-red-600'}>
                      {settings.soundEffects ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Background Music: </span>
                    <span className={settings.backgroundMusic ? 'text-green-600' : 'text-red-600'}>
                      {settings.backgroundMusic ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Volume Level: </span>
                    <span className="font-medium">{settings.volume}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Auto-save: </span>
                    <span className="text-green-600">Active</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sound-effects">Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable sound effects in the application
                    </p>
                  </div>
                  <Switch
                    id="sound-effects"
                    checked={settings.soundEffects}
                    onCheckedChange={(checked) => handleUpdateSetting("soundEffects", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="background-music">Background Music</Label>
                    <p className="text-sm text-muted-foreground">
                      Play background music during study sessions
                    </p>
                  </div>
                  <Switch
                    id="background-music"
                    checked={settings.backgroundMusic}
                    onCheckedChange={(checked) => handleUpdateSetting("backgroundMusic", checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="volume">Volume: {settings.volume}%</Label>
                  <Slider
                    id="volume"
                    min={0}
                    max={100}
                    step={1}
                    value={[settings.volume]}
                    onValueChange={(value) => handleUpdateSetting("volume", value[0])}
                    className="mt-4"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Learning Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="language">Language</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => handleUpdateSetting("language", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi (हिंदी)</SelectItem>
                    <SelectItem value="odia">Odia (ଓଡ଼ିଆ)</SelectItem>
                    <SelectItem value="bengali">Bengali (বাংলা)</SelectItem>
                    <SelectItem value="telugu">Telugu (తెలుగు)</SelectItem>
                    <SelectItem value="tamil">Tamil (தமிழ்)</SelectItem>
                    <SelectItem value="gujarati">Gujarati (ગુજરાતી)</SelectItem>
                    <SelectItem value="marathi">Marathi (मराठी)</SelectItem>
                    <SelectItem value="kannada">Kannada (ಕನ್ನಡ)</SelectItem>
                    <SelectItem value="malayalam">Malayalam (മലയാളം)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select
                  value={settings.difficultyLevel}
                  onValueChange={(value: "easy" | "medium" | "hard") =>
                    handleUpdateSetting("difficultyLevel", value)
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="study-reminders">Study Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminders to take breaks during study sessions
                  </p>
                </div>
                <Switch
                  id="study-reminders"
                  checked={settings.studyReminders}
                  onCheckedChange={(checked) => handleUpdateSetting("studyReminders", checked)}
                />
              </div>

              <div>
                <Label htmlFor="pomodoro-length">Pomodoro Timer: {settings.pomodoroLength} minutes</Label>
                <Slider
                  id="pomodoro-length"
                  min={15}
                  max={60}
                  step={5}
                  value={[settings.pomodoroLength]}
                  onValueChange={(value) => handleUpdateSetting("pomodoroLength", value[0])}
                  className="mt-4"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="profile-visibility">Profile Visibility</Label>
                <Select
                  value={settings.profileVisibility}
                  onValueChange={(value: "public" | "friends" | "private") =>
                    handleUpdateSetting("profileVisibility", value)
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="share-progress">Share Progress</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow others to see your learning progress
                    </p>
                  </div>
                  <Switch
                    id="share-progress"
                    checked={settings.shareProgress}
                    onCheckedChange={(checked) => handleUpdateSetting("shareProgress", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-collection">Data Collection</Label>
                    <p className="text-sm text-muted-foreground">
                      Help improve the app by sharing usage data
                    </p>
                  </div>
                  <Switch
                    id="data-collection"
                    checked={settings.dataCollection}
                    onCheckedChange={(checked) => handleUpdateSetting("dataCollection", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}