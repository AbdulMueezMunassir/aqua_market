'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Category {
  name: string
  count: number
  image: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      
      // Group products by category
      const categoryMap: Record<string, number> = {}
      data.products.forEach((p: any) => {
        categoryMap[p.category] = (categoryMap[p.category] || 0) + 1
      })
      
      const categoryImages: Record<string, string> = {
        'Freshwater': 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=300&fit=crop',
        'Saltwater': 'https://images.unsplash.com/photo-1570623375749-bf5f236ab057?w=400&h=300&fit=crop',
        'Invertebrates': 'https://images.unsplash.com/photo-1560439514-6b0d07c2ac1d?w=400&h=300&fit=crop',
        'Plants': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
        'Equipment': 'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=400&h=300&fit=crop',
        'Brackish': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      }
      
      const categoriesData = Object.entries(categoryMap).map(([name, count]) => ({
        name,
        count,
        image: categoryImages[name] || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'
      }))
      
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
      <div className="mb-12 text-center">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary">
          Explore Categories
        </h1>
        <p className="text-on-surface-variant mt-4 max-w-2xl mx-auto">
          Browse our premium aquatic life and equipment by category
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/shop?category=${encodeURIComponent(category.name)}`}
            className="group relative overflow-hidden rounded-2xl h-64 glass-panel hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url('${category.image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="font-headline-md text-headline-md">{category.name}</h3>
              <p className="text-sm opacity-90">{category.count} products</p>
              <div className="mt-3 inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm hover:bg-white/30 transition-colors">
                Browse →
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-on-surface-variant">No categories available yet.</p>
        </div>
      )}
    </div>
  )
}