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
  stock?: number
  status?: string
}

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=8')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      // Fallback to sample data
      setProducts([
        {
          _id: '1',
          name: 'Dwarf Gourami',
          category: 'Gourami',
          price: 1200,
          rating: 4.8,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBf_iQ31_Ymd1Vi7bzqCc31JKpj4HaRizJhJ_BNFR-zBvXN5awpm_NimtAqzp9ZJ0W2rF4JppkvA_CQglMT4yPZGzwDbnZgau5yma4NHrExCIn4B3XTgul56kGT29ygaMt3IJLifsMYdtj6vnk-FNODJg9sWdAM5hohXhUO9OTv4mbK8yFeOkWLqcEvZOyTBEkcB0TNxYQZuUuLsXU4wyS8HvAp1oqMLTSJClIr09YTxvZR7DJLI9nB',
          temperature: '72-82°F',
          temperament: 'Peaceful',
          stock: 10,
          status: 'Active'
        },
        {
          _id: '2',
          name: 'Neon Tetra (School of 6)',
          category: 'Tetra',
          price: 1800,
          rating: 4.9,
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdigo_xLo_nqqSOkh7Jrh--65-heJgz3GKbuHg7mXlk_RSH7rLtDGlqKWoGNGW0ff2DgoZNw2TcCg_Zxo0b2jXip3s6fvvOFkPIoLZkSgYK9-lByA-Q6ZgsnH9Q9XccQKOrQSgb63QE4m3kCAD05hqIR6GJ5GU-GfcOFkw-S3QC1Bs_Wdt4mV25IFDdxZ-UIsXu5xTnhrk4W_TJDW-wdb5-5Wf4TKUwjdRGkl5uzAMLgaIiMipTbA7',
          temperature: '70-81°F',
          temperament: 'Peaceful',
          stock: 20,
          status: 'Active'
        }
      ])
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}