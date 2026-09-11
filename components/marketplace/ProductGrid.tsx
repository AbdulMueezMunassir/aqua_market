'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from './ProductCard'

interface Product {
  _id: string
  name: string
  category: string
  price: number
  rating?: number
  reviews?: number
  image: string
  temperature?: string
  temperament?: string
  stock: number
  status: string
}

interface ProductGridProps {
  limit?: number
  category?: string
  search?: string
  sort?: string
  page?: number
}

export function ProductGrid({
  limit = 8,
  category = 'all',
  search = '',
  sort = '-createdAt',
  page = 1,
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [limit, category, search, sort, page])

  const fetchProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
        sort,
      })
      if (category && category !== 'all') params.set('category', category)
      if (search) params.set('search', search)

      const response = await fetch(`/api/products?${params.toString()}`)
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="glass-panel rounded-xl h-80 animate-pulse bg-surface-container-high"
          />
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
      <div className="glass-panel rounded-2xl p-12 text-center">
        <p className="text-on-surface-variant text-lg mb-2">No products found</p>
        <p className="text-on-surface-variant text-sm">
          Try adjusting your filters or search terms.
        </p>
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