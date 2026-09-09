'use client'

import { useAuth } from '@/context/AuthContext'

export default function ProfileTestPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  
  console.log('Profile Test Page - User:', user)
  console.log('Profile Test Page - Is Authenticated:', isAuthenticated)
  console.log('Profile Test Page - Is Loading:', isLoading)

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
      <div className="glass-panel rounded-2xl p-8">
        <h1 className="font-headline-md text-headline-md text-primary mb-4">Profile Test Page</h1>
        <div className="space-y-2">
          <p><strong>Is Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Is Loading:</strong> {isLoading ? '⏳ Yes' : '✅ No'}</p>
          <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'No user'}</p>
        </div>
        <div className="mt-4 flex gap-4">
          <a href="/profile" className="btn-primary">Go to Profile</a>
          <a href="/" className="glass-panel px-6 py-3 rounded-xl text-primary hover:bg-white/50 transition-colors">Go Home</a>
        </div>
      </div>
    </div>
  )
}