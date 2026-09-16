'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuth()
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    city: '',
    district: '',
    zipCode: '',
    paymentMethod: 'mock',
    notes: '',
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/checkout')
    }
  }, [authLoading, isAuthenticated, router])

  // Pre-fill user info
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        district: user.state || '',
        zipCode: user.zipCode || '',
      }))
    }
  }, [user])

  const subtotal = getTotalPrice()
  const totalItems = getTotalItems()
  const deliveryFee = subtotal > 5000 ? 0 : 500
  const tax = subtotal * 0.15
  const total = subtotal + deliveryFee + tax

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.phone.trim()) return setError('Phone number is required')
    if (!formData.address.trim()) return setError('Address is required')
    if (!formData.city.trim()) return setError('City is required')

    setLoading(true)

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        deliveryFee,
        tax,
        total,
        phone: formData.phone,
        paymentMethod: formData.paymentMethod,
        shipping: {
          address: formData.address,
          city: formData.city,
          state: formData.district,
          zipCode: formData.zipCode,
        },
        notes: formData.notes,
      }

      console.log('📦 Creating order:', orderData)

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()
      console.log('📦 Order response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      // Success — go to mock payment
      router.push(`/mock-payment/${data.orderId}`)
    } catch (err: any) {
      console.error('❌ Checkout error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Loading state (auth checking)
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="glass-panel rounded-2xl p-12 text-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-outline"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
          <h2 className="font-headline-md text-headline-md mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-on-surface-variant mb-6">
            Add some products to your cart before checking out.
          </p>
          <Link href="/shop" className="btn-primary inline-flex">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
      <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-8">
        Checkout
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Information */}
          <div className="glass-panel rounded-2xl p-8">
            <h2 className="font-headline-md text-headline-md mb-6">
              Delivery Information
            </h2>

            {error && (
              <div className="bg-error-container/20 text-error p-3 rounded-lg mb-6 text-sm border border-error/20">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    disabled
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 opacity-70 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 opacity-70 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0712345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    name="district"
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={formData.district}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={formData.zipCode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                  Order Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any special instructions..."
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="glass-panel rounded-2xl p-8">
            <h2 className="font-headline-md text-headline-md mb-6">
              Payment Method
            </h2>

            <div className="space-y-3">
              {/* Mock Payment */}
              <label className="flex items-center gap-3 p-4 border border-primary/50 rounded-lg bg-primary/5 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mock"
                  checked={formData.paymentMethod === 'mock'}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary"
                />
                <div className="flex-1">
                  <span className="font-medium">🧪 Mock Payment</span>
                  <p className="text-xs text-on-surface-variant">
                    Practice mode — no real money charged
                  </p>
                </div>
                <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full">
                  Recommended
                </span>
              </label>

              {/* Stripe (placeholder) */}
              <label className="flex items-center gap-3 p-4 border border-outline-variant/30 rounded-lg cursor-pointer hover:border-primary transition-colors opacity-60">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={formData.paymentMethod === 'stripe'}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary"
                />
                <div className="flex-1">
                  <span className="font-medium">💳 Credit/Debit Card</span>
                  <p className="text-xs text-on-surface-variant">
                    Coming soon
                  </p>
                </div>
                <span className="text-xs bg-surface-variant px-2 py-1 rounded-full">
                  Soon
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary (sticky) */}
        <div className="lg:col-span-1">
          <div className="glass-panel rounded-2xl p-6 sticky top-32">
            <h3 className="font-headline-md text-headline-md mb-4">
              Order Summary
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="truncate pr-2">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="whitespace-nowrap">
                    LKR {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-outline-variant/30 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Subtotal ({totalItems} items)</span>
                <span>LKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Delivery</span>
                <span>
                  {deliveryFee === 0
                    ? 'Free'
                    : `LKR ${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Tax (15%)</span>
                <span>LKR {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-outline-variant/30">
                <span>Total</span>
                <span className="text-primary">
                  LKR {total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Place Order · LKR {total.toLocaleString()}</>
              )}
            </button>

            <Link
              href="/cart"
              className="block text-center text-sm text-on-surface-variant hover:text-primary transition-colors mt-4"
            >
              ← Back to Cart
            </Link>

            <div className="mt-4 flex items-center justify-center gap-2 text-on-surface-variant opacity-70 text-xs">
              🔒 Secure Checkout
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}