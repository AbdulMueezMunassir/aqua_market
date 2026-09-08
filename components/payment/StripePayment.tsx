// components/payment/StripePayment.tsx
'use client'

import { useState, useEffect } from 'react'
import { useStripe, useElements, PaymentElement, Elements, CardElement } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

interface StripePaymentProps {
  amount: number
  orderId: string
  customerEmail: string
  onSuccess: () => void
  onError: (error: string) => void
  onCancel: () => void
}

// Stripe Payment Form
function PaymentForm({ amount, orderId, customerEmail, onSuccess, onError, onCancel }: StripePaymentProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [paymentIntentId, setPaymentIntentId] = useState('')

  useEffect(() => {
    // Create payment intent when component mounts
    createPaymentIntent()
  }, [])

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'usd', // Stripe works with USD but we'll display LKR
          metadata: { orderId },
          customerEmail,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to create payment')

      setClientSecret(data.clientSecret)
      setPaymentIntentId(data.paymentIntentId)
    } catch (error: any) {
      setError(error.message)
      onError(error.message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stripe || !elements || !clientSecret) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-success?orderId=${orderId}&stripe=true`,
          receipt_email: customerEmail,
        },
        redirect: 'if_required',
      })

      if (result.error) {
        setError(result.error.message || 'Payment failed')
        onError(result.error.message || 'Payment failed')
      } else if (result.paymentIntent?.status === 'succeeded') {
        onSuccess()
      }
    } catch (error: any) {
      setError(error.message)
      onError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!clientSecret) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
        <PaymentElement />
      </div>

      {error && (
        <div className="bg-error-container/20 text-error p-3 rounded-lg text-sm border border-error/20">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 rounded-xl border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 btn-primary justify-center py-3"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            `Pay LKR ${amount.toLocaleString()}`
          )}
        </button>
      </div>
    </form>
  )
}

// Main Stripe Payment Component
export function StripePayment(props: StripePaymentProps) {
  const [stripePromise, setStripePromise] = useState<any>(null)

  useEffect(() => {
    // Get publishable key from API
    const getPublishableKey = async () => {
      try {
        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: props.amount,
            currency: 'usd',
            metadata: { orderId: props.orderId },
            customerEmail: props.customerEmail,
          }),
        })
        const data = await response.json()
        if (data.publishableKey) {
          setStripePromise(loadStripe(data.publishableKey))
        }
      } catch (error) {
        console.error('Error loading Stripe:', error)
      }
    }
    getPublishableKey()
  }, [])

  if (!stripePromise) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise} options={{
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#00696b',
          colorBackground: '#ffffff',
          colorText: '#191c1e',
          borderRadius: '12px',
        },
      },
    }}>
      <PaymentForm {...props} />
    </Elements>
  )
}