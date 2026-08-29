'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'card'
  })

  const subtotal = getTotalPrice()
  const totalItems = getTotalItems()
  const deliveryFee = subtotal > 5000 ? 0 : 500
  const tax = subtotal * 0.15
  const total = subtotal + deliveryFee + tax

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would process the order
    // For now, we'll just show a success message
    setStep(3)
    // Clear cart after successful order
    setTimeout(() => {
      clearCart()
    }, 2000)
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-2">
          Checkout
        </h1>
        <p className="text-on-surface-variant font-body-md">
          Complete your order details below.
        </p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`flex items-center gap-2 ${step === 1 ? 'text-primary' : 'text-on-surface-variant'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
            step === 1 ? 'bg-primary text-white' : 'bg-surface-container-high'
          }`}>
            1
          </div>
          <span className="font-label-sm">Cart</span>
        </div>
        <div className="flex-1 h-0.5 bg-outline-variant/30" />
        <div className={`flex items-center gap-2 ${step === 2 ? 'text-primary' : 'text-on-surface-variant'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
            step === 2 ? 'bg-primary text-white' : 'bg-surface-container-high'
          }`}>
            2
          </div>
          <span className="font-label-sm">Details</span>
        </div>
        <div className="flex-1 h-0.5 bg-outline-variant/30" />
        <div className={`flex items-center gap-2 ${step === 3 ? 'text-primary' : 'text-on-surface-variant'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
            step === 3 ? 'bg-primary text-white' : 'bg-surface-container-high'
          }`}>
            3
          </div>
          <span className="font-label-sm">Confirm</span>
        </div>
      </div>

      {step === 1 && (
        <div className="glass-panel rounded-xl p-8 text-center">
          <h2 className="font-headline-md text-headline-md mb-4">Review Your Order</h2>
          <div className="space-y-4 mb-8 max-w-md mx-auto">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b border-outline-variant/30 pb-2">
                <span>{item.name} × {item.quantity}</span>
                <span className="font-medium">LKR {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-4">
              <span>Total</span>
              <span className="text-primary">LKR {total.toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={() => setStep(2)}
            className="btn-primary"
          >
            Continue to Details
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="glass-panel rounded-xl p-8">
              <h2 className="font-headline-md text-headline-md mb-6">Delivery Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary outline-none"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary outline-none"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary outline-none"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary outline-none"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary outline-none"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary outline-none"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    className="w-full bg-surface-container-low rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary outline-none"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-headline-md text-headline-md mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-outline-variant/30 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary"
                    />
                    <span>Credit / Debit Card</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-outline-variant/30 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={formData.paymentMethod === 'bank'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary"
                    />
                    <span>Bank Transfer</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-outline-variant/30 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary"
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary justify-center"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="glass-panel rounded-xl p-6 sticky top-32">
              <h3 className="font-headline-md text-headline-md mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-outline-variant/30 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>LKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? 'Free' : `LKR ${deliveryFee.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Tax</span>
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
      )}

      {step === 3 && (
        <div className="glass-panel rounded-xl p-12 text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="font-display-lg-mobile text-display-lg-mobile mb-4">Order Confirmed!</h2>
          <p className="text-on-surface-variant mb-8">
            Thank you for your order! We'll send you a confirmation email shortly.
          </p>
          <Link href="/" className="btn-primary inline-flex">
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  )
}