import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Order from '@/models/Order'
import crypto from 'crypto-js'

const PAYHERE_SECRET = process.env.PAYHERE_SECRET || ''

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    
    // Log received data for debugging
    console.log('PayHere Notification Received:', data)
    
    // Verify hash
    const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig } = data
    
    // Generate hash for verification
    const hash = crypto
      .MD5(`${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${PAYHERE_SECRET}`)
      .toString()
      .toUpperCase()
    
    // Verify hash
    if (hash !== md5sig) {
      console.error('Hash verification failed')
      return NextResponse.json({ status: 'error', message: 'Invalid hash' }, { status: 400 })
    }
    
    // Connect to database
    await connectToDatabase()
    
    // Find and update order
    const order = await Order.findOne({ orderId: order_id })
    if (!order) {
      console.error('Order not found:', order_id)
      return NextResponse.json({ status: 'error', message: 'Order not found' }, { status: 404 })
    }
    
    // Update order based on status
    const statusMap: Record<string, string> = {
      '2': 'Paid',
      '0': 'Failed',
      '1': 'Pending',
      '-1': 'Cancelled',
    }
    
    const paymentStatus = statusMap[status_code as string] || 'Pending'
    
    if (paymentStatus === 'Paid') {
      order.paymentStatus = 'Paid'
      order.status = 'Processing'
    } else if (paymentStatus === 'Failed' || paymentStatus === 'Cancelled') {
      order.paymentStatus = 'Failed'
      order.status = 'Cancelled'
    }
    
    await order.save()
    
    console.log(`Order ${order_id} updated with status: ${paymentStatus}`)
    
    // Return success response to PayHere
    return NextResponse.json({ status: 'success' })
  } catch (error: any) {
    console.error('Payment notification error:', error)
    return NextResponse.json(
      { error: error.message || 'Payment notification processing failed' },
      { status: 500 }
    )
  }
}