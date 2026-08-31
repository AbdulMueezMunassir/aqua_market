'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
      <div className="glass-panel rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-bold text-3xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface">
              {user.name}
            </h1>
            <p className="text-on-surface-variant">{user.email}</p>
            <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container-low rounded-lg p-4">
              <p className="text-sm text-on-surface-variant">Phone</p>
              <p className="font-medium">{user.phone || 'Not set'}</p>
            </div>
            <div className="bg-surface-container-low rounded-lg p-4">
              <p className="text-sm text-on-surface-variant">Address</p>
              <p className="font-medium">{user.address || 'Not set'}</p>
            </div>
            <div className="bg-surface-container-low rounded-lg p-4">
              <p className="text-sm text-on-surface-variant">City</p>
              <p className="font-medium">{user.city || 'Not set'}</p>
            </div>
            <div className="bg-surface-container-low rounded-lg p-4">
              <p className="text-sm text-on-surface-variant">State</p>
              <p className="font-medium">{user.state || 'Not set'}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full btn-primary justify-center py-3 bg-error hover:bg-error/90"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}