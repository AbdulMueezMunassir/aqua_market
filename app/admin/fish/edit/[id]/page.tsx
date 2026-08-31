'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SideNavBar } from '@/components/dashboard/SideNavBar'

export default function EditFishPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    category: '',
    price: '',
    stock: '',
    status: 'Active',
    image: '',
    temperature: '',
    pH: '',
    tankSize: '',
    maxSize: '',
    diet: '',
    temperament: ''
  })

  useEffect(() => {
    fetchFish()
  }, [])

  const fetchFish = async () => {
    try {
      const response = await fetch('/api/admin/fish')
      const data = await response.json()
      const fish = data.find((f: any) => f.id === parseInt(params.id))
      if (fish) {
        setFormData({
          name: fish.name || '',
          scientificName: fish.scientificName || '',
          category: fish.category || '',
          price: fish.price?.toString() || '',
          stock: fish.stock?.toString() || '',
          status: fish.status || 'Active',
          image: fish.image || '',
          temperature: fish.temperature || '',
          pH: fish.pH || '',
          tankSize: fish.tankSize || '',
          maxSize: fish.maxSize || '',
          diet: fish.diet || '',
          temperament: fish.temperament || ''
        })
      }
    } catch (error) {
      console.error('Error fetching fish:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const response = await fetch('/api/admin/fish', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: parseInt(params.id),
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        })
      })
      
      if (response.ok) {
        router.push('/admin/fish')
      }
    } catch (error) {
      console.error('Error updating fish:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-panel rounded-xl p-6 space-y-4">
            <h3 className="font-headline-md text-headline-md mb-4">Basic Information</h3>
            
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                Common Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary outline-none"
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
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary outline-none"
                value={formData.scientificName}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                Category
              </label>
              <select
                name="category"
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary outline-none"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                <option value="Freshwater">Freshwater</option>
                <option value="Saltwater">Saltwater</option>
                <option value="Brackish">Brackish</option>
                <option value="Invertebrates">Invertebrates</option>
              </select>
            </div>
            
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                Status
              </label>
              <select
                name="status"
                className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary outline-none"
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
                  Price (LKR)
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary outline-none"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  required
                  className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary outline-none"
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
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary outline-none"
                    value={formData.temperature}
                    onChange={handleChange}
                    placeholder="72-78"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    pH Range
                  </label>
                  <input
                    type="text"
                    name="pH"
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary outline-none"
                    value={formData.pH}
                    onChange={handleChange}
                    placeholder="6.5-7.5"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Tank Size (Gal)
                  </label>
                  <input
                    type="text"
                    name="tankSize"
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary outline-none"
                    value={formData.tankSize}
                    onChange={handleChange}
                    placeholder="20"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Max Size (in)
                  </label>
                  <input
                    type="text"
                    name="maxSize"
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary outline-none"
                    value={formData.maxSize}
                    onChange={handleChange}
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Diet
                  </label>
                  <select
                    name="diet"
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary outline-none"
                    value={formData.diet}
                    onChange={handleChange}
                  >
                    <option value="">Select Diet</option>
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
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary outline-none"
                    value={formData.temperament}
                    onChange={handleChange}
                  >
                    <option value="">Select Temperament</option>
                    <option value="Peaceful">Peaceful</option>
                    <option value="Semi-Aggressive">Semi-Aggressive</option>
                    <option value="Aggressive">Aggressive</option>
                  </select>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={saving}
              className="w-full btn-primary justify-center py-4"
            >
              {saving ? 'Saving...' : 'Update Fish'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}