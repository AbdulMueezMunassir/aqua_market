'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'staff' | 'customer'
  avatar?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  isStaff: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // 🔑 Per-user cart & wishlist setters
  const setCartUser = useCartStore((s) => s.setUser)
  const setWishlistUser = useWishlistStore((s) => s.setUser)

  // ────────────────────────────────────────────────────────────
  // Restore session from localStorage on mount
  // ────────────────────────────────────────────────────────────
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')

    if (savedToken && savedUser) {
      try {
        const parsedUser: User = JSON.parse(savedUser)
        setUser(parsedUser)
        setToken(savedToken)

        // Load this user's own cart & wishlist
        setCartUser(parsedUser.id)
        setWishlistUser(parsedUser.id)

        console.log('✅ User restored from localStorage:', parsedUser.email)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        setCartUser(null)
        setWishlistUser(null)
      }
    } else {
      console.log('ℹ️ No auth data found — guest mode')
      setCartUser(null)
      setWishlistUser(null)
    }

    setIsLoading(false)
  }, [setCartUser, setWishlistUser])

  // ────────────────────────────────────────────────────────────
  // LOGIN
  // ────────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log('🔐 Attempting login for:', email)

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      // Guard against non-JSON responses (HTML error pages, etc.)
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('❌ Non-JSON response:', text.substring(0, 200))
        throw new Error('Server returned an error. Please try again.')
      }

      const data = await response.json()
      console.log('📦 Login response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      if (!data.token || !data.user) {
        throw new Error('Invalid response from server')
      }

      // Persist session
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))

      setUser(data.user)
      setToken(data.token)

      // 🔑 Switch to this user's cart & wishlist
      setCartUser(data.user.id)
      setWishlistUser(data.user.id)

      console.log('✅ Login successful:', data.user.email, '| role:', data.user.role)

      // Role-based redirect
      if (data.user.role === 'admin') {
        router.push('/admin')
      } else if (data.user.role === 'staff') {
        router.push('/staff')
      } else {
        router.push('/')
      }
    } catch (error: any) {
      console.error('❌ Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // ────────────────────────────────────────────────────────────
  // REGISTER
  // ────────────────────────────────────────────────────────────
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log('📝 Attempting registration for:', email)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()
      console.log('📦 Registration response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      console.log('✅ Registration successful:', email)

      // Send user to login with a success hint
      router.push('/auth/login?registered=true')
    } catch (error: any) {
      console.error('❌ Registration error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // ────────────────────────────────────────────────────────────
  // LOGOUT
  // ────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')

    setUser(null)
    setToken(null)

    // 🔑 Switch back to guest cart & wishlist (user's cart is preserved in localStorage)
    setCartUser(null)
    setWishlistUser(null)

    router.push('/auth/login')
  }

  // ────────────────────────────────────────────────────────────
  // Context value
  // ────────────────────────────────────────────────────────────
  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff' || user?.role === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}