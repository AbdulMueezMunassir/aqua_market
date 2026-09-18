import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Order from '@/models/Order'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'

// ────────────────────────────────────────────────────────────
// Admin role check
// ────────────────────────────────────────────────────────────
function verifyAdmin(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    if (decoded.role !== 'admin') return null
    return decoded
  } catch {
    return null
  }
}

// ────────────────────────────────────────────────────────────
// GET — List all orders (admin only)
// ────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  try {
    const admin = verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      )
    }

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search') || ''

    const query: any = {}

    if (status && status !== 'All') {
      query.status = status
    }

    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i')
      query.$or = [{ orderId: regex }, { customer: regex }, { email: regex }]
    }

    const orders = await Order.find(query).sort({ createdAt: -1 })

    return NextResponse.json(orders)
  } catch (error: any) {
    console.error('❌ Admin orders GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// ────────────────────────────────────────────────────────────
// PUT — Update order status (admin only)
// ────────────────────────────────────────────────────────────
export async function PUT(request: Request) {
  try {
    const admin = verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      )
    }

    await connectToDatabase()
    const body = await request.json()
    const { id, status, paymentStatus } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    const validStatuses = [
      'Pending',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled',
    ]
    const validPaymentStatuses = ['Pending', 'Paid', 'Failed', 'Cancelled']

    const update: any = {}
    if (status) {
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status: ${status}` },
          { status: 400 }
        )
      }
      update.status = status
    }

    if (paymentStatus) {
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return NextResponse.json(
          { error: `Invalid payment status: ${paymentStatus}` },
          { status: 400 }
        )
      }
      update.paymentStatus = paymentStatus
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: 'Nothing to update' },
        { status: 400 }
      )
    }

    const order = await Order.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    console.log(
      `✅ Order ${order.orderId} updated → status: ${order.status}, payment: ${order.paymentStatus}`
    )

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('❌ Admin orders PUT error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update order' },
      { status: 500 }
    )
  }
}

// ────────────────────────────────────────────────────────────
// DELETE — Delete an order (admin only)
// ────────────────────────────────────────────────────────────
export async function DELETE(request: Request) {
  try {
    const admin = verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      )
    }

    await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    const order = await Order.findByIdAndDelete(id)
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    console.log(`🗑️ Order ${order.orderId} deleted by ${admin.email}`)

    return NextResponse.json({ message: 'Order deleted successfully' })
  } catch (error: any) {
    console.error('❌ Admin orders DELETE error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete order' },
      { status: 500 }
    )
  }
}