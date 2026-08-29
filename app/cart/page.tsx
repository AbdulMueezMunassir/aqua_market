'use client'

import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCartStore()
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  const subtotal = getTotalPrice()
  const totalItems = getTotalItems()
  const deliveryFee = subtotal > 5000 ? 0 : 500
  const tax = subtotal * 0.15
  const total = subtotal + deliveryFee + tax

  if (items.length === 0) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="glass-panel rounded-2xl p-12 text-center max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-outline mx-auto mb-6 opacity-50">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Your cart is empty</h2>
          <p className="text-on-surface-variant mb-8">Looks like you haven't added any aquatic treasures yet. Explore our marketplace to find your next centerpiece.</p>
          <Link href="/shop" className="btn-primary inline-flex">
            Explore Marketplace
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-2">
          Shopping Cart
        </h1>
        <p className="text-on-surface-variant font-body-md">
          {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="glass-panel rounded-xl p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128x128/00696b/ffffff?text=' + item.name
                  }}
                />
              </div>
              
              {/* Details */}
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface">{item.name}</h3>
                      <p className="text-on-surface-variant text-sm">{item.category}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-on-surface-variant hover:text-error transition-colors p-1"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
                  <div className="flex items-center gap-2 bg-surface-container-low rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-surface rounded-md transition-colors"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-body-md">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-surface rounded-md transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="font-headline-md text-headline-md text-primary font-bold">
                    LKR {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Clear Cart */}
          <button
            onClick={clearCart}
            className="text-on-surface-variant hover:text-error transition-colors text-sm"
          >
            Clear Cart
          </button>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-panel rounded-xl p-6 sticky top-32">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6">
              Order Summary
            </h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal ({totalItems} items)</span>
                <span className="text-on-surface font-medium">LKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Delivery Fee</span>
                <span className="text-on-surface font-medium">
                  {deliveryFee === 0 ? 'Free' : `LKR ${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Tax (15%)</span>
                <span className="text-on-surface font-medium">LKR {tax.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="border-t border-outline-variant/30 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-headline-md text-headline-md text-on-surface">Total</span>
                <span className="font-headline-md text-headline-md text-primary font-bold">
                  LKR {total.toLocaleString()}
                </span>
              </div>
            </div>
            
            {/* Promo Code */}
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code"
                  className="flex-1 bg-surface-container-low rounded-lg px-4 py-2 text-body-md focus:ring-1 focus:ring-primary outline-none"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button
                  onClick={() => setPromoApplied(!promoApplied)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <p className="text-primary text-sm mt-2">✓ Promo code applied successfully!</p>
              )}
            </div>
            
            <Link href="/checkout" className="btn-primary w-full justify-center">
              Proceed to Checkout
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-on-surface-variant opacity-70 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}