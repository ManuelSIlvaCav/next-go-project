'use client'

import { deleteCookie, getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface ClientUser {
  id: string
  email: string
  first_name: string
  last_name: string
  business_id: number
}

export interface JWTPayload {
  client_id: string
  business_id: number
  business_user_id: number
  admin_id: string
  exp: number
  iat: number
}

interface AuthContextType {
  isAuthenticated: boolean
  user: ClientUser | null
  isLoading: boolean
  logout: () => void
  getToken: () => string | undefined
  updateUser: (userData: ClientUser) => void
  refreshAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Decode JWT token (simple base64 decode, no verification)
 * This is safe for reading public data from our own token
 */
function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

/**
 * Check if JWT token is expired
 */
function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token)
  if (!decoded || !decoded.exp) return true

  const currentTime = Math.floor(Date.now() / 1000)
  return decoded.exp < currentTime
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<ClientUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = () => {
    const token = getCookie('petza_access_token') as string | undefined

    if (!token) {
      setIsAuthenticated(false)
      setUser(null)
      setIsLoading(false)
      return
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      deleteCookie('petza_access_token')
      setIsAuthenticated(false)
      setUser(null)
      setIsLoading(false)
      return
    }

    // Token exists and is valid
    const decoded = decodeJWT(token)
    if (decoded) {
      setIsAuthenticated(true)

      // Get user info from localStorage if available
      const storedUser = localStorage.getItem('petza_user')
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error('Failed to parse stored user:', error)
        }
      }
    }

    setIsLoading(false)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const logout = () => {
    deleteCookie('petza_access_token')
    localStorage.removeItem('petza_user')
    setIsAuthenticated(false)
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const getToken = () => {
    return getCookie('petza_access_token') as string | undefined
  }

  const updateUser = (userData: ClientUser) => {
    setUser(userData)
    localStorage.setItem('petza_user', JSON.stringify(userData))
    setIsAuthenticated(true)
  }

  const refreshAuth = () => {
    checkAuth()
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        logout,
        getToken,
        updateUser,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
