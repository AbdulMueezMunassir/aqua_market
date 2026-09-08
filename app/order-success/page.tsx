'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export default function OrderSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const isMock = searchParams.get('mock') === 'true'

  useEffect(() => {
    if (!orderId) {
      router.push('/')
    }
  }, [orderId, router])

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 min-h-[60vh] flex items-center justify-center">
      <div className="glass-panel rounded-2xl p-12 text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="font-display-lg-mobile text-display-lg-mobile mb-4">Order Placed Successfully! 🎉</h1>
        
        {isMock && (
          <div className="bg-yellow-500/10 text-yellow-600 p-3 rounded-lg mb-4 text-sm border border-yellow-500/20">
            🧪 This was a mock payment for practice. No real money was charged.
          </div>
        )}
        
        <p className="text-on-surface-variant mb-2">
          Thank you for your order! Your order has been confirmed.
        </p>
        {orderId && (
          <p className="text-on-surface-variant mb-8">
            Order ID: <span className="font-medium text-primary">{orderId}</span>
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/orders" className="btn-primary">
            View My Orders
          </Link>
          <Link href="/shop" className="glass-panel px-6 py-3 rounded-xl text-primary hover:bg-white/50 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}