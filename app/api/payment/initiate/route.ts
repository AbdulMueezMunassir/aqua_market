import { NextResponse } from 'next/server'
import { generatePayHereFormData } from '@/lib/payhere'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const required = ['order_id', 'payhere_amount', 'first_name', 'last_name', 'email', 'phone', 'address', 'city']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Generate PayHere form data
    const paymentData = generatePayHereFormData({
      merchant_id: process.env.PAYHERE_MERCHANT_ID!,
      order_id: body.order_id,
      payhere_amount: body.payhere_amount,
      payhere_currency: body.payhere_currency || 'LKR',
      return_url: body.return_url || process.env.PAYHERE_RETURN_URL,
      cancel_url: body.cancel_url || process.env.PAYHERE_CANCEL_URL,
      notify_url: body.notify_url || process.env.PAYHERE_NOTIFY_URL,
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      city: body.city,
      country: body.country || 'Sri Lanka',
      delivery_address: body.delivery_address || body.address,
      delivery_city: body.delivery_city || body.city,
      delivery_country: body.delivery_country || 'Sri Lanka',
      items: body.items || [],
    })
    
    return NextResponse.json({
      success: true,
      paymentData,
      checkoutUrl: process.env.PAYHERE_SANDBOX === 'true' 
        ? 'https://sandbox.payhere.lk/pay/checkout' 
        : 'https://www.payhere.lk/pay/checkout',
    })
  } catch (error: any) {
    console.error('Payment initiation error:', error)
    return NextResponse.json(
      { error: error.message || 'Payment initiation failed' },
      { status: 500 }
    )
  }
}