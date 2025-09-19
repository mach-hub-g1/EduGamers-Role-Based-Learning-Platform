"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { updateProfile, updateEmail } from "firebase/auth"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
// Custom progress bar component
const Progress = ({ value, className = "" }: { value: number; className?: string }) => (
  <div className={`bg-muted rounded-full h-2 w-full overflow-hidden ${className}`}>
    <div 
      className="bg-primary h-full rounded-full transition-all duration-300" 
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
)
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useFirestoreProgress } from "@/hooks/use-firestore-progress"
import { userService, UserProfile } from "@/lib/user-service"
import { profileStorageService } from "@/lib/profile-storage"
import {
  User,
  Edit,
  Save,
  Trophy,
  Target,
  BookOpen,
  Calendar,
  MapPin,
  Phone,
  Mail,
  School,
  Award,
  Zap,
  Camera,
  Loader2,
  Upload,
  Check,
  Star,
  TrendingUp,
  Clock,
  Building2,
  BarChart3,
} from "lucide-react"

// Validation rules with better typing
interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  validate?: (value: string) => boolean
  message: string
}

const validationRules: Record<string, ValidationRule> = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/,
    message: 'Name should be 2-50 characters long and contain only letters, spaces, hyphens, and apostrophes'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  phone: {
    required: false,
    pattern: /^[0-9\-\+\(\)\s]{0,20}$/,
    message: 'Please enter a valid phone number'
  },
  dateOfBirth: {
    required: false,
    validate: (value: string) => {
      if (!value) return true;
      const date = new Date(value);
      const now = new Date();
      const minAge = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
      const maxAge = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
      return date >= minAge && date <= maxAge;
    },
    message: 'Please enter a valid date of birth (age 5-100)'
  },
  bio: {
    maxLength: 500,
    message: 'Bio should be less than 500 characters'
  }
};

// Helper function to validate a field
const validateField = (field: string, value: any): string | null => {
  const rule = validationRules[field];
  if (!rule) return null;
  
  if (rule.required && !value) return 'This field is required';
  if (value) {
    if (rule.minLength && value.length < rule.minLength) return `Minimum ${rule.minLength} characters required`;
    if (rule.maxLength && value.length > rule.maxLength) return `Maximum ${rule.maxLength} characters allowed`;
    if (rule.pattern && !rule.pattern.test(value)) return rule.message;
    if (rule.validate && !rule.validate(value)) return rule.message;
  }
  return null;
};

