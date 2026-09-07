'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { SideNavBar } from '@/components/dashboard/SideNavBar'
import { useAuth } from '@/context/AuthContext'

export default function EditFishPage() {
  const router = useRouter()
  const params = useParams()
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    category: 'Freshwater',
    price: '',
    stock: '',
    status: 'Active',
    image: '',
    description: '',
    temperature: '',
    pH: '',
    tankSize: '',
    maxSize: '',
    diet: 'Omnivore',
    temperament: 'Peaceful',
  })

  const fishId = params.id as string

  useEffect(() => {
    fetchFish()
  }, [fishId])

  const fetchFish = async () => {
    try {
      const response = await fetch(`/api/products/${fishId}`)
      if (!response.ok) throw new Error('Fish not found')
      const data = await response.json()
      setFormData({
        name: data.name || '',
        scientificName: data.scientificName || '',
        category: data.category || 'Freshwater',
        price: data.price?.toString() || '',
        stock: data.stock?.toString() || '',
        status: data.status || 'Active',
        image: data.image || '',
        description: data.description || '',
        temperature: data.temperature || '',
        pH: data.pH || '',
        tankSize: data.tankSize || '',
        maxSize: data.maxSize || '',
        diet: data.diet || 'Omnivore',
        temperament: data.temperament || 'Peaceful',
      })
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const response = await fetch('/api/admin/fish', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: fishId,
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to update fish')

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/fish')
      }, 2000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <SideNavBar />
        <main className="flex-1 md:ml-[280px] p-margin-mobile md:p-margin-desktop flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SideNavBar />
      
      <main className="flex-1 md:ml-[280px] p-margin-mobile md:p-margin-desktop pb-32">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
              Edit Fish
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Update fish details
            </p>
          </div>
          <button
            onClick={() => router.push('/admin/fish')}
            className="px-6 py-2 rounded-xl glass-panel text-primary hover:bg-white/50 transition-colors"
          >
            Cancel
          </button>
        </div>

        {error && (
          <div className="bg-error-container/20 text-error p-4 rounded-lg mb-6 border border-error/20">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 text-green-600 p-4 rounded-lg mb-6 border border-green-500/20">
            ✅ Fish updated successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-panel rounded-xl p-6 space-y-4">
            <h3 className="font-headline-md text-headline-md mb-4">Basic Information</h3>
            
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                Common Name *
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                Scientific Name
              </label>
              <input
                type="text"
                name="scientificName"
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all italic"
                value={formData.scientificName}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                Category *
              </label>
              <select
                name="category"
                required
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Freshwater">Freshwater</option>
                <option value="Saltwater">Saltwater</option>
                <option value="Brackish">Brackish</option>
                <option value="Invertebrates">Invertebrates</option>
                <option value="Plants">Plants</option>
                <option value="Equipment">Equipment</option>
              </select>
            </div>
            
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                Status
              </label>
              <select
                name="status"
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="glass-panel rounded-xl p-6 space-y-4">
              <h3 className="font-headline-md text-headline-md mb-4">Pricing & Stock</h3>
              
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                  Price (LKR) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  required
                  min="0"
                  className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="glass-panel rounded-xl p-6 space-y-4">
              <h3 className="font-headline-md text-headline-md mb-4">Species Requirements</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Temperature (°F)
                  </label>
                  <input
                    type="text"
                    name="temperature"
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="72-78"
                    value={formData.temperature}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    pH Range
                  </label>
                  <input
                    type="text"
                    name="pH"
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="6.5-7.5"
                    value={formData.pH}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Tank Size (Gal)
                  </label>
                  <input
                    type="text"
                    name="tankSize"
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="20"
                    value={formData.tankSize}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Max Size (in)
                  </label>
                  <input
                    type="text"
                    name="maxSize"
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="3"
                    value={formData.maxSize}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Diet
                  </label>
                  <select
                    name="diet"
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={formData.diet}
                    onChange={handleChange}
                  >
                    <option value="Omnivore">Omnivore</option>
                    <option value="Carnivore">Carnivore</option>
                    <option value="Herbivore">Herbivore</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Temperament
                  </label>
                  <select
                    name="temperament"
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={formData.temperament}
                    onChange={handleChange}
                  >
                    <option value="Peaceful">Peaceful</option>
                    <option value="Semi-Aggressive">Semi-Aggressive</option>
                    <option value="Aggressive">Aggressive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-6 space-y-4">
              <h3 className="font-headline-md text-headline-md mb-4">Description</h3>
              <textarea
                name="description"
                rows={4}
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                placeholder="Describe the fish, its natural habitat, and care requirements..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            
            <button
              type="submit"
              disabled={saving}
              className="w-full btn-primary justify-center py-4"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Update Fish'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}