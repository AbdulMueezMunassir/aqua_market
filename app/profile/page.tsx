'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, isLoading, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoading && !isAuthenticated && mounted) {
      router.push('/auth/login?redirect=/profile')
    }
  }, [isLoading, isAuthenticated, router, mounted])

  if (!mounted || isLoading) {
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
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-primary/20">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface">
              {user.name || 'User'}
            </h1>
            <p className="text-on-surface-variant">{user.email}</p>
            <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Customer'}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* User Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/20">
              <p className="text-sm text-on-surface-variant">Full Name</p>
              <p className="font-medium text-on-surface">{user.name || 'Not set'}</p>
            </div>
            <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/20">
              <p className="text-sm text-on-surface-variant">Email</p>
              <p className="font-medium text-on-surface">{user.email || 'Not set'}</p>
            </div>
            <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/20">
              <p className="text-sm text-on-surface-variant">Phone</p>
              <p className="font-medium text-on-surface">{user.phone || 'Not set'}</p>
            </div>
            <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/20">
              <p className="text-sm text-on-surface-variant">Role</p>
              <p className="font-medium text-on-surface capitalize">{user.role || 'Customer'}</p>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/20">
            <p className="text-sm text-on-surface-variant mb-2">Address</p>
            {user.address ? (
              <div>
                <p className="font-medium text-on-surface">{user.address}</p>
                {(user.city || user.state || user.zipCode) && (
                  <p className="text-on-surface-variant text-sm">
                    {[user.city, user.state, user.zipCode].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-on-surface-variant">No address set</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-outline-variant/30">
            <Link
              href="/orders"
              className="flex-1 px-6 py-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-center font-medium"
            >
              View My Orders
            </Link>
            <Link
              href="/profile/edit"
              className="flex-1 px-6 py-3 rounded-xl bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors text-center font-medium"
            >
              Edit Profile
            </Link>
            <button
              onClick={logout}
              className="flex-1 px-6 py-3 rounded-xl bg-error/10 text-error hover:bg-error/20 transition-colors font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}