import { db } from "./firebase"
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  grade: string;
  school: string;
  address: string;
  bio: string;
  avatar: string;
  interests: string[];
  favoriteSubjects: string[];
  settings?: {
    pushNotifications?: boolean;
    emailNotifications?: boolean;
    achievementAlerts?: boolean;
    dailyReminders?: boolean;
    soundEffects?: boolean;
    backgroundMusic?: boolean;
    volume?: number;
    language?: string;
    difficultyLevel?: "easy" | "medium" | "hard";
    studyReminders?: boolean;
    pomodoroLength?: number;
    profileVisibility?: "public" | "friends" | "private";
    shareProgress?: boolean;
    dataCollection?: boolean;
  };
  createdAt: any;
  updatedAt: any;
}

class UserService {
  private static instance: UserService;

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      
      // Return default profile if none exists
      return {
        uid: userId,
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        grade: '',
        school: '',
        address: '',
        bio: '',
        avatar: '/placeholder.svg',
        interests: [],
        favoriteSubjects: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  }

  // Create or update user profile
  async saveUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<void> {
    try {
      console.log('UserService: Saving profile for user:', userId, 'Data keys:', Object.keys(profileData));
      console.log('UserService: Profile data preview:', {
        name: profileData.name,
        email: profileData.email,
        avatar: profileData.avatar ? 'provided' : 'not provided',
        hasInterests: Array.isArray(profileData.interests) && profileData.interests.length > 0
      });
      
      if (!userId) {
        console.error('UserService: User ID is required to save profile');
        throw new Error('User ID is required to save profile');
      }

      // Test database connection first with better error handling
      console.log('UserService: Testing database connection...');
      try {
        const testRef = doc(db, "test", "connection");
        await setDoc(testRef, { timestamp: new Date().toISOString() }, { merge: true });
        console.log('UserService: Database connection successful');
      } catch (connectionError) {
        console.error('UserService: Database connection failed:', connectionError);
        throw new Error(`Database connection failed: ${connectionError instanceof Error ? connectionError.message : 'Unknown connection error'}`);
      }

      // Ensure required fields have default values and clean the data
      const sanitizedData: Partial<UserProfile> = {
        ...profileData,
        uid: userId, // Always ensure UID is set
        name: (profileData.name || '').trim() || 'New User',
        email: (profileData.email || '').trim(),
        phone: (profileData.phone || '').trim(),
        dateOfBirth: (profileData.dateOfBirth || '').trim(),
        grade: (profileData.grade || '').trim(),
        school: (profileData.school || '').trim(),
        address: (profileData.address || '').trim(),
        bio: (profileData.bio || '').trim(),
        avatar: (profileData.avatar || '').trim() || '/placeholder.svg',
        interests: Array.isArray(profileData.interests) ? profileData.interests : [],
        favoriteSubjects: Array.isArray(profileData.favoriteSubjects) ? profileData.favoriteSubjects : [],
        updatedAt: serverTimestamp()
      };

      // Remove empty fields to avoid storing unnecessary data
      Object.keys(sanitizedData).forEach(key => {
        const value = sanitizedData[key as keyof UserProfile];
        if (value === '' || value === null || value === undefined) {
          delete sanitizedData[key as keyof UserProfile];
        }
      });

      console.log('UserService: Sanitized profile data:', sanitizedData);

      const userRef = doc(db, "users", userId);
      console.log('UserService: User reference path:', userRef.path);
      
      // Check if document exists
      const userDoc = await getDoc(userRef);
      console.log('UserService: Document exists:', userDoc.exists());
      
      try {
        if (userDoc.exists()) {
          console.log('UserService: Updating existing profile...');
          await updateDoc(userRef, sanitizedData);
          console.log('UserService: Profile updated successfully');
        } else {
          console.log('UserService: Creating new profile...');
          const newProfile = {
            ...sanitizedData,
            uid: userId,
            createdAt: serverTimestamp(),
          };
          console.log('UserService: New profile data:', newProfile);
          await setDoc(userRef, newProfile);
          console.log('UserService: New profile created successfully');
        }
        
        // Verify the document was saved
        const savedDoc = await getDoc(userRef);
        if (savedDoc.exists()) {
          console.log('UserService: Document successfully saved. Data:', savedDoc.data());
        } else {
          console.error('UserService: Document was not saved properly');
          throw new Error('Failed to verify document save');
        }
        
      } catch (dbError) {
        console.error('UserService: Database operation failed:', dbError);
        throw new Error(`Failed to save profile: ${dbError instanceof Error ? dbError.message : 'Unknown database error'}`);
      }
      
    } catch (error) {
      console.error("UserService: Error in saveUserProfile:", error);
      if (error instanceof Error) {
        console.error('UserService: Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
      throw error;
    }
  }

  // Update profile picture
  async updateProfilePicture(userId: string, avatarUrl: string): Promise<void> {
    try {
      console.log('UserService: Updating profile picture for user:', userId, 'URL:', avatarUrl);
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        avatar: avatarUrl,
        updatedAt: serverTimestamp(),
      });
      console.log('UserService: Profile picture updated successfully');
    } catch (error) {
      console.error("UserService: Error updating profile picture:", error);
      throw error;
    }
  }

  // Add backup functionality for profile data
  async backupUserProfile(userId: string): Promise<boolean> {
    try {
      console.log('UserService: Creating backup for user:', userId);
      const userProfile = await this.getUserProfile(userId);
      
      // Create backup in separate collection
      const backupRef = doc(db, "userBackups", userId);
      await setDoc(backupRef, {
        ...userProfile,
        backupDate: serverTimestamp(),
        version: '1.0'
      });
      
      console.log('UserService: Backup created successfully');
      return true;
    } catch (error) {
      console.error('UserService: Error creating backup:', error);
      return false;
    }
  }

  // Restore profile from backup
  async restoreUserProfile(userId: string): Promise<boolean> {
    try {
      console.log('UserService: Restoring profile from backup for user:', userId);
      const backupRef = doc(db, "userBackups", userId);
      const backupDoc = await getDoc(backupRef);
      
      if (backupDoc.exists()) {
        const backupData = backupDoc.data();
        // Remove backup-specific fields
        const { backupDate, version, ...profileData } = backupData;
        
        await this.saveUserProfile(userId, profileData);
        console.log('UserService: Profile restored successfully');
        return true;
      } else {
        console.log('UserService: No backup found for user');
        return false;
      }
    } catch (error) {
      console.error('UserService: Error restoring profile:', error);
      return false;
    }
  }

  // Verify data integrity
  async verifyProfileIntegrity(userId: string): Promise<boolean> {
    try {
      console.log('UserService: Verifying profile integrity for user:', userId);
      const userProfile = await this.getUserProfile(userId);
      
      // Check required fields
      const hasValidStructure = userProfile.uid === userId && 
                                userProfile.hasOwnProperty('name') &&
                                userProfile.hasOwnProperty('email') &&
                                userProfile.hasOwnProperty('avatar');
      
      console.log('UserService: Profile integrity check result:', hasValidStructure);
      return hasValidStructure;
    } catch (error) {
      console.error('UserService: Error verifying profile integrity:', error);
      return false;
    }
  }
}

export const userService = UserService.getInstance();
