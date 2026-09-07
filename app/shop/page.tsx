'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'

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

interface Pagination {
  total: number
  page: number
  limit: number
  pages: number
}

export default function ShopPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get query params
  const categoryParam = searchParams.get('category') || 'all'
  const searchParam = searchParams.get('search') || ''
  const sortParam = searchParams.get('sort') || '-createdAt'
  const pageParam = parseInt(searchParams.get('page') || '1')
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<string[]>(['all'])
  const [selectedCategory, setSelectedCategory] = useState(categoryParam)
  const [searchQuery, setSearchQuery] = useState(searchParam)
  const [sortBy, setSortBy] = useState(sortParam)
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: pageParam,
    limit: 12,
    pages: 0
  })
  
  const { addItem, getItemCount } = useCartStore()
  const { isInWishlist, toggleItem } = useWishlistStore()

  // Fetch categories
  useEffect(() => {
    fetchCategories()
  }, [])

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, sortBy, pagination.page, searchQuery])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/products?limit=100')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      const cats = ['all', ...new Set(data.products.map((p: any) => p.category))]
      setCategories(cats)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const url = new URL('/api/products', window.location.origin)
      url.searchParams.set('category', selectedCategory)
      url.searchParams.set('sort', sortBy)
      url.searchParams.set('page', pagination.page.toString())
      url.searchParams.set('limit', pagination.limit.toString())
      if (searchQuery) {
        url.searchParams.set('search', searchQuery)
      }
      
      const response = await fetch(url.toString())
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      
      setProducts(data.products || [])
      setPagination(data.pagination || { total: 0, page: 1, limit: 12, pages: 0 })
    } catch (error: any) {
      console.error('Error fetching products:', error)
      setError(error.message || 'Failed to load products')
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

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setPagination({ ...pagination, page: 1 })
    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    params.delete('page')
    router.push(`/shop?${params.toString()}`)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    setPagination({ ...pagination, page: 1 })
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sort)
    params.delete('page')
    router.push(`/shop?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination({ ...pagination, page: 1 })
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery.trim()) {
      params.set('search', searchQuery)
    } else {
      params.delete('search')
    }
    params.delete('page')
    router.push(`/shop?${params.toString()}`)
    fetchProducts()
  }

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage })
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/shop?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedCategory('all')
    setSearchQuery('')
    setSortBy('-createdAt')
    setPagination({ ...pagination, page: 1 })
    router.push('/shop')
  }

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-panel rounded-xl h-80 animate-pulse bg-surface-container-high" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary">
            Shop All Fish
          </h1>
          <p className="text-on-surface-variant mt-2">
            {pagination.total} premium aquatic species available
          </p>
        </div>
        
        <button
          onClick={clearFilters}
          className="text-sm text-primary hover:underline"
        >
          Clear All Filters
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-8 p-4 glass-panel rounded-xl">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-surface-container-low rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-primary outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-3 top-2.5 text-outline">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
        </form>
        
        {/* Category Filter */}
        <select
          className="bg-surface-container-low rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none min-w-[150px]"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
        
        {/* Sort */}
        <select
          className="bg-surface-container-low rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none min-w-[150px]"
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="-createdAt">Newest</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
          <option value="-rating">Top Rated</option>
        </select>
        
        {/* Results count */}
        <span className="text-sm text-on-surface-variant ml-auto">
          {pagination.total} results
        </span>
      </div>

      {error && (
        <div className="bg-error-container/20 text-error p-4 rounded-lg mb-6 border border-error/20">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-outline mx-auto mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="font-headline-md text-headline-md mb-2">No products found</h2>
          <p className="text-on-surface-variant mb-6">
            {searchQuery ? `No results found for "${searchQuery}"` : 'Try adjusting your filters'}
          </p>
          <button onClick={clearFilters} className="btn-primary inline-flex">
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const inCartCount = getItemCount(product._id)
              const isWishlisted = isInWishlist(product._id)
              
              return (
                <div key={product._id} className="glass-panel rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <Link href={`/product/${product._id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.image || 'https://via.placeholder.com/400x300/00696b/ffffff?text=' + encodeURIComponent(product.name)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/00696b/ffffff?text=' + encodeURIComponent(product.name)
                        }}
                      />
                      {product.rating > 0 && (
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <span className="text-yellow-500 text-sm">★</span>
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-xs text-on-surface-variant">({product.reviews})</span>
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute bottom-3 left-3 bg-error text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Out of Stock
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleItem(product._id)
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center hover:text-error transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                      </button>
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    <Link href={`/product/${product._id}`}>
                      <h3 className="font-headline-md text-[18px] font-semibold text-on-surface hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-on-surface-variant">{product.category}</p>
                    
                    {product.temperature && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-on-surface-variant">
                        <span>🌡️</span>
                        <span>{product.temperature}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-headline-md text-headline-md text-primary font-bold">
                        LKR {product.price.toLocaleString()}
                      </span>
                      {product.stock > 0 && product.status === 'Active' ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleAddToCart(product)
                          }}
                          className="px-4 py-2 rounded-lg btn-primary text-sm"
                        >
                          {inCartCount > 0 ? `✓ ${inCartCount}` : 'Add to Cart'}
                        </button>
                      ) : (
                        <span className="text-sm text-on-surface-variant">Out of Stock</span>
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
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-lg border border-outline-variant/30 hover:bg-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                  let pageNum
                  if (pagination.pages <= 5) {
                    pageNum = i + 1
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1
                  } else if (pagination.page >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i
                  } else {
                    pageNum = pagination.page - 2 + i
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        pagination.page === pageNum
                          ? 'bg-primary text-white'
                          : 'hover:bg-white/50 border border-outline-variant/30'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
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