// Offline-First Storage Service with IndexedDB
import { Achievement, CulturalElement } from './next-gen-xp-system';

interface OfflineData {
  id: string;
  timestamp: number;
  data: any;
  type: 'quest' | 'progress' | 'achievement' | 'cultural' | 'lesson' | 'resource';
  syncStatus: 'pending' | 'synced' | 'failed';
}

interface CachedResource {
  id: string;
  url: string;
  blob: Blob;
  timestamp: number;
  size: number;
}

class OfflineStorageService {
  private dbName = 'EduvationOfflineDB';
  private version = 1;
  private db: IDBDatabase | null = null;
  private maxCacheSize = 500 * 1024 * 1024; // 500MB cache limit
  private currentCacheSize = 0;

  async initializeDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        this.calculateCacheSize();
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store for offline data
        if (!db.objectStoreNames.contains('offlineData')) {
          const offlineStore = db.createObjectStore('offlineData', { keyPath: 'id' });
          offlineStore.createIndex('type', 'type', { unique: false });
          offlineStore.createIndex('timestamp', 'timestamp', { unique: false });
          offlineStore.createIndex('syncStatus', 'syncStatus', { unique: false });
        }

        // Store for cached resources (videos, images, documents)
        if (!db.objectStoreNames.contains('cachedResources')) {
          const resourceStore = db.createObjectStore('cachedResources', { keyPath: 'id' });
          resourceStore.createIndex('url', 'url', { unique: true });
          resourceStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store for language translations
        if (!db.objectStoreNames.contains('translations')) {
          const translationStore = db.createObjectStore('translations', { keyPath: 'key' });
          translationStore.createIndex('language', 'language', { unique: false });
        }

        // Store for offline lessons
        if (!db.objectStoreNames.contains('offlineLessons')) {
          const lessonStore = db.createObjectStore('offlineLessons', { keyPath: 'id' });
          lessonStore.createIndex('subject', 'subject', { unique: false });
          lessonStore.createIndex('grade', 'grade', { unique: false });
        }
      };
    });
  }

  // Store data for offline access
  async storeOfflineData(data: any, type: OfflineData['type']): Promise<void> {
    if (!this.db) await this.initializeDB();

    const offlineData: OfflineData = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      data,
      type,
      syncStatus: 'pending'
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      const request = store.add(offlineData);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Cache resource files for offline access
  async cacheResource(url: string, blob: Blob): Promise<void> {
    if (!this.db) await this.initializeDB();

    // Check cache size limit
    if (this.currentCacheSize + blob.size > this.maxCacheSize) {
      await this.cleanupOldCache();
    }

    const resource: CachedResource = {
      id: btoa(url).replace(/[/+=]/g, '_'),
      url,
      blob,
      timestamp: Date.now(),
      size: blob.size
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cachedResources'], 'readwrite');
      const store = transaction.objectStore('cachedResources');
      const request = store.put(resource);

      request.onsuccess = () => {
        this.currentCacheSize += blob.size;
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Retrieve cached resource
  async getCachedResource(url: string): Promise<Blob | null> {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cachedResources'], 'readonly');
      const store = transaction.objectStore('cachedResources');
      const index = store.index('url');
      const request = index.get(url);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.blob : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Store lesson content for offline learning
  async storeOfflineLesson(lesson: any): Promise<void> {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineLessons'], 'readwrite');
      const store = transaction.objectStore('offlineLessons');
      const request = store.put({
        ...lesson,
        cachedAt: Date.now(),
        isOfflineAvailable: true
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get offline lessons by subject and grade
  async getOfflineLessons(subject?: string, grade?: string): Promise<any[]> {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineLessons'], 'readonly');
      const store = transaction.objectStore('offlineLessons');
      
      let request: IDBRequest;
      if (subject) {
        const index = store.index('subject');
        request = index.getAll(subject);
      } else {
        request = store.getAll();
      }

      request.onsuccess = () => {
        let lessons = request.result;
        if (grade) {
          lessons = lessons.filter((lesson: any) => lesson.grade === grade);
        }
        resolve(lessons);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Store translations for offline multilingual support
  async storeTranslation(key: string, language: string, translation: string): Promise<void> {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['translations'], 'readwrite');
      const store = transaction.objectStore('translations');
      const request = store.put({
        key: `${language}_${key}`,
        language,
        originalKey: key,
        translation,
        timestamp: Date.now()
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get translation for offline use
  async getTranslation(key: string, language: string): Promise<string | null> {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['translations'], 'readonly');
      const store = transaction.objectStore('translations');
      const request = store.get(`${language}_${key}`);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.translation : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Get all pending data for synchronization
  async getPendingSyncData(): Promise<OfflineData[]> {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      const index = store.index('syncStatus');
      const request = index.getAll('pending');

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Mark data as synced
  async markAsSynced(id: string): Promise<void> {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const data = getRequest.result;
        if (data) {
          data.syncStatus = 'synced';
          const putRequest = store.put(data);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Network status detection
  isOnline(): boolean {
    return navigator.onLine;
  }

  // Background sync when network becomes available
  async syncWhenOnline(): Promise<void> {
    if (!this.isOnline()) {
      return new Promise((resolve) => {
        const handleOnline = async () => {
          window.removeEventListener('online', handleOnline);
          await this.performSync();
          resolve();
        };
        window.addEventListener('online', handleOnline);
      });
    }
    await this.performSync();
  }

  // Perform actual synchronization with server
  private async performSync(): Promise<void> {
    try {
      const pendingData = await this.getPendingSyncData();
      
      for (const item of pendingData) {
        try {
          // Simulate API call to sync data
          await this.syncToServer(item);
          await this.markAsSynced(item.id);
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          // Mark as failed for retry later
          await this.markSyncFailed(item.id);
        }
      }
    } catch (error) {
      console.error('Sync operation failed:', error);
    }
  }

  // Simulate server sync
  private async syncToServer(data: OfflineData): Promise<void> {
    // This would be replaced with actual API calls
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Synced to server:', data.type, data.id);
        resolve();
      }, 100);
    });
  }

  // Mark sync as failed
  private async markSyncFailed(id: string): Promise<void> {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const data = getRequest.result;
        if (data) {
          data.syncStatus = 'failed';
          const putRequest = store.put(data);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Calculate current cache size
  private async calculateCacheSize(): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cachedResources'], 'readonly');
      const store = transaction.objectStore('cachedResources');
      const request = store.getAll();

      request.onsuccess = () => {
        this.currentCacheSize = request.result.reduce((total, resource) => total + resource.size, 0);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Clean up old cached resources when cache is full
  private async cleanupOldCache(): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cachedResources'], 'readwrite');
      const store = transaction.objectStore('cachedResources');
      const index = store.index('timestamp');
      const request = index.openCursor();

      let deletedSize = 0;
      const targetCleanup = this.maxCacheSize * 0.3; // Clean 30% of cache

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && deletedSize < targetCleanup) {
          deletedSize += cursor.value.size;
          cursor.delete();
          cursor.continue();
        } else {
          this.currentCacheSize -= deletedSize;
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Clear all offline data (for development/testing)
  async clearAllOfflineData(): Promise<void> {
    if (!this.db) await this.initializeDB();

    const stores = ['offlineData', 'cachedResources', 'translations', 'offlineLessons'];
    
    for (const storeName of stores) {
      await new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }

    this.currentCacheSize = 0;
  }

  // Get storage usage statistics
  async getStorageStats(): Promise<{
    totalItems: number;
    cacheSize: number;
    maxCacheSize: number;
    offlineLessons: number;
    pendingSync: number;
  }> {
    if (!this.db) await this.initializeDB();

    const [offlineData, cachedResources, offlineLessons] = await Promise.all([
      this.getAllFromStore('offlineData'),
      this.getAllFromStore('cachedResources'),
      this.getAllFromStore('offlineLessons')
    ]);

    const pendingSync = offlineData.filter((item: OfflineData) => item.syncStatus === 'pending').length;

    return {
      totalItems: offlineData.length,
      cacheSize: this.currentCacheSize,
      maxCacheSize: this.maxCacheSize,
      offlineLessons: offlineLessons.length,
      pendingSync
    };
  }

  private async getAllFromStore(storeName: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const offlineStorageService = new OfflineStorageService();
export type { OfflineData, CachedResource };