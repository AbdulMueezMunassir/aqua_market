// app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { connectToDatabase } from '@/lib/mongodb'
import Order from '@/models/Order'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_key_here', {
  apiVersion: '2024-11-20.acacia',
})

// Webhook secret from Stripe dashboard
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature') || ''

  let event: Stripe.Event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
      break
    
    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
      break
    
    case 'payment_intent.canceled':
      await handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent)
      break
    
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    await connectToDatabase()
    const orderId = paymentIntent.metadata.orderId
    
    if (!orderId) {
      console.error('No orderId in payment intent metadata')
      return
    }

    const order = await Order.findOne({ orderId })
    if (!order) {
      console.error('Order not found:', orderId)
      return
    }

    // Update order status
    order.paymentStatus = 'Paid'
    order.status = 'Processing'
    order.stripeData = {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      paymentMethod: paymentIntent.payment_method_types?.[0] || 'card',
      receiptUrl: paymentIntent.charges?.data?.[0]?.receipt_url || '',
    }

    await order.save()
    console.log(`✅ Order ${orderId} updated - Payment succeeded`)
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    await connectToDatabase()
    const orderId = paymentIntent.metadata.orderId
    
    if (!orderId) return

    const order = await Order.findOne({ orderId })
    if (!order) return

    order.paymentStatus = 'Failed'
    order.status = 'Failed'
    order.stripeData = {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      failureMessage: paymentIntent.last_payment_error?.message || 'Payment failed',
    }

    await order.save()
    console.log(`❌ Order ${orderId} updated - Payment failed`)
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}

async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    await connectToDatabase()
    const orderId = paymentIntent.metadata.orderId
    
    if (!orderId) return

    const order = await Order.findOne({ orderId })
    if (!order) return

    order.paymentStatus = 'Cancelled'
    order.status = 'Cancelled'
    order.stripeData = {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    }

    await order.save()
    console.log(`⏹️ Order ${orderId} updated - Payment cancelled`)
  } catch (error) {
    console.error('Error handling payment cancellation:', error)
  }
}