'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

interface Product {
  _id: string
  name: string
  scientificName: string
  category: string
  price: number
  stock: number
  status: string
  image: string
  description: string
  temperature: string
  pH: string
  tankSize: string
  maxSize: string
  diet: string
  temperament: string
  rating: number
  reviews: number
}

const categories = ['all', 'Freshwater', 'Saltwater', 'Brackish', 'Invertebrates', 'Plants', 'Equipment']

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('-createdAt')
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, pages: 0 })
  const { addItem, getItemCount } = useCartStore()

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, sortBy, pagination.page])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const url = `/api/products?category=${selectedCategory}&sort=${sortBy}&page=${pagination.page}&limit=${pagination.limit}`
      const response = await fetch(url)
      const data = await response.json()
      setProducts(data.products)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
    })
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary">
            Shop All Fish
          </h1>
          <p className="text-on-surface-variant mt-2">
            {pagination.total} premium aquatic species available
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <select
            className="bg-surface-container-low rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          
          <select
            className="bg-surface-container-low rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="-createdAt">Newest</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-panel rounded-xl h-80 animate-pulse bg-surface-container-high" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-on-surface-variant">No products found in this category.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const inCartCount = getItemCount(product._id)
              return (
                <div key={product._id} className="glass-panel rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <Link href={`/product/${product._id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.image || 'https://via.placeholder.com/400x300/00696b/ffffff?text=' + product.name}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.rating > 0 && (
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <span className="text-yellow-500 text-sm">★</span>
                          <span className="text-sm font-medium">{product.rating}</span>
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute top-3 right-3 bg-error text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Out of Stock
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    <Link href={`/product/${product._id}`}>
                      <h3 className="font-headline-md text-[18px] font-semibold text-on-surface hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-on-surface-variant">{product.category}</p>
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-headline-md text-headline-md text-primary font-bold">
                        LKR {product.price.toLocaleString()}
                      </span>
                      {product.stock > 0 && (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="px-4 py-2 rounded-lg btn-primary text-sm"
                        >
                          {inCartCount > 0 ? `✓ ${inCartCount}` : 'Add to Cart'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-lg border border-outline-variant/30 hover:bg-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 rounded-lg border border-outline-variant/30 hover:bg-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}