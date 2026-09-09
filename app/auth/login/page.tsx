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
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

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
        <div className="relative glass-panel rounded-2xl p-8 shadow-xl backdrop-blur-2xl bg-white/70 border border-white/40">
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-primary/10 blur-2xl" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-secondary/10 blur-2xl" />
          
          <div className="text-center mb-8 relative">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-primary/20">
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
            <div className="bg-error-container/20 text-error p-3 rounded-lg mb-6 text-sm border border-error/20 flex items-start gap-2">
              <span className="text-lg">❌</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full bg-surface-container-low/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all backdrop-blur-sm border border-transparent focus:border-primary/50"
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
                className="w-full bg-surface-container-low/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all backdrop-blur-sm border border-transparent focus:border-primary/50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary justify-center py-3 text-base relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-on-surface-variant">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-primary hover:underline font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-outline-variant/30">
            <div className="text-xs text-on-surface-variant/70 text-center space-y-1">
              <p className="font-medium text-on-surface-variant">Demo Accounts:</p>
              <p className="font-mono text-xs">Admin: admin@aquamarket.com / admin123</p>
              <p className="font-mono text-xs">Staff: staff@aquamarket.com / staff123</p>
              <p className="font-mono text-xs">Customer: customer@aquamarket.com / customer123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}