'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'

interface Product {
  _id: string
  id?: string
  name: string
  category: string
  price: number
  rating?: number
  reviews?: number
  image: string
  temperature?: string
  temperament?: string
  stock?: number
  status?: string
}

export function ProductCard({ product }: { product: Product }) {
  const [imageError, setImageError] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  
  const addItem = useCartStore((state) => state.addItem)
  const { isInWishlist, toggleItem } = useWishlistStore()

  const productId = product._id || product.id || ''
  const isWishlisted = isInWishlist(productId)
  const isInStock = (product.stock ?? 0) > 0 && product.status === 'Active'

  const displayImage = product.image || 
    'https://via.placeholder.com/400x300/00696b/ffffff?text=' + encodeURIComponent(product.name)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isInStock) return

    addItem({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock ?? 0,
    })
    
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem(productId)
  }

  return (
    <div className="glass-panel rounded-xl overflow-hidden group hover:shadow-[0_20px_40px_-15px_rgba(0,105,107,0.15)] transition-all duration-300">
      <Link href={`/product/${productId}`}>
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
          {!imageError ? (
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary/40 font-bold text-lg p-4 text-center">
              {product.name}
            </div>
          )}

          {/* Rating Badge */}
          {product.rating !== undefined && product.rating > 0 && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <span className="text-yellow-500 text-sm">★</span>
              <span className="text-xs font-bold text-on-surface">{product.rating}</span>
              {product.reviews !== undefined && (
                <span className="text-xs text-on-surface-variant">({product.reviews})</span>
              )}
            </div>
          )}

          {/* Out of Stock Badge */}
          {!isInStock && (
            <div className="absolute top-3 right-3 bg-error text-white px-2 py-1 rounded-full text-xs font-semibold">
              Out of Stock
            </div>
          )}

          {/* Wishlist Button */}
          {isInStock && (
            <button
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-outline hover:text-error transition-colors hover:bg-white"
              aria-label="Toggle wishlist"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isWishlisted ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </button>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="text-xs font-semibold text-primary mb-1 uppercase tracking-wide">
          {product.category}
        </div>

        <Link href={`/product/${productId}`}>
          <h3 className="font-semibold text-[17px] text-on-surface leading-tight mb-2 hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-3 text-on-surface-variant mb-4 text-xs">
          {product.temperature && (
            <div className="flex items-center gap-1">
              <span>🌡️</span>
              <span>{product.temperature}</span>
            </div>
          )}
          {product.temperament && (
            <div className="flex items-center gap-1">
              <span>💧</span>
              <span>{product.temperament}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-lg text-on-surface">
            LKR {product.price.toLocaleString()}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 ${
              isInStock
                ? 'bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-secondary text-white shadow-primary/30'
                : 'bg-surface-variant text-outline cursor-not-allowed'
            }`}
            aria-label="Add to cart"
          >
            {addedToCart ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}