export function StudentProfile() {
  console.log('StudentProfile: Rendering component')
  const { user } = useAuth()
  const { t } = useLanguage()
  console.log('StudentProfile: Auth user:', user)
  
  const { progress, loading: progressLoading, error: progressError } = useFirestoreProgress(user?.uid)
  console.log('StudentProfile: Progress data:', { progress, progressLoading, progressError })
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  
  // Show error toast if there's a progress loading error
  useEffect(() => {
    if (progressError) {
      console.error('StudentProfile: Error loading progress:', progressError)
      toast({
        title: "Error",
        description: "Failed to load progress data. Some features may be limited.",
        variant: "destructive",
      })
    }
  }, [progressError])
  
  const { toast } = useToast()
  const storage = getStorage()
  
  // Log when the component mounts and unmounts
  useEffect(() => {
    console.log('StudentProfile: Component mounted')
    return () => {
      console.log('StudentProfile: Component unmounted')
    }
  }, [])
  
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
    if (!file) return
    
    if (!user?.uid) {
      toast({
        title: 'Please wait',
        description: 'System is loading. Please try again in a moment.',
        variant: 'default',
      })
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: t('error'),
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
      console.log('Starting avatar upload for user:', user.isAnonymous ? 'anonymous' : 'authenticated')
      
      // Upload to Firebase Storage
      const fileExt = file.name.split('.').pop()
      const storageRef = ref(storage, `profilePictures/${user.uid}/avatar.${fileExt}`)
      console.log('Uploading to:', storageRef.fullPath)
      
      const snapshot = await uploadBytes(storageRef, file)
      console.log('Upload completed, getting download URL...')
      
      const downloadURL = await getDownloadURL(snapshot.ref)
      console.log('Download URL obtained:', downloadURL)

      // Update profile in Firestore
      console.log('Saving avatar URL to Firestore...')
      await userService.saveUserProfile(user.uid, { avatar: downloadURL })
      console.log('Avatar URL saved to Firestore successfully')
      
      // Update auth profile for non-anonymous users
      if (!user.isAnonymous) {
        console.log('Updating Firebase Auth profile...')
        await updateProfile(user, { photoURL: downloadURL })
        console.log('Firebase Auth profile updated successfully')
      }
      
      // Update local state
      setProfile(prev => ({ ...prev, avatar: downloadURL }))
      console.log('Local state updated')
      
      toast({
        title: t('success'),
        description: user.isAnonymous 
          ? 'Profile picture updated for your guest account! 🎉'
          : 'Profile picture updated successfully! 🎉',
      })
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      
      let errorMessage = 'Failed to update profile picture. Please try again.';
      if (error instanceof Error) {
        console.error('Upload error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        errorMessage = error.message || errorMessage;
      }
      
      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
      console.log('Avatar upload process completed')
    }
  }

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateString?: string): string => {
    if (!dateString) return ''
    try {
      // Handle both ISO format and timestamp
      const date = new Date(dateString)
      // Check if the date is valid
      if (isNaN(date.getTime())) return ''
      
      // Convert to local date string in YYYY-MM-DD format
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error)
      return ''
    }
  }

  // Parse date from input field
  const parseDateFromInput = (dateString: string): string => {
    if (!dateString) return ''
    try {
      // Create date in local timezone
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) return ''
      
      // Return ISO string in UTC
      return date.toISOString();
    } catch (error) {
      console.error("Error parsing date:", error)
      return ''
    }
  }

  // Load user profile on component mount or when user changes
  useEffect(() => {
    console.log('Profile: User changed:', { 
      user: user ? {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        isAnonymous: user.isAnonymous
      } : null
    })
    
    const loadProfile = async () => {
      if (!user?.uid) {
        console.log('Profile: No user UID available, user:', user)
        setIsLoading(false)
        return
      }
      
      console.log('Profile: Loading profile for user:', {
        uid: user.uid,
        isAnonymous: user.isAnonymous,
        displayName: user.displayName
      })
      
      try {
        setIsLoading(true)
        console.log('Profile: Fetching user profile...')
        
        // Add a small delay to ensure we can see the loading state
        const [userProfile] = await Promise.all([
          userService.getUserProfile(user.uid),
          new Promise(resolve => setTimeout(resolve, 500)) // 500ms delay
        ])
        
        console.log('Profile: Received user profile:', userProfile)
        
        if (!userProfile) {
          console.log('Profile: No profile data received')
          toast({
            title: "No Profile",
            description: "No profile data found. Please update your profile.",
            variant: "default",
          })
          return
        }
        
        const updatedProfile = {
          ...userProfile,
          dateOfBirth: formatDateForInput(userProfile.dateOfBirth),
          email: userProfile.email || user.email || '',
          name: userProfile.name || user.displayName || 'Student',
          avatar: userProfile.avatar || user.photoURL || '/placeholder.svg'
        }
        
        console.log('Profile: Updating profile state with:', updatedProfile)
        
        setProfile(prev => {
          const newProfile = {
            ...prev,
            ...updatedProfile
          }
          console.log('Profile: New profile state:', newProfile)
          return newProfile
        })
        
      } catch (error) {
        console.error("Profile: Error loading profile:", error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load profile. Please try again.",
          variant: "destructive",
        })
      } finally {
        console.log('Profile: Finished loading profile')
        setIsLoading(false)
      }
    }
    
    loadProfile().catch(error => {
      console.error('Profile: Unhandled error in loadProfile:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please refresh the page.",
        variant: "destructive",
      })
      setIsLoading(false)
    })
    
    // Cleanup function
    return () => {
      console.log('Profile: Cleaning up...')
    }
  }, [user?.uid])

  const testSave = async () => {
    if (!user?.uid) {
      console.error('No user found for test save');
      return;
    }
    
    try {
      console.log('=== TEST SAVE STARTED ===');
      const testData = {
        name: 'Test User',
        email: user.email || 'test@example.com',
        uid: user.uid
      };
      
      console.log('Testing simple save with:', testData);
      await userService.saveUserProfile(user.uid, testData);
      
      toast({
        title: "Test Save Successful! ✅",
        description: "Basic save functionality is working.",
      });
      
      console.log('=== TEST SAVE COMPLETED ===');
    } catch (error) {
      console.error('Test save failed:', error);
      toast({
        title: "Test Save Failed ❌",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  }

  const handleSave = async () => {
    console.log('=== PROFILE SAVE STARTED ===');
    console.log('Current profile state:', profile);
    console.log('User state:', {
      uid: user?.uid,
      email: user?.email,
      displayName: user?.displayName,
      isAnonymous: user?.isAnonymous,
      emailVerified: user?.emailVerified
    });
    
    console.log('Saving profile...');
    
    // Enhanced authentication check - Support anonymous users
    if (!user) {
      const errorMsg = 'Please wait for the system to load...';
      console.error(errorMsg);
      toast({
        title: "Loading",
        description: errorMsg,
        variant: "default",
      });
      return;
    }
    
    if (!user.uid) {
      const errorMsg = 'Session error. Please refresh the page.';
      console.error(errorMsg);
      toast({
        title: "Session Error",
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }

    console.log('Authentication check passed. User:', {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      isAnonymous: user.isAnonymous
    });

    try {
      console.log('Starting save process...');
      setIsSaving(true);
      
      // Enhanced validation for all users including anonymous
      const errors: Record<string, string> = {};
      
      // Name is required for all users
      if (!profile.name?.trim()) {
        errors.name = 'Name is required';
      }
      
      // Email validation - optional for anonymous users, but must be valid if provided
      if (profile.email?.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
          errors.email = 'Please enter a valid email address';
        }
      }
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        toast({
          title: "Validation Error",
          description: "Please fix the highlighted fields.",
          variant: "destructive",
        });
        return;
      }
      
      // Clear any previous errors
      setFormErrors({});
      
      // Prepare the profile data with proper defaults
      const profileData = {
        ...profile,
        name: profile.name?.trim() || user.displayName || 'Student',
        email: (profile.email || user.email || '').trim(),
        phone: (profile.phone || '').trim(),
        dateOfBirth: (profile.dateOfBirth || '').trim(),
        grade: (profile.grade || '').trim(),
        school: (profile.school || '').trim(),
        address: (profile.address || '').trim(),
        bio: (profile.bio || '').trim(),
        interests: Array.isArray(profile.interests) ? profile.interests : [],
        favoriteSubjects: Array.isArray(profile.favoriteSubjects) ? profile.favoriteSubjects : [],
        avatar: profile.avatar?.trim() || user.photoURL || '/placeholder.svg',
        uid: user.uid // Ensure UID is always set
      };
      
      console.log('Profile data to save:', profileData);
      
      // Validate email format if provided
      if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
      }
      
      console.log('About to save profile data:', {
        userId: user.uid,
        hasName: !!profileData.name,
        hasEmail: !!profileData.email,
        dataKeys: Object.keys(profileData)
      });
      
      // Update email in Firebase Auth if it changed and user is not anonymous
      if (profileData.email && profileData.email !== user.email && !user.isAnonymous) {
        console.log('Updating email in Firebase Auth for authenticated user...');
        try {
          await updateEmail(user, profileData.email);
          console.log('Email updated in Firebase Auth successfully');
        } catch (emailError: any) {
          console.error('Error updating email:', emailError);
          
          // Handle specific Firebase Auth errors
          let emailErrorMessage = 'Failed to update email';
          if (emailError.code === 'auth/requires-recent-login') {
            emailErrorMessage = 'Please sign out and sign back in to change your email address.';
          } else if (emailError.code === 'auth/email-already-in-use') {
            emailErrorMessage = 'This email address is already in use by another account.';
          } else if (emailError.code === 'auth/invalid-email') {
            emailErrorMessage = 'Please enter a valid email address.';
          }
          
          toast({
            title: "Email Update Failed",
            description: emailErrorMessage,
            variant: "destructive",
          });
          return;
        }
      } else if (user.isAnonymous && profileData.email) {
        console.log('Email provided for anonymous user - will be saved to profile only');
      }
      
      // Save the profile to Firestore
      console.log('Calling userService.saveUserProfile...');
      await userService.saveUserProfile(user.uid, profileData);
      console.log('Profile saved successfully');
      
      // Create automatic backup (non-blocking)
      try {
        await userService.backupUserProfile(user.uid);
        console.log('Profile backup created');
      } catch (backupError) {
        console.warn('Failed to create backup, but continuing:', backupError);
      }
      
      // Create profile snapshot with storage service (non-blocking)
      try {
        await profileStorageService.createProfileSnapshot(user.uid, profileData as UserProfile);
        console.log('Profile snapshot created');
      } catch (snapshotError) {
        console.warn('Failed to create snapshot, but continuing:', snapshotError);
      }
      
      // Update the user's display name and photo in auth if they changed
      const authUpdates: any = {};
      if (profile.name && profile.name !== user.displayName) {
        authUpdates.displayName = profile.name;
      }
      if (profile.avatar && profile.avatar !== user.photoURL) {
        authUpdates.photoURL = profile.avatar;
      }
      
      if (Object.keys(authUpdates).length > 0) {
        console.log('Updating auth profile...', authUpdates);
        try {
          await updateProfile(user, authUpdates);
          console.log('Auth profile updated successfully');
        } catch (authError) {
          console.error('Error updating auth profile:', authError);
          // Continue even if this fails - it's not critical
        }
      }
      
      // Update local state with the saved data
      setProfile(prev => ({
        ...prev,
        ...profileData
      }));
      
      // Show success message with user-type specific messaging
      toast({
        title: "Success! 🎉",
        description: user.isAnonymous 
          ? "Your guest profile has been saved successfully."
          : "Your profile has been updated successfully.",
      });
      
      console.log('Profile save completed successfully!');
      
      // Exit edit mode
      setIsEditing(false);
      
      // Reload the profile to get the latest data
      console.log('Reloading profile data...');
      try {
        const updatedProfile = await userService.getUserProfile(user.uid);
        if (updatedProfile) {
          setProfile(prev => ({
            ...prev,
            ...updatedProfile,
            dateOfBirth: formatDateForInput(updatedProfile.dateOfBirth)
          }));
          console.log('Profile data reloaded successfully');
        }
      } catch (reloadError) {
        console.warn('Failed to reload profile data:', reloadError);
        // Don't show error to user as the save was successful
      }
      
    } catch (error) {
      console.error("Error in handleSave:", error);
      
      // More detailed error message
      let errorMessage = "Failed to update profile. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        
        // Handle specific Firebase errors
        if (error.message.includes('permission-denied')) {
          errorMessage = 'Permission denied. Please check your login status and try again.';
        } else if (error.message.includes('network-request-failed')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('auth/requires-recent-login')) {
          errorMessage = 'Please sign out and sign back in, then try again.';
        }
      }
      
      toast({
        title: "Profile Save Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      console.log('Save process completed');
    }
  }

  const handleInputChange = <K extends keyof UserProfile>(
    field: K,
    value: UserProfile[K] | string | string[]
  ) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const achievements = [
    { id: "1", title: "First Quiz Master", description: "Completed your first quiz", icon: "🏆", date: "2024-01-15" },
    { id: "2", title: "Week Warrior", description: "7-day learning streak", icon: "🔥", date: "2024-01-20" },
    { id: "3", title: "Math Genius", description: "Scored 100% in mathematics", icon: "🧮", date: "2024-01-25" },
    { id: "4", title: "Science Explorer", description: "Completed 10 science lessons", icon: "🔬", date: "2024-02-01" },
  ]

  // Calculate level based on XP: level = floor(√(xp/100)) + 1
  // Forced to level 2 for demonstration
  const calculateLevel = (xp: number = 0) => {
    return 2 // Force level 2
  }

  const stats = [
    { label: "Total XP", value: progress?.xp || 0, icon: Zap, color: "text-yellow-600" },
    { label: "Current Level", value: calculateLevel(progress?.xp), icon: Trophy, color: "text-blue-600" },
    {
      label: "Lessons Completed",
      value: progress?.totalLessonsCompleted || 0,
      icon: BookOpen,
      color: "text-green-600",
    },
    { label: "Current Streak", value: progress?.streak || 0, icon: Target, color: "text-red-600" },
  ]

  return (
    <div className="space-y-6 px-2 sm:px-4 max-w-5xl mx-auto">
      {/* Anonymous User Notice */}
      {user?.isAnonymous && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Guest Profile Active</h4>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  You're using a guest account. All features are available and your data will be saved. 
                  You can edit and update your profile anytime!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Profile Header */}
      <Card className="border-0 shadow-lg sm:border sm:shadow-xl bg-gradient-to-br from-background via-background to-muted/30">
        <CardHeader className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <Avatar className="relative h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-background shadow-xl">
                  <AvatarImage 
                    src={profile.avatar} 
                    alt={profile.name || 'User'}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <label htmlFor="avatar-upload" className="cursor-pointer p-2">
                      <div className="bg-white/90 rounded-full p-2">
                        {isSaving ? (
                          <Loader2 className="h-5 w-5 text-gray-800 animate-spin" />
                        ) : (
                          <Upload className="h-5 w-5 text-gray-800" />
                        )}
                      </div>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                        disabled={isSaving}
                      />
                    </label>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
                  {profile.name || t('profile.title')}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="font-medium">
                    {profile.grade || 'Grade not set'}
                  </Badge>
                  {profile.school && (
                    <Badge variant="outline" className="text-xs">
                      <School className="h-3 w-3 mr-1" />
                      {profile.school}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">Level {progress?.level || 1}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">{progress?.xp || 0} XP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">{progress?.streak || 0} day streak</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto justify-end">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    size="sm"
                    className="gap-2"
                  >
                    {t('cancel')}
                  </Button>
                  
                  {/* Debug Test Button */}
                  <Button
                    variant="secondary"
                    onClick={testSave}
                    disabled={isSaving}
                    size="sm"
                    className="gap-2 text-xs"
                  >
                    🔧 Test
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
                        {t('loading')}
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        {t('profile.save')}
                      </>
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
                  {t('profile.edit')}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 min-h-[75px]">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('profile.name')}
              </Label>
              {isEditing ? (
                <div className="space-y-1">
                  <Input
                    id="name"
                    value={profile.name || ''}
                    onChange={(e) => {
                      handleInputChange("name", e.target.value)
                      // Clear error when user starts typing
                      if (formErrors.name) {
                        setFormErrors(prev => ({ ...prev, name: '' }))
                      }
                    }}
                    placeholder="Enter your full name"
                    className={`transition-all focus:ring-2 focus:ring-primary/20 ${
                      formErrors.name ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-muted/30 rounded-md">
                  <p className="text-sm">
                    {profile.name || 'Not specified'}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2 min-h-[75px]">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t('profile.email')}
                {user?.isAnonymous && (
                  <Badge variant="outline" className="text-xs px-1 py-0">Optional</Badge>
                )}
              </Label>
              {isEditing ? (
                <div className="space-y-1">
                  <Input
                    id="email"
                    type="email"
                    value={profile.email || ''}
                    onChange={(e) => {
                      handleInputChange("email", e.target.value)
                      // Clear error when user starts typing
                      if (formErrors.email) {
                        setFormErrors(prev => ({ ...prev, email: '' }))
                      }
                    }}
                    placeholder={user?.isAnonymous ? "Enter email (optional)" : "Enter your email address"}
                    className={`transition-all focus:ring-2 focus:ring-primary/20 ${
                      formErrors.email ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>
                  )}
                  {user?.isAnonymous && !formErrors.email && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Email is optional for guest accounts
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-muted/30 rounded-md">
                  <p className="text-sm">
                    {profile.email || (user?.isAnonymous ? 'No email provided (optional)' : 'No email provided')}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2 min-h-[75px]">
              <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t('profile.phone')}
              </Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={profile.phone || ''}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                />
              ) : (
                <div className="p-3 bg-muted/30 rounded-md">
                  <p className="text-sm">
                    {profile.phone || 'Not specified'}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2 min-h-[75px]">
              <Label htmlFor="grade" className="text-sm font-medium flex items-center gap-2">
                <School className="h-4 w-4" />
                {t('profile.grade')}
              </Label>
              {isEditing ? (
                <Select 
                  value={profile.grade || ''}
                  onValueChange={(value) => handleInputChange("grade", value)}
                >
                  <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={`Grade ${i + 1}`}>
                        Grade {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-3 bg-muted/30 rounded-md">
                  <p className="text-sm">
                    {profile.grade || 'Not specified'}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2 min-h-[75px]">
              <Label htmlFor="school" className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {t('profile.school')}
              </Label>
              {isEditing ? (
                <Input
                  id="school"
                  value={profile.school || ''}
                  onChange={(e) => handleInputChange("school", e.target.value)}
                  placeholder="Enter your school name"
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                />
              ) : (
                <div className="p-3 bg-muted/30 rounded-md">
                  <p className="text-sm">
                    {profile.school || 'Not specified'}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2 min-h-[120px] md:col-span-2">
              <Label htmlFor="bio" className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {t('profile.bio')}
              </Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  value={profile.bio || ''}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                />
              ) : (
                <div className="p-3 bg-muted/30 rounded-md min-h-[80px]">
                  <p className="text-sm">
                    {profile.bio || 'No bio provided'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 space-y-3">
            {progressLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    <span className="font-medium">{t('profile.level')} {progress?.level || 1}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>{progress?.xp || 0} XP</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{progress?.streak || 0} days</span>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 h-3 rounded-full transition-all duration-500 ease-out" 
                    style={{ 
                      width: `${Math.min(100, ((progress?.xp || 0) % 1000) / 10)}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t('profile.level')} {progress?.level || 1}</span>
                  <span>{t('profile.level')} {(progress?.level || 1) + 1}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="stats" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('profile.stats')}
          </TabsTrigger>
          <TabsTrigger value="achievements" className="gap-2">
            <Award className="h-4 w-4" />
            {t('profile.achievements')}
          </TabsTrigger>
          <TabsTrigger value="subjects" className="gap-2">
            <BookOpen className="h-4 w-4" />
            {t('profile.subjects')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="grid gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Earned on {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      <Award className="h-3 w-3 mr-1" />
                      Achievement
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subjects">
          <div className="space-y-4">
            {Object.entries(progress?.subjects || {}).map(([subject, data]) => (
              <Card key={subject}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold capitalize">{subject}</h4>
                    <Badge variant="outline">{data.xp} XP</Badge>
                  </div>
                  <Progress value={data.progress} className="mb-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{data.progress}% Complete</span>
                    <span>{data.lessonsCompleted} lessons completed</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
