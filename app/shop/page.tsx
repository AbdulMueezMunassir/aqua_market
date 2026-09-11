'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProductCard } from '@/components/marketplace/ProductCard'

interface Product {
  _id: string
  name: string
  scientificName?: string
  category: string
  price: number
  stock: number
  status: string
  image: string
  description?: string
  temperature?: string
  pH?: string
  tankSize?: string
  maxSize?: string
  diet?: string
  temperament?: string
  rating?: number
  reviews?: number
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

  // URL params
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
    pages: 0,
  })

  // Sync state when URL changes
  useEffect(() => {
    setSelectedCategory(categoryParam)
    setSearchQuery(searchParam)
    setSortBy(sortParam)
  }, [categoryParam, searchParam, sortParam])

  // Fetch categories once
  useEffect(() => {
    fetchCategories()
  }, [])

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, sortBy, pageParam, searchParam])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/products?limit=100')
      if (!response.ok) return
      const data = await response.json()
      const cats: string[] = Array.from(
        new Set((data.products || []).map((p: Product) => p.category))
      ) as string[]
      setCategories(['all', ...cats])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({
        category: selectedCategory,
        sort: sortBy,
        page: pageParam.toString(),
        limit: '12',
      })
      if (searchParam) params.set('search', searchParam)

      const response = await fetch(`/api/products?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()

      setProducts(data.products || [])
      setPagination(
        data.pagination || { total: 0, page: 1, limit: 12, pages: 0 }
      )
    } catch (error: any) {
      console.error('Error fetching products:', error)
      setError(error.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || value === 'all') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
      // Reset to page 1 on filter change
      if (!updates.page) params.delete('page')
      router.push(`/shop?${params.toString()}`)
    },
    [searchParams, router]
  )

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setPagination((p) => ({ ...p, page: 1 }))
    updateUrl({ category: category === 'all' ? null : category })
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    setPagination((p) => ({ ...p, page: 1 }))
    updateUrl({ sort })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination((p) => ({ ...p, page: 1 }))
    updateUrl({ search: searchQuery.trim() || null })
  }

  const handlePageChange = (newPage: number) => {
    setPagination((p) => ({ ...p, page: newPage }))
    updateUrl({ page: newPage.toString() })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setSelectedCategory('all')
    setSearchQuery('')
    setSortBy('-createdAt')
    setPagination((p) => ({ ...p, page: 1 }))
    router.push('/shop')
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
            {pagination.total} premium aquatic{' '}
            {pagination.total === 1 ? 'species' : 'species'} available
          </p>
        </div>

        <button
          onClick={clearFilters}
          className="text-sm text-primary hover:underline self-start"
        >
          Clear All Filters
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-8 p-4 glass-panel rounded-xl">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 min-w-[220px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-surface-container-low rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-primary outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 absolute left-3 top-2.5 text-outline"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
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

      {/* Error */}
      {error && (
        <div className="bg-error-container/20 text-error p-4 rounded-lg mb-6 border border-error/20">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="glass-panel rounded-xl h-80 animate-pulse bg-surface-container-high"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Empty */
        <div className="glass-panel rounded-2xl p-12 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-20 h-20 text-outline mx-auto mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="font-headline-md text-headline-md mb-2">
            No products found
          </h2>
          <p className="text-on-surface-variant mb-6">
            {searchParam
              ? `No results found for "${searchParam}"`
              : 'Try adjusting your filters'}
          </p>
          <button onClick={clearFilters} className="btn-primary inline-flex">
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
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