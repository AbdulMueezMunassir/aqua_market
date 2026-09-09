'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EditProfilePage() {
  const { user, token, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoading && !isAuthenticated && mounted) {
      router.push('/auth/login?redirect=/profile/edit')
    }
  }, [isLoading, isAuthenticated, router, mounted])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
      })
    }
  }, [user])

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      // Update local user data
      const updatedUser = { ...user, ...formData }
      localStorage.setItem('auth_user', JSON.stringify(updatedUser))
      
      setSuccess('Profile updated successfully!')
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/profile')
      }, 2000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
      <div className="glass-panel rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display-lg-mobile text-display-lg-mobile text-primary">
              Edit Profile
            </h1>
            <p className="text-on-surface-variant mt-1">
              Update your personal information
            </p>
          </div>
          <Link
            href="/profile"
            className="px-4 py-2 rounded-lg glass-panel text-primary hover:bg-white/50 transition-colors"
          >
            Cancel
          </Link>
        </div>

        {success && (
          <div className="bg-green-500/10 text-green-600 p-3 rounded-lg mb-6 text-sm border border-green-500/20">
            ✅ {success}
          </div>
        )}

        {error && (
          <div className="bg-error-container/20 text-error p-3 rounded-lg mb-6 text-sm border border-error/20">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="0712345678"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="123 Main Street"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="Colombo"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">
                State/Province
              </label>
              <input
                type="text"
                name="state"
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="Western"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">
                Postal Code
              </label>
              <input
                type="text"
                name="zipCode"
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="10000"
                value={formData.zipCode}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary justify-center py-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Save Changes'
              )}
            </button>
            <Link
              href="/profile"
              className="flex-1 px-6 py-3 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}