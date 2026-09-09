'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, isLoading, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/profile')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
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

          <div className="flex gap-4 mt-4">
            <Link
              href="/orders"
              className="flex-1 px-6 py-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-center"
            >
              View Orders
            </Link>
            <button
              onClick={logout}
              className="flex-1 px-6 py-3 rounded-xl bg-error/10 text-error hover:bg-error/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}