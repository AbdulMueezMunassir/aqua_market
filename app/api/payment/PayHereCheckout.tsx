'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PayHereCheckoutProps {
  orderId: string
  amount: number
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    country?: string
  }
  items?: Array<{
    name: string
    quantity: number
    price: number
  }>
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function PayHereCheckout({
  orderId,
  amount,
  customer,
  items = [],
  onSuccess,
  onError,
}: PayHereCheckoutProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: orderId,
          payhere_amount: amount,
          payhere_currency: 'LKR',
          first_name: customer.firstName,
          last_name: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          country: customer.country || 'Sri Lanka',
          delivery_address: customer.address,
          delivery_city: customer.city,
          delivery_country: customer.country || 'Sri Lanka',
          items: items,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment initiation failed')
      }

      // Create form and submit to PayHere
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = data.checkoutUrl

      // Add all payment data as hidden fields
      const paymentData = data.paymentData
      for (const [key, value] of Object.entries(paymentData)) {
        if (value !== undefined && value !== null) {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = String(value)
          form.appendChild(input)
        }
      }

      document.body.appendChild(form)
      form.submit()

      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      setError(error.message || 'Payment failed. Please try again.')
      if (onError) {
        onError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full btn-primary justify-center py-4 text-lg"
      >
        {loading ? (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          <span>Pay with PayHere</span>
        )}
      </button>

      {error && (
        <div className="mt-4 bg-error-container/20 text-error p-3 rounded-lg text-sm border border-error/20">
          {error}
        </div>
      )}

      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-on-surface-variant">
          <span>Secure payment by</span>
          <span className="font-semibold text-primary">PayHere</span>
          <span className="text-xs">🔒</span>
        </div>
        <div className="flex items-center justify-center gap-4 mt-2 text-xs text-on-surface-variant/70">
          <span>💳 Visa</span>
          <span>💳 Mastercard</span>
          <span>🏦 All Banks</span>
          <span>📱 Mobile</span>
        </div>
      </div>
    </div>
  )
}