'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!formData.name.trim()) {
      setError('Full name is required')
      return
    }

    if (!formData.email.trim()) {
      setError('Email is required')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      }
      
      console.log('📤 Sending registration data:', registrationData)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      })

      const data = await response.json()
      console.log('📦 Registration response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      setSuccess('Account created successfully! Redirecting to login...')
      
      setTimeout(() => {
        router.push('/auth/login?registered=true')
      }, 1500)
    } catch (err: any) {
      console.error('❌ Registration error:', err)
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
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
              Create Account
            </h1>
            <p className="text-on-surface-variant mt-2">
              Join the Aqua Market community
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

          <form onSubmit={handleSubmit} className="space-y-5 relative">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full bg-surface-container-low/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all backdrop-blur-sm border border-transparent focus:border-primary/50"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-surface-container-low/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all backdrop-blur-sm border border-transparent focus:border-primary/50"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full bg-surface-container-low/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all backdrop-blur-sm border border-transparent focus:border-primary/50"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                className="w-full bg-surface-container-low/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all backdrop-blur-sm border border-transparent focus:border-primary/50"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
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
                    <span>Creating account...</span>
                  </>
                ) : (
                  'Create Account'
                )}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}