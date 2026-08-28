'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'

interface Product {
  id: number
  name: string
  category: string
  price: number
  rating: number
  image: string
  temperature?: string
  temperament?: string
  inStock: boolean
}

export function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <div className="glass-panel rounded-xl overflow-hidden group cursor-pointer hover:shadow-[0_20px_40px_-15px_rgba(0,105,107,0.15)] transition-all duration-300">
      <div className="relative h-48 w-full overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <PlaceholderImage text={product.name} className="w-full h-full" />
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <span className="text-yellow-500 text-sm">★</span>
          <span className="text-label-sm font-label-sm font-bold text-on-surface">{product.rating}</span>
        </div>
        
        {/* Wishlist Button */}
        <button 
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-outline hover:text-error transition-colors hover:bg-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </button>
      </div>
      
      <div className="p-4">
        <div className="text-label-sm font-label-sm text-primary mb-1 uppercase tracking-wide">
          {product.category}
        </div>
        <h3 className="font-headline-md text-[18px] font-semibold text-on-surface leading-tight mb-2">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-4 text-on-surface-variant mb-4">
          {product.temperature && (
            <div className="flex items-center gap-1">
              <span className="text-[16px]">🌡️</span>
              <span className="text-label-sm font-label-sm">{product.temperature}</span>
            </div>
          )}
          {product.temperament && (
            <div className="flex items-center gap-1">
              <span className="text-[16px]">💧</span>
              <span className="text-label-sm font-label-sm">{product.temperament}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="font-headline-md text-headline-md text-on-surface font-bold">
            LKR {product.price.toLocaleString()}
          </span>
          <button className="w-10 h-10 rounded-full btn-primary flex items-center justify-center p-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}