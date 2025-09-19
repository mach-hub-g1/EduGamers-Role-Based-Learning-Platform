"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

type UserRole = "student" | "teacher" | "admin"

interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  xp?: number
  level?: number
  streak?: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: UserRole) => Promise<void>
  loginWithGoogle: (role: UserRole) => Promise<void>
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            name: userData.name,
            role: userData.role,
            avatar: userData.avatar || `/placeholder.svg?height=40&width=40&query=${userData.name}`,
            xp: userData.xp || 0,
            level: userData.level || 1,
            streak: userData.streak || 0,
          })
        }
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      // Check if user has the correct role
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        if (userData.role !== role) {
          await signOut(auth)
          throw new Error("Invalid role for this account")
        }
      } else {
        // If no user document exists, create one with demo data
        await setDoc(doc(db, "users", firebaseUser.uid), {
          name: getDemoName(email, role),
          role,
          xp: 0,
          level: 1,
          streak: 0,
          avatar: `/placeholder.svg?height=40&width=40&query=${getDemoName(email, role)}`,
          createdAt: new Date(),
        })
      }
    } catch (error: any) {
      throw new Error(error.message || "Login failed")
    }
  }

  const loginWithGoogle = async (role: UserRole) => {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      const firebaseUser = userCredential.user

      // Check if user document exists
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        if (userData.role !== role) {
          await signOut(auth)
          throw new Error("Invalid role for this account")
        }
      } else {
        // Create new user document with Google account info
        await setDoc(doc(db, "users", firebaseUser.uid), {
          name: firebaseUser.displayName || "Google User",
          role,
          xp: 0,
          level: 1,
          streak: 0,
          avatar: firebaseUser.photoURL || `/placeholder.svg?height=40&width=40&query=${firebaseUser.displayName}`,
          createdAt: new Date(),
        })
      }
    } catch (error: any) {
      throw new Error(error.message || "Google sign-in failed")
    }
  }

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      // Create user document in Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        name,
        role,
        xp: 0,
        level: 1,
        streak: 0,
        avatar: `/placeholder.svg?height=40&width=40&query=${name}`,
        createdAt: new Date(),
      })
    } catch (error: any) {
      throw new Error(error.message || "Registration failed")
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  const getDemoName = (email: string, role: UserRole) => {
    const demoNames = {
      "student@edu.gov.in": "Amandeep",
      "teacher@edu.gov.in": "Ramesh",
      "admin@edu.gov.in": "Dr. Amit Singh",
    }
    return demoNames[email as keyof typeof demoNames] || `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`
  }

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // Fallback: allow usage without wrapping in AuthProvider (no-auth mode)
    return {
      user: null,
      login: async () => {},
      loginWithGoogle: async () => {},
      register: async () => {},
      logout: () => {},
      isLoading: false,
    }
  }
  return context
}
