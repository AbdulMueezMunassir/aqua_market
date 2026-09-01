'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Product {
  _id: string
  name: string
  category: string
  price: number
  rating: number
  reviews: number
  image: string
  stock: number
}

export default function PopularPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPopularProducts()
  }, [])

  const fetchPopularProducts = async () => {
    try {
      const response = await fetch('/api/products?sort=-rating&limit=12')
      const data = await response.json()
      setProducts(data.products)
    } catch (error) {
      console.error('Error fetching popular products:', error)
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
          🌟 Popular Products
        </h1>
        <p className="text-on-surface-variant mt-4">
          Discover what other aquarists love
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product._id} href={`/product/${product._id}`}>
            <div className="glass-panel rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image || 'https://via.placeholder.com/400x300/00696b/ffffff?text=' + product.name}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-medium">{product.rating || 0}</span>
                  <span className="text-xs text-on-surface-variant">({product.reviews || 0})</span>
                </div>
                <div className="absolute top-3 right-3 bg-primary text-white text-xs px-2 py-1 rounded-full">
                  Popular
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-on-surface-variant">{product.category}</p>
                <h3 className="font-semibold text-on-surface mt-1">{product.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-bold text-primary">LKR {product.price.toLocaleString()}</span>
                  {product.stock > 0 && (
                    <span className="text-xs text-green-600">In Stock</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-on-surface-variant">No popular products found yet.</p>
        </div>
      )}
    </div>
  )
}