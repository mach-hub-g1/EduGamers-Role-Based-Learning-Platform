"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { updateProfile } from "firebase/auth"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useFirestoreProgress } from "@/hooks/use-firestore-progress"
import { userService, UserProfile } from "@/lib/user-service"
import { Edit, Loader2, Camera, User, BookOpen, Target, Trophy, Zap } from "lucide-react"

export function StudentProfile() {
  const { user } = useAuth()
  const { progress } = useFirestoreProgress(user?.uid)
  const { toast } = useToast()
  const storage = getStorage()
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    dateOfBirth: "",
    grade: "",
    school: "",
    address: "",
    bio: "",
    avatar: user?.photoURL || "/placeholder.svg",
    interests: [],
    favoriteSubjects: [],
  })

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.uid) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive',
      })
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 2MB',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsSaving(true)
      
      // Upload to Firebase Storage
      const fileExt = file.name.split('.').pop()
      const storageRef = ref(storage, `profilePictures/${user.uid}/avatar.${fileExt}`)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)

      // Update profile with new avatar URL
      await userService.saveUserProfile(user.uid, { avatar: downloadURL })
      
      // Update auth profile
      await updateProfile(user, { photoURL: downloadURL })
      
      // Update local state
      setProfile(prev => ({ ...prev, avatar: downloadURL }))
      
      toast({
        title: 'Success',
        description: 'Profile picture updated successfully!',
      })
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile picture. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSave = async () => {
    if (!user?.uid) return
    
    try {
      setIsSaving(true)
      await userService.saveUserProfile(user.uid, profile)
      await updateProfile(user, { displayName: profile.name })
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      })
      
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Load user profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return
      
      try {
        const userProfile = await userService.getUserProfile(user.uid)
        if (userProfile) {
          setProfile(prev => ({
            ...prev,
            ...userProfile,
            name: userProfile.name || user.displayName || '',
            email: user.email || userProfile.email || '',
            avatar: user.photoURL || userProfile.avatar || '/placeholder.svg'
          }))
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        toast({
          title: 'Error',
          description: 'Failed to load profile data.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadProfile()
  }, [user?.uid])

  const stats = [
    { label: "XP Earned", value: progress?.xp || 0, icon: Zap, color: "text-yellow-500" },
    { label: "Level", value: progress?.level || 1, icon: Trophy, color: "text-blue-500" },
    { label: "Lessons Completed", value: progress?.totalLessonsCompleted || 0, icon: BookOpen, color: "text-green-500" },
    { label: "Current Streak", value: progress?.streak || 0, icon: Target, color: "text-red-500" },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <Card className="border-0 shadow-sm sm:border sm:shadow">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                  <AvatarImage 
                    src={profile.avatar} 
                    alt={profile.name || 'User'}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-xl bg-primary/10">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label 
                    htmlFor="avatar-upload"
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="h-6 w-6 text-white" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={isSaving}
                    />
                  </label>
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold">{profile.name || 'Student'}</h1>
                <p className="text-sm text-muted-foreground">{profile.grade || 'Grade not set'}</p>
                <p className="text-xs text-muted-foreground">{profile.school || 'School not set'}</p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    size="sm"
                    className="gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  size="sm"
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={profile.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {profile.name || 'Not specified'}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  {profile.email || 'No email provided'}
                </p>
              </div>
              
              <div>
                <Label htmlFor="grade" className="text-sm font-medium">Grade/Class</Label>
                {isEditing ? (
                  <select
                    id="grade"
                    value={profile.grade || ''}
                    onChange={(e) => handleInputChange('grade', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Select grade</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={`Grade ${i + 1}`}>
                        Grade {i + 1}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {profile.grade || 'Not specified'}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="school" className="text-sm font-medium">School</Label>
                {isEditing ? (
                  <Input
                    id="school"
                    value={profile.school || ''}
                    onChange={(e) => handleInputChange('school', e.target.value)}
                    placeholder="Enter your school name"
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {profile.school || 'Not specified'}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {profile.phone || 'Not specified'}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="bio" className="text-sm font-medium">About Me</Label>
                {isEditing ? (
                  <textarea
                    id="bio"
                    value={profile.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
                    {profile.bio || 'No information provided'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats Section */}
      <Card className="border-0 shadow-sm sm:border sm:shadow">
        <CardHeader>
          <CardTitle className="text-lg">Your Learning Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center p-4 bg-muted/10 rounded-lg">
                <stat.icon className={`h-6 w-6 mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground text-center">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
