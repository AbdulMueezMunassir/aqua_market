'use client'

import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function CheckoutTestPage() {
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    console.log('✅ Checkout test page loaded')
    console.log('👤 User:', user)
    console.log('🔐 Authenticated:', isAuthenticated)
  }, [user, isAuthenticated])

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
      <div className="glass-panel rounded-2xl p-8">
        <h1 className="font-headline-md text-headline-md text-primary">Checkout Test Page</h1>
        <div className="mt-4 space-y-2">
          <p className="text-on-surface-variant">✅ This page is accessible!</p>
          <p className="text-on-surface-variant">👤 User: {user?.email || 'Not logged in'}</p>
          <p className="text-on-surface-variant">🔐 Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <div className="mt-4 flex gap-4">
            <a href="/checkout" className="btn-primary">
              Go to Real Checkout
            </a>
            <a href="/" className="glass-panel px-6 py-3 rounded-xl text-primary hover:bg-white/50 transition-colors">
              Go Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}