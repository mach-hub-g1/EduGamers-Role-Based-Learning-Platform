"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react"
import { User, onAuthStateChanged, signInAnonymously, updateProfile, signOut as firebaseSignOut } from "firebase/auth"
import { auth } from "./firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // If user is anonymous and doesn't have a display name, set it to Vaibhav
        if (user.isAnonymous && !user.displayName) {
          await updateProfile(user, {
            displayName: 'Vaibhav',
            photoURL: 'https://ui-avatars.com/api/?name=Vaibhav&background=random'
          });
          // Refresh the user to get updated data
          await user.reload();
          setUser(auth.currentUser);
        } else {
          setUser(user);
        }
      } else {
        // Sign in anonymously if no user is found
        try {
          const result = await signInAnonymously(auth);
          // Set default name and photo for new anonymous user
          await updateProfile(result.user, {
            displayName: 'Vaibhav',
            photoURL: 'https://ui-avatars.com/api/?name=Vaibhav&background=random'
          });
          // Refresh the user to get updated data
          await result.user.reload();
          setUser(auth.currentUser);
        } catch (error) {
          console.error("Error signing in anonymously:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe()
  }, [])

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth)
      // Sign back in anonymously after sign out
      const result = await signInAnonymously(auth)
      // Set default name and photo for new anonymous user
      await updateProfile(result.user, {
        displayName: 'Vaibhav',
        photoURL: 'https://ui-avatars.com/api/?name=Vaibhav&background=random'
      })
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
