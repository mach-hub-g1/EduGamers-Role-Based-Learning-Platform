import { messaging } from "./firebase"
import { getToken, onMessage } from "firebase/messaging"

export class FCMService {
  private static instance: FCMService
  private token: string | null = null

  static getInstance(): FCMService {
    if (!FCMService.instance) {
      FCMService.instance = new FCMService()
    }
    return FCMService.instance
  }

  async requestPermission(): Promise<string | null> {
    try {
      if (!messaging) {
        console.log("FCM not supported in this browser")
        return null
      }

      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: "YOUR_VAPID_KEY", // You'll need to add this from Firebase Console
        })
        this.token = token
        console.log("[v0] FCM Token:", token)
        return token
      }
      return null
    } catch (error) {
      console.error("[v0] FCM Permission Error:", error)
      return null
    }
  }

  setupMessageListener(callback: (payload: any) => void) {
    if (!messaging) return

    onMessage(messaging, (payload) => {
      console.log("[v0] FCM Message received:", payload)
      callback(payload)
    })
  }

  async sendNotification(title: string, body: string, data?: any) {
    // This would typically be called from your backend
    // For demo purposes, we'll show a local notification
    if ("serviceWorker" in navigator && "Notification" in window) {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        data,
      })
    }
  }

  getToken(): string | null {
    return this.token
  }
}

export const fcmService = FCMService.getInstance()
