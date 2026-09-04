'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'

interface Product {
  _id: string
  name: string
  category: string
  price: number
  rating: number
  image: string
  stock: number
  status: string
}

export default function WishlistPage() {
  const { items, toggleItem } = useWishlistStore()
  const { addItem } = useCartStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (items.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }
    fetchWishlistItems()
  }, [items])

  const fetchWishlistItems = async () => {
    setLoading(true)
    setError('')
    try {
      // Fetch all products
      const response = await fetch('/api/products?limit=100')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      
      // Filter products that are in wishlist
      const wishlistProducts = data.products.filter((p: any) => 
        items.includes(p._id)
      )
      setProducts(wishlistProducts)
    } catch (error: any) {
      console.error('Error fetching wishlist:', error)
      setError(error.message || 'Failed to load wishlist')
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

  const handleRemoveFromWishlist = (productId: string) => {
    toggleItem(productId)
    // Remove from local state
    setProducts(products.filter(p => p._id !== productId))
  }

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary">
          My Wishlist
        </h1>
        <p className="text-on-surface-variant mt-2">
          {items.length} item{items.length !== 1 ? 's' : ''} in your wishlist
        </p>
      </div>

      {error && (
        <div className="bg-error-container/20 text-error p-4 rounded-lg mb-6 border border-error/20">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-outline">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </div>
          <h2 className="font-headline-md text-headline-md mb-2">Your wishlist is empty</h2>
          <p className="text-on-surface-variant mb-6">Start exploring and save your favorite products!</p>
          <Link href="/shop" className="btn-primary inline-flex">
            Browse Products
          </Link>
        </div>
      ) : products.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <p className="text-on-surface-variant">Some items in your wishlist are no longer available.</p>
          <Link href="/shop" className="btn-primary inline-flex mt-4">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
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
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleRemoveFromWishlist(product._id)
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-error hover:text-outline transition-colors hover:bg-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </button>
                  {product.stock === 0 && (
                    <div className="absolute bottom-3 left-3 bg-error text-white px-2 py-1 rounded-full text-xs font-semibold">
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
                
                {product.rating > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-500 text-sm">★</span>
                    <span className="text-sm text-on-surface-variant">{product.rating}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-4">
                  <span className="font-headline-md text-headline-md text-primary font-bold">
                    LKR {product.price.toLocaleString()}
                  </span>
                  {product.stock > 0 && product.status === 'Active' ? (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="px-4 py-2 rounded-lg btn-primary text-sm"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <span className="text-sm text-on-surface-variant">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {products.length > 0 && items.length > products.length && (
        <div className="mt-6 glass-panel rounded-xl p-4 text-center">
          <p className="text-on-surface-variant text-sm">
            {items.length - products.length} item{items.length - products.length !== 1 ? 's' : ''} in your wishlist are no longer available.
          </p>
        </div>
      )}
    </div>
  )
}