'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PayHereCheckout } from '@/components/payment/PayHereCheckout'

export default function CheckoutPage() {
  const router = useRouter()
  const { user, token, isAuthenticated } = useAuth()
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderCreated, setOrderCreated] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'payhere',
    notes: '',
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    if (items.length === 0) {
      router.push('/cart')
      return
    }
    if (user) {
      setFormData(prev => ({
        ...prev,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
      }))
    }
  }, [isAuthenticated, user, items, router])

  const subtotal = getTotalPrice()
  const totalItems = getTotalItems()
  const deliveryFee = subtotal > 5000 ? 0 : 500
  const tax = subtotal * 0.15
  const total = subtotal + deliveryFee + tax

  const createOrder = async () => {
    setLoading(true)
    setError('')

    try {
      const orderData = {
        items: items.map(item => ({
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
          state: formData.state,
          zipCode: formData.zipCode,
        },
        notes: formData.notes,
        customer: user?.name || '',
        email: user?.email || '',
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      setOrderId(data.orderId)
      setOrderCreated(true)
      return data.orderId
    } catch (error: any) {
      setError(error.message || 'Failed to create order')
      return null
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    clearCart()
    router.push(`/order-success?orderId=${orderId}`)
  }

  const handlePaymentError = (errorMsg: string) => {
    setError(errorMsg)
  }

  const handlePlaceOrder = async () => {
    const newOrderId = await createOrder()
    if (newOrderId) {
      // Order created, now proceed with payment
      // The PayHereCheckout component will handle the payment
    }
  }

  if (orderCreated) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="glass-panel rounded-2xl p-8">
              <h2 className="font-headline-md text-headline-md mb-6">Complete Payment</h2>
              <p className="text-on-surface-variant mb-6">
                Order #{orderId} - Total: LKR {total.toLocaleString()}
              </p>
              
              <PayHereCheckout
                orderId={orderId}
                amount={total}
                customer={{
                  firstName: user?.name?.split(' ')[0] || '',
                  lastName: user?.name?.split(' ')[1] || '',
                  email: user?.email || '',
                  phone: formData.phone,
                  address: formData.address,
                  city: formData.city,
                }}
                items={items.map(item => ({
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price,
                }))}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="glass-panel rounded-2xl p-6 sticky top-32">
              <h3 className="font-headline-md text-headline-md mb-4">Order Summary</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-outline-variant/30 pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">LKR {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary">
          Checkout
        </h1>
        <p className="text-on-surface-variant mt-2">Complete your order details below.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="glass-panel rounded-2xl p-8">
            <h2 className="font-headline-md text-headline-md mb-6">Delivery Information</h2>

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
                  required
                  name="phone"
                  className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0712345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  required
                  name="address"
                  className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    name="state"
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any special instructions..."
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Link
                href="/cart"
                className="flex-1 px-6 py-3 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors text-center"
              >
                Back to Cart
              </Link>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="flex-1 btn-primary justify-center py-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  `Proceed to Payment · LKR ${total.toLocaleString()}`
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="glass-panel rounded-2xl p-6 sticky top-32">
            <h3 className="font-headline-md text-headline-md mb-4">Order Summary</h3>
            
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
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
                <span>{deliveryFee === 0 ? 'Free' : `LKR ${deliveryFee.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Tax (15%)</span>
                <span>LKR {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-outline-variant/30">
                <span>Total</span>
                <span className="text-primary">LKR {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}