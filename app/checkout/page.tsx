'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
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
    paymentMethod: 'mock',
    notes: '',
  })

  // Log cart state for debugging
  useEffect(() => {
    console.log('📄 Checkout page loaded')
    console.log('🛒 Cart items from store:', items)
    console.log('🛒 Cart items count:', items.length)
    console.log('👤 User:', user?.email)
    
    // Check localStorage directly
    const cartData = localStorage.getItem('aqua-market-cart')
    console.log('💾 Cart from localStorage:', cartData)
    
    if (cartData) {
      try {
        const parsed = JSON.parse(cartData)
        console.log('📦 Parsed cart:', parsed)
      } catch (e) {
        console.error('Error parsing cart:', e)
      }
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
  }, [user, items])

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
          state: formData.state || '',
          zipCode: formData.zipCode || '',
        },
        notes: formData.notes,
        customer: user?.name || '',
        email: user?.email || '',
      }

      console.log('📦 Creating order:', orderData)

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()
      console.log('📦 Order response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      setOrderId(data.orderId)
      setOrderCreated(true)
      return data.orderId
    } catch (error: any) {
      console.error('❌ Create order error:', error)
      setError(error.message || 'Failed to create order')
      return null
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    clearCart()
    router.push(`/order-success?orderId=${orderId}&mock=true`)
  }

  const handleProceedToPayment = async () => {
    // Validate form
    if (!formData.phone) {
      setError('Please enter your phone number')
      return
    }
    if (!formData.address) {
      setError('Please enter your address')
      return
    }
    if (!formData.city) {
      setError('Please enter your city')
      return
    }

    console.log('📝 Proceeding to payment with method:', formData.paymentMethod)

    const newOrderId = await createOrder()
    if (newOrderId) {
      // Always redirect to mock payment for now
      router.push(`/mock-payment/${newOrderId}`)
    }
  }

  // If cart is empty, show option to go to shop
  if (items.length === 0) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="glass-panel rounded-2xl p-12 text-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-outline">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
          <h2 className="font-headline-md text-headline-md mb-4">Your Cart is Empty</h2>
          <p className="text-on-surface-variant mb-6">Add some products to your cart before checking out.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="btn-primary">
              Start Shopping
            </Link>
            <button
              onClick={() => {
                // Add test items to cart
                const testItems = {
                  items: [
                    {
                      id: '1',
                      name: 'Dwarf Gourami',
                      price: 1200,
                      quantity: 1,
                      image: 'https://via.placeholder.com/400x300/00696b/ffffff?text=Gourami',
                      category: 'Freshwater',
                      stock: 10
                    },
                    {
                      id: '2',
                      name: 'Neon Tetra (School of 6)',
                      price: 1800,
                      quantity: 1,
                      image: 'https://via.placeholder.com/400x300/00696b/ffffff?text=Tetra',
                      category: 'Freshwater',
                      stock: 20
                    }
                  ]
                }
                localStorage.setItem('aqua-market-cart', JSON.stringify(testItems))
                window.location.reload()
              }}
              className="glass-panel px-6 py-3 rounded-xl text-primary hover:bg-white/50 transition-colors"
            >
              Add Test Items
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show payment UI when order is created
  if (orderCreated) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="glass-panel rounded-2xl p-8 max-w-2xl mx-auto">
          <h2 className="font-headline-md text-headline-md mb-4">Complete Payment</h2>
          <p className="text-on-surface-variant mb-6">
            Order #{orderId} · LKR {total.toLocaleString()}
          </p>
          
          <div className="bg-yellow-500/10 p-6 rounded-xl text-center border border-yellow-500/20">
            <p className="text-yellow-600 font-medium mb-4">🧪 Mock Payment Mode</p>
            <p className="text-sm text-on-surface-variant mb-4">
              This is a practice payment. No real money will be charged.
            </p>
            <button
              onClick={handlePaymentSuccess}
              className="btn-primary"
            >
              Simulate Successful Payment
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-error-container/20 text-error p-3 rounded-lg text-sm border border-error/20">
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Main Checkout Form
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
      <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-8">
        Checkout
      </h1>

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
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  {/* Stripe Option */}
                  <label className="flex items-center gap-3 p-4 border border-outline-variant/30 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={formData.paymentMethod === 'stripe'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-4 h-4 text-primary"
                    />
                    <div>
                      <span className="font-medium">💳 Credit/Debit Card (Stripe)</span>
                      <p className="text-xs text-on-surface-variant">Pay with Stripe - Practice mode</p>
                    </div>
                    <span className="ml-auto text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full">
                      Test
                    </span>
                  </label>

                  {/* Mock Payment Option */}
                  <label className="flex items-center gap-3 p-4 border border-primary/50 rounded-lg bg-primary/5 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mock"
                      checked={formData.paymentMethod === 'mock'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-4 h-4 text-primary"
                    />
                    <div>
                      <span className="font-medium">🧪 Mock Payment</span>
                      <p className="text-xs text-on-surface-variant">No real money charged - For testing</p>
                    </div>
                    <span className="ml-auto text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full">
                      Practice
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">
                  Order Notes (Optional)
                </label>
                <textarea
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
                onClick={handleProceedToPayment}
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