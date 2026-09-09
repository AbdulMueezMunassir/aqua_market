'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/'
  const registered = searchParams.get('registered')

  // Show success message if just registered
  useEffect(() => {
    if (registered === 'true') {
      setSuccess('Account created successfully! Please login.')
    }
  }, [registered])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectPath)
    }
  }, [isAuthenticated, router, redirectPath])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    // Validate
    if (!email.trim()) {
      setError('Email is required')
      setIsLoading(false)
      return
    }

    if (!password.trim()) {
      setError('Password is required')
      setIsLoading(false)
      return
    }

    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
      setIsLoading(false)
    }
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

          {success && (
            <div className="bg-green-500/10 text-green-600 p-3 rounded-lg mb-6 text-sm border border-green-500/20 flex items-start gap-2">
              <span className="text-lg">✅</span>
              <span>{success}</span>
            </div>
          )}

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
                disabled={isLoading}
                autoComplete="email"
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
                disabled={isLoading}
                autoComplete="current-password"
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

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-outline-variant/30">
            <p className="text-xs text-center text-on-surface-variant mb-3">
              Demo Credentials
            </p>
            <div className="flex flex-col gap-2 text-xs">
              <button
                onClick={() => {
                  setEmail('admin@aquamarket.com')
                  setPassword('admin123')
                }}
                className="text-center p-2 rounded-lg bg-surface-container-low hover:bg-primary/10 transition-colors"
              >
                Admin: admin@aquamarket.com / admin123
              </button>
              <button
                onClick={() => {
                  setEmail('customer@aquamarket.com')
                  setPassword('customer123')
                }}
                className="text-center p-2 rounded-lg bg-surface-container-low hover:bg-primary/10 transition-colors"
              >
                Customer: customer@aquamarket.com / customer123
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}