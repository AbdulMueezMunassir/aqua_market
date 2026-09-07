'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from './ProductCard'

interface Product {
  _id: string
  name: string
  category: string
  price: number
  rating: number
  image: string
  temperature?: string
  temperament?: string
  stock: number
  status: string
}

export function ProductGrid({ limit = 8 }: { limit?: number }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [limit])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/products?limit=${limit}&sort=-createdAt`)
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error: any) {
      console.error('Error fetching products:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-panel rounded-xl h-80 animate-pulse bg-surface-container-high" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center">
        <p className="text-error">Error loading products: {error}</p>
        <button onClick={fetchProducts} className="btn-primary mt-4">
          Try Again
        </button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-on-surface-variant">No products available yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}