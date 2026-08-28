'use client'

import { useState } from 'react'
import { ProductGrid } from '@/components/marketplace/ProductGrid'
import { CategoryFilter } from '@/components/marketplace/CategoryFilter'

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 10000])

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
      <div className="flex flex-col md:flex-row gap-gutter">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="glass-panel rounded-xl p-6 sticky top-36">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline-md text-headline-md text-on-surface">Filters</h2>
              <button className="text-label-sm font-label-sm text-primary hover:underline">
                Clear All
              </button>
            </div>
            
            <CategoryFilter 
              selected={selectedCategory}
              onChange={setSelectedCategory}
            />
            
            {/* Price Range */}
            <div className="mt-6">
              <h3 className="font-label-sm text-label-sm text-on-surface mb-3 uppercase tracking-wider">
                Price Range
              </h3>
              <input
                type="range"
                min="0"
                max="10000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full h-1 bg-surface-variant rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-label-sm font-label-sm text-on-surface-variant mt-2">
                <span>LKR 0</span>
                <span>LKR {priceRange[1].toLocaleString()}+</span>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
                All Fish
              </h1>
              <p className="text-body-md font-body-md text-on-surface-variant mt-1">
                Showing 1-12 of 142 products
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-body-md font-body-md text-on-surface-variant">Sort by:</span>
              <select className="bg-surface-container-lowest border border-outline-variant rounded-lg py-1.5 pl-3 pr-8 text-body-md focus:ring-1 focus:ring-primary-container focus:border-primary-container">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>
          
          <ProductGrid />
          
          <div className="mt-12 flex justify-center">
            <button className="glass-panel px-8 py-3 rounded-xl font-label-sm text-label-sm text-primary font-semibold hover:bg-white/50 transition-colors">
              Load More Fish
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}