// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getMessaging, isSupported } from "firebase/messaging"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIuoPSdOCQc6DEUqSBshKLiFdv3rbo50g",
  authDomain: "edugamers-76530.firebaseapp.com",
  projectId: "edugamers-76530",
  storageBucket: "edugamers-76530.firebasestorage.app",
  messagingSenderId: "498888509783",
  appId: "1:498888509783:web:2b9641b0cb933f9e739612",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

let messaging: any = null
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app)
    }
  })
}

export { messaging }
export default app
