'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'

interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
}

interface Order {
  _id: string
  orderId: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
  status: string
  paymentStatus: string
  shipping: {
    address: string
    city: string
    state?: string
    zipCode?: string
  }
  createdAt: string
}

export default function MockPaymentPage() {
  const params = useParams()
  const router = useRouter()
  const { token, isAuthenticated, isLoading: authLoading } = useAuth()
  const { clearCart } = useCartStore()

  const orderId = params?.orderId as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/auth/login?redirect=/mock-payment/${orderId}`)
    }
  }, [authLoading, isAuthenticated, router, orderId])

  // Fetch the order
  useEffect(() => {
    if (!orderId || !token) return

    const fetchOrder = async () => {
      try {
        const response = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) throw new Error('Failed to fetch order')
        const orders: Order[] = await response.json()
        const found = orders.find((o) => o.orderId === orderId)
        if (!found) throw new Error('Order not found')
        setOrder(found)
      } catch (err: any) {
        console.error('Error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, token])

  const handleSimulateSuccess = async () => {
    if (!order) return
    setProcessing(true)
    setError('')

    try {
      // Simulate network delay for realism
      await new Promise((resolve) => setTimeout(resolve, 1200))

      // Clear the cart now that "payment" is done
      clearCart()

      // Redirect to success page
      router.push(`/order-success?orderId=${order.orderId}&mock=true`)
    } catch (err: any) {
      setError(err.message || 'Payment failed')
      setProcessing(false)
    }
  }

  const handleCancel = () => {
    router.push('/cart')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="glass-panel rounded-2xl p-12 text-center max-w-lg mx-auto">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="font-headline-md text-headline-md mb-2">
            Order Not Found
          </h2>
          <p className="text-on-surface-variant mb-6">
            {error || 'We could not find this order.'}
          </p>
          <Link href="/orders" className="btn-primary inline-flex">
            View My Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 mb-4">
            <span className="text-3xl">🧪</span>
          </div>
          <h1 className="font-display-lg-mobile text-display-lg-mobile text-primary mb-2">
            Mock Payment
          </h1>
          <p className="text-on-surface-variant">
            Practice mode — no real money will be charged
          </p>
        </div>

        {/* Order Info */}
        <div className="glass-panel rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-outline-variant/30">
            <div>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider">
                Order ID
              </p>
              <p className="font-semibold text-primary">{order.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider">
                Amount
              </p>
              <p className="font-bold text-lg">
                LKR {order.total.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2 mb-4">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between text-sm text-on-surface-variant"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>
                  LKR {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-outline-variant/30 space-y-2 text-sm">
            <div className="flex justify-between text-on-surface-variant">
              <span>Subtotal</span>
              <span>LKR {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Delivery</span>
              <span>
                {order.deliveryFee === 0
                  ? 'Free'
                  : `LKR ${order.deliveryFee.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Tax</span>
              <span>LKR {order.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-outline-variant/30">
              <span>Total</span>
              <span className="text-primary">
                LKR {order.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="glass-panel rounded-2xl p-6 mb-6">
          <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-3">
            Shipping To
          </h3>
          <p className="text-on-surface">{order.shipping.address}</p>
          <p className="text-on-surface-variant text-sm">
            {[
              order.shipping.city,
              order.shipping.state,
              order.shipping.zipCode,
            ]
              .filter(Boolean)
              .join(', ')}
          </p>
        </div>

        {error && (
          <div className="bg-error-container/20 text-error p-3 rounded-lg mb-6 text-sm border border-error/20">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="glass-panel rounded-2xl p-6 bg-yellow-500/5 border-yellow-500/20">
          <div className="text-center mb-4">
            <p className="text-sm text-on-surface-variant">
              This is a <strong>mock payment</strong>. Click the button below to
              simulate a successful payment.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={processing}
              className="flex-1 px-6 py-3 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSimulateSuccess}
              disabled={processing}
              className="flex-1 btn-primary justify-center py-3"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>✅ Simulate Payment</>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-on-surface-variant mt-6">
          🧪 Practice mode — no real card required
        </p>
      </div>
    </div>
  )
}