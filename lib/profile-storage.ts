import { ref, uploadBytes, getDownloadURL, deleteObject, listAll, getMetadata } from 'firebase/storage'
import { doc, setDoc, getDoc, collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { storage, db } from '@/lib/firebase'
import { UserProfile } from './user-service'

export interface ProfileImage {
  id: string
  url: string
  fileName: string
  uploadDate: string
  size: number
  type: string
}

export interface ProfileActivity {
  id: string
  userId: string
  action: string
  timestamp: string
  details: any
}

class ProfileStorageService {
  private static instance: ProfileStorageService

  static getInstance(): ProfileStorageService {
    if (!ProfileStorageService.instance) {
      ProfileStorageService.instance = new ProfileStorageService()
    }
    return ProfileStorageService.instance
  }

  // Upload profile picture with metadata tracking
  async uploadProfilePicture(userId: string, file: File): Promise<string> {
    try {
      console.log('ProfileStorage: Starting upload for user:', userId)
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Invalid file type. Please upload an image.')
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('File too large. Please upload an image smaller than 5MB.')
      }
      
      // Create unique filename with timestamp
      const timestamp = Date.now()
      const fileExt = file.name.split('.').pop()
      const fileName = `avatar_${timestamp}.${fileExt}`
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, `profilePictures/${userId}/${fileName}`)
      console.log('ProfileStorage: Uploading to path:', storageRef.fullPath)
      
      const uploadTask = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(uploadTask.ref)
      
      // Save metadata to Firestore
      const imageMetadata: ProfileImage = {
        id: `${userId}_${timestamp}`,
        url: downloadURL,
        fileName: fileName,
        uploadDate: new Date().toISOString(),
        size: file.size,
        type: file.type
      }
      
      await this.saveImageMetadata(userId, imageMetadata)
      
      // Log activity
      await this.logProfileActivity(userId, 'profile_picture_upload', {
        fileName: fileName,
        size: file.size,
        url: downloadURL
      })
      
      console.log('ProfileStorage: Upload completed successfully:', downloadURL)
      return downloadURL
      
    } catch (error) {
      console.error('ProfileStorage: Upload failed:', error)
      throw error
    }
  }

  // Save image metadata
  private async saveImageMetadata(userId: string, metadata: ProfileImage): Promise<void> {
    try {
      const metadataRef = doc(db, 'profileImages', metadata.id)
      await setDoc(metadataRef, metadata)
      console.log('ProfileStorage: Metadata saved successfully')
    } catch (error) {
      console.error('ProfileStorage: Error saving metadata:', error)
      throw error
    }
  }

  // Get user's profile images
  async getUserProfileImages(userId: string): Promise<ProfileImage[]> {
    try {
      console.log('ProfileStorage: Fetching images for user:', userId)
      
      // List all files in user's profile pictures folder
      const listRef = ref(storage, `profilePictures/${userId}`)
      const result = await listAll(listRef)
      
      const images: ProfileImage[] = []
      for (const itemRef of result.items) {
        try {
          const url = await getDownloadURL(itemRef)
          const metadata = await getMetadata(itemRef)
          
          images.push({
            id: `${userId}_${metadata.timeCreated}`,
            url: url,
            fileName: itemRef.name,
            uploadDate: metadata.timeCreated || new Date().toISOString(),
            size: metadata.size || 0,
            type: metadata.contentType || 'image/jpeg'
          })
        } catch (error) {
          console.warn('ProfileStorage: Error getting metadata for image:', itemRef.name)
        }
      }
      
      // Sort by upload date (newest first)
      images.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
      
      console.log('ProfileStorage: Found', images.length, 'images')
      return images
      
    } catch (error) {
      console.error('ProfileStorage: Error fetching images:', error)
      return []
    }
  }

  // Delete profile picture
  async deleteProfilePicture(userId: string, fileName: string): Promise<boolean> {
    try {
      console.log('ProfileStorage: Deleting image:', fileName, 'for user:', userId)
      
      const imageRef = ref(storage, `profilePictures/${userId}/${fileName}`)
      await deleteObject(imageRef)
      
      // Log activity
      await this.logProfileActivity(userId, 'profile_picture_delete', {
        fileName: fileName
      })
      
      console.log('ProfileStorage: Image deleted successfully')
      return true
      
    } catch (error) {
      console.error('ProfileStorage: Error deleting image:', error)
      return false
    }
  }

  // Log profile activity
  async logProfileActivity(userId: string, action: string, details: any = {}): Promise<void> {
    try {
      const activity: ProfileActivity = {
        id: `${userId}_${Date.now()}`,
        userId: userId,
        action: action,
        timestamp: new Date().toISOString(),
        details: details
      }
      
      const activityRef = collection(db, 'profileActivities')
      await addDoc(activityRef, activity)
      
      console.log('ProfileStorage: Activity logged:', action)
    } catch (error) {
      console.warn('ProfileStorage: Error logging activity:', error)
      // Don't throw error for logging failures
    }
  }

  // Get profile activity history
  async getProfileActivityHistory(userId: string, limitCount: number = 50): Promise<ProfileActivity[]> {
    try {
      console.log('ProfileStorage: Fetching activity history for user:', userId)
      
      const activitiesRef = collection(db, 'profileActivities')
      const q = query(
        activitiesRef,
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      )
      
      const querySnapshot = await getDocs(q)
      const activities: ProfileActivity[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as ProfileActivity
        if (data.userId === userId) {
          activities.push(data)
        }
      })
      
      console.log('ProfileStorage: Found', activities.length, 'activities')
      return activities
      
    } catch (error) {
      console.error('ProfileStorage: Error fetching activity history:', error)
      return []
    }
  }

  // Create profile data snapshot
  async createProfileSnapshot(userId: string, profileData: UserProfile): Promise<boolean> {
    try {
      console.log('ProfileStorage: Creating profile snapshot for user:', userId)
      
      const snapshot = {
        ...profileData,
        snapshotDate: new Date().toISOString(),
        version: '1.0'
      }
      
      const snapshotRef = doc(db, 'profileSnapshots', `${userId}_${Date.now()}`)
      await setDoc(snapshotRef, snapshot)
      
      // Log activity
      await this.logProfileActivity(userId, 'profile_snapshot_created', {
        snapshotId: snapshotRef.id
      })
      
      console.log('ProfileStorage: Snapshot created successfully')
      return true
      
    } catch (error) {
      console.error('ProfileStorage: Error creating snapshot:', error)
      return false
    }
  }

  // Get storage usage for user
  async getUserStorageUsage(userId: string): Promise<{ totalSize: number; imageCount: number }> {
    try {
      const images = await this.getUserProfileImages(userId)
      const totalSize = images.reduce((sum, img) => sum + img.size, 0)
      
      return {
        totalSize: totalSize,
        imageCount: images.length
      }
    } catch (error) {
      console.error('ProfileStorage: Error calculating storage usage:', error)
      return { totalSize: 0, imageCount: 0 }
    }
  }

  // Clean up old profile pictures (keep only latest 5)
  async cleanupOldProfilePictures(userId: string): Promise<number> {
    try {
      console.log('ProfileStorage: Cleaning up old pictures for user:', userId)
      
      const images = await this.getUserProfileImages(userId)
      
      // Keep only the 5 most recent images
      const imagesToDelete = images.slice(5)
      let deletedCount = 0
      
      for (const image of imagesToDelete) {
        const success = await this.deleteProfilePicture(userId, image.fileName)
        if (success) deletedCount++
      }
      
      console.log('ProfileStorage: Cleaned up', deletedCount, 'old images')
      return deletedCount
      
    } catch (error) {
      console.error('ProfileStorage: Error during cleanup:', error)
      return 0
    }
  }
}

export const profileStorageService = ProfileStorageService.getInstance()