'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@aquamarket.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/'

  // Only redirect if authenticated and not loading
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      console.log('✅ Already authenticated, redirecting to:', redirectPath)
      router.push(redirectPath)
    }
  }, [authLoading, isAuthenticated, router, redirectPath])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      // The login function handles redirect
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-margin-mobile py-12">
      <div className="w-full max-w-md">
        <div className="glass-panel rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              A
            </div>
            <h1 className="font-display-lg-mobile text-display-lg-mobile text-primary">
              Welcome Back
            </h1>
            <p className="text-on-surface-variant mt-2">
              Sign in to your Aqua Market account
            </p>
          </div>

          {error && (
            <div className="bg-error-container/20 text-error p-3 rounded-lg mb-6 text-sm border border-error/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary justify-center py-3"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-on-surface-variant">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-outline-variant/30">
            <div className="text-xs text-on-surface-variant/70 text-center space-y-1">
              <p className="font-medium text-on-surface-variant">Demo Accounts:</p>
              <p>Admin: admin@aquamarket.com / admin123</p>
              <p>Staff: staff@aquamarket.com / staff123</p>
              <p>Customer: customer@aquamarket.com / customer123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}