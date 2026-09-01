'use client'

import { useState, useEffect } from 'react'
import { SideNavBar } from '@/components/dashboard/SideNavBar'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Fish {
  _id: string
  name: string
  scientificName: string
  category: string
  price: number
  stock: number
  status: string
  image: string
  createdAt: string
}

export default function FishManagement() {
  const { token, isAdmin } = useAuth()
  const router = useRouter()
  const [fish, setFish] = useState<Fish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    if (!isAdmin) {
      router.push('/')
      return
    }
    fetchFish()
  }, [isAdmin, router])

  const fetchFish = async () => {
    try {
      const response = await fetch('/api/admin/fish', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (!response.ok) throw new Error('Failed to fetch fish')
      const data = await response.json()
      setFish(data)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteFish = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fish?')) return
    
    try {
      const response = await fetch(`/api/admin/fish?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (!response.ok) throw new Error('Failed to delete fish')
      await fetchFish()
    } catch (error: any) {
      setError(error.message)
    }
  }

  const filteredFish = fish.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || f.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...new Set(fish.map(f => f.category))]

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
      
      <main className="flex-1 md:ml-[280px] p-margin-mobile md:p-margin-desktop">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tight">
              Fish Management
            </h1>
            <p className="text-on-surface-variant font-body-md mt-2">
              Manage your premium aquatic livestock inventory.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="text"
              placeholder="Search fish..."
              className="glass-panel rounded-full px-4 py-2 font-body-md text-on-surface focus:ring-1 focus:ring-primary outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="glass-panel rounded-full px-4 py-2 font-body-md text-on-surface focus:ring-1 focus:ring-primary outline-none"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            <Link
              href="/admin/fish/add"
              className="btn-primary px-6 py-2 text-sm"
            >
              + Add Fish
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-error-container/20 text-error p-4 rounded-lg mb-6 border border-error/20">
            {error}
          </div>
        )}

        <div className="glass-panel rounded-xl overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/40 text-on-surface-variant font-label-sm text-label-sm bg-surface/30">
                <th className="py-4 px-6 font-medium">Image</th>
                <th className="py-4 px-6 font-medium">Fish Name</th>
                <th className="py-4 px-6 font-medium">Category</th>
                <th className="py-4 px-6 font-medium text-right">Price</th>
                <th className="py-4 px-6 font-medium text-right">Stock</th>
                <th className="py-4 px-6 font-medium text-center">Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-md divide-y divide-white/30">
              {filteredFish.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-on-surface-variant">
                    No fish found. Add your first fish!
                  </td>
                </tr>
              ) : (
                filteredFish.map((f) => (
                  <tr key={f._id} className="hover:bg-white/40 transition-colors group">
                    <td className="py-3 px-6">
                      <img
                        src={f.image || 'https://via.placeholder.com/48x48/00696b/ffffff?text=' + f.name}
                        alt={f.name}
                        className="w-12 h-12 rounded-lg object-cover shadow-sm"
                      />
                    </td>
                    <td className="py-3 px-6">
                      <div className="font-semibold text-on-surface">{f.name}</div>
                      <div className="text-xs text-on-surface-variant mt-0.5 italic">{f.scientificName}</div>
                    </td>
                    <td className="py-3 px-6 text-on-surface-variant">{f.category}</td>
                    <td className="py-3 px-6 text-right font-medium">LKR {f.price.toLocaleString()}</td>
                    <td className={`py-3 px-6 text-right ${f.stock === 0 ? 'text-error font-medium' : ''}`}>
                      {f.stock}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        f.status === 'Active'
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : f.status === 'Out of Stock'
                          ? 'bg-error/10 text-error border border-error/20'
                          : 'bg-surface-variant text-on-surface-variant border border-outline-variant'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/fish/edit/${f._id}`}
                          className="p-1.5 text-on-surface-variant hover:text-primary rounded-md hover:bg-primary-container/20 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => deleteFish(f._id)}
                          className="p-1.5 text-on-surface-variant hover:text-error rounded-md hover:bg-error-container/50 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}