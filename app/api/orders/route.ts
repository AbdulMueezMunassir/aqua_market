import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Order from '@/models/Order'
import Product from '@/models/Product'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'

export async function POST(request: Request) {
  try {
    // Get token from header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const token = authHeader.split(' ')[1]
    let decoded
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    await connectToDatabase()
    const body = await request.json()
    
    console.log('📦 Order creation request:', body)
    
    // Validate required fields
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'No items in order' }, { status: 400 })
    }
    
    if (!body.shipping || !body.shipping.address || !body.shipping.city) {
      return NextResponse.json({ error: 'Shipping address is required' }, { status: 400 })
    }
    
    if (!body.phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }
    
    // Validate stock availability
    for (const item of body.items) {
      const product = await Product.findById(item.productId)
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.name} not found` },
          { status: 404 }
        )
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        )
      }
    }
    
    // Generate order ID manually
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const orderId = `ORD-${year}${month}${day}-${random}`
    
    // Create order
    const orderData = {
      orderId,
      userId: decoded.id,
      customer: decoded.name || body.customer || 'Customer',
      email: decoded.email || body.email || '',
      phone: body.phone,
      items: body.items,
      subtotal: body.subtotal || 0,
      deliveryFee: body.deliveryFee || 0,
      tax: body.tax || 0,
      total: body.total || 0,
      paymentMethod: body.paymentMethod || 'mock',
      paymentStatus: 'Pending',
      status: 'Pending',
      shipping: {
        address: body.shipping.address,
        city: body.shipping.city,
        state: body.shipping.state || '',
        zipCode: body.shipping.zipCode || '',
      },
      notes: body.notes || '',
    }
    
    console.log('📦 Creating order with data:', orderData)
    
    const order = await Order.create(orderData)
    
    // Update stock
    for (const item of body.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      })
    }
    
    console.log('✅ Order created successfully:', order.orderId)
    
    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error('❌ Error creating order:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const token = authHeader.split(' ')[1]
    let decoded
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    await connectToDatabase()
    const orders = await Order.find({ userId: decoded.id }).sort({ createdAt: -1 })
    return NextResponse.json(orders)
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}